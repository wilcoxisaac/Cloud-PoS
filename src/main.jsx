import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/index.css'
import { registerServiceWorker, setupInstallPrompt } from './pwa'
import { startBackgroundSync } from './lib/syncManager'

registerServiceWorker()
setupInstallPrompt()
startBackgroundSync()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
