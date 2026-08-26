import { useCallback, useEffect, useMemo, useState } from 'react'
import { Bar, Empty } from './ui.jsx'
import { Copy, Check, Download, Alert, Plus, Trash, Checklist, Layers, Right, Save, Gear, Search } from './icons.jsx'
import {
  BLOCOS,
  TOTAL_ITENS,
  SETUP_VERSAO,
  SENHA_PADRAO,
  SENHA_ROOT_FABRICA,
  MODELOS,
  preencher,
} from '../lib/setupPcs.js'
import {
  SHEET_URL,
  APPS_SCRIPT,
  PASSO_A_PASSO,
  lerInventario,
  enviarLinha,
  linhaTSV,
  lerWebAppUrl,
  gravarWebAppUrl,
} from '../lib/sheets.js'

const CHAVE = 'rwork.setup-pcs'

const maquinaVazia = () => ({ feitos: {}, anydeskId: '', modelo: 'Multi', validadoPor: '', data: '', enviado: false })

function ler() {
  try {
    const raw = localStorage.getItem(CHAVE)
    const d = raw ? JSON.parse(raw) : null
    return {
      senha: d?.senha ?? SENHA_PADRAO,
      root: d?.root ?? SENHA_ROOT_FABRICA,
      atual: d?.atual || '',
      maquinas: d?.maquinas || {},
    }
  } catch {
    return { senha: SENHA_PADRAO, root: SENHA_ROOT_FABRICA, atual: '', maquinas: {} }
  }
}

function gravar(estado) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(estado))
  } catch {
    /* modo privado: só não persiste */
  }
}

async function copiar(texto) {
  try {
    await navigator.clipboard.writeText(texto)
    return true
  } catch {
    const ta = document.createElement('textarea')
    ta.value = texto
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    let ok = false
    try {
      ok = document.execCommand('copy')
    } catch {
      ok = false
    }
    document.body.removeChild(ta)
    return ok
  }
}

function BotaoCopiar({ texto, rotulo = 'copiar', className = 'code-copy' }) {
  const [feito, setFeito] = useState(false)
  return (
    <button
      className={className}
      onClick={async () => {
        if (await copiar(texto)) {
          setFeito(true)
          setTimeout(() => setFeito(false), 1600)
        }
      }}
      aria-label={`Copiar ${rotulo}`}
    >
      {feito ? <Check size={14} /> : <Copy size={14} />}
      {feito ? 'copiado' : rotulo}
    </button>
  )
}

function CodeBlock({ code }) {
  return (
    <div className="code">
      <pre>
        <code>{code}</code>
      </pre>
      <BotaoCopiar texto={code} />
    </div>
  )
}

export default function SetupPcs() {
  const [estado, setEstado] = useState(ler)
  const [inventario, setInventario] = useState({ carregando: true, ok: false, linhas: [], erro: '' })
  const [webApp, setWebApp] = useState(lerWebAppUrl)
  const [config, setConfig] = useState(false)
  const [envio, setEnvio] = useState({ estado: 'ocioso', msg: '' })
  const [busca, setBusca] = useState('')

  const { senha, root, atual, maquinas } = estado

  useEffect(() => {
    gravar(estado)
  }, [estado])

  const carregar = useCallback(async () => {
    setInventario((i) => ({ ...i, carregando: true }))
    const r = await lerInventario()
    setInventario({ carregando: false, ...r })
  }, [])

  useEffect(() => {
    carregar()
  }, [carregar])

  const set = (patch) => setEstado((e) => ({ ...e, ...patch }))

  const maquina = maquinas[atual] || maquinaVazia()
  const vars = { pc: atual, senha, root }

  const setMaquina = (patch) =>
    setEstado((e) => ({ ...e, maquinas: { ...e.maquinas, [e.atual]: { ...maquina, ...patch } } }))

  const alternar = (id) => setMaquina({ feitos: { ...maquina.feitos, [id]: !maquina.feitos[id] } })

  const feitos = useMemo(() => Object.values(maquina.feitos).filter(Boolean).length, [maquina.feitos])
  const pct = TOTAL_ITENS ? Math.round((feitos / TOTAL_ITENS) * 100) : 0

  // O PC já está na planilha? Evita duplicar linha e cria alerta de conflito.
  const naPlanilha = useMemo(
    () => (atual ? inventario.linhas.find((l) => l.pc.trim() === atual.trim()) : null),
    [inventario.linhas, atual]
  )

  const achados = useMemo(() => {
    const t = busca.trim().toLowerCase()
    if (!t) return []
    return inventario.linhas
      .filter(
        (l) =>
          l.pc.toLowerCase().includes(t) ||
          l.anydesk.toLowerCase().includes(t) ||
          l.modelo.toLowerCase().includes(t)
      )
      .slice(0, 25)
  }, [busca, inventario.linhas])

  const listaMaquinas = useMemo(
    () =>
      Object.entries(maquinas)
        .map(([pc, m]) => ({ pc, feitos: Object.values(m.feitos || {}).filter(Boolean).length }))
        .sort((a, b) => a.pc.localeCompare(b.pc, 'pt-BR', { numeric: true })),
    [maquinas]
  )

  const novaMaquina = () => {
    const pc = window.prompt('Número do PC no inventário (ex.: 0629)')
    if (!pc?.trim()) return
    const limpo = pc.trim().toLowerCase()
    setEstado((e) => ({
      ...e,
      atual: limpo,
      maquinas: { ...e.maquinas, [limpo]: e.maquinas[limpo] || maquinaVazia() },
    }))
    setEnvio({ estado: 'ocioso', msg: '' })
  }

  const removerMaquina = (pc) =>
    setEstado((e) => {
      const m = { ...e.maquinas }
      delete m[pc]
      return { ...e, maquinas: m, atual: e.atual === pc ? '' : e.atual }
    })

  const enviar = async () => {
    setEnvio({ estado: 'enviando', msg: '' })
    const r = await enviarLinha(webApp, { pc: atual, ...maquina })
    if (r.ok) {
      setMaquina({ enviado: true })
      setEnvio({ estado: 'ok', msg: 'Linha gravada na planilha.' })
      carregar()
    } else {
      setEnvio({ estado: 'erro', msg: r.erro })
    }
  }

  const tsv = linhaTSV({ pc: atual, ...maquina })

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">
            Setup de <em>PCs</em>
          </h1>
          <p className="page-sub">
            Checklist oficial de preparação de notebook Linux no padrão Thep — {SETUP_VERSAO}. Escolha a máquina, os
            comandos se preenchem com o número dela, e o cadastro vai para a planilha de inventário.
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

      {/* ── inventário da planilha ── */}
      <div className="panel spark-top">
        <div className="panel-head">
          <h3>
            <Layers size={17} /> Inventário
          </h3>
          <div className="row" style={{ gap: 9 }}>
            {inventario.ok && (
              <span className="mono muted" style={{ fontSize: 12.5 }}>
                {inventario.linhas.length} máquinas
              </span>
            )}
            <a className="btn btn-sm btn-ghost" href={SHEET_URL} target="_blank" rel="noopener noreferrer">
              Abrir planilha <Right size={14} />
            </a>
            <button className="btn btn-sm btn-ghost" onClick={carregar} disabled={inventario.carregando}>
              {inventario.carregando ? 'lendo…' : 'recarregar'}
            </button>
          </div>
        </div>
        <div className="panel-pad">
          {inventario.carregando && <p className="hint">Lendo a planilha…</p>}
          {!inventario.carregando && !inventario.ok && (
            <p className="hint" style={{ color: 'var(--amber)' }}>
              {inventario.erro} O cadastro continua funcionando — use “copiar linha” e cole na planilha.
            </p>
          )}
          {inventario.ok && (
            <div className="col" style={{ gap: 13 }}>
              <div className="search">
                <Search size={17} />
                <input
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar por número do PC, ID do AnyDesk ou modelo…"
                  aria-label="Buscar no inventário"
                />
              </div>

              {!busca.trim() && (
                <p className="hint">
                  {inventario.linhas.length} máquinas na planilha. Busque acima, ou abra uma máquina — a página avisa se
                  o número já existe lá.
                </p>
              )}

              {busca.trim() && achados.length === 0 && (
                <p className="hint">Nenhuma máquina com esse termo na planilha.</p>
              )}

              {achados.length > 0 && (
                <div className="tabela-scroll">
                  <table className="tabela">
                    <thead>
                      <tr>
                        <th>PC</th>
                        <th>AnyDesk</th>
                        <th>Modelo</th>
                        <th>Data</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {achados.map((l) => (
                        <tr key={l.pc}>
                          <td className="mono" style={{ fontWeight: 700 }}>{l.pc}</td>
                          <td className="mono">{l.anydesk || '—'}</td>
                          <td className="muted">{l.modelo || '—'}</td>
                          <td className="mono muted">{l.data || '—'}</td>
                          <td style={{ textAlign: 'right' }}>
                            <BotaoCopiar texto={l.anydesk} rotulo="ID" className="btn btn-sm btn-ghost" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── seletor de máquina ── */}
      {listaMaquinas.length > 0 && (
        <div className="row wrap" style={{ gap: 8 }}>
          <span className="hint" style={{ marginRight: 2 }}>
            Em andamento:
          </span>
          {listaMaquinas.map((m) => (
            <span key={m.pc} className={`maq-chip${atual === m.pc ? ' on' : ''}`}>
              <button onClick={() => { set({ atual: m.pc }); setEnvio({ estado: 'ocioso', msg: '' }) }}>
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

      {!atual && (
        <div className="panel spark-top">
          <Empty
            icon={<Layers size={30} />}
            title="O passo a passo está logo abaixo"
            text="Dá para consultar do jeito que está. Escolhendo uma máquina, o número dela entra nos comandos no lugar de xxxx e o progresso passa a ser guardado por notebook."
            action={
              <button className="btn btn-primary" onClick={novaMaquina}>
                <Plus size={17} /> Escolher máquina
              </button>
            }
          />
        </div>
      )}

      {atual && (
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
              {naPlanilha && (
                <p className="bloco-aviso" style={{ marginTop: 12 }}>
                  O PC {atual} já está na planilha — AnyDesk {naPlanilha.anydesk || '(vazio)'}, modelo{' '}
                  {naPlanilha.modelo || '(vazio)'}. Enviar de novo atualiza a linha existente em vez de duplicar.
                </p>
              )}
              {feitos > 0 && (
                <button className="btn btn-sm btn-ghost" style={{ marginTop: 11 }} onClick={() => setMaquina({ feitos: {} })}>
                  Desmarcar tudo desta máquina
                </button>
              )}
            </div>
          </div>
      )}

      {/* ── passo a passo: visível com ou sem máquina escolhida ── */}
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
                <span className="mono" style={{ fontSize: 12.5, color: completo ? 'var(--elec-4)' : 'var(--text-3)' }}>
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
                        <div className="row wrap" style={{ gap: 10, marginLeft: 32 }}>
                          <input
                            className="input mono"
                            style={{ width: 'auto', minWidth: 210 }}
                            value={maquina.anydeskId}
                            onChange={(e) => setMaquina({ anydeskId: e.target.value.replace(/\D/g, '') })}
                            placeholder="ID do AnyDesk — 9 dígitos"
                            inputMode="numeric"
                            maxLength={12}
                          />
                          <select
                            className="select"
                            style={{ width: 'auto' }}
                            value={maquina.modelo}
                            onChange={(e) => setMaquina({ modelo: e.target.value })}
                            aria-label="Modelo"
                          >
                            {MODELOS.map((m) => (
                              <option key={m} value={m}>
                                {m}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })}

      {atual && (
        <>
          {/* ── cadastro na planilha ── */}
          <div className="panel spark-top">
            <div className="panel-head">
              <h3>
                <Save size={17} /> Cadastrar na planilha
              </h3>
              <button className="btn btn-sm btn-ghost" onClick={() => setConfig((c) => !c)}>
                <Gear size={14} /> {webApp ? 'configurado' : 'configurar envio'}
              </button>
            </div>

            <div className="panel-pad col" style={{ gap: 15 }}>
              <div className="form-row">
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

              <div className="linha-planilha">
                <div className="linha-cols">
                  <span><i>PC</i>{atual}</span>
                  <span><i>anydesk</i>{maquina.anydeskId || '—'}</span>
                  <span><i>Modelo</i>{maquina.modelo}</span>
                  <span><i>Data</i>{maquina.data ? maquina.data.split('-').reverse().slice(0, 2).join('/') : '—'}</span>
                </div>
                <BotaoCopiar texto={tsv} rotulo="copiar linha" className="btn btn-sm" />
              </div>

              <div className="row wrap" style={{ gap: 10 }}>
                <button
                  className="btn btn-primary"
                  onClick={enviar}
                  disabled={!webApp || !maquina.anydeskId || envio.estado === 'enviando'}
                  title={!webApp ? 'Configure a URL do Apps Script primeiro' : 'Gravar na planilha'}
                >
                  <Save size={16} /> {envio.estado === 'enviando' ? 'enviando…' : 'Enviar para a planilha'}
                </button>
                <a className="btn" href={SHEET_URL} target="_blank" rel="noopener noreferrer">
                  Abrir planilha <Right size={14} />
                </a>
                {maquina.enviado && (
                  <span className="chip" style={{ color: 'var(--elec-4)', borderColor: 'rgba(93,255,155,0.3)', background: 'rgba(93,255,155,0.1)' }}>
                    <Check size={12} /> já enviado
                  </span>
                )}
              </div>

              {envio.msg && (
                <p className="hint" style={{ color: envio.estado === 'erro' ? 'var(--danger)' : 'var(--elec-4)' }}>
                  {envio.msg}
                </p>
              )}

              {!webApp && (
                <p className="hint">
                  O envio direto precisa de um Apps Script publicado na planilha — o Google não aceita gravação anônima.
                  Enquanto isso, <strong>copiar linha</strong> já entrega o dado pronto para colar.
                </p>
              )}

              {config && (
                <div className="col" style={{ gap: 13, paddingTop: 6, borderTop: '1px solid var(--stroke)' }}>
                  <div className="bloco-rotulo">Ligar o envio direto</div>
                  <ol className="lista-numerada">
                    {PASSO_A_PASSO.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ol>
                  <CodeBlock code={APPS_SCRIPT} />
                  <div className="field">
                    <label htmlFor="webapp-url">URL do aplicativo web (termina em /exec)</label>
                    <div className="add-step">
                      <input
                        id="webapp-url"
                        className="input mono"
                        value={webApp}
                        onChange={(e) => setWebApp(e.target.value.trim())}
                        placeholder="https://script.google.com/macros/s/…/exec"
                      />
                      <button
                        className="btn btn-sm"
                        onClick={() => {
                          gravarWebAppUrl(webApp)
                          setEnvio({ estado: 'ok', msg: 'URL salva neste navegador.' })
                        }}
                      >
                        <Check size={15} /> Salvar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── credenciais ── */}
          <div className="panel spark-top">
            <div className="panel-head">
              <h3>
                <Alert size={17} /> Credenciais da TI
              </h3>
            </div>
            <div className="panel-pad form-row">
              <div className="field">
                <label htmlFor="senha-padrao">Senha padrão da Thep</label>
                <input
                  id="senha-padrao"
                  className="input mono"
                  value={senha}
                  onChange={(e) => set({ senha: e.target.value })}
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
                  autoComplete="off"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}