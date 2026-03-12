import React, { useState, useEffect } from 'react'
import { Download, X, Smartphone } from 'lucide-react'
import { promptInstall, isStandalone, isIOS, isSafari, onInstallAvailable } from '../../pwa'
import ElavonLogo from '../ElavonLogo'

export default function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [showIOSGuide, setShowIOSGuide] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (isStandalone()) return
    if (sessionStorage.getItem('pwa-dismissed')) return

    if (isIOS() && isSafari()) {
      const timer = setTimeout(() => setShowIOSGuide(true), 3000)
      return () => clearTimeout(timer)
    }

    const unsubscribe = onInstallAvailable(() => setShowPrompt(true))
    return unsubscribe
  }, [])

  const handleInstall = async () => {
    const accepted = await promptInstall()
    if (accepted) setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    setShowIOSGuide(false)
    setDismissed(true)
    sessionStorage.setItem('pwa-dismissed', 'true')
  }

  if (dismissed || isStandalone()) return null

  if (showIOSGuide) {
    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-2xl shadow-2xl border border-neutral-200 p-4 z-[100] animate-slide-up">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-elavon-navy flex items-center justify-center">
            <ElavonLogo size={24} color="#FFFFFF" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-600 text-sm text-neutral-900">Install Cloud POS</h3>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              Tap the share button
              <svg className="w-4 h-4 inline mx-0.5 text-blue-500 align-text-bottom" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16,6 12,2 8,6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
              in Safari, then select <strong>"Add to Home Screen"</strong> to install this app.
            </p>
          </div>
          <button onClick={handleDismiss} className="flex-shrink-0 p-1 rounded-lg hover:bg-neutral-100">
            <X size={16} className="text-neutral-400" />
          </button>
        </div>
      </div>
    )
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-2xl shadow-2xl border border-neutral-200 p-4 z-[100] animate-slide-up">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-elavon-navy flex items-center justify-center">
          <ElavonLogo size={24} color="#FFFFFF" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-600 text-sm text-neutral-900">Install Cloud POS</h3>
          <p className="text-xs text-neutral-500 mt-1">
            Add Cloud POS to your home screen for quick access and an app-like experience.
          </p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleInstall}
              className="px-4 py-1.5 bg-elavon-teal text-white text-xs font-600 rounded-lg hover:bg-elavon-teal-light transition-colors"
            >
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-1.5 text-neutral-500 text-xs font-500 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              Not now
            </button>
          </div>
        </div>
        <button onClick={handleDismiss} className="flex-shrink-0 p-1 rounded-lg hover:bg-neutral-100">
          <X size={16} className="text-neutral-400" />
        </button>
      </div>
    </div>
  )
}
