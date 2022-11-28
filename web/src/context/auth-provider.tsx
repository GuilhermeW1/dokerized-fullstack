import * as React from 'react'
import axios from 'axios'
import api from '../api'
import { useNavigate } from 'react-router-dom'

type UserType = {
  id: string
  username: string
  password: string
  accountId: string
}

type RegisterReturnType = {
  status: string
  message: string
}

type LoginReturnType = {
  status: string
  message: string
}

type TypeData = {
  token: string
  user: UserType
}

type AuthContextType = {
  user: UserType | undefined
  handleLogin: (username: string, password: string) => Promise<LoginReturnType>
  register: (username: string, password: string) => Promise<RegisterReturnType>
  logoff: () => void
}

type AuthContextProviderProps = {
  children: React.ReactNode
}

const AuthContext = React.createContext({} as AuthContextType)

function AuthContextProvider(props: AuthContextProviderProps) {
  const [user, setUser] = React.useState<UserType>({} as UserType)
  const navigate = useNavigate()
  React.useEffect(() => {
    const data = localStorage.getItem('token-ng')

    if (!data) {
      return
    }

    const parsedData = JSON.parse(data ?? '')
    console.log(parsedData.user)
    if (parsedData) {
      api.defaults.headers.Authorization = `Bearer ${parsedData.token}`
      setUser(parsedData.user)
    }
  }, [])

  async function register(username: string, password: string) {
    const { data } = await api.post('/register', {
      username: username,
      password: password
    })

    if (data.status == 'Error') {
      return { status: data.status, message: data.message }
    }

    return { status: 'Success', message: 'Success' }
  }

  async function handleLogin(username: string, password: string) {
    const { data } = await api.post('/authenticate', {
      username,
      password
    })

    //return if there are errors
    if (data.status == 'Error') {
      return { status: data.status, message: data.message }
    }

    localStorage.setItem('token-ng', JSON.stringify(data))

    api.defaults.headers.Authorization = `Bearer ${data.token}`
    setUser(data.user)
    return { status: 'Success', message: 'Success' }
  }

  function logoff() {
    localStorage.removeItem('token-ng')
    api.defaults.headers.Authorization = null
    setUser({} as UserType)
    navigate('/')
  }

  return (
    <AuthContext.Provider value={{ user, register, handleLogin, logoff }}>
      {props.children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error('Use auth have to be used within auth context provider')
  }
  return context
}

export { AuthContextProvider, useAuth }
