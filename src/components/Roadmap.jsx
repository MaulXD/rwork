import { useMemo, useState } from 'react'
import { Empty, StatusChip, Bar } from './ui.jsx'
import { Route, Plus, Calendar, Alert, Check, X, Target, Checklist } from './icons.jsx'
import { MONTHS_SHORT, STATUS, STATUS_ORDER, PRIORITY, PRIORITY_ORDER } from '../lib/constants.js'
import { monthSpan, positionIn, parseDate, today, progressOf, formatShort, stepsSummary } from '../lib/utils.js'

const COL_W = 118
const SIDE_W = 210

/** Ordem de ataque: da prioridade mais alta para a mais baixa. */
const ATTACK_ORDER = [...PRIORITY_ORDER].reverse()

export default function Roadmap({ workflows, onOpen, onCreate, onSetDates }) {
  const [group, setGroup] = useState('status')
  const [hideDone, setHideDone] = useState(false)
  const [planning, setPlanning] = useState(null) // id do fluxo em edição de datas
  const [draft, setDraft] = useState({ start: '', end: '' })

  const dated = useMemo(
    () =>
      workflows
        .filter((w) => w.start && w.end && parseDate(w.start) && parseDate(w.end))
        .filter((w) => (hideDone ? w.status !== 'concluido' : true)),
    [workflows, hideDone]
  )

  const undated = useMemo(() => workflows.filter((w) => !(w.start && w.end)), [workflows])

  /** Fluxos sem data, agrupados por prioridade — é o roadmap antes de virar calendário. */
  const plan = useMemo(
    () =>
      ATTACK_ORDER.map((p) => ({
        key: p,
        ...PRIORITY[p],
        items: undated
          .filter((w) => w.priority === p)
          .sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status)),
      })).filter((g) => g.items.length > 0),
    [undated]
  )

  const months = useMemo(() => monthSpan(dated), [dated])
  const trackWidth = months.length * COL_W
  const cols = `repeat(${months.length}, minmax(0, 1fr))`
  const nowPct = positionIn(months, today())

  const nowKey = (() => {
    const t = today()
    return `${t.getFullYear()}-${t.getMonth()}`
  })()

  const lanes = useMemo(() => {
    const sorted = [...dated].sort((a, b) => parseDate(a.start) - parseDate(b.start))
    if (group === 'nenhum') return [{ key: 'todos', label: null, items: sorted }]
    return STATUS_ORDER.map((s) => ({
      key: s,
      label: STATUS[s].label,
      items: sorted.filter((w) => w.status === s),
    })).filter((g) => g.items.length > 0)
  }, [dated, group])

  const openPlanner = (w) => {
    setPlanning(w.id)
    setDraft({ start: w.start || '', end: w.end || '' })
  }

  const savePlan = (w) => {
    if (!draft.start || !draft.end) return
    onSetDates(w.id, draft.start, draft.end)
    setPlanning(null)
  }

  const invalid = draft.start && draft.end && draft.end < draft.start

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">
            Meu <em>roadmap</em>
          </h1>
          <p className="page-sub">
            Em cima, a ordem de ataque dos fluxos sem prazo — o roadmap antes de virar calendário. Embaixo, a linha do
            tempo dos que já receberam data. Um fluxo sobe para a linha do tempo assim que você define início e
            entrega.
          </p>
        </div>
        <div className="head-actions">
          <button className="btn btn-primary" onClick={onCreate}>
            <Plus size={17} /> Novo fluxo
          </button>
        </div>
      </div>

      {workflows.length === 0 ? (
        <div className="panel spark-top">
          <Empty
            icon={<Route size={30} />}
            title="Nada para planejar ainda"
            text="Crie um fluxo ou use um modelo da biblioteca. Ele aparece aqui na ordem de ataque, e vai para a linha do tempo quando você definir as datas."
            action={
              <button className="btn btn-primary" onClick={onCreate}>
                <Plus size={17} /> Criar fluxo
              </button>
            }
          />
        </div>
      ) : (
        <>
          {/* ────────── Ordem de ataque (sem data) ────────── */}
          {plan.length > 0 && (
            <div className="panel spark-top">
              <div className="panel-head">
                <h3>
                  <Target size={17} /> Ordem de ataque
                </h3>
                <span className="muted mono" style={{ fontSize: 12.5 }}>
                  {undated.length} sem prazo
                </span>
              </div>
              <div className="panel-pad col" style={{ gap: 20 }}>
                <p className="hint" style={{ marginTop: -4 }}>
                  Ordenado por prioridade e depois por status. Defina as datas quando quiser — aí o fluxo passa para a
                  linha do tempo.
                </p>

                {plan.map((g) => (
                  <section key={g.key} className="col" style={{ gap: 9 }}>
                    <div className="row" style={{ gap: 9 }}>
                      <span
                        className="chip"
                        style={{ color: g.color, borderColor: `${g.color}44`, background: `${g.color}14` }}
                      >
                        <span className="dot" />
                        {g.label}
                      </span>
                      <span className="muted mono" style={{ fontSize: 11.5 }}>
                        {g.items.length}
                      </span>
                    </div>

                    {g.items.map((w) => {
                      const { total, done } = stepsSummary(w)
                      const pct = progressOf(w)
                      const isPlanning = planning === w.id

                      return (
                        <div className="plan-row" key={w.id} style={{ '--accent': w.color }}>
                          <span className="plan-dot" />

                          <div className="plan-body">
                            <button className="plan-title" onClick={() => onOpen(w)}>
                              {w.title}
                            </button>
                            <div className="plan-meta">
                              <StatusChip status={w.status} />
                              <span>
                                <Checklist size={13} /> {done}/{total}
                              </span>
                              <span className="mono">{pct}%</span>
                            </div>
                            <div className="plan-bar">
                              <Bar value={pct} />
                            </div>
                          </div>

                          {isPlanning ? (
                            <div className="plan-dates">
                              <input
                                type="date"
                                className="input"
                                value={draft.start}
                                onChange={(e) => setDraft((d) => ({ ...d, start: e.target.value }))}
                                aria-label="Início"
                              />
                              <span className="muted">→</span>
                              <input
                                type="date"
                                className="input"
                                value={draft.end}
                                onChange={(e) => setDraft((d) => ({ ...d, end: e.target.value }))}
                                aria-label="Entrega"
                              />
                              <button
                                className="icon-btn"
                                onClick={() => savePlan(w)}
                                disabled={!draft.start || !draft.end || invalid}
                                aria-label="Salvar datas"
                                title={invalid ? 'A entrega está antes do início' : 'Salvar'}
                              >
                                <Check size={16} />
                              </button>
                              <button className="icon-btn" onClick={() => setPlanning(null)} aria-label="Cancelar">
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <button className="btn btn-sm" onClick={() => openPlanner(w)}>
                              <Calendar size={14} /> Definir datas
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </section>
                ))}
              </div>
            </div>
          )}

          {/* ────────── Linha do tempo (com data) ────────── */}
          <div className="panel spark-top">
            <div className="panel-head">
              <h3>
                <Route size={17} /> Linha do tempo
              </h3>
              {dated.length > 0 && (
                <div className="row wrap" style={{ gap: 10 }}>
                  <div className="seg">
                    <button className={group === 'status' ? 'on' : ''} onClick={() => setGroup('status')}>
                      Por status
                    </button>
                    <button className={group === 'nenhum' ? 'on' : ''} onClick={() => setGroup('nenhum')}>
                      Linha única
                    </button>
                  </div>
                  <div className="seg">
                    <button className={hideDone ? 'on' : ''} onClick={() => setHideDone((v) => !v)}>
                      {hideDone ? 'Concluídos ocultos' : 'Mostrando concluídos'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {dated.length === 0 ? (
              <Empty
                icon={<Calendar size={30} />}
                title="Nenhum fluxo com data ainda"
                text="Use o botão “Definir datas” na ordem de ataque, aí o fluxo aparece aqui posicionado entre o início e a entrega."
              />
            ) : (
              <div className="roadmap-scroll">
                <div className="roadmap" style={{ minWidth: SIDE_W + trackWidth }}>
                  <div className="rm-head">
                    <div className="rm-side" style={{ width: SIDE_W }}>
                      <span
                        className="muted"
                        style={{ fontSize: 11.5, letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: 700 }}
                      >
                        Fluxo
                      </span>
                    </div>
                    <div className="rm-head-cols" style={{ gridTemplateColumns: cols }}>
                      {months.map((mo) => {
                        const key = `${mo.getFullYear()}-${mo.getMonth()}`
                        return (
                          <div key={key} className={`rm-col-head${key === nowKey ? ' now' : ''}`}>
                            {MONTHS_SHORT[mo.getMonth()]}
                            <span className="muted" style={{ marginLeft: 5, fontSize: 10 }}>
                              {String(mo.getFullYear()).slice(2)}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {lanes.map((g) => (
                    <div key={g.key}>
                      {g.label && (
                        <div className="rm-row" style={{ background: 'rgba(120,160,255,0.04)' }}>
                          <div className="rm-side" style={{ width: SIDE_W, height: 34 }}>
                            <StatusChip status={g.key} />
                          </div>
                          <div className="rm-track" style={{ height: 34 }}>
                            <div className="rm-cols" style={{ gridTemplateColumns: cols }}>
                              {months.map((_, i) => (
                                <i key={i} />
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {g.items.map((w) => {
                        const s = parseDate(w.start)
                        const e = parseDate(w.end)
                        const left = positionIn(months, s)
                        const right = positionIn(months, e)
                        const width = Math.max(right - left, 1.6)
                        const pct = progressOf(w)
                        const late = e < today() && w.status !== 'concluido'

                        return (
                          <div className="rm-row" key={w.id}>
                            <div className="rm-side" style={{ width: SIDE_W, height: 54 }}>
                              <span
                                style={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: 99,
                                  background: w.color,
                                  boxShadow: `0 0 10px ${w.color}`,
                                  flexShrink: 0,
                                }}
                              />
                              <span className="rm-side-name" title={w.title}>
                                {w.title}
                              </span>
                              {late && <Alert size={13} style={{ color: 'var(--danger)', flexShrink: 0 }} />}
                            </div>

                            <div className="rm-track rm-lane">
                              <div className="rm-cols" style={{ gridTemplateColumns: cols }}>
                                {months.map((_, i) => (
                                  <i key={i} />
                                ))}
                              </div>

                              <div className="rm-today" style={{ left: `${nowPct}%` }} />

                              <button
                                className="rm-bar"
                                style={{ left: `${left}%`, width: `${width}%`, '--accent': w.color }}
                                onClick={() => onOpen(w)}
                                title={`${w.title} · ${formatShort(w.start)} → ${formatShort(w.end)} · ${pct}%`}
                              >
                                <span className="rm-bar-fill" style={{ width: `${pct}%` }} />
                                <span className="rm-bar-label">{w.title}</span>
                                <span
                                  className="rm-bar-label mono"
                                  style={{ marginLeft: 'auto', fontSize: 11, opacity: 0.85 }}
                                >
                                  {pct}%
                                </span>
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}
