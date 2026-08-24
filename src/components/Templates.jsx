import { useMemo, useState } from 'react'
import { Modal } from './ui.jsx'
import { Plus, Checklist, Layers, Right, Search, Check } from './icons.jsx'
import { TEMPLATES, CATEGORIES, templateStats } from '../lib/templates.js'

const byCategory = (a, b) => CATEGORIES.indexOf(a.category) - CATEGORIES.indexOf(b.category)

export default function Templates({ onUse }) {
  const [cat, setCat] = useState('todas')
  const [q, setQ] = useState('')
  const [preview, setPreview] = useState(null)

  const list = useMemo(() => {
    const term = q.trim().toLowerCase()
    return [...TEMPLATES].sort(byCategory).filter((t) => (cat === 'todas' ? true : t.category === cat)).filter((t) => {
      if (!term) return true
      return (
        t.title.toLowerCase().includes(term) ||
        t.description.toLowerCase().includes(term) ||
        t.tags.some((x) => x.includes(term)) ||
        t.groups.some((g) => g.steps.some(([title]) => title.toLowerCase().includes(term)))
      )
    })
  }, [cat, q])

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">
            Biblioteca de <em>modelos</em>
          </h1>
          <p className="page-sub">
            Checklists prontos e detalhados. Ao usar um modelo, ele vira um fluxo seu — dá para editar, marcar as
            etapas e desmarcar tudo para rodar de novo no próximo ciclo.
          </p>
        </div>
      </div>

      <div className="toolbar">
        <div className="search">
          <Search size={17} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar modelo ou etapa…"
            aria-label="Buscar modelos"
          />
        </div>
        <div className="seg">
          <button className={cat === 'todas' ? 'on' : ''} onClick={() => setCat('todas')}>
            Todas
          </button>
          {CATEGORIES.map((c) => (
            <button key={c} className={cat === c ? 'on' : ''} onClick={() => setCat(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="wf-grid">
        {list.map((t, i) => {
          const st = templateStats(t)
          return (
            <article
              className="wf-card tpl-card"
              key={t.key}
              style={{ '--accent': t.color, animationDelay: `${Math.min(i, 12) * 45}ms` }}
            >
              <div className="wf-card-top">
                <div className="wf-title">{t.title}</div>
              </div>
              <span className="chip" style={{ color: t.color, borderColor: `${t.color}44`, background: `${t.color}14`, alignSelf: 'flex-start' }}>
                <span className="dot" />
                {t.category}
              </span>
              <p className="wf-desc" style={{ WebkitLineClamp: 3 }}>
                {t.description}
              </p>
              <div className="wf-meta">
                <span>
                  <Layers size={14} /> {st.groups} blocos
                </span>
                <span>
                  <Checklist size={14} /> {st.steps} etapas
                </span>
                {st.done > 0 && (
                  <span style={{ color: t.color }}>
                    <Check size={14} /> {st.done} já concluídas
                  </span>
                )}
              </div>
              <div className="row wrap" style={{ gap: 6 }}>
                {t.tags.map((x) => (
                  <span className="tag" key={x}>
                    #{x}
                  </span>
                ))}
              </div>
              <div className="row" style={{ gap: 8, marginTop: 'auto' }}>
                <button className="btn btn-primary btn-sm grow" style={{ justifyContent: 'center' }} onClick={() => onUse(t)}>
                  <Plus size={15} /> Usar modelo
                </button>
                <button className="btn btn-sm" onClick={() => setPreview(t)}>
                  Ver etapas <Right size={14} />
                </button>
              </div>
            </article>
          )
        })}
      </div>

      {list.length === 0 && (
        <div className="panel spark-top">
          <div className="empty">
            <div className="empty-mark">
              <Search size={30} />
            </div>
            <h3>Nenhum modelo com esse termo</h3>
            <p>Tente outra palavra ou volte para todas as categorias.</p>
          </div>
        </div>
      )}

      {preview && (
        <Modal
          title={preview.title}
          size="lg"
          onClose={() => setPreview(null)}
          footer={
            <>
              <span className="hint">
                {templateStats(preview).groups} blocos · {templateStats(preview).steps} etapas
                {templateStats(preview).done > 0 && ` · ${templateStats(preview).done} já concluídas`}
              </span>
              <button
                className="btn btn-primary"
                onClick={() => {
                  onUse(preview)
                  setPreview(null)
                }}
              >
                <Check size={16} /> Usar este modelo
              </button>
            </>
          }
        >
          <p className="hint">{preview.description}</p>
          {preview.groups.map((g) => (
            <section className="step-group" key={g.name}>
              <header className="step-group-head">
                <span className="step-group-name">{g.name}</span>
                <span className="mono muted" style={{ fontSize: 11.5 }}>
                  {g.steps.length}
                </span>
              </header>
              <ul className="steps">
                {g.steps.map(([title, note, done], i) => (
                  <li className={`step${done ? ' done' : ''}`} key={i}>
                    <div className="step-main">
                      <span className={`check${done ? ' on' : ''}`} aria-hidden="true">
                        {done && <Check size={13} />}
                      </span>
                      <span className="step-title" style={{ whiteSpace: 'normal' }}>
                        {title}
                      </span>
                    </div>
                    {note && <p className="step-note">{note}</p>}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </Modal>
      )}
    </>
  )
}
