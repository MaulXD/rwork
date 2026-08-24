import { StatusChip, Bar } from './ui.jsx'
import { Checklist, Calendar, Alert, Clock } from './icons.jsx'
import { progressOf, stepsSummary, deadlineInfo, formatShort } from '../lib/utils.js'

export default function WorkflowCard({ wf, onOpen, index = 0 }) {
  const pct = progressOf(wf)
  const { total, done } = stepsSummary(wf)
  const dl = deadlineInfo(wf)

  return (
    <button
      className="wf-card"
      style={{ '--accent': wf.color, animationDelay: `${Math.min(index, 12) * 45}ms` }}
      onClick={() => onOpen(wf)}
      aria-label={`Abrir fluxo ${wf.title}`}
    >
      <div className="wf-card-top">
        <div className="wf-title">{wf.title}</div>
        <StatusChip status={wf.status} />
      </div>

      {wf.description && <p className="wf-desc">{wf.description}</p>}

      {wf.tags.length > 0 && (
        <div className="row wrap" style={{ gap: 6 }}>
          {wf.tags.slice(0, 4).map((t) => (
            <span className="tag" key={t}>
              #{t}
            </span>
          ))}
          {wf.tags.length > 4 && <span className="tag">+{wf.tags.length - 4}</span>}
        </div>
      )}

      <div className="wf-progress-row">
        <Bar value={pct} />
        <span className="wf-pct">{pct}%</span>
      </div>

      <div className="wf-meta">
        <span>
          <Checklist size={14} />
          {done}/{total} etapas
        </span>
        {wf.start && wf.end && (
          <span>
            <Calendar size={14} />
            {formatShort(wf.start)} → {formatShort(wf.end)}
          </span>
        )}
        {dl && dl.late && (
          <span style={{ color: 'var(--danger)' }}>
            <Alert size={14} />
            {Math.abs(dl.days)}d atrasado
          </span>
        )}
        {dl && !dl.late && dl.soon && (
          <span style={{ color: 'var(--amber)' }}>
            <Clock size={14} />
            faltam {dl.days}d
          </span>
        )}
      </div>
    </button>
  )
}
