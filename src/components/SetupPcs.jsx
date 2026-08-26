import { useEffect, useMemo, useState } from 'react'
import { Bar, Empty } from './ui.jsx'
import { Copy, Check, Download, Alert, Plus, Trash, Checklist, Layers } from './icons.jsx'
import { BLOCOS, TOTAL_ITENS, SETUP_VERSAO, preencher } from '../lib/setupPcs.js'

const CHAVE = 'rwork.setup-pcs'

/**
 * Estado por máquina. Fica só neste navegador — as senhas jamais entram no
 * repositório, que é público.
 */
function ler() {
  try {
    const raw = localStorage.getItem(CHAVE)
    const d = raw ? JSON.parse(raw) : null
    return {
      senha: d?.senha || '',
      root: d?.root || '',
      atual: d?.atual || '',
      maquinas: d?.maquinas || {},
    }
  } catch {
    return { senha: '', root: '', atual: '', maquinas: {} }
  }
}

function gravar(estado) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(estado))
  } catch {
    /* modo privado: só não persiste */
  }
}

function CodeBlock({ code }) {
  const [copiado, setCopiado] = useState(false)

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      // Fallback para contexto sem permissão de área de transferência.
      const ta = document.createElement('textarea')
      ta.value = code
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      try {
        document.execCommand('copy')
      } catch {
        /* desiste em silêncio: o texto continua selecionável na tela */
      }
      document.body.removeChild(ta)
    }
    setCopiado(true)
    setTimeout(() => setCopiado(false), 1600)
  }

  return (
    <div className="code">
      <pre>
        <code>{code}</code>
      </pre>
      <button className="code-copy" onClick={copiar} aria-label="Copiar comando">
        {copiado ? <Check size={14} /> : <Copy size={14} />}
        {copiado ? 'copiado' : 'copiar'}
      </button>
    </div>
  )
}

export default function SetupPcs() {
  const [estado, setEstado] = useState(ler)
  const { senha, root, atual, maquinas } = estado

  useEffect(() => {
    gravar(estado)
  }, [estado])

  const set = (patch) => setEstado((e) => ({ ...e, ...patch }))

  const maquina = maquinas[atual] || { feitos: {}, anydeskId: '', validadoPor: '', data: '' }
  const vars = { pc: atual, senha, root }

  const setMaquina = (patch) =>
    setEstado((e) => ({
      ...e,
      maquinas: { ...e.maquinas, [e.atual]: { ...maquina, ...patch } },
    }))

  const alternar = (id) =>
    setMaquina({ feitos: { ...maquina.feitos, [id]: !maquina.feitos[id] } })

  const feitos = useMemo(
    () => Object.values(maquina.feitos).filter(Boolean).length,
    [maquina.feitos]
  )
  const pct = TOTAL_ITENS ? Math.round((feitos / TOTAL_ITENS) * 100) : 0

  const listaMaquinas = useMemo(
    () =>
      Object.entries(maquinas)
        .map(([pc, m]) => ({
          pc,
          feitos: Object.values(m.feitos || {}).filter(Boolean).length,
        }))
        .sort((a, b) => a.pc.localeCompare(b.pc, 'pt-BR', { numeric: true })),
    [maquinas]
  )

  const novaMaquina = () => {
    const pc = window.prompt('Número do PC no inventário (ex.: 0042)')
    if (!pc) return
    const limpo = pc.trim().toLowerCase()
    if (!limpo) return
    setEstado((e) => ({
      ...e,
      atual: limpo,
      maquinas: { ...e.maquinas, [limpo]: e.maquinas[limpo] || { feitos: {}, anydeskId: '', validadoPor: '', data: '' } },
    }))
  }

  const removerMaquina = (pc) => {
    setEstado((e) => {
      const m = { ...e.maquinas }
      delete m[pc]
      return { ...e, maquinas: m, atual: e.atual === pc ? '' : e.atual }
    })
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">
            Setup de <em>PCs</em>
          </h1>
          <p className="page-sub">
            Checklist oficial de preparação de notebook Linux no padrão Thep — {SETUP_VERSAO}. Escolha a máquina, os
            comandos se preenchem sozinhos com o número dela e o progresso fica guardado por máquina.
          </p>
        </div>
        <div className="head-actions">
          <a className="btn" href="/bloquear-sites.sh" download>
            <Download size={16} /> bloquear-sites.sh
          </a>
          <button className="btn btn-primary" onClick={novaMaquina}>
            <Plus size={17} /> Nova máquina
          </button>
        </div>
      </div>

      {/* ── credenciais, só neste navegador ── */}
      <div className="panel spark-top">
        <div className="panel-head">
          <h3>
            <Alert size={17} /> Credenciais da TI
          </h3>
        </div>
        <div className="panel-pad col" style={{ gap: 14 }}>
          <p className="hint">
            Estes valores ficam <strong>só neste navegador</strong> e nunca são enviados a lugar nenhum. Foram deixados
            de fora do código porque o repositório e o site publicado são públicos — a senha do AnyDesk dá acesso remoto
            às máquinas.
          </p>
          <div className="form-row">
            <div className="field">
              <label htmlFor="senha-padrao">Senha padrão da Thep</label>
              <input
                id="senha-padrao"
                className="input mono"
                value={senha}
                onChange={(e) => set({ senha: e.target.value })}
                placeholder="usada nos usuários e no AnyDesk"
                autoComplete="off"
              />
            </div>
            <div className="field">
              <label htmlFor="senha-root">Senha de fábrica do root</label>
              <input
                id="senha-root"
                className="input mono"
                value={root}
                onChange={(e) => set({ root: e.target.value })}
                placeholder="a que vem na máquina nova"
                autoComplete="off"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── seletor de máquina ── */}
      {listaMaquinas.length > 0 && (
        <div className="row wrap" style={{ gap: 8 }}>
          <span className="hint" style={{ marginRight: 2 }}>
            Máquina:
          </span>
          {listaMaquinas.map((m) => (
            <span key={m.pc} className={`maq-chip${atual === m.pc ? ' on' : ''}`}>
              <button onClick={() => set({ atual: m.pc })}>
                THEP-NOT-{m.pc.toUpperCase()}
                <span className="mono"> {m.feitos}/{TOTAL_ITENS}</span>
              </button>
              <button className="maq-x" onClick={() => removerMaquina(m.pc)} aria-label={`Remover ${m.pc}`}>
                <Trash size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      {!atual ? (
        <div className="panel spark-top">
          <Empty
            icon={<Layers size={30} />}
            title="Escolha ou crie uma máquina"
            text="O checklist é preenchido por máquina: o número entra nos comandos e o progresso de cada notebook fica separado."
            action={
              <button className="btn btn-primary" onClick={novaMaquina}>
                <Plus size={17} /> Nova máquina
              </button>
            }
          />
        </div>
      ) : (
        <>
          <div className="panel spark-top">
            <div className="panel-pad">
              <div className="row between wrap" style={{ gap: 12, marginBottom: 11 }}>
                <span className="row" style={{ gap: 9, fontSize: 15, fontWeight: 700 }}>
                  <Checklist size={16} style={{ color: 'var(--elec-1)' }} />
                  THEP-NOT-{atual.toUpperCase()}
                </span>
                <span className="mono" style={{ fontSize: 13, fontWeight: 700, color: 'var(--elec-1)' }}>
                  {feitos}/{TOTAL_ITENS} · {pct}%
                </span>
              </div>
              <Bar value={pct} />
              {feitos > 0 && (
                <button
                  className="btn btn-sm btn-ghost"
                  style={{ marginTop: 11 }}
                  onClick={() => setMaquina({ feitos: {} })}
                >
                  Desmarcar tudo desta máquina
                </button>
              )}
            </div>
          </div>

          {BLOCOS.map((b, i) => {
            const bFeitos = b.itens.filter((it) => maquina.feitos[it.id]).length
            const completo = bFeitos === b.itens.length

            return (
              <section className="panel spark-top" key={b.id}>
                <div className="panel-head">
                  <h3>
                    <span className="setup-num">{String(i + 1).padStart(2, '0')}</span>
                    {b.titulo}
                  </h3>
                  <span
                    className="mono"
                    style={{ fontSize: 12.5, color: completo ? 'var(--elec-4)' : 'var(--text-3)' }}
                  >
                    {bFeitos}/{b.itens.length}
                  </span>
                </div>

                <div className="panel-pad col" style={{ gap: 12 }}>
                  {b.resumo && <p className="hint" style={{ marginTop: -2 }}>{b.resumo}</p>}

                  {b.script && (
                    <a className="btn btn-sm" href="/bloquear-sites.sh" download style={{ alignSelf: 'flex-start' }}>
                      <Download size={15} /> Baixar bloquear-sites.sh
                    </a>
                  )}

                  {b.itens.map((it) => {
                    const done = !!maquina.feitos[it.id]
                    return (
                      <div className={`setup-item${done ? ' done' : ''}`} key={it.id}>
                        <div className="step-main">
                          <button
                            className={`check${done ? ' on' : ''}`}
                            onClick={() => alternar(it.id)}
                            aria-label={done ? 'Desmarcar' : 'Marcar como feito'}
                          >
                            <Check size={13} />
                          </button>
                          <span className="step-title" style={{ whiteSpace: 'normal' }}>
                            {preencher(it.texto, vars)}
                          </span>
                        </div>

                        {it.code && <CodeBlock code={preencher(it.code, vars)} />}
                        {it.nota && <p className="step-note">{preencher(it.nota, vars)}</p>}

                        {it.campo === 'anydeskId' && (
                          <input
                            className="input mono"
                            style={{ marginLeft: 32, width: 'auto', minWidth: 220 }}
                            value={maquina.anydeskId}
                            onChange={(e) => setMaquina({ anydeskId: e.target.value })}
                            placeholder="ID do AnyDesk — 9 dígitos"
                            inputMode="numeric"
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              </section>
            )
          })}

          <div className="panel spark-top">
            <div className="panel-head">
              <h3>
                <Check size={17} /> Entrega
              </h3>
            </div>
            <div className="panel-pad form-row">
              <div className="field">
                <label htmlFor="validado-por">Máquina validada por</label>
                <input
                  id="validado-por"
                  className="input"
                  value={maquina.validadoPor}
                  onChange={(e) => setMaquina({ validadoPor: e.target.value })}
                  placeholder="Nome de quem validou"
                />
              </div>
              <div className="field">
                <label htmlFor="data-validacao">Data</label>
                <input
                  id="data-validacao"
                  type="date"
                  className="input"
                  value={maquina.data}
                  onChange={(e) => setMaquina({ data: e.target.value })}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
