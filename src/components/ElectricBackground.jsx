import { useEffect, useRef } from 'react'

const CYAN = [34, 230, 255]
const VIOLET = [124, 92, 255]
const MAGENTA = [255, 79, 216]

const rgba = ([r, g, b], a) => `rgba(${r},${g},${b},${a})`
const rand = (min, max) => min + Math.random() * (max - min)
const pick = (arr) => arr[(Math.random() * arr.length) | 0]

/**
 * Fundo elétrico: malha de nós à deriva, pulsos de energia percorrendo as
 * conexões e relâmpagos ocasionais. Tudo em um único canvas.
 *
 * `intensity` (0..1) controla densidade de nós e frequência dos raios.
 */
export default function ElectricBackground({ intensity = 0.6, enabled = true }) {
  const canvasRef = useRef(null)
  const stateRef = useRef({ intensity })
  const rebuildRef = useRef(null)

  // Mudar a intensidade refaz a malha sem reiniciar a animação inteira.
  useEffect(() => {
    stateRef.current.intensity = intensity
    rebuildRef.current?.()
  }, [intensity])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let width = 0
    let height = 0
    let dpr = 1
    let nodes = []
    let pulses = []
    let bolts = []
    let sparks = []
    let raf = 0
    let running = true
    let nextBolt = 0

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      buildNodes()
    }

    function buildNodes() {
      const density = 0.000042 * (0.45 + stateRef.current.intensity)
      const count = Math.round(Math.min(88, Math.max(18, width * height * density)))
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: rand(-0.13, 0.13),
        vy: rand(-0.13, 0.13),
        r: rand(0.8, 2.1),
        hue: Math.random() < 0.55 ? CYAN : VIOLET,
        phase: Math.random() * Math.PI * 2,
      }))
      sparks = Array.from({ length: Math.round(count * 0.5) }, () => makeSpark(true))
    }

    function makeSpark(anywhere = false) {
      return {
        x: Math.random() * width,
        y: anywhere ? Math.random() * height : height + 10,
        vy: rand(-0.55, -0.15),
        vx: rand(-0.14, 0.14),
        life: rand(0.3, 1),
        decay: rand(0.0012, 0.0035),
        size: rand(0.6, 1.7),
        hue: pick([CYAN, VIOLET, MAGENTA]),
      }
    }

    const LINK_DIST = 168

    /** Gera um raio quebrado entre dois pontos por deslocamento do ponto médio. */
    function makeBolt(x1, y1, x2, y2, generations = 5) {
      let points = [
        { x: x1, y: y1 },
        { x: x2, y: y2 },
      ]
      let offset = Math.hypot(x2 - x1, y2 - y1) * 0.18
      for (let g = 0; g < generations; g++) {
        const next = []
        for (let i = 0; i < points.length - 1; i++) {
          const a = points[i]
          const b = points[i + 1]
          const mx = (a.x + b.x) / 2
          const my = (a.y + b.y) / 2
          const dx = b.x - a.x
          const dy = b.y - a.y
          const len = Math.hypot(dx, dy) || 1
          const nx = -dy / len
          const ny = dx / len
          const d = rand(-offset, offset)
          next.push(a, { x: mx + nx * d, y: my + ny * d })
        }
        next.push(points[points.length - 1])
        points = next
        offset *= 0.55
      }
      return { points, life: 1, decay: rand(0.018, 0.035), hue: pick([CYAN, VIOLET, MAGENTA]), width: rand(0.9, 2) }
    }

    function spawnBolt() {
      // O raio cruza a tela partindo de uma borda aleatória.
      const edge = (Math.random() * 4) | 0
      let x1, y1, x2, y2
      if (edge === 0) {
        x1 = rand(0, width); y1 = -20; x2 = rand(0, width); y2 = rand(height * 0.35, height)
      } else if (edge === 1) {
        x1 = width + 20; y1 = rand(0, height); x2 = rand(0, width * 0.7); y2 = rand(0, height)
      } else if (edge === 2) {
        x1 = rand(0, width); y1 = height + 20; x2 = rand(0, width); y2 = rand(0, height * 0.65)
      } else {
        x1 = -20; y1 = rand(0, height); x2 = rand(width * 0.3, width); y2 = rand(0, height)
      }
      bolts.push(makeBolt(x1, y1, x2, y2))
      if (bolts.length > 4) bolts.shift()
    }

    function spawnPulse() {
      if (nodes.length < 2) return
      const a = (Math.random() * nodes.length) | 0
      // Procura um vizinho dentro do alcance de ligação.
      for (let k = 0; k < 12; k++) {
        const b = (Math.random() * nodes.length) | 0
        if (a === b) continue
        const d = Math.hypot(nodes[a].x - nodes[b].x, nodes[a].y - nodes[b].y)
        if (d < LINK_DIST) {
          pulses.push({ a, b, t: 0, speed: rand(0.006, 0.016), hue: pick([CYAN, VIOLET]) })
          return
        }
      }
    }

    function drawStatic() {
      ctx.clearRect(0, 0, width, height)
      drawNetwork(0)
      drawNodes(0)
    }

    function drawNetwork(time) {
      ctx.lineWidth = 1
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.hypot(dx, dy)
          if (dist > LINK_DIST) continue
          const alpha = (1 - dist / LINK_DIST) * 0.17
          ctx.strokeStyle = rgba(a.hue, alpha)
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }
      }
    }

    function drawNodes(time) {
      for (const n of nodes) {
        const twinkle = 0.55 + Math.sin(time * 0.0016 + n.phase) * 0.45
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fillStyle = rgba(n.hue, 0.55 * twinkle)
        ctx.fill()

        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r * 4.5, 0, Math.PI * 2)
        ctx.fillStyle = rgba(n.hue, 0.05 * twinkle)
        ctx.fill()
      }
    }

    function frame(time) {
      if (!running) return
      raf = requestAnimationFrame(frame)

      ctx.clearRect(0, 0, width, height)

      // --- nós ---
      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy
        if (n.x < -30) n.x = width + 30
        if (n.x > width + 30) n.x = -30
        if (n.y < -30) n.y = height + 30
        if (n.y > height + 30) n.y = -30
      }

      drawNetwork(time)
      drawNodes(time)

      // --- pulsos de energia percorrendo as ligações ---
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i]
        const a = nodes[p.a]
        const b = nodes[p.b]
        if (!a || !b) { pulses.splice(i, 1); continue }
        p.t += p.speed
        if (p.t >= 1) { pulses.splice(i, 1); continue }
        const x = a.x + (b.x - a.x) * p.t
        const y = a.y + (b.y - a.y) * p.t
        const fade = Math.sin(p.t * Math.PI)

        ctx.strokeStyle = rgba(p.hue, 0.42 * fade)
        ctx.lineWidth = 1.4
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(x, y)
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(x, y, 2.3, 0, Math.PI * 2)
        ctx.fillStyle = rgba(p.hue, 0.95 * fade)
        ctx.fill()

        ctx.beginPath()
        ctx.arc(x, y, 9, 0, Math.PI * 2)
        ctx.fillStyle = rgba(p.hue, 0.12 * fade)
        ctx.fill()
      }

      if (Math.random() < 0.05 + stateRef.current.intensity * 0.08) spawnPulse()

      // --- fagulhas subindo ---
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i]
        s.x += s.vx
        s.y += s.vy
        s.life -= s.decay
        if (s.life <= 0 || s.y < -20) {
          sparks[i] = makeSpark()
          continue
        }
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
        ctx.fillStyle = rgba(s.hue, 0.7 * s.life)
        ctx.fill()
      }

      // --- relâmpagos ---
      if (time > nextBolt) {
        spawnBolt()
        nextBolt = time + rand(2600, 7200) / (0.4 + stateRef.current.intensity)
      }

      for (let i = bolts.length - 1; i >= 0; i--) {
        const bolt = bolts[i]
        bolt.life -= bolt.decay
        if (bolt.life <= 0) { bolts.splice(i, 1); continue }

        const pts = bolt.points
        ctx.lineJoin = 'round'
        ctx.lineCap = 'round'

        // halo
        ctx.strokeStyle = rgba(bolt.hue, 0.1 * bolt.life)
        ctx.lineWidth = bolt.width * 7
        ctx.beginPath()
        ctx.moveTo(pts[0].x, pts[0].y)
        for (let k = 1; k < pts.length; k++) ctx.lineTo(pts[k].x, pts[k].y)
        ctx.stroke()

        // corpo
        ctx.strokeStyle = rgba(bolt.hue, 0.55 * bolt.life)
        ctx.lineWidth = bolt.width * 2.2
        ctx.stroke()

        // núcleo
        ctx.strokeStyle = `rgba(235,248,255,${0.85 * bolt.life})`
        ctx.lineWidth = bolt.width * 0.7
        ctx.stroke()
      }
    }

    function onVisibility() {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(raf)
      } else if (!reduced) {
        running = true
        raf = requestAnimationFrame(frame)
      }
    }

    resize()
    rebuildRef.current = buildNodes
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVisibility)

    if (reduced) {
      drawStatic()
    } else {
      raf = requestAnimationFrame(frame)
    }

    return () => {
      running = false
      rebuildRef.current = null
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [enabled])

  return (
    <>
      <div className="bg-aurora" />
      <div className="bg-grid" />
      {enabled && <canvas ref={canvasRef} className="bg-canvas" />}
      <div className="bg-scan" />
      <div className="bg-vignette" />
    </>
  )
}
