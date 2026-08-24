import { useEffect } from 'react'
import { X } from './icons.jsx'
import { STATUS, PRIORITY } from '../lib/constants.js'

export function Modal({ title, onClose, children, footer, size }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal${size ? ` ${size}` : ''}`} role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-head">
          <h2>{title}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  )
}

export function Bar({ value }) {
  return (
    <div className="bar" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <i style={{ width: `${Math.max(value, value > 0 ? 3 : 0)}%` }} />
    </div>
  )
}

export function StatusChip({ status }) {
  const s = STATUS[status] || STATUS.planejado
  return (
    <span className="chip" style={{ color: s.color, borderColor: `${s.color}44`, background: `${s.color}14` }}>
      <span className="dot" />
      {s.label}
    </span>
  )
}

export function PriorityChip({ priority }) {
  const p = PRIORITY[priority] || PRIORITY.media
  return (
    <span className="chip" style={{ color: p.color, borderColor: `${p.color}33`, background: `${p.color}0f` }}>
      {p.label}
    </span>
  )
}

export function Empty({ icon, title, text, action }) {
  return (
    <div className="empty">
      <div className="empty-mark">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  )
}

export function Stat({ label, value, suffix, foot, accent, icon }) {
  return (
    <div className="stat" style={{ '--accent': accent }}>
      {icon && <div className="stat-icon">{icon}</div>}
      <div className="stat-label">{label}</div>
      <div className="stat-value">
        {value}
        {suffix && <small>{suffix}</small>}
      </div>
      {foot && <div className="stat-foot">{foot}</div>}
    </div>
  )
}
