import React, { useState } from 'react'
import {
  Users, Search, Plus, Star, DollarSign, ShoppingBag,
  Mail, Phone, MapPin, Edit2, Trash2, Eye, Filter,
  TrendingUp, Award, ChevronRight, Calendar
} from 'lucide-react'

const CUSTOMERS = [
  { id: 1, name: 'Emily Chen', email: 'emily.chen@email.com', phone: '(612) 555-0101', visits: 42, totalSpent: 1284.50, lastVisit: '2026-03-09', tier: 'gold', loyaltyPoints: 1284, joinDate: '2024-06-12', avgOrder: 30.58 },
  { id: 2, name: 'Marcus Williams', email: 'marcus.w@email.com', phone: '(651) 555-0182', visits: 28, totalSpent: 892.00, lastVisit: '2026-03-08', tier: 'silver', loyaltyPoints: 892, joinDate: '2024-09-03', avgOrder: 31.86 },
  { id: 3, name: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '(612) 555-0234', visits: 67, totalSpent: 2341.75, lastVisit: '2026-03-07', tier: 'platinum', loyaltyPoints: 2341, joinDate: '2023-11-15', avgOrder: 34.95 },
  { id: 4, name: 'David Park', email: 'david.park@email.com', phone: '(763) 555-0318', visits: 12, totalSpent: 348.00, lastVisit: '2026-02-28', tier: 'bronze', loyaltyPoints: 348, joinDate: '2025-08-20', avgOrder: 29.00 },
  { id: 5, name: 'Rachel Torres', email: 'r.torres@email.com', phone: '(612) 555-0445', visits: 55, totalSpent: 1876.25, lastVisit: '2026-03-09', tier: 'gold', loyaltyPoints: 1876, joinDate: '2024-01-08', avgOrder: 34.11 },
  { id: 6, name: 'James Mitchell', email: 'j.mitchell@email.com', phone: '(952) 555-0521', visits: 8, totalSpent: 214.50, lastVisit: '2026-02-20', tier: 'bronze', loyaltyPoints: 214, joinDate: '2025-10-14', avgOrder: 26.81 },
  { id: 7, name: 'Aisha Thompson', email: 'aisha.t@email.com', phone: '(612) 555-0677', visits: 91, totalSpent: 3124.00, lastVisit: '2026-03-10', tier: 'platinum', loyaltyPoints: 3124, joinDate: '2023-05-22', avgOrder: 34.33 },
  { id: 8, name: 'Carlos Rivera', email: 'c.rivera@email.com', phone: '(651) 555-0789', visits: 19, totalSpent: 567.75, lastVisit: '2026-03-05', tier: 'silver', loyaltyPoints: 567, joinDate: '2025-03-11', avgOrder: 29.88 },
]

const TIER_CONFIG = {
  platinum: { label: 'Platinum', bg: 'bg-neutral-800', text: 'text-white', color: '#1C2E40' },
  gold: { label: 'Gold', bg: 'bg-warning-light', text: 'text-warning', color: '#C06800' },
  silver: { label: 'Silver', bg: 'bg-neutral-100', text: 'text-neutral-600', color: '#5A7A96' },
  bronze: { label: 'Bronze', bg: 'bg-orange-50', text: 'text-orange-600', color: '#C06800' },
}

function CustomerRow({ customer, onSelect }) {
  const tier = TIER_CONFIG[customer.tier]
  return (
    <tr className="hover:bg-neutral-50/50 transition-colors cursor-pointer" onClick={() => onSelect(customer)}>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-elavon-navy/10 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-700 text-elavon-navy">{customer.name.split(' ').map(n => n[0]).join('')}</span>
          </div>
          <div>
            <div className="font-600 text-sm text-elavon-navy">{customer.name}</div>
            <div className="text-xs text-neutral-400">{customer.email}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="text-sm text-neutral-600">{customer.phone}</span>
      </td>
      <td className="px-4 py-3 text-center">
        <span className="font-600 text-sm text-neutral-700">{customer.visits}</span>
      </td>
      <td className="px-4 py-3 text-right">
        <span className="font-700 text-sm text-elavon-navy">${customer.totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
      </td>
      <td className="px-4 py-3 text-right">
        <span className="font-600 text-sm text-neutral-600">${customer.avgOrder.toFixed(2)}</span>
      </td>
      <td className="px-4 py-3">
        <span className={`badge ${tier.bg} ${tier.text}`}>{tier.label}</span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 text-elavon-teal">
          <Star size={11} fill="currentColor" />
          <span className="text-xs font-600">{customer.loyaltyPoints.toLocaleString()}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="text-xs text-neutral-400">{customer.lastVisit}</span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-center gap-2">
          <button className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-elavon-navy transition-colors" onClick={e => { e.stopPropagation(); onSelect(customer) }}>
            <Eye size={14} />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-elavon-teal transition-colors" onClick={e => e.stopPropagation()}>
            <Edit2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  )
}

function CustomerDetailPanel({ customer, onClose }) {
  if (!customer) return null
  const tier = TIER_CONFIG[customer.tier]
  return (
    <div className="w-80 card p-5 space-y-5 flex-shrink-0">
      <div className="flex items-center justify-between">
        <h3 className="font-700 text-elavon-navy">Customer Profile</h3>
        <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 text-lg leading-none">&times;</button>
      </div>
      <div className="text-center pb-4 border-b border-neutral-100">
        <div className="w-16 h-16 rounded-full bg-elavon-navy/10 flex items-center justify-center mx-auto mb-3">
          <span className="text-xl font-700 text-elavon-navy">{customer.name.split(' ').map(n => n[0]).join('')}</span>
        </div>
        <div className="font-700 text-elavon-navy">{customer.name}</div>
        <span className={`badge ${tier.bg} ${tier.text} mt-2`}>{tier.label} Member</span>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Mail size={14} className="text-neutral-400" />
          <span className="text-neutral-600">{customer.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Phone size={14} className="text-neutral-400" />
          <span className="text-neutral-600">{customer.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar size={14} className="text-neutral-400" />
          <span className="text-neutral-600">Member since {customer.joinDate}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Total Visits', value: customer.visits, icon: ShoppingBag, color: '#002D5C' },
          { label: 'Total Spent', value: `$${customer.totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: DollarSign, color: '#00A3AD' },
          { label: 'Avg Order', value: `$${customer.avgOrder.toFixed(2)}`, icon: TrendingUp, color: '#0073B1' },
          { label: 'Points', value: customer.loyaltyPoints.toLocaleString(), icon: Star, color: '#C06800' },
        ].map(stat => (
          <div key={stat.label} className="bg-neutral-50 rounded-xl p-3">
            <stat.icon size={14} style={{ color: stat.color }} className="mb-1" />
            <div className="font-700 text-sm text-elavon-navy">{stat.value}</div>
            <div className="text-xs text-neutral-400">{stat.label}</div>
          </div>
        ))}
      </div>
      <button className="btn btn-teal w-full flex items-center justify-center gap-2">
        View Full History
        <ChevronRight size={14} />
      </button>
    </div>
  )
}

export default function CustomersPage() {
  const [search, setSearch] = useState('')
  const [tierFilter, setTierFilter] = useState('All')
  const [selected, setSelected] = useState(null)

  const filtered = CUSTOMERS.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
    const matchTier = tierFilter === 'All' || c.tier === tierFilter.toLowerCase()
    return matchSearch && matchTier
  })

  const totalCustomers = CUSTOMERS.length
  const totalRevenue = CUSTOMERS.reduce((s, c) => s + c.totalSpent, 0)
  const avgOrderVal = CUSTOMERS.reduce((s, c) => s + c.avgOrder, 0) / CUSTOMERS.length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-700 text-elavon-navy">Customers</h1>
          <p className="text-sm text-neutral-500 mt-0.5">{totalCustomers} registered customers</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-secondary flex items-center gap-2">
            <Filter size={15} />
            Export
          </button>
          <button className="btn btn-teal flex items-center gap-2">
            <Plus size={15} />
            Add Customer
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Customers', value: totalCustomers, icon: Users, color: '#002D5C', raw: true },
          { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: DollarSign, color: '#00A3AD', raw: true },
          { label: 'Avg Order Value', value: `$${avgOrderVal.toFixed(2)}`, icon: TrendingUp, color: '#0073B1', raw: true },
          { label: 'Loyalty Members', value: CUSTOMERS.filter(c => c.tier !== 'bronze').length, icon: Award, color: '#C06800', raw: true },
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
        {/* Table */}
        <div className="flex-1 space-y-4">
          {/* Filters */}
          <div className="card p-4 flex items-center gap-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search customers…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input pl-9 w-full"
              />
            </div>
            {['All', 'Platinum', 'Gold', 'Silver', 'Bronze'].map(t => (
              <button
                key={t}
                onClick={() => setTierFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-sm font-500 transition-colors ${
                  tierFilter === t ? 'bg-elavon-navy text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-100">
                    {['Customer', 'Phone', 'Visits', 'Total Spent', 'Avg Order', 'Tier', 'Points', 'Last Visit', ''].map(h => (
                      <th key={h} className={`px-4 py-3 text-xs font-600 text-neutral-400 uppercase tracking-wide ${h === 'Visits' || h === '' ? 'text-center' : h === 'Total Spent' || h === 'Avg Order' ? 'text-right' : 'text-left'}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  {filtered.map(c => (
                    <CustomerRow key={c.id} customer={c} onSelect={setSelected} />
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-neutral-100 text-sm text-neutral-500">
              Showing {filtered.length} of {CUSTOMERS.length} customers
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        {selected && <CustomerDetailPanel customer={selected} onClose={() => setSelected(null)} />}
      </div>
    </div>
  )
}
