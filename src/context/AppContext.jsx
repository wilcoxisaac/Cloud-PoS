import React, { createContext, useContext, useState, useCallback } from 'react'

const AppContext = createContext(null)

// Sample business data
const INITIAL_BUSINESS = {
  name: 'The Corner Bistro',
  type: 'restaurant', // 'restaurant' | 'retail' | 'services'
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
  const [business, setBusiness] = useState(INITIAL_BUSINESS)
  const [businessType, setBusinessType] = useState('restaurant')
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [theme, setTheme] = useState('light')
  const [activeEmployee, setActiveEmployee] = useState({
    id: 'emp001',
    name: 'Alex Rivera',
    role: 'Manager',
    pin: '1234',
    avatar: null,
  })

  const markNotificationRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }, [])

  const markAllRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }, [])

  const addNotification = useCallback((notification) => {
    setNotifications(prev => [
      { id: Date.now(), ...notification, time: 'just now', read: false },
      ...prev
    ])
  }, [])

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
      setActiveEmployee,
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
