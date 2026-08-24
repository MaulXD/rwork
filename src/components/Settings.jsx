import { useRef, useState } from 'react'
import { Download, Upload, Trash, Bolt, Save, Alert, Check } from './icons.jsx'
import { Modal } from './ui.jsx'
import { STORAGE_KEY } from '../lib/constants.js'
import { download } from '../lib/utils.js'

export default function Settings({ workflows, prefs, onPrefs, onImport, onReset, onSeed, toast }) {
  const fileRef = useRef(null)
  const [confirmReset, setConfirmReset] = useState(false)

  const exportar = () => {
    const stamp = new Date().toISOString().slice(0, 10)
    download(
      `rwork-${stamp}.json`,
      JSON.stringify({ app: 'RWork', version: 2, exportedAt: new Date().toISOString(), workflows }, null, 2)
    )
    toast('Backup exportado com sucesso')
  }

  const importar = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        onImport(String(reader.result))
      } catch (err) {
        toast(`Não foi possível importar: ${err.message}`)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const bytes = (() => {
    try {
      return new Blob([localStorage.getItem(STORAGE_KEY) || '']).size
    } catch {
      return 0
    }
  })()

  const totalSteps = workflows.reduce((n, w) => n + w.steps.length, 0)

  return (
    <>
      <div className="page-head">
        <div>
          <h1 className="page-title">
            Ajustes & <em>dados</em>
          </h1>
          <p className="page-sub">
            O RWork guarda tudo no armazenamento local deste navegador — nada sai da sua máquina. Exporte um backup de
            tempos em tempos para não depender só dele.
          </p>
        </div>
      </div>

      <div className="panel spark-top">
        <div className="panel-head">
          <h3>
            <Save size={17} /> Seus dados
          </h3>
        </div>
        <div className="panel-pad col" style={{ gap: 18 }}>
          <div className="stat-grid">
            <div className="stat" style={{ '--accent': '#22e6ff' }}>
              <div className="stat-label">Fluxos</div>
              <div className="stat-value">{workflows.length}</div>
            </div>
            <div className="stat" style={{ '--accent': '#7c5cff' }}>
              <div className="stat-label">Etapas</div>
              <div className="stat-value">{totalSteps}</div>
            </div>
            <div className="stat" style={{ '--accent': '#5dff9b' }}>
              <div className="stat-label">Espaço usado</div>
              <div className="stat-value">
                {(bytes / 1024).toFixed(1)}
                <small>KB</small>
              </div>
            </div>
          </div>

          <div className="row wrap" style={{ gap: 10 }}>
            <button className="btn" onClick={exportar} disabled={workflows.length === 0}>
              <Download size={16} /> Exportar backup (.json)
            </button>
            <button className="btn" onClick={() => fileRef.current?.click()}>
              <Upload size={16} /> Importar backup
            </button>
            <input ref={fileRef} type="file" accept="application/json,.json" onChange={importar} style={{ display: 'none' }} />
            <button className="btn" onClick={onSeed}>
              <Check size={16} /> Recarregar fluxos iniciais
            </button>
            <button className="btn btn-danger" onClick={() => setConfirmReset(true)}>
              <Trash size={16} /> Apagar tudo
            </button>
          </div>

          <p className="hint">
            A importação <strong>substitui</strong> os fluxos atuais pelos do arquivo. Exporte antes se quiser manter o
            que já existe.
          </p>
        </div>
      </div>

      <div className="panel spark-top">
        <div className="panel-head">
          <h3>
            <Bolt size={17} /> Fundo elétrico
          </h3>
        </div>
        <div className="panel-pad col" style={{ gap: 18 }}>
          <div className="row between wrap" style={{ gap: 14 }}>
            <div className="col" style={{ gap: 4 }}>
              <strong style={{ fontSize: 14.5 }}>Animação de fundo</strong>
              <span className="hint">Desligue se preferir uma tela totalmente estática ou economizar bateria.</span>
            </div>
            <div className="seg">
              <button className={prefs.bg ? 'on' : ''} onClick={() => onPrefs({ bg: true })}>
                Ligado
              </button>
              <button className={!prefs.bg ? 'on' : ''} onClick={() => onPrefs({ bg: false })}>
                Desligado
              </button>
            </div>
          </div>

          <div className="col" style={{ gap: 8, opacity: prefs.bg ? 1 : 0.45 }}>
            <div className="row between">
              <label htmlFor="intensity" style={{ fontSize: 14.5, fontWeight: 600 }}>
                Intensidade
              </label>
              <span className="mono muted" style={{ fontSize: 12.5 }}>
                {Math.round(prefs.intensity * 100)}%
              </span>
            </div>
            <input
              id="intensity"
              type="range"
              min="0.15"
              max="1"
              step="0.05"
              value={prefs.intensity}
              disabled={!prefs.bg}
              onChange={(e) => onPrefs({ intensity: Number(e.target.value) })}
              style={{ width: '100%', accentColor: '#22e6ff' }}
            />
            <span className="hint">
              Controla quantos nós da malha aparecem e com que frequência os raios cruzam a tela. O sistema já respeita
              a preferência de “reduzir movimento” do seu aparelho.
            </span>
          </div>
        </div>
      </div>

      <div className="panel spark-top">
        <div className="panel-head">
          <h3>
            <Alert size={17} /> Bom saber
          </h3>
        </div>
        <div className="panel-pad col" style={{ gap: 10 }}>
          <p className="hint">
            • Os dados ficam presos a <strong>este navegador e este computador</strong>. Em outro aparelho, importe o
            backup.
          </p>
          <p className="hint">
            • Limpar o histórico do navegador com a opção “dados de sites” apaga os fluxos. O arquivo exportado é a sua
            garantia.
          </p>
          <p className="hint">
            • Atalhos: <span className="tag">N</span> cria um fluxo, <span className="tag">/</span> foca a busca e{' '}
            <span className="tag">Esc</span> fecha a janela aberta.
          </p>
        </div>
      </div>

      {confirmReset && (
        <Modal
          title="Apagar todos os fluxos?"
          size="sm"
          onClose={() => setConfirmReset(false)}
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setConfirmReset(false)}>
                Cancelar
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  onReset()
                  setConfirmReset(false)
                }}
              >
                <Trash size={16} /> Apagar tudo
              </button>
            </>
          }
        >
          <p style={{ color: 'var(--text-2)', lineHeight: 1.6 }}>
            Isso remove os <strong>{workflows.length} fluxos</strong> e todas as etapas deste navegador. A ação não pode
            ser desfeita — exporte um backup antes se tiver dúvida.
          </p>
        </Modal>
      )}
    </>
  )
}
