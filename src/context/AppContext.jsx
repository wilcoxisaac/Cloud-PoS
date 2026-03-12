import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { saveAppState, loadAppState } from '../lib/offlineStorage'

const AppContext = createContext(null)

const INITIAL_BUSINESS = {
  name: 'The Corner Bistro',
  type: 'restaurant',
  address: '123 Main St, Minneapolis, MN 55401',
  phone: '(612) 555-0100',
  tax_rate: 0.08875,
  currency: 'USD',
  timezone: 'America/Chicago',
  logo: null,
  elavon: {
    merchant_id: 'ELV-DEMO-12345',
    ssl_merchant_id: '003',
    ssl_user_id: 'apiuser',
    connected: true,
    terminal_id: 'T001',
    mode: 'test',
  },
  usbank: {
    account_number: '****4821',
    routing_number: '091000022',
    account_name: 'Corner Bistro LLC Business Checking',
    connected: true,
    balance: 24847.32,
    pending: 1342.50,
  }
}

const INITIAL_NOTIFICATIONS = [
  { id: 1, type: 'warning', message: 'Low stock alert: House Wine (3 bottles remaining)', time: '5m ago', read: false },
  { id: 2, type: 'info', message: 'Table 7 has been waiting 45 minutes', time: '12m ago', read: false },
  { id: 3, type: 'success', message: 'Settlement complete: $4,821.50 deposited to US Bank', time: '2h ago', read: false },
]

export function AppProvider({ children }) {
  const [business, setBusinessState] = useState(INITIAL_BUSINESS)
  const [businessType, setBusinessTypeState] = useState('restaurant')
  const [notifications, setNotificationsState] = useState(INITIAL_NOTIFICATIONS)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [theme, setTheme] = useState('light')
  const [activeEmployee, setActiveEmployee] = useState({
    id: 'emp001',
    name: 'Alex Rivera',
    role: 'Manager',
    pin: '1234',
    avatar: null,
  })
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    async function loadSavedData() {
      try {
        const [savedBusiness, savedType, savedNotifications, savedEmployee] = await Promise.all([
          loadAppState('business'),
          loadAppState('businessType'),
          loadAppState('notifications'),
          loadAppState('activeEmployee'),
        ])
        if (savedBusiness) setBusinessState(savedBusiness)
        if (savedType) setBusinessTypeState(savedType)
        if (savedNotifications) setNotificationsState(savedNotifications)
        if (savedEmployee) setActiveEmployee(savedEmployee)
      } catch (e) {
        console.log('Failed to load offline data:', e)
      }
      setDataLoaded(true)
    }
    loadSavedData()
  }, [])

  const setBusiness = useCallback((value) => {
    setBusinessState((prev) => {
      const next = typeof value === 'function' ? value(prev) : value
      saveAppState('business', next).catch(() => {})
      return next
    })
  }, [])

  const setBusinessType = useCallback((value) => {
    setBusinessTypeState(value)
    saveAppState('businessType', value).catch(() => {})
  }, [])

  const setNotifications = useCallback((updater) => {
    setNotificationsState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      saveAppState('notifications', next).catch(() => {})
      return next
    })
  }, [])

  const markNotificationRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }, [setNotifications])

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [setNotifications])

  const addNotification = useCallback((notification) => {
    setNotifications(prev => [
      { id: Date.now(), ...notification, time: 'just now', read: false },
      ...prev
    ])
  }, [setNotifications])

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <AppContext.Provider value={{
      business,
      setBusiness,
      businessType,
      setBusinessType,
      notifications,
      unreadCount,
      markNotificationRead,
      markAllRead,
      addNotification,
      sidebarCollapsed,
      setSidebarCollapsed,
      theme,
      setTheme,
      activeEmployee,
      setActiveEmployee: (emp) => {
        setActiveEmployee(emp)
        saveAppState('activeEmployee', emp).catch(() => {})
      },
      dataLoaded,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
