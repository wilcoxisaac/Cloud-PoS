import React, { useState } from 'react'
import {
  Users, Search, Plus, Star, DollarSign, ShoppingBag,
  Mail, Phone, MapPin, Edit2, Trash2, Eye, Filter,
  TrendingUp, Award, ChevronRight, Calendar, X, Save, Check, Download
} from 'lucide-react'

const INITIAL_CUSTOMERS = [
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

function exportToCSV(data, filename) {
  const headers = Object.keys(data[0]).join(',')
  const rows = data.map(row => Object.values(row).map(v => (typeof v === 'string' && v.includes(',') ? `"${v}"` : v)).join(',')).join('\n')
  const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url; link.download = filename
  document.body.appendChild(link); link.click()
  document.body.removeChild(link); URL.revokeObjectURL(url)
}

function CustomerModal({ customer, onSave, onClose }) {
  const [form, setForm] = useState(customer || {
    name: '', email: '', phone: '', tier: 'bronze', notes: ''
  })

  function handleSubmit(e) {
    e.preventDefault()
    onSave({
      ...form,
      id: customer?.id || Date.now(),
      visits: customer?.visits || 0,
      totalSpent: customer?.totalSpent || 0,
      lastVisit: customer?.lastVisit || new Date().toISOString().split('T')[0],
      loyaltyPoints: customer?.loyaltyPoints || 0,
      joinDate: customer?.joinDate || new Date().toISOString().split('T')[0],
      avgOrder: customer?.avgOrder || 0,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-modal overflow-hidden animate-fade-in">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <h2 className="font-700 text-elavon-navy">{customer ? 'Edit Customer' : 'Add Customer'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-neutral-100"><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-600 text-neutral-500 uppercase tracking-wide">Full Name *</label>
              <input required className="input w-full" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="First Last" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-600 text-neutral-500 uppercase tracking-wide">Email</label>
              <input type="email" className="input w-full" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@example.com" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-600 text-neutral-500 uppercase tracking-wide">Phone</label>
              <input className="input w-full" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="(612) 555-0000" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-600 text-neutral-500 uppercase tracking-wide">Loyalty Tier</label>
              <select className="input w-full" value={form.tier} onChange={e => setForm(f => ({ ...f, tier: e.target.value }))}>
                {Object.entries(TIER_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn btn-teal flex-1 flex items-center justify-center gap-2">
              <Save size={15} /> {customer ? 'Save Changes' : 'Add Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function HistoryModal({ customer, onClose }) {
  const MOCK_HISTORY = [
    { date: '2026-03-09', items: 'House Burger, Craft Beer x2', total: 42.50, points: 42 },
    { date: '2026-03-01', items: 'Caesar Salad, Sparkling Water', total: 18.50, points: 18 },
    { date: '2026-02-22', items: 'Margherita Pizza, House Wine', total: 38.00, points: 38 },
    { date: '2026-02-14', items: 'Fish & Chips, Tiramisu, Craft Beer', total: 54.00, points: 54 },
    { date: '2026-02-07', items: 'Group Special x3', total: 90.00, points: 90 },
  ]
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg rounded-2xl shadow-modal overflow-hidden animate-fade-in">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <h2 className="font-700 text-elavon-navy">Purchase History – {customer.name}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-neutral-100"><X size={16} /></button>
        </div>
        <div className="divide-y divide-neutral-50 max-h-96 overflow-y-auto">
          {MOCK_HISTORY.map((h, i) => (
            <div key={i} className="px-5 py-3.5 flex items-center justify-between">
              <div>
                <div className="text-sm font-600 text-elavon-navy">{h.date}</div>
                <div className="text-xs text-neutral-400 mt-0.5">{h.items}</div>
              </div>
              <div className="text-right">
                <div className="font-700 text-sm text-elavon-navy">${h.total.toFixed(2)}</div>
                <div className="text-xs text-elavon-teal">+{h.points} pts</div>
              </div>
            </div>
          ))}
        </div>
        <div className="px-5 py-4 border-t border-neutral-100">
          <button onClick={onClose} className="btn btn-secondary w-full">Close</button>
        </div>
      </div>
    </div>
  )
}

function CustomerRow({ customer, onSelect, onEdit }) {
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
      <td className="px-4 py-3"><span className="text-sm text-neutral-600">{customer.phone}</span></td>
      <td className="px-4 py-3 text-center"><span className="font-600 text-sm text-neutral-700">{customer.visits}</span></td>
      <td className="px-4 py-3 text-right"><span className="font-700 text-sm text-elavon-navy">${customer.totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></td>
      <td className="px-4 py-3 text-right"><span className="font-600 text-sm text-neutral-600">${customer.avgOrder.toFixed(2)}</span></td>
      <td className="px-4 py-3"><span className={`badge ${tier.bg} ${tier.text}`}>{tier.label}</span></td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 text-elavon-teal">
          <Star size={11} fill="currentColor" />
          <span className="text-xs font-600">{customer.loyaltyPoints.toLocaleString()}</span>
        </div>
      </td>
      <td className="px-4 py-3"><span className="text-xs text-neutral-400">{customer.lastVisit}</span></td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-center gap-2">
          <button className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-elavon-navy transition-colors" onClick={e => { e.stopPropagation(); onSelect(customer) }}>
            <Eye size={14} />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-elavon-teal transition-colors" onClick={e => { e.stopPropagation(); onEdit(customer) }}>
            <Edit2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  )
}

function CustomerDetailPanel({ customer, onClose, onEdit, onViewHistory }) {
  if (!customer) return null
  const tier = TIER_CONFIG[customer.tier]
  return (
    <div className="fixed inset-0 z-50 sm:relative sm:inset-auto sm:z-auto">
      <div className="fixed inset-0 bg-black/30 sm:hidden" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-80 max-w-full bg-white card p-5 space-y-5 flex-shrink-0 overflow-y-auto sm:relative sm:right-auto sm:top-auto sm:bottom-auto">
        <div className="flex items-center justify-between">
          <h3 className="font-700 text-elavon-navy">Customer Profile</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-neutral-100"><X size={16} /></button>
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
            { label: 'Total Visits', value: customer.visits, icon: ShoppingBag, color: '#0A1638' },
            { label: 'Total Spent', value: `$${customer.totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: DollarSign, color: '#00A3AD' },
            { label: 'Avg Order', value: `$${customer.avgOrder.toFixed(2)}`, icon: TrendingUp, color: '#1E3A6E' },
            { label: 'Points', value: customer.loyaltyPoints.toLocaleString(), icon: Star, color: '#C06800' },
          ].map(stat => (
            <div key={stat.label} className="bg-neutral-50 rounded-xl p-3">
              <stat.icon size={14} style={{ color: stat.color }} className="mb-1" />
              <div className="font-700 text-sm text-elavon-navy">{stat.value}</div>
              <div className="text-xs text-neutral-400">{stat.label}</div>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <button onClick={() => onEdit(customer)} className="btn btn-secondary w-full flex items-center justify-center gap-2">
            <Edit2 size={14} /> Edit Customer
          </button>
          <button onClick={() => onViewHistory(customer)} className="btn btn-teal w-full flex items-center justify-center gap-2">
            View Full History
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS)
  const [search, setSearch] = useState('')
  const [tierFilter, setTierFilter] = useState('All')
  const [selected, setSelected] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [historyCustomer, setHistoryCustomer] = useState(null)
  const [exportDone, setExportDone] = useState(false)

  const filtered = customers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
    const matchTier = tierFilter === 'All' || c.tier === tierFilter.toLowerCase()
    return matchSearch && matchTier
  })

  const totalCustomers = customers.length
  const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0)
  const avgOrderVal = customers.reduce((s, c) => s + c.avgOrder, 0) / customers.length

  function handleSave(c) {
    setCustomers(prev => {
      const exists = prev.find(x => x.id === c.id)
      if (exists) return prev.map(x => x.id === c.id ? c : x)
      return [...prev, c]
    })
    setShowModal(false)
    setEditingCustomer(null)
    if (selected?.id === c.id) setSelected(c)
  }

  function handleEdit(c) {
    setEditingCustomer(c)
    setShowModal(true)
  }

  function handleAdd() {
    setEditingCustomer(null)
    setShowModal(true)
  }

  function handleExport() {
    exportToCSV(filtered.map(c => ({
      Name: c.name, Email: c.email, Phone: c.phone,
      Visits: c.visits, 'Total Spent': c.totalSpent, 'Avg Order': c.avgOrder,
      Tier: c.tier, Points: c.loyaltyPoints, 'Last Visit': c.lastVisit, 'Join Date': c.joinDate,
    })), 'customers-export.csv')
    setExportDone(true)
    setTimeout(() => setExportDone(false), 2000)
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-700 text-elavon-navy">Customers</h1>
          <p className="text-sm text-neutral-500 mt-0.5">{totalCustomers} registered customers</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleExport} className={`btn btn-secondary flex items-center gap-2 transition-all ${exportDone ? 'text-success border-success' : ''}`}>
            {exportDone ? <Check size={15} className="text-success" /> : <Download size={15} />}
            {exportDone ? 'Exported!' : 'Export'}
          </button>
          <button onClick={handleAdd} className="btn btn-teal flex items-center gap-2">
            <Plus size={15} />
            Add Customer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Customers', value: totalCustomers, icon: Users, color: '#0A1638' },
          { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: DollarSign, color: '#00A3AD' },
          { label: 'Avg Order Value', value: `$${avgOrderVal.toFixed(2)}`, icon: TrendingUp, color: '#1E3A6E' },
          { label: 'Loyalty Members', value: customers.filter(c => c.tier !== 'bronze').length, icon: Award, color: '#C06800' },
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
          <div className="card p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input type="text" placeholder="Search customers…" value={search} onChange={e => setSearch(e.target.value)} className="input pl-9 w-full" />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto">
              {['All', 'Platinum', 'Gold', 'Silver', 'Bronze'].map(t => (
                <button key={t} onClick={() => setTierFilter(t)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-500 transition-colors whitespace-nowrap flex-shrink-0 ${
                    tierFilter === t ? 'bg-elavon-navy text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}>
                  {t}
                </button>
              ))}
            </div>
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
                    <CustomerRow key={c.id} customer={c} onSelect={setSelected} onEdit={handleEdit} />
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-neutral-100 text-sm text-neutral-500">
              Showing {filtered.length} of {customers.length} customers
            </div>
          </div>
        </div>

        {selected && (
          <CustomerDetailPanel
            customer={selected}
            onClose={() => setSelected(null)}
            onEdit={c => { handleEdit(c); setSelected(null) }}
            onViewHistory={setHistoryCustomer}
          />
        )}
      </div>

      {showModal && (
        <CustomerModal
          customer={editingCustomer}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingCustomer(null) }}
        />
      )}

      {historyCustomer && (
        <HistoryModal customer={historyCustomer} onClose={() => setHistoryCustomer(null)} />
      )}
    </div>
  )
}
