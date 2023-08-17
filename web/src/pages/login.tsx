import * as React from 'react'
import { useAuth } from '../context/auth-provider'
import { useNavigate } from 'react-router-dom'

import { useTranslation } from 'react-i18next'
//import { t } from 'i18next'

export default function Login() {
  const { user, handleLogin } = useAuth()
  const navigate = useNavigate()

  const { t } = useTranslation()

  const [loginUsername, setLoginUsername] = React.useState('')
  const [loginPassword, setLoginPassword] = React.useState('')
  const [loginError, setLoginError] = React.useState('')

  async function login(e: React.FormEvent) {
    e.preventDefault()
    const data = await handleLogin(loginUsername, loginPassword)
    if (data.status == 'Error') {
      setLoginError(data.message)
      return
    }
    navigate('/home')
  }

  return (
    <div className="bg-blackCustom-700 h-screen w-screen text-white flex items-center justify-center flex-col">
      <span className="text-lg mb-3">Login</span>
      <form
        onSubmit={login}
        className="flex flex-col gap-3 bg-blackCustom-400 p-3 rounded"
      >
        <label>Usuario</label>
        <input
          className=" bg-blackCustom-600 border-none p-2"
          type="text"
          onChange={e => setLoginUsername(e.target.value)}
          value={loginUsername}
        />
        <label>Senha</label>
        <input
          className=" bg-blackCustom-600 border-none p-2"
          type="password"
          onChange={e => setLoginPassword(e.target.value)}
          value={loginPassword}
        />
        {loginError ? (
          <span role="alert" className="text-red-900 mt-2">
            Error: {loginError}
          </span>
        ) : null}
        <button className="border bg-blackCustom-400 p-2" type="submit">
          entrar
        </button>
      </form>
      <a
        className="cursor-pointer mt-2 text-sm "
        onClick={() => navigate('/register')}
      >
        Não tem uma conta? Registre-se aqui
      </a>
    </div>
  )
}
