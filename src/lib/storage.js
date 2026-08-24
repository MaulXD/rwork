import { STORAGE_KEY } from './constants.js'
import { uid } from './utils.js'
import { TEMPLATES, templateToWorkflow } from './templates.js'

/** Fluxos que devem existir na conta — vindos dos modelos reais. */
const SEED_KEYS = [
  'pre-impressao',
  'rtools-nova-ferramenta',
  'educacross-tr-etp',
  'educacross-negociacao',
  'orcamento-hardware',
  'revisao-itens',
  'relatorio-atividades',
]

export function seedWorkflows() {
  return SEED_KEYS.map((key) => TEMPLATES.find((t) => t.key === key))
    .filter(Boolean)
    .map((tpl) => templateToWorkflow(tpl))
}

const emptyState = () => ({
  version: 2,
  workflows: [],
  seededKeys: [],
  createdAt: Date.now(),
})

/** Garante que qualquer fluxo carregado tenha todos os campos esperados. */
function normalizeWorkflow(w) {
  return {
    id: w.id || uid(),
    title: String(w.title || 'Sem título'),
    description: String(w.description || ''),
    status: w.status || 'planejado',
    priority: w.priority || 'media',
    color: w.color || '#22e6ff',
    tags: Array.isArray(w.tags) ? w.tags.filter(Boolean).map(String) : [],
    start: w.start || '',
    end: w.end || '',
    steps: Array.isArray(w.steps)
      ? w.steps.map((s) => ({
          id: s.id || uid(),
          title: String(s.title || ''),
          note: String(s.note || ''),
          group: String(s.group || ''),
          done: Boolean(s.done),
        }))
      : [],
    templateKey: w.templateKey || '',
    createdAt: w.createdAt || Date.now(),
    updatedAt: w.updatedAt || w.createdAt || Date.now(),
  }
}

/**
 * Entrega os fluxos de `SEED_KEYS` que ainda não chegaram a este navegador.
 *
 * `seededKeys` registra o que já foi entregue alguma vez. Sem esse controle,
 * modelo novo acrescentado ao código nunca alcançaria quem já tem dados
 * salvos — e com ele, fluxo que o usuário apagou de propósito não volta.
 */
function pendingSeeds(workflows, seededKeys) {
  return SEED_KEYS.filter(
    (key) => !seededKeys.includes(key) && !workflows.some((w) => w.templateKey === key)
  )
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return {
        ...emptyState(),
        workflows: seedWorkflows(),
        seededKeys: [...SEED_KEYS],
        seeded: true,
      }
    }

    const parsed = JSON.parse(raw)
    const workflows = Array.isArray(parsed.workflows) ? parsed.workflows.map(normalizeWorkflow) : []
    const seededKeys = Array.isArray(parsed.seededKeys) ? parsed.seededKeys : []

    const pending = pendingSeeds(workflows, seededKeys)
    const novos = pending
      .map((key) => TEMPLATES.find((t) => t.key === key))
      .filter(Boolean)
      .map((tpl) => templateToWorkflow(tpl))

    // Registra também o que já estava presente, para que apagar um fluxo
    // seja definitivo — sem isso ele voltaria na carga seguinte.
    const jaPresentes = SEED_KEYS.filter((key) => workflows.some((w) => w.templateKey === key))

    return {
      ...emptyState(),
      ...parsed,
      workflows: [...novos, ...workflows],
      seededKeys: [...new Set([...seededKeys, ...jaPresentes, ...pending])],
      novos: novos.map((w) => w.title),
    }
  } catch (err) {
    console.warn('[RWork] não foi possível ler o armazenamento local:', err)
    return emptyState()
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, savedAt: Date.now() }))
    return true
  } catch (err) {
    console.warn('[RWork] não foi possível gravar no armazenamento local:', err)
    return false
  }
}

/** Lê um arquivo exportado e devolve a lista de fluxos válidos. */
export function parseImport(text) {
  const data = JSON.parse(text)
  const list = Array.isArray(data) ? data : data.workflows
  if (!Array.isArray(list)) throw new Error('Arquivo sem a lista de fluxos.')
  return list.map(normalizeWorkflow)
}

export { normalizeWorkflow, SEED_KEYS }
