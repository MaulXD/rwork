import { useCallback, useEffect, useRef, useState } from 'react'
import ElectricBackground from './components/ElectricBackground.jsx'
import Sidebar from './components/Sidebar.jsx'
import Dashboard from './components/Dashboard.jsx'
import Workflows from './components/Workflows.jsx'
import Roadmap from './components/Roadmap.jsx'
import Settings from './components/Settings.jsx'
import Templates from './components/Templates.jsx'
import SetupPcs from './components/SetupPcs.jsx'
import Treinamento from './components/Treinamento.jsx'
import WorkflowEditor, { emptyWorkflow } from './components/WorkflowEditor.jsx'
import EasterEggs from './components/EasterEggs.jsx'
import { BoltFill, Menu, Check, Plus } from './components/icons.jsx'
import { loadState, saveState, parseImport, seedWorkflows } from './lib/storage.js'
import { templateToWorkflow } from './lib/templates.js'
import { uid } from './lib/utils.js'
import { PALETTE } from './lib/constants.js'

const VIEWS = ['painel', 'fluxos', 'modelos', 'roadmap', 'setup-pcs', 'treinamento', 'ajustes']

const initial = loadState()

export default function App() {
  const [workflows, setWorkflows] = useState(initial.workflows)
  const [prefs, setPrefs] = useState({ bg: true, intensity: 0.6, ...(initial.prefs || {}) })
  const [seededKeys] = useState(initial.seededKeys || [])
  const [datesCleared] = useState(initial.datesCleared !== false)
  const [view, setView] = useState(() => {
    const hash = window.location.hash.replace('#', '')
    return VIEWS.includes(hash) ? hash : 'painel'
  })
  const [editing, setEditing] = useState(null) // { wf, isNew }
  const [menuOpen, setMenuOpen] = useState(false)
  const [toasts, setToasts] = useState([])
  const [centelha, setCentelha] = useState(0)
  const [tempestade, setTempestade] = useState(false)
  const firstRun = useRef(true)

  // ---- persistência ----
  useEffect(() => {
    // Na montagem só regrava se houve entrega de fluxo novo (primeiro acesso
    // ou modelo acrescentado depois), para não gravar por gravar.
    const entregou =
      initial.seeded || (initial.novos && initial.novos.length > 0) || initial.limpos > 0
    if (firstRun.current && !entregou) {
      firstRun.current = false
      return
    }
    firstRun.current = false
    saveState({ version: 2, workflows, prefs, seededKeys, datesCleared })
  }, [workflows, prefs, seededKeys, datesCleared])

  // ---- navegação por hash ----
  useEffect(() => {
    window.location.hash = view
  }, [view])

  useEffect(() => {
    const onHash = () => {
      const h = window.location.hash.replace('#', '')
      if (VIEWS.includes(h)) setView(h)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const toast = useCallback((message) => {
    const id = uid()
    setToasts((t) => [...t, { id, message }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200)
  }, [])

  // Avisa quando modelo novo do código chegou a um navegador que já tinha dados.
  useEffect(() => {
    if (initial.seeded) return
    const novos = initial.novos || []
    const limpos = initial.limpos || 0
    if (novos.length === 0 && limpos === 0) return
    const t = setTimeout(() => {
      if (novos.length === 1) toast(`Fluxo novo adicionado: ${novos[0]}`)
      else if (novos.length > 1) toast(`${novos.length} fluxos novos adicionados`)
      if (limpos > 0) toast(`Prazos removidos de ${limpos} fluxos — defina no roadmap quando quiser`)
    }, 600)
    return () => clearTimeout(t)
  }, [toast])


  // ---- ações sobre fluxos ----
  const openNew = useCallback(() => {
    const wf = emptyWorkflow()
    wf.color = PALETTE[Math.floor(Math.random() * PALETTE.length)]
    setEditing({ wf, isNew: true })
  }, [])

  const openEdit = useCallback((wf) => setEditing({ wf, isNew: false }), [])

  const saveWorkflow = (wf) => {
    setWorkflows((list) => {
      const exists = list.some((w) => w.id === wf.id)
      return exists ? list.map((w) => (w.id === wf.id ? wf : w)) : [wf, ...list]
    })
    toast(editing?.isNew ? 'Fluxo criado' : 'Alterações salvas')
    setEditing(null)
  }

  const deleteWorkflow = (id) => {
    setWorkflows((list) => list.filter((w) => w.id !== id))
    toast('Fluxo excluído')
    setEditing(null)
  }

  const duplicateWorkflow = (wf) => {
    const copy = {
      ...wf,
      id: uid(),
      title: `${wf.title} (cópia)`,
      steps: wf.steps.map((s) => ({ ...s, id: uid() })),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    setWorkflows((list) => [copy, ...list])
    toast('Fluxo duplicado')
    setEditing({ wf: copy, isNew: false })
  }

  const useTemplate = (tpl) => {
    const wf = templateToWorkflow(tpl, { status: 'ativo' })
    setWorkflows((list) => [wf, ...list])
    toast(`"${tpl.title}" adicionado aos seus fluxos`)
    setEditing({ wf, isNew: false })
  }

  const setDates = (id, start, end) => {
    setWorkflows((list) =>
      list.map((w) => (w.id === id ? { ...w, start, end, updatedAt: Date.now() } : w))
    )
    toast('Datas definidas — o fluxo entrou na linha do tempo')
  }

  const importData = (text) => {
    const list = parseImport(text)
    setWorkflows(list)
    toast(`${list.length} fluxo${list.length === 1 ? '' : 's'} importado${list.length === 1 ? '' : 's'}`)
    setView('fluxos')
  }

  const resetData = () => {
    setWorkflows([])
    toast('Todos os fluxos foram apagados')
  }

  const loadSeed = () => {
    setWorkflows((list) => [...seedWorkflows(), ...list])
    toast('Fluxos iniciais adicionados')
    setView('fluxos')
  }

  // ---- atalhos ----
  useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement?.tagName
      const typing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT'
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return
      if (editing) return

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault()
        openNew()
      } else if (e.key === '/') {
        e.preventDefault()
        setView('fluxos')
        setTimeout(() => document.querySelector('.search input')?.focus(), 60)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [editing, openNew])

  const go = (v) => {
    setView(v)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <ElectricBackground enabled={prefs.bg} intensity={tempestade ? 1 : prefs.intensity} />

      <div className="topbar">
        <button className="icon-btn" onClick={() => setMenuOpen(true)} aria-label="Abrir menu">
          <Menu size={20} />
        </button>
        <div className="row" style={{ gap: 9 }}>
          <div className="brand-mark" style={{ width: 30, height: 30, borderRadius: 9 }}>
            <BoltFill size={16} />
          </div>
          <span className="brand-name" style={{ fontSize: 17 }}>
            RWork
          </span>
        </div>
        <button className="btn btn-primary btn-sm" onClick={openNew}>
          <Plus size={15} /> Novo
        </button>
      </div>

      {menuOpen && <div className="scrim" onClick={() => setMenuOpen(false)} />}

      <div className="shell">
        <Sidebar
          view={view}
          onGo={go}
          workflows={workflows}
          onCreate={openNew}
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          onCentelha={() => setCentelha((n) => n + 1)}
        />

        <main className="main">
          {view === 'painel' && (
            <Dashboard workflows={workflows} onOpen={openEdit} onCreate={openNew} onGo={go} />
          )}
          {view === 'fluxos' && <Workflows workflows={workflows} onOpen={openEdit} onCreate={openNew} onGo={go} />}
          {view === 'modelos' && <Templates onUse={useTemplate} workflows={workflows} onGo={go} />}
          {view === 'setup-pcs' && <SetupPcs />}
          {view === 'treinamento' && <Treinamento onGo={go} />}
          {view === 'roadmap' && (
            <Roadmap workflows={workflows} onOpen={openEdit} onCreate={openNew} onSetDates={setDates} />
          )}
          {view === 'ajustes' && (
            <Settings
              workflows={workflows}
              prefs={prefs}
              onPrefs={(patch) => setPrefs((p) => ({ ...p, ...patch }))}
              onImport={importData}
              onReset={resetData}
              onSeed={loadSeed}
              toast={toast}
            />
          )}
        </main>
      </div>

      {editing && (
        <WorkflowEditor
          workflow={editing.wf}
          isNew={editing.isNew}
          onSave={saveWorkflow}
          onDelete={deleteWorkflow}
          onDuplicate={duplicateWorkflow}
          onClose={() => setEditing(null)}
        />
      )}

      <EasterEggs
        trigger={centelha}
        onStorm={() => {
          setTempestade(true)
          setTimeout(() => setTempestade(false), 9000)
        }}
      />

      <div className="toast-wrap">
        {toasts.map((t) => (
          <div className="toast" key={t.id}>
            <Check size={17} />
            {t.message}
          </div>
        ))}
      </div>
    </>
  )
}
