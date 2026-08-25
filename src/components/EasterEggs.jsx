import { useCallback, useEffect, useRef, useState } from 'react'
import { Modal } from './ui.jsx'
import { BoltFill, Sparkle, Right } from './icons.jsx'
import { PHILOSOPHERS, TOTAL_CENTELHAS } from '../lib/philosophers.js'

const CHAVE = 'rwork.centelhas'
const KONAMI = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
]
const PALAVRA = 'sofia'

function lerDescobertas() {
  try {
    const raw = localStorage.getItem(CHAVE)
    const arr = raw ? JSON.parse(raw) : []
    return new Set(Array.isArray(arr) ? arr : [])
  } catch {
    return new Set()
  }
}

function gravarDescobertas(set) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify([...set]))
  } catch {
    /* modo privado: a coleção só não persiste */
  }
}

/**
 * Centelhas — curiosidades sobre filósofos escondidas pelo site.
 *
 * Três gatilhos: o código Konami, digitar "sofia" fora de um campo de texto,
 * e sete cliques no raio da marca (contados pela Sidebar, via `trigger`).
 */
export default function EasterEggs({ trigger = 0, onStorm }) {
  const [aberto, setAberto] = useState(false)
  const [atual, setAtual] = useState(0)
  const [descobertas, setDescobertas] = useState(lerDescobertas)
  const [novidade, setNovidade] = useState(false)
  const primeiroRender = useRef(true)

  // Espelho do estado para o sorteio: efeito colateral dentro de um updater
  // de setState roda duas vezes em StrictMode e sortearia duas centelhas.
  const descobertasRef = useRef(descobertas)

  const revelar = useCallback(
    (comTempestade = false) => {
      const prev = descobertasRef.current
      const indices = PHILOSOPHERS.map((_, i) => i)
      const inedito = indices.filter((i) => !prev.has(i))
      const pool = inedito.length > 0 ? inedito : indices
      const escolhido = pool[Math.floor(Math.random() * pool.length)]

      const next = new Set(prev)
      next.add(escolhido)
      descobertasRef.current = next
      gravarDescobertas(next)

      setDescobertas(next)
      setAtual(escolhido)
      setNovidade(inedito.length > 0)
      setAberto(true)

      if (comTempestade) onStorm?.()
    },
    [onStorm]
  )

  // Gatilho vindo dos cliques na marca.
  useEffect(() => {
    if (primeiroRender.current) {
      primeiroRender.current = false
      return
    }
    if (trigger > 0) revelar(false)
  }, [trigger, revelar])

  // Gatilhos de teclado: Konami e a palavra secreta.
  useEffect(() => {
    let konami = []
    let buffer = ''

    const onKey = (e) => {
      const tag = document.activeElement?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      konami = [...konami, e.key].slice(-KONAMI.length)
      if (konami.length === KONAMI.length && konami.every((k, i) => k.toLowerCase() === KONAMI[i].toLowerCase())) {
        konami = []
        buffer = ''
        revelar(true)
        return
      }

      if (e.key.length === 1) {
        buffer = (buffer + e.key.toLowerCase()).slice(-PALAVRA.length)
        if (buffer === PALAVRA) {
          buffer = ''
          revelar(false)
        }
      }
    }

    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [revelar])

  // Dica no console, para quem abre as ferramentas de desenvolvedor.
  useEffect(() => {
    const achadas = lerDescobertas().size
    console.log(
      '%c⚡ RWork %c— há centelhas escondidas por aqui.\n' +
        `Você encontrou ${achadas} de ${TOTAL_CENTELHAS}.\n` +
        'Tente digitar "sofia", o código Konami, ou clicar sete vezes no raio.',
      'font-weight:700;font-size:14px;color:#22e6ff',
      'color:#9fb0d4'
    )
  }, [])

  if (!aberto) return null

  const p = PHILOSOPHERS[atual]

  return (
    <Modal
      title="Centelha"
      size="sm"
      onClose={() => setAberto(false)}
      footer={
        <>
          <span className="hint mono">
            {descobertas.size}/{TOTAL_CENTELHAS} encontradas
          </span>
          <button className="btn btn-primary btn-sm" onClick={() => revelar(false)}>
            Outra <Right size={14} />
          </button>
        </>
      }
    >
      <div className="centelha">
        <div className="centelha-mark">
          <BoltFill size={24} />
        </div>

        <div className="centelha-nome">{p.nome}</div>
        <div className="centelha-epoca mono">{p.epoca}</div>

        <p className="centelha-fato">{p.fato}</p>

        {p.lenda && (
          <p className="centelha-lenda">
            <Sparkle size={13} /> Tradição antiga, sem confirmação de fonte contemporânea.
          </p>
        )}

        {novidade && descobertas.size < TOTAL_CENTELHAS && (
          <p className="hint" style={{ textAlign: 'center' }}>
            Faltam {TOTAL_CENTELHAS - descobertas.size} para completar a coleção.
          </p>
        )}
        {descobertas.size === TOTAL_CENTELHAS && (
          <p className="centelha-fim">Coleção completa. Todas as {TOTAL_CENTELHAS} centelhas encontradas.</p>
        )}
      </div>
    </Modal>
  )
}
