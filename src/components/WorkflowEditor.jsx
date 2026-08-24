import { useEffect, useMemo, useRef, useState } from 'react'
import { Modal, Bar } from './ui.jsx'
import { Plus, Trash, Check, Up, Down, Copy, X, Checklist, Pencil, Gear, Layers } from './icons.jsx'
import { PALETTE, STATUS, STATUS_ORDER, PRIORITY, PRIORITY_ORDER } from '../lib/constants.js'
import { uid, progressOf, groupedSteps } from '../lib/utils.js'

export function emptyWorkflow() {
  return {
    id: uid(),
    title: '',
    description: '',
    status: 'planejado',
    priority: 'media',
    color: PALETTE[0],
    tags: [],
    start: '',
    end: '',
    steps: [],
    templateKey: '',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}

export default function WorkflowEditor({ workflow, isNew, onSave, onDelete, onDuplicate, onClose }) {
  const [draft, setDraft] = useState(workflow)
  const [tab, setTab] = useState(isNew ? 'detalhes' : 'etapas')
  const [stepText, setStepText] = useState('')
  const [stepGroup, setStepGroup] = useState('')
  const [tagText, setTagText] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [collapsed, setCollapsed] = useState(() => new Set())
  const [editingNote, setEditingNote] = useState(null)
  const [showNotes, setShowNotes] = useState(true)
  const titleRef = useRef(null)

  useEffect(() => setDraft(workflow), [workflow])
  useEffect(() => {
    if (isNew) titleRef.current?.focus()
  }, [isNew])

  const set = (patch) => setDraft((d) => ({ ...d, ...patch }))
  const pct = useMemo(() => progressOf(draft), [draft])
  const groups = useMemo(() => groupedSteps(draft.steps), [draft.steps])
  const doneCount = draft.steps.filter((s) => s.done).length
  const groupNames = useMemo(
    () => [...new Set(draft.steps.map((s) => s.group).filter(Boolean))],
    [draft.steps]
  )

  // ---- etapas ----
  const addStep = () => {
    const t = stepText.trim()
    if (!t) return
    const group = stepGroup.trim()
    const next = [...draft.steps]
    const step = { id: uid(), title: t, note: '', group, done: false }
    // Insere logo após o último item do mesmo grupo, para não quebrar os blocos.
    const lastOfGroup = group ? next.map((s) => s.group).lastIndexOf(group) : -1
    if (lastOfGroup >= 0) next.splice(lastOfGroup + 1, 0, step)
    else next.push(step)
    set({ steps: next })
    setStepText('')
  }

  const updateStep = (id, patch) =>
    set({ steps: draft.steps.map((s) => (s.id === id ? { ...s, ...patch } : s)) })

  const removeStep = (id) => set({ steps: draft.steps.filter((s) => s.id !== id) })

  const moveStep = (index, dir) => {
    const next = [...draft.steps]
    const target = index + dir
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    // Ao atravessar a fronteira, a etapa assume o grupo do bloco de destino.
    next[target] = { ...next[target], group: next[index].group }
    set({ steps: next })
  }

  const toggleGroup = (name) => {
    const g = draft.steps.filter((s) => (s.group || '') === name)
    const allDone = g.every((s) => s.done)
    set({ steps: draft.steps.map((s) => ((s.group || '') === name ? { ...s, done: !allDone } : s)) })
  }

  const collapse = (name) =>
    setCollapsed((c) => {
      const next = new Set(c)
      next.has(name) ? next.delete(name) : next.add(name)
      return next
    })

  const resetAll = () => set({ steps: draft.steps.map((s) => ({ ...s, done: false })) })

  // ---- tags ----
  const addTag = () => {
    const t = tagText.trim().toLowerCase().replace(/^#/, '')
    if (!t || draft.tags.includes(t)) {
      setTagText('')
      return
    }
    set({ tags: [...draft.tags, t] })
    setTagText('')
  }

  const removeTag = (t) => set({ tags: draft.tags.filter((x) => x !== t) })

  const canSave = draft.title.trim().length > 0
  const datesInvalid = draft.start && draft.end && draft.end < draft.start

  const save = () => {
    if (!canSave) return
    onSave({
      ...draft,
      title: draft.title.trim(),
      description: draft.description.trim(),
      updatedAt: Date.now(),
    })
  }

  return (
    <Modal
      title={isNew ? 'Novo fluxo de trabalho' : draft.title || 'Editar fluxo'}
      onClose={onClose}
      size="lg"
      footer={
        <>
          <div className="row wrap" style={{ gap: 8 }}>
            {!isNew &&
              (confirmDelete ? (
                <>
                  <button className="btn btn-danger btn-sm" onClick={() => onDelete(draft.id)}>
                    <Trash size={15} /> Confirmar exclusão
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setConfirmDelete(false)}>
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <button className="btn btn-danger btn-sm" onClick={() => setConfirmDelete(true)}>
                    <Trash size={15} /> Excluir
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => onDuplicate(draft)}>
                    <Copy size={15} /> Duplicar
                  </button>
                </>
              ))}
          </div>
          <div className="row" style={{ gap: 8 }}>
            <button className="btn btn-ghost" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={save} disabled={!canSave}>
              <Check size={16} /> {isNew ? 'Criar fluxo' : 'Salvar'}
            </button>
          </div>
        </>
      }
    >
      <div className="tabs">
        <button className={tab === 'etapas' ? 'on' : ''} onClick={() => setTab('etapas')}>
          <Checklist size={15} /> Etapas
          <span className="nav-count">
            {doneCount}/{draft.steps.length}
          </span>
        </button>
        <button className={tab === 'detalhes' ? 'on' : ''} onClick={() => setTab('detalhes')}>
          <Gear size={15} /> Detalhes
        </button>
      </div>

      {/* ────────────── ETAPAS ────────────── */}
      {tab === 'etapas' && (
        <>
          <div className="run-head">
            <div className="row between" style={{ marginBottom: 9 }}>
              <span className="row" style={{ gap: 8, fontSize: 14, fontWeight: 600 }}>
                <Layers size={15} style={{ color: draft.color }} />
                {groups.filter((g) => g.name).length > 0
                  ? `${groups.length} blocos · ${draft.steps.length} etapas`
                  : `${draft.steps.length} etapas`}
              </span>
              <span className="mono" style={{ fontSize: 13, fontWeight: 700, color: draft.color }}>
                {pct}%
              </span>
            </div>
            <Bar value={pct} />
            <div className="row wrap between" style={{ marginTop: 11, gap: 8 }}>
              <button className="btn btn-sm btn-ghost" onClick={resetAll} disabled={doneCount === 0}>
                Desmarcar tudo
              </button>
              <button className="btn btn-sm btn-ghost" onClick={() => setShowNotes((v) => !v)}>
                {showNotes ? 'Ocultar notas' : 'Mostrar notas'}
              </button>
            </div>
          </div>

          {draft.steps.length === 0 && (
            <p className="hint">
              Nenhuma etapa ainda. Escreva a primeira aí embaixo — ou comece a partir de um modelo pronto na aba{' '}
              <strong>Modelos</strong>.
            </p>
          )}

          {groups.map((g) => {
            const gDone = g.steps.filter((s) => s.done).length
            const gPct = Math.round((gDone / g.steps.length) * 100)
            const isCollapsed = collapsed.has(g.name)
            const complete = gDone === g.steps.length

            return (
              <section className="step-group" key={g.name || '__sem_grupo__'}>
                {g.name && (
                  <header className={`step-group-head${complete ? ' complete' : ''}`}>
                    <button
                      className="icon-btn"
                      onClick={() => collapse(g.name)}
                      aria-label={isCollapsed ? 'Expandir bloco' : 'Recolher bloco'}
                    >
                      {isCollapsed ? <Down size={15} /> : <Up size={15} />}
                    </button>
                    <span className="step-group-name">{g.name}</span>
                    <span className="mono muted" style={{ fontSize: 11.5 }}>
                      {gDone}/{g.steps.length}
                    </span>
                    <div className="step-group-bar">
                      <i style={{ width: `${gPct}%`, background: draft.color }} />
                    </div>
                    <button className="btn btn-sm btn-ghost" onClick={() => toggleGroup(g.name)}>
                      {complete ? 'Limpar' : 'Marcar tudo'}
                    </button>
                  </header>
                )}

                {!isCollapsed && (
                  <ul className="steps">
                    {g.steps.map((s) => (
                      <li className={`step${s.done ? ' done' : ''}`} key={s.id}>
                        <div className="step-main">
                          <span className="step-num">{String(s.index + 1).padStart(2, '0')}</span>
                          <button
                            className={`check${s.done ? ' on' : ''}`}
                            onClick={() => updateStep(s.id, { done: !s.done })}
                            aria-label={s.done ? 'Desmarcar etapa' : 'Marcar etapa como concluída'}
                          >
                            <Check size={13} />
                          </button>
                          <input
                            className="step-edit"
                            value={s.title}
                            onChange={(e) => updateStep(s.id, { title: e.target.value })}
                            aria-label={`Etapa ${s.index + 1}`}
                          />
                          <div className="step-actions">
                            <button
                              className={`icon-btn${s.note ? ' has-note' : ''}`}
                              onClick={() => setEditingNote(editingNote === s.id ? null : s.id)}
                              aria-label="Editar nota"
                              title="Nota"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              className="icon-btn"
                              onClick={() => moveStep(s.index, -1)}
                              disabled={s.index === 0}
                              aria-label="Subir"
                            >
                              <Up size={14} />
                            </button>
                            <button
                              className="icon-btn"
                              onClick={() => moveStep(s.index, 1)}
                              disabled={s.index === draft.steps.length - 1}
                              aria-label="Descer"
                            >
                              <Down size={14} />
                            </button>
                            <button className="icon-btn danger" onClick={() => removeStep(s.id)} aria-label="Remover etapa">
                              <Trash size={14} />
                            </button>
                          </div>
                        </div>

                        {editingNote === s.id ? (
                          <textarea
                            className="textarea step-note-edit"
                            value={s.note}
                            autoFocus
                            onChange={(e) => updateStep(s.id, { note: e.target.value })}
                            onBlur={() => setEditingNote(null)}
                            placeholder="Detalhe técnico, faixa de valores, motivo…"
                          />
                        ) : (
                          showNotes && s.note && <p className="step-note">{s.note}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )
          })}

          <div className="field" style={{ marginTop: 4 }}>
            <label>Adicionar etapa</label>
            <div className="add-step">
              <input
                className="input"
                value={stepText}
                onChange={(e) => setStepText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addStep()
                  }
                }}
                placeholder="O que precisa ser feito — Enter para adicionar"
                maxLength={200}
              />
              <button className="btn btn-sm" onClick={addStep}>
                <Plus size={15} /> Add
              </button>
            </div>
            {(groupNames.length > 0 || stepGroup) && (
              <div className="row wrap" style={{ gap: 6, marginTop: 8 }}>
                <span className="hint" style={{ marginRight: 2 }}>
                  Bloco:
                </span>
                <button className={`tag${stepGroup === '' ? ' on' : ''}`} onClick={() => setStepGroup('')}>
                  sem bloco
                </button>
                {groupNames.map((n) => (
                  <button key={n} className={`tag${stepGroup === n ? ' on' : ''}`} onClick={() => setStepGroup(n)}>
                    {n}
                  </button>
                ))}
              </div>
            )}
            <div className="add-step" style={{ marginTop: 8 }}>
              <input
                className="input"
                value={stepGroup}
                onChange={(e) => setStepGroup(e.target.value)}
                placeholder="Nome de um bloco novo (opcional)"
                maxLength={60}
              />
            </div>
          </div>
        </>
      )}

      {/* ────────────── DETALHES ────────────── */}
      {tab === 'detalhes' && (
        <>
          <div className="field">
            <label htmlFor="wf-title">Título</label>
            <input
              id="wf-title"
              ref={titleRef}
              className="input"
              value={draft.title}
              onChange={(e) => set({ title: e.target.value })}
              placeholder="Ex.: Pré-impressão — do modelo à primeira camada"
              maxLength={120}
            />
          </div>

          <div className="field">
            <label htmlFor="wf-desc">Descrição</label>
            <textarea
              id="wf-desc"
              className="textarea"
              value={draft.description}
              onChange={(e) => set({ description: e.target.value })}
              placeholder="Para que serve esse fluxo, quando ele roda, quem participa…"
            />
          </div>

          <div className="form-row">
            <div className="field">
              <label htmlFor="wf-status">Status</label>
              <select
                id="wf-status"
                className="select"
                value={draft.status}
                onChange={(e) => set({ status: e.target.value })}
              >
                {STATUS_ORDER.map((s) => (
                  <option key={s} value={s}>
                    {STATUS[s].label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="wf-priority">Prioridade</label>
              <select
                id="wf-priority"
                className="select"
                value={draft.priority}
                onChange={(e) => set({ priority: e.target.value })}
              >
                {PRIORITY_ORDER.map((p) => (
                  <option key={p} value={p}>
                    {PRIORITY[p].label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="field">
              <label htmlFor="wf-start">Início</label>
              <input
                id="wf-start"
                type="date"
                className="input"
                value={draft.start}
                onChange={(e) => set({ start: e.target.value })}
              />
            </div>
            <div className="field">
              <label htmlFor="wf-end">Entrega</label>
              <input
                id="wf-end"
                type="date"
                className="input"
                value={draft.end}
                onChange={(e) => set({ end: e.target.value })}
              />
            </div>
          </div>
          {datesInvalid && (
            <p className="hint" style={{ color: 'var(--amber)', marginTop: -10 }}>
              A data de entrega está antes do início — o fluxo não vai aparecer no roadmap com a duração correta.
            </p>
          )}
          <p className="hint" style={{ marginTop: -10 }}>
            As datas alimentam o roadmap. Sem elas, o fluxo continua salvo, só não entra na linha do tempo.
          </p>

          <div className="field">
            <label>Cor do fluxo</label>
            <div className="swatches">
              {PALETTE.map((c) => (
                <button
                  key={c}
                  className={`swatch${draft.color === c ? ' on' : ''}`}
                  style={{ background: c, boxShadow: draft.color === c ? `0 0 16px -2px ${c}` : 'none' }}
                  onClick={() => set({ color: c })}
                  aria-label={`Cor ${c}`}
                />
              ))}
            </div>
          </div>

          <div className="field">
            <label htmlFor="wf-tag">Tags</label>
            <div className="add-step">
              <input
                id="wf-tag"
                className="input"
                value={tagText}
                onChange={(e) => setTagText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault()
                    addTag()
                  }
                }}
                placeholder="Ex.: impressao-3d, rtools, relatorio…"
                maxLength={24}
              />
              <button className="btn btn-sm" onClick={addTag}>
                <Plus size={15} /> Add
              </button>
            </div>
            {draft.tags.length > 0 && (
              <div className="row wrap" style={{ gap: 7, marginTop: 4 }}>
                {draft.tags.map((t) => (
                  <span className="tag" key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    #{t}
                    <button
                      className="icon-btn"
                      style={{ width: 16, height: 16 }}
                      onClick={() => removeTag(t)}
                      aria-label={`Remover ${t}`}
                    >
                      <X size={11} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </Modal>
  )
}
