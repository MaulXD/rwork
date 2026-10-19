import { useState } from 'react'
import { BoltFill } from './icons.jsx'

// Tela de senha simples, só para uso pessoal: a senha fica no código e a
// liberação é lembrada neste navegador.
const SENHA = 'R123R'
const CHAVE = 'rwork-acesso'

const jaLiberado = () => {
  try {
    return localStorage.getItem(CHAVE) === '1'
  } catch {
    return false
  }
}

export default function Gate({ children }) {
  const [liberado, setLiberado] = useState(jaLiberado)
  const [valor, setValor] = useState('')
  const [erro, setErro] = useState(false)

  if (liberado) return children

  const entrar = (e) => {
    e.preventDefault()
    if (valor === SENHA) {
      try {
        localStorage.setItem(CHAVE, '1')
      } catch {
        /* sem armazenamento: libera só nesta sessão */
      }
      setLiberado(true)
    } else {
      setErro(true)
      setValor('')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 20 }}>
      <form
        className="panel panel-pad"
        onSubmit={entrar}
        style={{ width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', gap: 16 }}
      >
        <h3 style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 18, fontWeight: 700 }}>
          <BoltFill width={20} height={20} style={{ color: 'var(--elec-1)' }} />
          RWork
        </h3>
        <div className="field">
          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            className="input"
            type="password"
            autoFocus
            value={valor}
            onChange={(e) => {
              setValor(e.target.value)
              setErro(false)
            }}
          />
          {erro && <span style={{ color: 'var(--danger)', fontSize: 13 }}>Senha incorreta</span>}
        </div>
        <button className="btn btn-primary" type="submit">
          Entrar
        </button>
      </form>
    </div>
  )
}
