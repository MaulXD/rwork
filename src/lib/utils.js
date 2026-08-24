import { MONTHS_SHORT } from './constants.js'

export const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`

/** Progresso 0..100 de um fluxo, a partir das etapas concluídas. */
export function progressOf(wf) {
  if (wf.status === 'concluido') return 100
  if (!wf.steps || wf.steps.length === 0) return 0
  const done = wf.steps.filter((s) => s.done).length
  return Math.round((done / wf.steps.length) * 100)
}

/**
 * Divide as etapas em blocos consecutivos por `group`, preservando a ordem e
 * guardando o índice original de cada etapa (necessário para reordenar).
 */
export function groupedSteps(steps) {
  const out = []
  steps.forEach((s, index) => {
    const name = s.group || ''
    let last = out[out.length - 1]
    if (!last || last.name !== name) {
      last = { name, steps: [] }
      out.push(last)
    }
    last.steps.push({ ...s, index })
  })
  return out
}

export function stepsSummary(wf) {
  const total = wf.steps?.length ?? 0
  const done = wf.steps?.filter((s) => s.done).length ?? 0
  return { total, done }
}

/** 'YYYY-MM-DD' -> Date local (evita o deslocamento de fuso do parser ISO). */
export function parseDate(iso) {
  if (!iso) return null
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}

export function toISO(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function today() {
  const n = new Date()
  return new Date(n.getFullYear(), n.getMonth(), n.getDate())
}

export function formatDate(iso) {
  const d = parseDate(iso)
  if (!d) return '—'
  return `${String(d.getDate()).padStart(2, '0')} ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`
}

export function formatShort(iso) {
  const d = parseDate(iso)
  if (!d) return '—'
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
}

/** Diferença em dias inteiros entre duas datas (b - a). */
export function daysBetween(a, b) {
  return Math.round((b - a) / 86400000)
}

/** Texto relativo curto: "há 2 dias", "em 5 dias", "hoje". */
export function relativeDays(iso) {
  const d = parseDate(iso)
  if (!d) return ''
  const diff = daysBetween(today(), d)
  if (diff === 0) return 'hoje'
  if (diff === 1) return 'amanhã'
  if (diff === -1) return 'ontem'
  if (diff > 0) return `em ${diff} dias`
  return `há ${Math.abs(diff)} dias`
}

export function formatTimestamp(ts) {
  if (!ts) return '—'
  const d = new Date(ts)
  const diff = Math.round((Date.now() - ts) / 60000)
  if (diff < 1) return 'agora'
  if (diff < 60) return `há ${diff} min`
  if (diff < 1440) return `há ${Math.floor(diff / 60)} h`
  const days = Math.floor(diff / 1440)
  if (days < 30) return `há ${days} d`
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

/** Prazo de um fluxo: dias restantes e se está atrasado. */
export function deadlineInfo(wf) {
  if (!wf.end || wf.status === 'concluido') return null
  const end = parseDate(wf.end)
  if (!end) return null
  const days = daysBetween(today(), end)
  return { days, late: days < 0, soon: days >= 0 && days <= 7 }
}

/** Lista de meses (Date no dia 1) cobrindo o intervalo, com folga mínima. */
export function monthSpan(workflows, minMonths = 6) {
  const dates = []
  workflows.forEach((w) => {
    const s = parseDate(w.start)
    const e = parseDate(w.end)
    if (s) dates.push(s)
    if (e) dates.push(e)
  })
  const now = today()
  dates.push(now)

  let min = new Date(Math.min(...dates.map((d) => d.getTime())))
  let max = new Date(Math.max(...dates.map((d) => d.getTime())))

  let start = new Date(min.getFullYear(), min.getMonth(), 1)
  let end = new Date(max.getFullYear(), max.getMonth() + 1, 0)

  const months = []
  const cursor = new Date(start)
  while (cursor <= end) {
    months.push(new Date(cursor))
    cursor.setMonth(cursor.getMonth() + 1)
  }
  while (months.length < minMonths) {
    const last = months[months.length - 1]
    months.push(new Date(last.getFullYear(), last.getMonth() + 1, 1))
  }
  return months
}

/** Posição percentual de uma data dentro da faixa de meses do roadmap. */
export function positionIn(months, date) {
  if (!months.length) return 0
  const start = months[0]
  const last = months[months.length - 1]
  const end = new Date(last.getFullYear(), last.getMonth() + 1, 1)
  const total = end - start
  if (total <= 0) return 0
  return Math.min(100, Math.max(0, ((date - start) / total) * 100))
}

export function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n))
}

export function download(filename, text) {
  const blob = new Blob([text], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
