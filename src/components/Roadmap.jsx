import { useMemo, useState } from 'react'
import { Empty, StatusChip } from './ui.jsx'
import { Route, Plus, Calendar, Alert } from './icons.jsx'
import { MONTHS_SHORT, STATUS, STATUS_ORDER } from '../lib/constants.js'
import { monthSpan, positionIn, parseDate, today, progressOf, formatShort } from '../lib/utils.js'

const COL_W = 118
const SIDE_W = 210

export default function Roadmap({ workflows, onOpen, onCreate }) {
  const [group, setGroup] = useState('status')
  const [hideDone, setHideDone] = useState(false)

  const dated = useMemo(
    () =>
      workflows
        .filter((w) => w.start && w.end && parseDate(w.start) && parseDate(w.end))
        .filter((w) => (hideDone ? w.status !== 'concluido' : true)),
    [workflows, hideDone]
  )

  const undated = useMemo(() => workflows.filter((w) => !(w.start && w.end)), [workflows])

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
      color: STATUS[s].color,
      items: sorted.filter((w) => w.status === s),
    })).filter((g) => g.items.length > 0)
  }, [dated, group])

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">
            Meu <em>roadmap</em>
          </h1>
          <p className="page-sub">
            Cada barra é um fluxo posicionado entre o início e a entrega. A parte preenchida mostra o quanto das etapas
            já foi concluído, e a linha rosa marca hoje.
          </p>
        </div>
        <div className="head-actions">
          <button className="btn btn-primary" onClick={onCreate}>
            <Plus size={17} /> Novo fluxo
          </button>
        </div>
      </div>

      <div className="toolbar">
        <div className="seg">
          <button className={group === 'status' ? 'on' : ''} onClick={() => setGroup('status')}>
            Agrupar por status
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
        <span className="hint grow" style={{ textAlign: 'right' }}>
          {dated.length} fluxo{dated.length === 1 ? '' : 's'} na linha do tempo
        </span>
      </div>

      {dated.length === 0 ? (
        <div className="panel spark-top">
          <Empty
            icon={<Route size={30} />}
            title="Nada no roadmap ainda"
            text="Um fluxo entra na linha do tempo quando tem data de início e de entrega preenchidas. Abra um fluxo e defina as duas datas."
            action={
              <button className="btn btn-primary" onClick={onCreate}>
                <Plus size={17} /> Criar fluxo com datas
              </button>
            }
          />
        </div>
      ) : (
        <div className="panel spark-top">
          <div className="roadmap-scroll">
            <div className="roadmap" style={{ minWidth: SIDE_W + trackWidth }}>
              {/* cabeçalho de meses */}
              <div className="rm-head">
                <div className="rm-side" style={{ width: SIDE_W }}>
                  <span className="muted" style={{ fontSize: 11.5, letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: 700 }}>
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
                            <span className="rm-bar-label mono" style={{ marginLeft: 'auto', fontSize: 11, opacity: 0.85 }}>
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
        </div>
      )}

      {undated.length > 0 && (
        <div className="panel spark-top">
          <div className="panel-head">
            <h3>
              <Calendar size={17} /> Sem datas definidas
            </h3>
            <span className="muted mono" style={{ fontSize: 12.5 }}>
              {undated.length}
            </span>
          </div>
          <div className="panel-pad">
            <p className="hint" style={{ marginBottom: 12 }}>
              Estes fluxos estão salvos, mas ficam fora da linha do tempo até receberem início e entrega.
            </p>
            <div className="row wrap" style={{ gap: 9 }}>
              {undated.map((w) => (
                <button
                  key={w.id}
                  className="chip"
                  style={{ color: w.color, borderColor: `${w.color}44`, background: `${w.color}12`, cursor: 'pointer' }}
                  onClick={() => onOpen(w)}
                >
                  <span className="dot" />
                  {w.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
