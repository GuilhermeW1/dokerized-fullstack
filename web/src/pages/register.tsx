import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/auth-provider'

function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [registerUsername, setRegisterUsername] = React.useState('')
  const [registerPassword, setRegisterPassword] = React.useState('')
  const [registerError, setRegisterError] = React.useState('')

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    const data = await register(registerUsername, registerPassword)
    if (data.status == 'Error') {
      setRegisterError(data.message)
      return
    }
    alert('Success')
    navigate('/')
  }

  return (
    <div className="bg-blackCustom-700 h-screen w-screen text-white flex items-center justify-center flex-col">
      <span className="text-lg mb-3">register</span>
      <form
        className="flex flex-col gap-3 bg-blackCustom-400 p-3 rounded"
        onSubmit={handleRegister}
      >
        <label>username</label>
        <input
          className=" bg-blackCustom-600 border-none p-2"
          type="text"
          onChange={e => setRegisterUsername(e.target.value)}
          value={registerUsername}
        />
        <label>password</label>
        <input
          className=" bg-blackCustom-600 border-none p-2"
          type="password"
          onChange={e => setRegisterPassword(e.target.value)}
          value={registerPassword}
        />
        {registerError ? (
          <span role="alert" className="text-red-900 mt-2">
            Error: {registerError}
          </span>
        ) : null}
        <button className="border bg-blackCustom-400 p-2" type="submit">
          Register Account
        </button>
      </form>
      <a className="cursor-pointer mt-2 text-sm " onClick={() => navigate('/')}>
        Do you have an account? Login here
      </a>
    </div>
  )
}

export default Register
