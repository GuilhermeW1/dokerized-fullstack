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

type AuthContextType = {
  user: UserType | undefined
  handleLogin: (username: string, password: string) => Promise<LoginReturnType>
  register: (username: string, password: string) => Promise<RegisterReturnType>
  logoff: () => void
  language: string
}

type AuthContextProviderProps = {
  children: React.ReactNode
}

const AuthContext = React.createContext({} as AuthContextType)

function AuthContextProvider(props: AuthContextProviderProps) {
  const [user, setUser] = React.useState<UserType>({} as UserType)
  const [language, setLanguage] = React.useState('')
  const navigate = useNavigate()
  React.useEffect(() => {
    const data = localStorage.getItem('token-ng')

    //if thers no data return that means there is a new user or the user clear the cache
    if (!data) {
      return
    }

    const parsedData = JSON.parse(data ?? '')
    if (parsedData) {
      api.defaults.headers.Authorization = `Bearer ${parsedData.token}`
      setUser(parsedData.user)
    }
  }, [])

  const register = React.useCallback(
    async (username: string, password: string) => {
      const { data } = await api.post('/register', {
        username: username,
        password: password
      })

      if (data.status == 'Error') {
        return { status: data.status, message: data.message }
      }

      return { status: 'Success', message: 'Success' }
    },
    []
  )

  const handleLogin = React.useCallback(
    async (username: string, password: string) => {
      const { data } = await api.post('/authenticate', {
        username,
        password
      })

      if (data.status == 'Error') {
        return { status: data.status, message: data.message }
      }
      //set the localstorage user and toke an set the api default headers autorization
      localStorage.setItem('token-ng', JSON.stringify(data))

      api.defaults.headers.Authorization = `Bearer ${data.token}`
      setUser(data.user)
      return { status: 'Success', message: 'Success' }
    },
    []
  )

  const logoff = React.useCallback(() => {
    localStorage.removeItem('token-ng')
    api.defaults.headers.Authorization = null
    setUser({} as UserType)
    navigate('/')
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, register, handleLogin, logoff, language }}
    >
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
