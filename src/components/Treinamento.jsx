import { useEffect, useMemo, useState } from 'react'
import { Bar } from './ui.jsx'
import { Check, Target, Alert, Right, Layers, Checklist, Trend } from './icons.jsx'
import {
  PERFIL,
  REGRAS,
  FASES,
  POS_TRILHA,
  INDICADORES,
  ANEXOS,
  TOTAL_METAS,
  TOTAL_BLOCOS,
} from '../lib/treinamento.js'

const CHAVE = 'rwork.treinamento'

function ler() {
  try {
    const raw = localStorage.getItem(CHAVE)
    const d = raw ? JSON.parse(raw) : null
    return { metas: d?.metas || {}, liberados: d?.liberados || {}, aluno: d?.aluno || '' }
  } catch {
    return { metas: {}, liberados: {}, aluno: '' }
  }
}

function gravar(estado) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(estado))
  } catch {
    /* modo privado: só não persiste */
  }
}

const ESTADO_ANEXO = {
  pronto: { rotulo: 'pronto', cor: '#5dff9b' },
  pendente: { rotulo: 'pendente', cor: '#ffb547' },
  opcional: { rotulo: 'opcional', cor: '#8ea3cc' },
}

export default function Treinamento({ onGo }) {
  const [estado, setEstado] = useState(ler)
  const { metas, liberados, aluno } = estado

  useEffect(() => {
    gravar(estado)
  }, [estado])

  const alternarMeta = (id) =>
    setEstado((e) => ({ ...e, metas: { ...e.metas, [id]: !e.metas[id] } }))

  const alternarBloco = (id) =>
    setEstado((e) => ({ ...e, liberados: { ...e.liberados, [id]: !e.liberados[id] } }))

  const feitas = useMemo(() => Object.values(metas).filter(Boolean).length, [metas])
  const pct = TOTAL_METAS ? Math.round((feitas / TOTAL_METAS) * 100) : 0
  const blocosLiberados = Object.values(liberados).filter(Boolean).length

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">
            Protocolo Treinamento <em>TI THEP</em>
          </h1>
          <p className="page-sub">
            Trilha de {TOTAL_BLOCOS} blocos progressivos em quatro fases, para estagiário iniciante. Sem prazo fixo:
            cada bloco leva o tempo que precisar, e só se avança ao cumprir o critério de conclusão.
          </p>
        </div>
      </div>

      {/* ── progresso geral ── */}
      <div className="panel spark-top">
        <div className="panel-pad col" style={{ gap: 13 }}>
          <div className="row between wrap" style={{ gap: 12 }}>
            <div className="field" style={{ maxWidth: 280, flex: 1 }}>
              <label htmlFor="aluno">Estagiário</label>
              <input
                id="aluno"
                className="input"
                value={aluno}
                onChange={(e) => setEstado((s) => ({ ...s, aluno: e.target.value }))}
                placeholder="Nome de quem está na trilha"
              />
            </div>
            <div className="col" style={{ gap: 4, alignItems: 'flex-end' }}>
              <span className="mono" style={{ fontSize: 20, fontWeight: 800, color: 'var(--elec-1)' }}>
                {pct}%
              </span>
              <span className="hint">
                {feitas}/{TOTAL_METAS} metas · {blocosLiberados}/{TOTAL_BLOCOS} blocos liberados
              </span>
            </div>
          </div>
          <Bar value={pct} />
        </div>
      </div>

      {/* ── perfil ── */}
      <div className="panel spark-top">
        <div className="panel-head">
          <h3>
            <Layers size={17} /> Escopo da trilha
          </h3>
        </div>
        <div className="panel-pad col" style={{ gap: 11 }}>
          {PERFIL.map((p) => (
            <div className="perfil-linha" key={p.rotulo}>
              <span className="perfil-rotulo">{p.rotulo}</span>
              <span className="perfil-valor">{p.valor}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── regras ── */}
      <div className="panel spark-top">
        <div className="panel-head">
          <h3>
            <Alert size={17} /> Regras gerais
          </h3>
        </div>
        <div className="panel-pad col" style={{ gap: 14 }}>
          {REGRAS.map((r, i) => (
            <div className="regra" key={r.titulo}>
              <span className="regra-num mono">{i + 1}</span>
              <div>
                <div className="regra-titulo">{r.titulo}</div>
                <p className="hint" style={{ marginTop: 3 }}>
                  {r.texto}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── fases e blocos ── */}
      {FASES.map((fase) => (
        <section key={fase.id} className="col" style={{ gap: 16 }}>
          <div className="fase-head" style={{ '--accent': fase.cor }}>
            <span className="fase-barra" />
            <h2 className="section-title" style={{ color: fase.cor }}>
              {fase.nome}
            </h2>
          </div>

          {fase.blocos.map((b) => {
            const bFeitas = b.metas.filter((m) => metas[m.id]).length
            const completo = bFeitas === b.metas.length
            const liberado = !!liberados[b.id]

            return (
              <article className="panel spark-top" key={b.id} style={{ '--accent': fase.cor }}>
                <div className="panel-head">
                  <h3>
                    <span className="setup-num" style={{ background: `${fase.cor}22`, color: fase.cor }}>
                      {b.numero}
                    </span>
                    {b.titulo}
                  </h3>
                  <div className="row" style={{ gap: 10 }}>
                    <span
                      className="mono"
                      style={{ fontSize: 12.5, color: completo ? 'var(--elec-4)' : 'var(--text-3)' }}
                    >
                      {bFeitas}/{b.metas.length}
                    </span>
                    <button
                      className={`chip${liberado ? '' : ' chip-off'}`}
                      style={
                        liberado
                          ? { color: 'var(--elec-4)', borderColor: 'rgba(93,255,155,0.32)', background: 'rgba(93,255,155,0.1)', cursor: 'pointer' }
                          : { color: 'var(--text-3)', borderColor: 'var(--stroke)', cursor: 'pointer' }
                      }
                      onClick={() => alternarBloco(b.id)}
                      title="Checkpoint com o supervisor"
                    >
                      {liberado ? <Check size={12} /> : <span className="dot" />}
                      {liberado ? 'liberado' : 'checkpoint'}
                    </button>
                  </div>
                </div>

                <div className="panel-pad col" style={{ gap: 16 }}>
                  <p className="bloco-objetivo">{b.objetivo}</p>

                  <div className="col" style={{ gap: 8 }}>
                    <div className="bloco-rotulo">Atividades</div>
                    <ul className="lista-pontos">
                      {b.atividades.map((a) => (
                        <li key={a}>{a}</li>
                      ))}
                    </ul>
                  </div>

                  {b.prova && (
                    <div className="col" style={{ gap: 8 }}>
                      <div className="bloco-rotulo">Avaliação prática final</div>
                      <ol className="lista-numerada">
                        {b.prova.map((p) => (
                          <li key={p}>{p}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  <div className="col" style={{ gap: 8 }}>
                    <div className="bloco-rotulo">
                      <Checklist size={13} /> Metas do bloco
                    </div>
                    <ul className="steps">
                      {b.metas.map((m) => {
                        const done = !!metas[m.id]
                        return (
                          <li className={`step${done ? ' done' : ''}`} key={m.id}>
                            <div className="step-main">
                              <button
                                className={`check${done ? ' on' : ''}`}
                                onClick={() => alternarMeta(m.id)}
                                aria-label={done ? 'Desmarcar meta' : 'Marcar meta como cumprida'}
                              >
                                <Check size={13} />
                              </button>
                              <span className="step-title" style={{ whiteSpace: 'normal' }}>
                                {m.texto}
                              </span>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  </div>

                  <div className="criterio">
                    <div className="bloco-rotulo" style={{ marginBottom: 5 }}>
                      <Target size={13} /> Critério de conclusão
                    </div>
                    <p>{b.criterio}</p>
                  </div>

                  {b.aviso && <p className="bloco-aviso">{b.aviso}</p>}

                  {b.anexo && (
                    <button className="btn btn-sm" style={{ alignSelf: 'flex-start' }} onClick={() => onGo?.(b.anexo)}>
                      Abrir o Anexo A — Setup de PCs <Right size={14} />
                    </button>
                  )}
                </div>
              </article>
            )
          })}
        </section>
      ))}

      {/* ── indicadores ── */}
      <div className="panel spark-top">
        <div className="panel-head">
          <h3>
            <Trend size={17} /> Indicadores para acompanhar
          </h3>
        </div>
        <div className="panel-pad">
          <div className="tabela-scroll">
            <table className="tabela">
              <thead>
                <tr>
                  <th>Indicador</th>
                  <th>Como medir</th>
                  <th>Tendência</th>
                </tr>
              </thead>
              <tbody>
                {INDICADORES.map((i) => (
                  <tr key={i.nome}>
                    <td style={{ fontWeight: 600 }}>{i.nome}</td>
                    <td className="muted">{i.medida}</td>
                    <td className="mono" style={{ color: 'var(--elec-1)' }}>
                      {i.alvo}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── pós-trilha ── */}
      <div className="panel spark-top">
        <div className="panel-head">
          <h3>
            <Right size={17} /> Depois da trilha
          </h3>
        </div>
        <div className="panel-pad">
          <ul className="lista-pontos">
            {POS_TRILHA.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── anexos ── */}
      <div className="panel spark-top">
        <div className="panel-head">
          <h3>
            <Layers size={17} /> Anexos
          </h3>
        </div>
        <div className="panel-pad col" style={{ gap: 13 }}>
          {ANEXOS.map((a) => {
            const e = ESTADO_ANEXO[a.estado]
            return (
              <div className="anexo" key={a.id}>
                <div className="row between wrap" style={{ gap: 10 }}>
                  <span style={{ fontSize: 14.5, fontWeight: 600 }}>{a.nome}</span>
                  <span
                    className="chip"
                    style={{ color: e.cor, borderColor: `${e.cor}44`, background: `${e.cor}12` }}
                  >
                    <span className="dot" />
                    {e.rotulo}
                  </span>
                </div>
                <p className="hint" style={{ marginTop: 6 }}>
                  {a.texto}
                </p>
                {a.pagina && (
                  <button className="btn btn-sm" style={{ marginTop: 10 }} onClick={() => onGo?.(a.pagina)}>
                    Abrir <Right size={14} />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
