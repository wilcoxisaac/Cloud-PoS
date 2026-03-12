import React, { useState } from 'react'
import {
  Package, Search, Plus, AlertTriangle, TrendingDown, TrendingUp,
  Filter, Download, RefreshCw, ChevronDown, Edit2, Trash2, Eye,
  BarChart3, Archive, Tag, CheckCircle, X, Save, Check
} from 'lucide-react'

const INITIAL_INVENTORY = [
  { id: 1, sku: 'BVG-001', name: 'House Wine (Red)', category: 'Beverages', quantity: 3, min: 10, max: 50, cost: 12.00, price: 9.00, unit: 'bottle', supplier: 'Valley Wines Co.', lastOrdered: '2026-02-15', status: 'critical' },
  { id: 2, sku: 'BVG-002', name: 'Craft Beer (IPA)', category: 'Beverages', quantity: 18, min: 24, max: 96, cost: 2.50, price: 7.00, unit: 'bottle', supplier: 'Local Brews LLC', lastOrdered: '2026-03-01', status: 'low' },
  { id: 3, sku: 'FD-001', name: 'Ground Beef (80/20)', category: 'Proteins', quantity: 15, min: 10, max: 40, cost: 5.50, price: null, unit: 'lb', supplier: 'Metro Meats', lastOrdered: '2026-03-05', status: 'ok' },
  { id: 4, sku: 'FD-002', name: 'Russet Potatoes', category: 'Produce', quantity: 42, min: 20, max: 80, cost: 0.80, price: null, unit: 'lb', supplier: 'Fresh Farms', lastOrdered: '2026-03-06', status: 'ok' },
  { id: 5, sku: 'FD-003', name: 'Caesar Dressing', category: 'Sauces', quantity: 6, min: 8, max: 24, cost: 4.20, price: null, unit: 'bottle', supplier: 'FoodService Pro', lastOrdered: '2026-02-28', status: 'low' },
  { id: 6, sku: 'BVG-003', name: 'Sparkling Water', category: 'Beverages', quantity: 48, min: 20, max: 100, cost: 0.90, price: 3.50, unit: 'bottle', supplier: 'Pure Springs', lastOrdered: '2026-03-03', status: 'ok' },
  { id: 7, sku: 'FD-004', name: 'Pizza Dough', category: 'Bakery', quantity: 24, min: 12, max: 60, cost: 1.50, price: null, unit: 'ball', supplier: 'Artisan Bakery', lastOrdered: '2026-03-07', status: 'ok' },
  { id: 8, sku: 'FD-005', name: 'Mozzarella Cheese', category: 'Dairy', quantity: 8, min: 10, max: 30, cost: 7.00, price: null, unit: 'lb', supplier: 'Dairy Direct', lastOrdered: '2026-02-27', status: 'low' },
  { id: 9, sku: 'SUP-001', name: 'Takeout Containers', category: 'Supplies', quantity: 200, min: 100, max: 500, cost: 0.15, price: null, unit: 'ea', supplier: 'PackRight', lastOrdered: '2026-02-20', status: 'ok' },
  { id: 10, sku: 'BVG-004', name: 'House Wine (White)', category: 'Beverages', quantity: 12, min: 10, max: 50, cost: 10.00, price: 9.00, unit: 'bottle', supplier: 'Valley Wines Co.', lastOrdered: '2026-02-15', status: 'ok' },
]

const CATEGORIES = ['All', 'Beverages', 'Proteins', 'Produce', 'Sauces', 'Bakery', 'Dairy', 'Supplies']
const UNITS = ['bottle', 'lb', 'ea', 'ball', 'case', 'box', 'bag', 'gallon', 'oz']

const STATUS_CONFIG = {
  critical: { label: 'Critical', bg: 'bg-danger-light', text: 'text-danger', icon: AlertTriangle },
  low: { label: 'Low', bg: 'bg-warning-light', text: 'text-warning', icon: TrendingDown },
  ok: { label: 'In Stock', bg: 'bg-success-light', text: 'text-success', icon: CheckCircle },
}

function deriveStatus(quantity, min) {
  if (quantity <= min * 0.5) return 'critical'
  if (quantity <= min) return 'low'
  return 'ok'
}

function StockBar({ quantity, min, max }) {
  const pct = Math.min((quantity / max) * 100, 100)
  const color = quantity <= min * 0.5 ? '#DE350B' : quantity <= min ? '#FF8B00' : '#00875A'
  return (
    <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
    </div>
  )
}

function exportToCSV(data, filename) {
  const headers = Object.keys(data[0]).join(',')
  const rows = data.map(row => Object.values(row).map(v => (v === null ? '' : typeof v === 'string' && v.includes(',') ? `"${v}"` : v)).join(',')).join('\n')
  const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url; link.download = filename
  document.body.appendChild(link); link.click()
  document.body.removeChild(link); URL.revokeObjectURL(url)
}

function ItemModal({ item, onSave, onClose }) {
  const [form, setForm] = useState(item || {
    sku: '', name: '', category: 'Beverages', quantity: 0, min: 10, max: 100,
    cost: 0, price: '', unit: 'bottle', supplier: '', lastOrdered: new Date().toISOString().split('T')[0],
  })

  function handleSubmit(e) {
    e.preventDefault()
    const qty = parseInt(form.quantity) || 0
    const min = parseInt(form.min) || 0
    onSave({
      ...form,
      id: item?.id || Date.now(),
      quantity: qty,
      min: parseInt(form.min) || 0,
      max: parseInt(form.max) || 100,
      cost: parseFloat(form.cost) || 0,
      price: form.price !== '' ? parseFloat(form.price) : null,
      status: deriveStatus(qty, min),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-modal overflow-hidden animate-fade-in">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <h2 className="font-700 text-elavon-navy">{item ? 'Edit Item' : 'Add Inventory Item'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-neutral-100"><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-600 text-neutral-500 uppercase tracking-wide">SKU</label>
              <input required className="input w-full font-mono" value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} placeholder="BVG-001" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-600 text-neutral-500 uppercase tracking-wide">Category</label>
              <select className="input w-full" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1 col-span-2">
              <label className="text-xs font-600 text-neutral-500 uppercase tracking-wide">Item Name *</label>
              <input required className="input w-full" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Item name" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-600 text-neutral-500 uppercase tracking-wide">Quantity</label>
              <input type="number" min="0" className="input w-full" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-600 text-neutral-500 uppercase tracking-wide">Unit</label>
              <select className="input w-full" value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}>
                {UNITS.map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-600 text-neutral-500 uppercase tracking-wide">Min Stock</label>
              <input type="number" min="0" className="input w-full" value={form.min} onChange={e => setForm(f => ({ ...f, min: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-600 text-neutral-500 uppercase tracking-wide">Max Stock</label>
              <input type="number" min="0" className="input w-full" value={form.max} onChange={e => setForm(f => ({ ...f, max: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-600 text-neutral-500 uppercase tracking-wide">Unit Cost ($)</label>
              <input type="number" step="0.01" min="0" className="input w-full" value={form.cost} onChange={e => setForm(f => ({ ...f, cost: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-600 text-neutral-500 uppercase tracking-wide">Sale Price ($, optional)</label>
              <input type="number" step="0.01" min="0" className="input w-full" value={form.price ?? ''} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="—" />
            </div>
            <div className="space-y-1 col-span-2">
              <label className="text-xs font-600 text-neutral-500 uppercase tracking-wide">Supplier</label>
              <input className="input w-full" value={form.supplier} onChange={e => setForm(f => ({ ...f, supplier: e.target.value }))} placeholder="Supplier name" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn btn-teal flex-1 flex items-center justify-center gap-2">
              <Save size={15} /> {item ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function DeleteConfirm({ item, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-modal p-6 text-center animate-fade-in">
        <div className="w-14 h-14 rounded-full bg-danger-light flex items-center justify-center mx-auto mb-4">
          <Trash2 size={22} className="text-danger" />
        </div>
        <h3 className="font-700 text-elavon-navy mb-2">Delete Item?</h3>
        <p className="text-sm text-neutral-500 mb-6">Remove <span className="font-600 text-neutral-700">{item.name}</span> from inventory? This cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn btn-secondary flex-1">Cancel</button>
          <button onClick={onConfirm} className="btn flex-1 bg-danger text-white hover:bg-danger/90">Delete</button>
        </div>
      </div>
    </div>
  )
}

function ItemDetailModal({ item, onClose, onEdit }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-modal overflow-hidden animate-fade-in">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <h2 className="font-700 text-elavon-navy">{item.name}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-neutral-100"><X size={16} /></button>
        </div>
        <div className="p-5 space-y-3">
          {[
            { label: 'SKU', value: item.sku },
            { label: 'Category', value: item.category },
            { label: 'Quantity', value: `${item.quantity} ${item.unit}` },
            { label: 'Stock Range', value: `Min: ${item.min} / Max: ${item.max}` },
            { label: 'Unit Cost', value: `$${item.cost.toFixed(2)}` },
            { label: 'Sale Price', value: item.price ? `$${item.price.toFixed(2)}` : 'N/A' },
            { label: 'Supplier', value: item.supplier },
            { label: 'Last Ordered', value: item.lastOrdered },
          ].map(f => (
            <div key={f.label} className="flex justify-between py-1.5 border-b border-neutral-50 text-sm">
              <span className="text-neutral-500">{f.label}</span>
              <span className="font-600 text-elavon-navy">{f.value}</span>
            </div>
          ))}
        </div>
        <div className="px-5 pb-5 flex gap-3">
          <button onClick={onClose} className="btn btn-secondary flex-1">Close</button>
          <button onClick={() => { onClose(); onEdit(item) }} className="btn btn-teal flex-1">Edit Item</button>
        </div>
      </div>
    </div>
  )
}

export default function InventoryPage() {
  const [items, setItems] = useState(INITIAL_INVENTORY)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [deleteItem, setDeleteItem] = useState(null)
  const [viewItem, setViewItem] = useState(null)
  const [syncing, setSyncing] = useState(false)
  const [syncDone, setSyncDone] = useState(false)
  const [exportDone, setExportDone] = useState(false)

  const filtered = items.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.sku.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'All' || item.category === category
    const matchStatus = statusFilter === 'All' || item.status === statusFilter.toLowerCase()
    return matchSearch && matchCat && matchStatus
  })

  const criticalCount = items.filter(i => i.status === 'critical').length
  const lowCount = items.filter(i => i.status === 'low').length
  const totalValue = items.reduce((sum, i) => sum + i.quantity * i.cost, 0)

  function handleSave(item) {
    setItems(prev => {
      const exists = prev.find(i => i.id === item.id)
      if (exists) return prev.map(i => i.id === item.id ? item : i)
      return [...prev, item]
    })
    setShowModal(false)
    setEditingItem(null)
  }

  function handleEdit(item) {
    setEditingItem(item)
    setShowModal(true)
  }

  function handleDelete() {
    setItems(prev => prev.filter(i => i.id !== deleteItem.id))
    setDeleteItem(null)
  }

  function handleSync() {
    setSyncing(true)
    setTimeout(() => { setSyncing(false); setSyncDone(true); setTimeout(() => setSyncDone(false), 2000) }, 1500)
  }

  function handleExport() {
    exportToCSV(filtered.map(i => ({
      SKU: i.sku, Name: i.name, Category: i.category,
      Quantity: i.quantity, Unit: i.unit, Min: i.min, Max: i.max,
      Cost: i.cost, Price: i.price ?? '', Supplier: i.supplier, Status: i.status,
    })), 'inventory-export.csv')
    setExportDone(true)
    setTimeout(() => setExportDone(false), 2000)
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-700 text-elavon-navy">Inventory</h1>
          <p className="text-sm text-neutral-500 mt-0.5">{items.length} items tracked · Last synced just now</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleExport} className={`btn btn-secondary flex items-center gap-2 transition-all ${exportDone ? 'text-success border-success' : ''}`}>
            {exportDone ? <Check size={15} className="text-success" /> : <Download size={15} />}
            <span className="hidden sm:inline">{exportDone ? 'Exported!' : 'Export'}</span>
          </button>
          <button onClick={handleSync} disabled={syncing} className={`btn btn-secondary flex items-center gap-2 transition-all ${syncDone ? 'text-success border-success' : ''}`}>
            {syncDone ? <Check size={15} className="text-success" /> : <RefreshCw size={15} className={syncing ? 'animate-spin' : ''} />}
            <span className="hidden sm:inline">{syncDone ? 'Synced!' : syncing ? 'Syncing…' : 'Sync'}</span>
          </button>
          <button onClick={() => { setEditingItem(null); setShowModal(true) }} className="btn btn-teal flex items-center gap-2">
            <Plus size={15} />
            <span className="hidden sm:inline">Add Item</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="metric-card">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#0A163815' }}>
            <Package size={20} style={{ color: '#0A1638' }} />
          </div>
          <div className="mt-4">
            <div className="text-2xl font-700 text-money" style={{ color: 'var(--elavon-navy)' }}>{items.length}</div>
            <div className="text-xs font-500 text-neutral-400 uppercase tracking-wide mt-1">Total Items</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#DE350B15' }}>
              <AlertTriangle size={20} style={{ color: '#DE350B' }} />
            </div>
            {criticalCount > 0 && <span className="badge badge-danger">{criticalCount}</span>}
          </div>
          <div className="mt-4">
            <div className="text-2xl font-700 text-money" style={{ color: '#DE350B' }}>{criticalCount}</div>
            <div className="text-xs font-500 text-neutral-400 uppercase tracking-wide mt-1">Critical Stock</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#FF8B0015' }}>
            <TrendingDown size={20} style={{ color: '#FF8B00' }} />
          </div>
          <div className="mt-4">
            <div className="text-2xl font-700 text-money" style={{ color: '#FF8B00' }}>{lowCount}</div>
            <div className="text-xs font-500 text-neutral-400 uppercase tracking-wide mt-1">Low Stock</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#00A3AD15' }}>
            <BarChart3 size={20} style={{ color: '#00A3AD' }} />
          </div>
          <div className="mt-4">
            <div className="text-2xl font-700 text-money" style={{ color: 'var(--elavon-navy)' }}>
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <div className="text-xs font-500 text-neutral-400 uppercase tracking-wide mt-1">Inventory Value</div>
          </div>
        </div>
      </div>

      <div className="card p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input type="text" placeholder="Search by name or SKU…" value={search} onChange={e => setSearch(e.target.value)} className="input pl-9 w-full" />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-500 transition-colors ${
                category === cat ? 'bg-elavon-navy text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}>
              {cat}
            </button>
          ))}
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input w-36">
          <option>All</option>
          <option>Critical</option>
          <option>Low</option>
          <option>Ok</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100">
                <th className="text-left px-4 py-3 text-xs font-600 text-neutral-400 uppercase tracking-wide">SKU</th>
                <th className="text-left px-4 py-3 text-xs font-600 text-neutral-400 uppercase tracking-wide">Item</th>
                <th className="text-left px-4 py-3 text-xs font-600 text-neutral-400 uppercase tracking-wide">Category</th>
                <th className="text-right px-4 py-3 text-xs font-600 text-neutral-400 uppercase tracking-wide">Qty</th>
                <th className="text-left px-4 py-3 text-xs font-600 text-neutral-400 uppercase tracking-wide w-32">Stock Level</th>
                <th className="text-right px-4 py-3 text-xs font-600 text-neutral-400 uppercase tracking-wide">Cost</th>
                <th className="text-left px-4 py-3 text-xs font-600 text-neutral-400 uppercase tracking-wide">Supplier</th>
                <th className="text-left px-4 py-3 text-xs font-600 text-neutral-400 uppercase tracking-wide">Status</th>
                <th className="text-center px-4 py-3 text-xs font-600 text-neutral-400 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {filtered.map(item => {
                const st = STATUS_CONFIG[item.status]
                const StIcon = st.icon
                return (
                  <tr key={item.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-4 py-3"><span className="text-xs font-600 text-neutral-400 font-mono">{item.sku}</span></td>
                    <td className="px-4 py-3"><div className="font-600 text-sm text-elavon-navy">{item.name}</div></td>
                    <td className="px-4 py-3"><span className="badge badge-navy">{item.category}</span></td>
                    <td className="px-4 py-3 text-right"><span className="font-600 text-sm text-neutral-700">{item.quantity} <span className="text-neutral-400 font-400">{item.unit}</span></span></td>
                    <td className="px-4 py-3">
                      <StockBar quantity={item.quantity} min={item.min} max={item.max} />
                      <div className="text-xs text-neutral-400 mt-1">{item.quantity}/{item.max}</div>
                    </td>
                    <td className="px-4 py-3 text-right"><span className="text-sm font-600 text-neutral-700">${item.cost.toFixed(2)}</span></td>
                    <td className="px-4 py-3"><span className="text-sm text-neutral-600">{item.supplier}</span></td>
                    <td className="px-4 py-3">
                      <span className={`badge ${st.bg} ${st.text} flex items-center gap-1 w-fit`}>
                        <StIcon size={10} /> {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => setViewItem(item)} className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-elavon-navy transition-colors">
                          <Eye size={14} />
                        </button>
                        <button onClick={() => handleEdit(item)} className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-elavon-teal transition-colors">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => setDeleteItem(item)} className="p-1.5 rounded-lg hover:bg-danger-light text-neutral-400 hover:text-danger transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-neutral-100 text-sm text-neutral-500">
          Showing {filtered.length} of {items.length} items
        </div>
      </div>

      {showModal && (
        <ItemModal item={editingItem} onSave={handleSave} onClose={() => { setShowModal(false); setEditingItem(null) }} />
      )}
      {deleteItem && (
        <DeleteConfirm item={deleteItem} onConfirm={handleDelete} onClose={() => setDeleteItem(null)} />
      )}
      {viewItem && (
        <ItemDetailModal item={viewItem} onClose={() => setViewItem(null)} onEdit={handleEdit} />
      )}
    </div>
  )
}
