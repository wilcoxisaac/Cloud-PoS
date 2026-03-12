import React, { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { useOnlineStatus } from '../../hooks/useOnlineStatus'
import {
  Bell, Search, HelpCircle, ChevronDown, Check,
  Zap, Info, AlertTriangle, X, Menu, WifiOff, Wifi
} from 'lucide-react'
import clsx from 'clsx'

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/pos': 'Point of Sale',
  '/restaurant': 'Restaurant',
  '/inventory': 'Inventory',
  '/customers': 'Customers',
  '/loyalty': 'Loyalty & Rewards',
  '/employees': 'Employees',
  '/appointments': 'Appointments',
  '/analytics': 'Analytics',
  '/banking': 'Banking',
  '/settings': 'Settings',
}

function NotificationIcon({ type }) {
  if (type === 'success') return <Zap size={14} className="text-success" />
  if (type === 'warning') return <AlertTriangle size={14} className="text-warning" />
  return <Info size={14} className="text-info" />
}

export default function Header({ onToggleMobileMenu }) {
  const location = useLocation()
  const { notifications, unreadCount, markNotificationRead, markAllRead, business, businessType, setBusinessType } = useApp()
  const isOnline = useOnlineStatus()
  const [showNotifs, setShowNotifs] = useState(false)
  const [showBizSwitch, setShowBizSwitch] = useState(false)
  const notifsRef = useRef()
  const bizRef = useRef()

  const title = PAGE_TITLES[location.pathname] || 'Cloud POS'

  useEffect(() => {
    function handleClick(e) {
      if (notifsRef.current && !notifsRef.current.contains(e.target)) setShowNotifs(false)
      if (bizRef.current && !bizRef.current.contains(e.target)) setShowBizSwitch(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <header className="app-header">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <button
          onClick={onToggleMobileMenu}
          className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500 md:hidden flex-shrink-0"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-base sm:text-lg font-700 truncate" style={{ color: 'var(--elavon-navy)' }}>{title}</h1>
        <div className="relative hidden sm:block" ref={bizRef}>
          <button
            onClick={() => setShowBizSwitch(!showBizSwitch)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-500 hover:border-elavon-teal transition-colors"
            style={{ color: 'var(--elavon-navy)' }}
          >
            <span className="capitalize">{businessType === 'restaurant' ? '🍽️' : businessType === 'retail' ? '🛍️' : '✂️'} {businessType}</span>
            <ChevronDown size={12} />
          </button>
          {showBizSwitch && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-neutral-200 rounded-xl shadow-dropdown z-50 py-1 min-w-40 animate-fade-in">
              {['restaurant', 'retail', 'services'].map(type => (
                <button
                  key={type}
                  onClick={() => { setBusinessType(type); setShowBizSwitch(false) }}
                  className={clsx(
                    'w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-neutral-50 capitalize',
                    businessType === type && 'text-elavon-teal font-600'
                  )}
                >
                  <span>{type === 'restaurant' ? '🍽️' : type === 'retail' ? '🛍️' : '✂️'}</span>
                  {type}
                  {businessType === type && <Check size={13} className="ml-auto text-elavon-teal" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        <button className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500 hover:text-elavon-navy transition-colors hidden sm:block">
          <Search size={18} />
        </button>

        <button className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500 hover:text-elavon-navy transition-colors hidden sm:block">
          <HelpCircle size={18} />
        </button>

        <div className="relative" ref={notifsRef}>
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2 rounded-lg hover:bg-neutral-100 text-neutral-500 hover:text-elavon-navy transition-colors"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-danger text-white text-xs flex items-center justify-center font-700 leading-none">
                {unreadCount}
              </span>
            )}
          </button>
          {showNotifs && (
            <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white border border-neutral-200 rounded-xl shadow-dropdown z-50 animate-fade-in overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
                <span className="font-600 text-sm" style={{ color: 'var(--elavon-navy)' }}>Notifications</span>
                <button onClick={markAllRead} className="text-xs text-elavon-teal hover:text-elavon-teal-dark font-500">
                  Mark all read
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-neutral-400 text-sm">No notifications</div>
                ) : notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={clsx(
                      'flex gap-3 px-4 py-3 hover:bg-neutral-50 cursor-pointer border-b border-neutral-50 transition-colors',
                      !n.read && 'bg-blue-50/30'
                    )}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <NotificationIcon type={n.type} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-neutral-700 leading-tight">{n.message}</p>
                      <span className="text-xs text-neutral-400 mt-0.5 block">{n.time}</span>
                    </div>
                    {!n.read && (
                      <div className="w-2 h-2 rounded-full bg-elavon-blue flex-shrink-0 mt-1.5" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {!isOnline && (
          <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-full text-xs font-500 bg-warning-light text-warning-dark">
            <WifiOff size={13} />
            <span className="hidden sm:inline">Offline Mode</span>
          </div>
        )}

        <div className={clsx(
          'hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-500',
          isOnline
            ? 'text-elavon-teal-dark'
            : 'text-neutral-400'
        )} style={isOnline ? { background: 'rgba(0,163,173,0.08)' } : { background: 'rgba(0,0,0,0.04)' }}>
          <div className={clsx(
            'w-1.5 h-1.5 rounded-full',
            isOnline ? 'bg-success animate-pulse-soft' : 'bg-neutral-300'
          )} />
          <span>{isOnline ? 'Elavon Live' : 'Elavon Offline'}</span>
        </div>
      </div>
    </header>
  )
}
