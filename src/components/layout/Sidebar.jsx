import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import {
  LayoutDashboard, ShoppingCart, UtensilsCrossed, Package,
  Users, Star, Clock, Calendar, BarChart3, Landmark,
  Settings, ChevronLeft, ChevronRight, Zap, Menu,
  CreditCard, Bell, LogOut, User, Shield
} from 'lucide-react'
import clsx from 'clsx'

const NAV_ITEMS = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/pos', icon: ShoppingCart, label: 'Point of Sale' },
  { path: '/restaurant', icon: UtensilsCrossed, label: 'Restaurant', industries: ['restaurant'] },
  { path: '/appointments', icon: Calendar, label: 'Appointments', industries: ['services'] },
  { path: '/inventory', icon: Package, label: 'Inventory', industries: ['retail', 'restaurant'] },
  { path: '/customers', icon: Users, label: 'Customers' },
  { path: '/loyalty', icon: Star, label: 'Loyalty & Rewards' },
  { path: '/employees', icon: Clock, label: 'Employees' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/banking', icon: Landmark, label: 'Banking', badge: 'US Bank' },
  { path: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed, business, businessType, unreadCount, activeEmployee } = useApp()
  const location = useLocation()

  const visibleItems = NAV_ITEMS.filter(item =>
    !item.industries || item.industries.includes(businessType)
  )

  return (
    <aside className={clsx(
      'sidebar flex flex-col h-full transition-all duration-300 z-30',
      sidebarCollapsed ? 'w-16' : 'w-60'
    )}>
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-teal flex items-center justify-center">
          <Zap size={18} className="text-white" strokeWidth={2.5} />
        </div>
        {!sidebarCollapsed && (
          <div className="min-w-0">
            <div className="text-white font-700 text-sm leading-tight truncate">Cloud POS</div>
            <div className="text-white/40 text-xs truncate">by Elavon & US Bank</div>
          </div>
        )}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="ml-auto p-1 rounded-lg hover:bg-white/10 transition-colors text-white/50 hover:text-white/90 flex-shrink-0"
        >
          {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Business Selector */}
      {!sidebarCollapsed && (
        <div className="mx-3 mt-4 mb-2 px-3 py-2.5 rounded-lg bg-white/5 border border-white/10">
          <div className="text-white/40 text-xs font-500 uppercase tracking-wide mb-1">Location</div>
          <div className="text-white/90 text-sm font-600 truncate">{business.name}</div>
          <div className="text-white/40 text-xs truncate capitalize">{businessType} · Minneapolis, MN</div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
        {visibleItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx('sidebar-item', isActive && 'active', sidebarCollapsed && 'justify-center px-0')
            }
            title={sidebarCollapsed ? item.label : undefined}
          >
            <item.icon size={18} strokeWidth={1.75} className="flex-shrink-0" />
            {!sidebarCollapsed && (
              <>
                <span className="truncate">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto text-xs px-1.5 py-0.5 rounded-full bg-elavon-teal/20 text-elavon-teal-light font-500">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-white/10 p-3 space-y-2">
        {/* Elavon Status */}
        {!sidebarCollapsed && (
          <div className="px-3 py-2 rounded-lg bg-white/5">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse-soft" />
              <span className="text-white/60 text-xs font-500">Elavon Connected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CreditCard size={11} className="text-white/40" />
              <span className="text-white/40 text-xs">Terminal: T001 · Ready</span>
            </div>
          </div>
        )}

        {/* Employee */}
        <div className={clsx(
          'flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-white/10 cursor-pointer transition-colors',
          sidebarCollapsed && 'justify-center'
        )}>
          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-elavon-teal/30 flex items-center justify-center">
            <User size={13} className="text-elavon-teal-light" />
          </div>
          {!sidebarCollapsed && (
            <div className="min-w-0 flex-1">
              <div className="text-white/85 text-xs font-600 truncate">{activeEmployee.name}</div>
              <div className="text-white/40 text-xs truncate">{activeEmployee.role}</div>
            </div>
          )}
          {!sidebarCollapsed && (
            <LogOut size={13} className="text-white/30 hover:text-white/60 cursor-pointer flex-shrink-0" />
          )}
        </div>
      </div>
    </aside>
  )
}
