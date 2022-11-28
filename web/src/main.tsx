import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthContextProvider } from './context/auth-provider'
import { ErrorBoundary } from 'react-error-boundary'
import { BrowserRouter } from 'react-router-dom'

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div role="alert" style={{ color: 'red' }}>
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <BrowserRouter>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
)
