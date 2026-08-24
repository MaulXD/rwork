import { useMemo } from 'react'
import WorkflowCard from './WorkflowCard.jsx'
import { Stat, Empty, Bar, StatusChip } from './ui.jsx'
import { Plus, Trend, Checklist, Alert, Layers, Clock, Sparkle, Target, Flow, Right } from './icons.jsx'
import { STATUS, STATUS_ORDER } from '../lib/constants.js'
import { progressOf, deadlineInfo, formatDate, formatTimestamp, relativeDays, parseDate } from '../lib/utils.js'

export default function Dashboard({ workflows, onOpen, onCreate, onGo }) {
  const m = useMemo(() => {
    const total = workflows.length
    const ativos = workflows.filter((w) => w.status === 'ativo').length
    const concluidos = workflows.filter((w) => w.status === 'concluido').length
    const stepsTotal = workflows.reduce((n, w) => n + w.steps.length, 0)
    const stepsDone = workflows.reduce((n, w) => n + w.steps.filter((s) => s.done).length, 0)
    const emCurso = workflows.filter((w) => w.status !== 'concluido')
    const media = emCurso.length
      ? Math.round(emCurso.reduce((n, w) => n + progressOf(w), 0) / emCurso.length)
      : 0
    const atrasados = workflows.filter((w) => deadlineInfo(w)?.late).length

    const byStatus = STATUS_ORDER.map((s) => ({
      key: s,
      ...STATUS[s],
      count: workflows.filter((w) => w.status === s).length,
    })).filter((s) => s.count > 0)

    const prazos = workflows
      .filter((w) => w.end && w.status !== 'concluido')
      .sort((a, b) => parseDate(a.end) - parseDate(b.end))
      .slice(0, 6)

    const recentes = [...workflows].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 6)

    const foco = workflows
      .filter((w) => w.status === 'ativo')
      .sort((a, b) => progressOf(b) - progressOf(a))
      .slice(0, 4)

    return { total, ativos, concluidos, stepsTotal, stepsDone, media, atrasados, byStatus, prazos, recentes, foco }
  }, [workflows])

  const saudacao = (() => {
    const h = new Date().getHours()
    if (h < 6) return 'Boa madrugada'
    if (h < 12) return 'Bom dia'
    if (h < 18) return 'Boa tarde'
    return 'Boa noite'
  })()

  if (workflows.length === 0) {
    return (
      <>
        <div className="page-head">
          <div>
            <h1 className="page-title">
              {saudacao}, bem-vindo ao <em>RWork</em>
            </h1>
            <p className="page-sub">Seu painel começa vazio. Crie o primeiro fluxo e ele passa a viver aqui.</p>
          </div>
        </div>
        <div className="panel spark-top">
          <Empty
            icon={<Sparkle size={30} />}
            title="Tudo pronto para o primeiro fluxo"
            text="Um fluxo é um processo do seu trabalho quebrado em etapas. Dê um nome, liste as etapas e acompanhe o progresso."
            action={
              <button className="btn btn-primary" onClick={onCreate}>
                <Plus size={17} /> Criar meu primeiro fluxo
              </button>
            }
          />
        </div>
      </>
    )
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">
            {saudacao} — seu <em>painel</em>
          </h1>
          <p className="page-sub">
            {m.ativos > 0
              ? `${m.ativos} fluxo${m.ativos > 1 ? 's' : ''} em andamento e ${m.stepsTotal - m.stepsDone} etapa${
                  m.stepsTotal - m.stepsDone === 1 ? '' : 's'
                } esperando por você.`
              : 'Nenhum fluxo em andamento agora. Bom momento para planejar o próximo.'}
          </p>
        </div>
        <div className="head-actions">
          <button className="btn btn-primary" onClick={onCreate}>
            <Plus size={17} /> Novo fluxo
          </button>
        </div>
      </div>

      <div className="stat-grid">
        <Stat
          label="Fluxos salvos"
          value={m.total}
          accent="#22e6ff"
          icon={<Layers size={17} />}
          foot={<>{m.concluidos} concluído{m.concluidos === 1 ? '' : 's'}</>}
        />
        <Stat
          label="Em andamento"
          value={m.ativos}
          accent="#7c5cff"
          icon={<Trend size={17} />}
          foot={<>progresso médio de {m.media}%</>}
        />
        <Stat
          label="Etapas feitas"
          value={m.stepsDone}
          suffix={`/ ${m.stepsTotal}`}
          accent="#5dff9b"
          icon={<Checklist size={17} />}
          foot={<>{m.stepsTotal - m.stepsDone} restantes</>}
        />
        <Stat
          label="Atrasados"
          value={m.atrasados}
          accent={m.atrasados > 0 ? '#ff5c7a' : '#8ea3cc'}
          icon={<Alert size={17} />}
          foot={m.atrasados > 0 ? <>revise os prazos</> : <>tudo dentro do prazo</>}
        />
      </div>

      <div className="dash-grid">
        <div className="col" style={{ gap: 18 }}>
          <div className="panel spark-top">
            <div className="panel-head">
              <h3>
                <Target size={17} /> Foco agora
              </h3>
              <button className="btn btn-sm btn-ghost" onClick={() => onGo('fluxos')}>
                Ver todos <Right size={14} />
              </button>
            </div>
            <div className="panel-pad">
              {m.foco.length === 0 ? (
                <p className="hint">
                  Nenhum fluxo marcado como <strong>em andamento</strong>. Abra um fluxo e mude o status para vê-lo
                  aqui.
                </p>
              ) : (
                <div className="wf-grid">
                  {m.foco.map((wf, i) => (
                    <WorkflowCard key={wf.id} wf={wf} onOpen={onOpen} index={i} />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="panel spark-top">
            <div className="panel-head">
              <h3>
                <Flow size={17} /> Distribuição por status
              </h3>
            </div>
            <div className="panel-pad col" style={{ gap: 14 }}>
              {m.byStatus.map((s) => (
                <div key={s.key} className="col" style={{ gap: 6 }}>
                  <div className="row between">
                    <StatusChip status={s.key} />
                    <span className="mono muted" style={{ fontSize: 12.5 }}>
                      {s.count} · {Math.round((s.count / m.total) * 100)}%
                    </span>
                  </div>
                  <div className="bar">
                    <i
                      style={{
                        width: `${(s.count / m.total) * 100}%`,
                        background: `linear-gradient(90deg, ${s.color}, ${s.color}66)`,
                        boxShadow: `0 0 14px -2px ${s.color}`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col" style={{ gap: 18 }}>
          <div className="panel spark-top">
            <div className="panel-head">
              <h3>
                <Clock size={17} /> Próximos prazos
              </h3>
              <button className="btn btn-sm btn-ghost" onClick={() => onGo('roadmap')}>
                Roadmap <Right size={14} />
              </button>
            </div>
            <div className="panel-pad">
              {m.prazos.length === 0 ? (
                <p className="hint">Nenhum fluxo em aberto com data de entrega definida.</p>
              ) : (
                <ul className="col" style={{ gap: 12 }}>
                  {m.prazos.map((w) => {
                    const dl = deadlineInfo(w)
                    return (
                      <li key={w.id}>
                        <button
                          className="row between grow"
                          style={{ width: '100%', textAlign: 'left', gap: 12 }}
                          onClick={() => onOpen(w)}
                        >
                          <span className="col grow" style={{ gap: 3 }}>
                            <span style={{ fontSize: 14, fontWeight: 600 }}>{w.title}</span>
                            <span className="muted" style={{ fontSize: 12.5 }}>
                              {formatDate(w.end)}
                            </span>
                          </span>
                          <span
                            className="chip"
                            style={{
                              color: dl?.late ? 'var(--danger)' : dl?.soon ? 'var(--amber)' : 'var(--text-2)',
                              borderColor: 'var(--stroke)',
                              background: 'rgba(120,160,255,0.06)',
                            }}
                          >
                            {relativeDays(w.end)}
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>

          <div className="panel spark-top">
            <div className="panel-head">
              <h3>
                <Sparkle size={17} /> Atividade recente
              </h3>
            </div>
            <div className="panel-pad">
              <ul className="tl">
                {m.recentes.map((w) => (
                  <li className="tl-item" key={w.id} style={{ '--accent': w.color }}>
                    <span className="tl-dot">
                      <i />
                    </span>
                    <div className="tl-body">
                      <button className="tl-title" style={{ textAlign: 'left' }} onClick={() => onOpen(w)}>
                        {w.title}
                      </button>
                      <div className="tl-meta">
                        {STATUS[w.status]?.label} · atualizado {formatTimestamp(w.updatedAt)} · {progressOf(w)}%
                      </div>
                      <div style={{ marginTop: 7 }}>
                        <Bar value={progressOf(w)} />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
