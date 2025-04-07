import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ApiContext, ApiProvider } from './api'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApiContext.Provider value={ApiProvider({})}>
      <App />
    </ApiContext.Provider>
  </React.StrictMode>,
)
