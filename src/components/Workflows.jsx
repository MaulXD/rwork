import { useMemo, useState } from 'react'
import WorkflowCard from './WorkflowCard.jsx'
import { Empty } from './ui.jsx'
import { Search, Plus, Flow } from './icons.jsx'
import { STATUS, STATUS_ORDER, PRIORITY_ORDER } from '../lib/constants.js'
import { progressOf, parseDate } from '../lib/utils.js'

const SORTS = {
  recentes: { label: 'Recentes', fn: (a, b) => b.updatedAt - a.updatedAt },
  prazo: {
    label: 'Prazo',
    fn: (a, b) => {
      const da = parseDate(a.end)
      const db = parseDate(b.end)
      if (!da && !db) return 0
      if (!da) return 1
      if (!db) return -1
      return da - db
    },
  },
  progresso: { label: 'Progresso', fn: (a, b) => progressOf(b) - progressOf(a) },
  prioridade: {
    label: 'Prioridade',
    fn: (a, b) => PRIORITY_ORDER.indexOf(b.priority) - PRIORITY_ORDER.indexOf(a.priority),
  },
  alfabetica: { label: 'A–Z', fn: (a, b) => a.title.localeCompare(b.title, 'pt-BR') },
}

export default function Workflows({ workflows, onOpen, onCreate }) {
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('todos')
  const [tag, setTag] = useState(null)
  const [sort, setSort] = useState('recentes')

  const allTags = useMemo(() => {
    const set = new Set()
    workflows.forEach((w) => w.tags.forEach((t) => set.add(t)))
    return [...set].sort((a, b) => a.localeCompare(b, 'pt-BR'))
  }, [workflows])

  const counts = useMemo(() => {
    const c = { todos: workflows.length }
    STATUS_ORDER.forEach((s) => {
      c[s] = workflows.filter((w) => w.status === s).length
    })
    return c
  }, [workflows])

  const list = useMemo(() => {
    const term = q.trim().toLowerCase()
    return workflows
      .filter((w) => (status === 'todos' ? true : w.status === status))
      .filter((w) => (tag ? w.tags.includes(tag) : true))
      .filter((w) => {
        if (!term) return true
        return (
          w.title.toLowerCase().includes(term) ||
          w.description.toLowerCase().includes(term) ||
          w.tags.some((t) => t.toLowerCase().includes(term)) ||
          w.steps.some((s) => s.title.toLowerCase().includes(term))
        )
      })
      .sort(SORTS[sort].fn)
  }, [workflows, q, status, tag, sort])

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">
            Meus <em>fluxos</em>
          </h1>
          <p className="page-sub">
            Cada fluxo guarda as etapas de um processo do seu trabalho. Marque o que já foi feito e o progresso se
            atualiza sozinho.
          </p>
        </div>
        <div className="head-actions">
          <button className="btn btn-primary" onClick={onCreate}>
            <Plus size={17} /> Novo fluxo
          </button>
        </div>
      </div>

      <div className="toolbar">
        <div className="search">
          <Search size={17} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por título, etapa ou tag…"
            aria-label="Buscar fluxos"
          />
        </div>

        <div className="seg">
          <button className={status === 'todos' ? 'on' : ''} onClick={() => setStatus('todos')}>
            Todos {counts.todos > 0 && `· ${counts.todos}`}
          </button>
          {STATUS_ORDER.map((s) => (
            <button key={s} className={status === s ? 'on' : ''} onClick={() => setStatus(s)}>
              {STATUS[s].label} {counts[s] > 0 && `· ${counts[s]}`}
            </button>
          ))}
        </div>

        <select className="select" style={{ width: 'auto' }} value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Ordenar por">
          {Object.entries(SORTS).map(([k, v]) => (
            <option key={k} value={k}>
              Ordenar: {v.label}
            </option>
          ))}
        </select>
      </div>

      {allTags.length > 0 && (
        <div className="row wrap" style={{ gap: 7, marginTop: -12 }}>
          <button className={`tag${tag === null ? ' on' : ''}`} onClick={() => setTag(null)}>
            todas
          </button>
          {allTags.map((t) => (
            <button key={t} className={`tag${tag === t ? ' on' : ''}`} onClick={() => setTag(tag === t ? null : t)}>
              #{t}
            </button>
          ))}
        </div>
      )}

      {list.length === 0 ? (
        <div className="panel spark-top">
          <Empty
            icon={<Flow size={30} />}
            title={workflows.length === 0 ? 'Nenhum fluxo ainda' : 'Nada com esses filtros'}
            text={
              workflows.length === 0
                ? 'Crie o primeiro fluxo para começar a registrar como o seu trabalho acontece.'
                : 'Tente outro termo de busca ou limpe os filtros de status e tag.'
            }
            action={
              workflows.length === 0 ? (
                <button className="btn btn-primary" onClick={onCreate}>
                  <Plus size={17} /> Criar fluxo
                </button>
              ) : (
                <button
                  className="btn"
                  onClick={() => {
                    setQ('')
                    setStatus('todos')
                    setTag(null)
                  }}
                >
                  Limpar filtros
                </button>
              )
            }
          />
        </div>
      ) : (
        <div className="wf-grid">
          {list.map((wf, i) => (
            <WorkflowCard key={wf.id} wf={wf} onOpen={onOpen} index={i} />
          ))}
        </div>
      )}
    </>
  )
}
