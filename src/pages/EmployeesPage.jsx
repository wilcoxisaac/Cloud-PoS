import React, { useState } from 'react'
import {
  Users, Plus, Clock, DollarSign, Star, Shield,
  Edit2, Trash2, Eye, Search, CheckCircle, XCircle,
  Coffee, TrendingUp, Calendar, User, Key
} from 'lucide-react'

const EMPLOYEES = [
  { id: 'emp001', name: 'Alex Rivera', role: 'Manager', email: 'alex.r@bistro.com', phone: '(612) 555-0201', pin: '****', status: 'active', hoursThisWeek: 38, hourlyRate: 22.00, totalSales: 18420.50, avgTransaction: 45.80, clockedIn: true, clockInTime: '8:02 AM', permissions: ['pos', 'refunds', 'reports', 'employees', 'settings'] },
  { id: 'emp002', name: 'Jordan Lee', role: 'Server', email: 'jordan.l@bistro.com', phone: '(651) 555-0342', pin: '****', status: 'active', hoursThisWeek: 32, hourlyRate: 14.00, totalSales: 12840.00, avgTransaction: 38.20, clockedIn: true, clockInTime: '10:15 AM', permissions: ['pos', 'refunds'] },
  { id: 'emp003', name: 'Morgan Scott', role: 'Bartender', email: 'morgan.s@bistro.com', phone: '(612) 555-0456', pin: '****', status: 'active', hoursThisWeek: 28, hourlyRate: 16.50, totalSales: 9240.75, avgTransaction: 32.50, clockedIn: false, clockInTime: null, permissions: ['pos', 'refunds'] },
  { id: 'emp004', name: 'Taylor Kim', role: 'Host', email: 'taylor.k@bistro.com', phone: '(763) 555-0512', pin: '****', status: 'active', hoursThisWeek: 24, hourlyRate: 13.50, totalSales: 3120.00, avgTransaction: 28.90, clockedIn: true, clockInTime: '11:00 AM', permissions: ['pos'] },
  { id: 'emp005', name: 'Jamie Chen', role: 'Kitchen', email: 'jamie.c@bistro.com', phone: '(952) 555-0634', pin: '****', status: 'active', hoursThisWeek: 40, hourlyRate: 18.00, totalSales: 0, avgTransaction: 0, clockedIn: true, clockInTime: '7:45 AM', permissions: [] },
  { id: 'emp006', name: 'Sam Patel', role: 'Server', email: 'sam.p@bistro.com', phone: '(612) 555-0718', pin: '****', status: 'inactive', hoursThisWeek: 0, hourlyRate: 14.00, totalSales: 7820.25, avgTransaction: 36.40, clockedIn: false, clockInTime: null, permissions: ['pos'] },
]

const ROLE_COLORS = {
  Manager: { bg: 'bg-elavon-navy/10', text: 'text-elavon-navy' },
  Server: { bg: 'bg-elavon-teal/10', text: 'text-elavon-teal-dark' },
  Bartender: { bg: 'bg-info-light', text: 'text-info' },
  Host: { bg: 'bg-warning-light', text: 'text-warning' },
  Kitchen: { bg: 'bg-success-light', text: 'text-success' },
}

const ALL_PERMISSIONS = [
  { key: 'pos', label: 'Point of Sale', icon: DollarSign },
  { key: 'refunds', label: 'Process Refunds', icon: TrendingUp },
  { key: 'reports', label: 'View Reports', icon: Star },
  { key: 'employees', label: 'Manage Staff', icon: Users },
  { key: 'settings', label: 'Settings', icon: Key },
]

const CLOCK_EVENTS = [
  { emp: 'Alex Rivera', event: 'Clock In', time: '8:02 AM', hours: '4h 58m ago' },
  { emp: 'Jordan Lee', event: 'Clock In', time: '10:15 AM', hours: '2h 45m ago' },
  { emp: 'Taylor Kim', event: 'Clock In', time: '11:00 AM', hours: '2h 00m ago' },
  { emp: 'Jamie Chen', event: 'Clock In', time: '7:45 AM', hours: '5h 15m ago' },
  { emp: 'Morgan Scott', event: 'Clock Out', time: '6:30 PM', hours: 'Yesterday' },
]

export default function EmployeesPage() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [selectedEmp, setSelectedEmp] = useState(null)
  const [activeTab, setActiveTab] = useState('roster')

  const filtered = EMPLOYEES.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.role.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'All' || e.role === roleFilter
    return matchSearch && matchRole
  })

  const activeCount = EMPLOYEES.filter(e => e.status === 'active').length
  const clockedInCount = EMPLOYEES.filter(e => e.clockedIn).length
  const totalWeeklyHours = EMPLOYEES.reduce((s, e) => s + e.hoursThisWeek, 0)
  const totalWeeklyPayroll = EMPLOYEES.reduce((s, e) => s + e.hoursThisWeek * e.hourlyRate, 0)

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-700 text-elavon-navy">Employees</h1>
          <p className="text-sm text-neutral-500 mt-0.5">{activeCount} active staff · {clockedInCount} clocked in</p>
        </div>
        <button className="btn btn-teal flex items-center gap-2 w-fit">
          <Plus size={15} />
          Add Employee
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Active Staff', value: activeCount, icon: Users, color: '#0A1638' },
          { label: 'Clocked In Now', value: clockedInCount, icon: Clock, color: '#00A3AD' },
          { label: 'Hours This Week', value: totalWeeklyHours, icon: Calendar, color: '#1E3A6E' },
          { label: 'Weekly Payroll Est.', value: `$${totalWeeklyPayroll.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: DollarSign, color: '#C06800' },
        ].map(m => (
          <div key={m.label} className="metric-card">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${m.color}15` }}>
              <m.icon size={20} style={{ color: m.color }} />
            </div>
            <div className="mt-4">
              <div className="text-2xl font-700 text-money" style={{ color: 'var(--elavon-navy)' }}>{m.value}</div>
              <div className="text-xs font-500 text-neutral-400 uppercase tracking-wide mt-1">{m.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-6">
        <div className="flex-1 min-w-0 space-y-4">
          <div className="flex border-b border-neutral-200 gap-1">
            {[
              { key: 'roster', label: 'Roster' },
              { key: 'timeclock', label: 'Time Clock' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2.5 text-sm font-600 border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-elavon-teal text-elavon-teal'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'roster' && (
            <>
              <div className="card p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search employees…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="input pl-9 w-full"
                  />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto">
                  {['All', 'Manager', 'Server', 'Bartender', 'Host', 'Kitchen'].map(r => (
                    <button
                      key={r}
                      onClick={() => setRoleFilter(r)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-500 transition-colors whitespace-nowrap flex-shrink-0 ${
                        roleFilter === r ? 'bg-elavon-navy text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-neutral-100">
                        {['Employee', 'Role', 'Status', 'Hours/Wk', 'Rate', 'Total Sales', 'Permissions', ''].map(h => (
                          <th key={h} className={`px-4 py-3 text-xs font-600 text-neutral-400 uppercase tracking-wide ${h === 'Hours/Wk' || h === 'Rate' || h === 'Total Sales' ? 'text-right' : h === '' ? 'text-center' : 'text-left'}`}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-50">
                      {filtered.map(emp => {
                        const roleColor = ROLE_COLORS[emp.role] || ROLE_COLORS.Server
                        return (
                          <tr key={emp.id} className="hover:bg-neutral-50/50 transition-colors cursor-pointer" onClick={() => setSelectedEmp(emp)}>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="relative flex-shrink-0">
                                  <div className="w-9 h-9 rounded-full bg-elavon-navy/10 flex items-center justify-center">
                                    <span className="text-sm font-700 text-elavon-navy">{emp.name.split(' ').map(n => n[0]).join('')}</span>
                                  </div>
                                  {emp.clockedIn && (
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-success border-2 border-white" />
                                  )}
                                </div>
                                <div>
                                  <div className="font-600 text-sm text-elavon-navy">{emp.name}</div>
                                  <div className="text-xs text-neutral-400">{emp.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`badge ${roleColor.bg} ${roleColor.text}`}>{emp.role}</span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1.5">
                                {emp.status === 'active'
                                  ? <CheckCircle size={14} className="text-success" />
                                  : <XCircle size={14} className="text-neutral-400" />}
                                <span className={`text-xs font-500 ${emp.status === 'active' ? 'text-success' : 'text-neutral-400'}`}>
                                  {emp.status === 'active' ? (emp.clockedIn ? `In · ${emp.clockInTime}` : 'Off') : 'Inactive'}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className="font-600 text-sm text-neutral-700">{emp.hoursThisWeek}h</span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className="font-600 text-sm text-neutral-700">${emp.hourlyRate.toFixed(2)}</span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className="font-600 text-sm text-elavon-navy">${emp.totalSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1">
                                {ALL_PERMISSIONS.map(p => (
                                  <div
                                    key={p.key}
                                    title={p.label}
                                    className={`w-5 h-5 rounded flex items-center justify-center ${emp.permissions.includes(p.key) ? 'bg-elavon-teal/15 text-elavon-teal-dark' : 'bg-neutral-100 text-neutral-300'}`}
                                  >
                                    <p.icon size={10} />
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-center gap-2" onClick={e => e.stopPropagation()}>
                                <button className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-elavon-teal transition-colors">
                                  <Edit2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === 'timeclock' && (
            <div className="card overflow-hidden">
              <div className="px-5 py-4 border-b border-neutral-100">
                <h3 className="font-700 text-elavon-navy">Today's Clock Events</h3>
              </div>
              <div className="divide-y divide-neutral-50">
                {CLOCK_EVENTS.map((ev, i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${ev.event === 'Clock In' ? 'bg-success-light' : 'bg-danger-light'}`}>
                      {ev.event === 'Clock In'
                        ? <Coffee size={14} className="text-success" />
                        : <Clock size={14} className="text-danger" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-600 text-sm text-elavon-navy">{ev.emp}</div>
                      <div className="text-xs text-neutral-400">{ev.event} at {ev.time}</div>
                    </div>
                    <span className="text-xs text-neutral-400">{ev.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
