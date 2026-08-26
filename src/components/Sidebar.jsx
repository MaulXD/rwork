import { useRef } from 'react'
import { BoltFill, Dashboard, Flow, Route, Gear, Plus, Layers, Save, Target } from './icons.jsx'
import { Bar } from './ui.jsx'
import { progressOf } from '../lib/utils.js'

const NAV = [
  { key: 'painel', label: 'Painel', Icon: Dashboard },
  { key: 'fluxos', label: 'Fluxos', Icon: Flow },
  { key: 'modelos', label: 'Modelos', Icon: Layers },
  { key: 'roadmap', label: 'Roadmap', Icon: Route },
]

const NAV_THEP = [
  { key: 'setup-pcs', label: 'Setup de PCs', Icon: Save },
  { key: 'treinamento', label: 'Treinamento TI', Icon: Target },
]

const NAV_FIM = [{ key: 'ajustes', label: 'Ajustes', Icon: Gear }]

export default function Sidebar({ view, onGo, workflows, onCreate, open, onClose, onCentelha }) {
  // Sete cliques seguidos no raio revelam uma centelha.
  const cliques = useRef({ n: 0, ultimo: 0 })
  const bater = () => {
    const agora = Date.now()
    cliques.current.n = agora - cliques.current.ultimo < 900 ? cliques.current.n + 1 : 1
    cliques.current.ultimo = agora
    if (cliques.current.n >= 7) {
      cliques.current.n = 0
      onCentelha?.()
    }
  }

  const ativos = workflows.filter((w) => w.status === 'ativo').length
  const emCurso = workflows.filter((w) => w.status !== 'concluido')
  const media = emCurso.length ? Math.round(emCurso.reduce((n, w) => n + progressOf(w), 0) / emCurso.length) : 0

  const counts = {
    fluxos: workflows.length,
    roadmap: workflows.filter((w) => w.start && w.end).length,
    painel: ativos,
  }

  const go = (key) => {
    onGo(key)
    onClose?.()
  }

  return (
    <aside className={`sidebar${open ? ' open' : ''}`}>
      <div className="brand">
        <button
          className="brand-mark"
          onClick={bater}
          aria-label="RWork"
          title="RWork"
        >
          <BoltFill size={22} />
        </button>
        <div>
          <div className="brand-name">RWork</div>
          <div className="brand-sub">Fluxos & Roadmaps</div>
        </div>
      </div>

      <button className="btn btn-primary" style={{ justifyContent: 'center' }} onClick={() => { onCreate(); onClose?.() }}>
        <Plus size={17} /> Novo fluxo
      </button>

      <nav className="nav">
        <div className="nav-label">Navegação</div>
        {NAV.map(({ key, label, Icon }) => (
          <button key={key} className={`nav-item${view === key ? ' active' : ''}`} onClick={() => go(key)}>
            <Icon size={18} />
            {label}
            {counts[key] > 0 && <span className="nav-count">{counts[key]}</span>}
          </button>
        ))}

        <div className="nav-label">Thep</div>
        {NAV_THEP.map(({ key, label, Icon }) => (
          <button key={key} className={`nav-item${view === key ? ' active' : ''}`} onClick={() => go(key)}>
            <Icon size={18} />
            {label}
          </button>
        ))}

        <div className="nav-label">Sistema</div>
        {NAV_FIM.map(({ key, label, Icon }) => (
          <button key={key} className={`nav-item${view === key ? ' active' : ''}`} onClick={() => go(key)}>
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>

      <div className="sidebar-foot">
        <div className="energy-box">
          <div className="energy-title">Carga do trabalho</div>
          <div className="energy-value">
            {media}
            <span>%</span>
          </div>
          <Bar value={media} />
          <div className="hint" style={{ marginTop: 9 }}>
            {emCurso.length === 0
              ? 'Tudo concluído por aqui.'
              : `${emCurso.length} fluxo${emCurso.length > 1 ? 's' : ''} em aberto`}
          </div>
        </div>
      </div>
    </aside>
  )
}
