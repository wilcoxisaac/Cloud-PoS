import React, { useState } from 'react'
import {
  Package, Search, Plus, AlertTriangle, TrendingDown, TrendingUp,
  Filter, Download, RefreshCw, ChevronDown, Edit2, Trash2, Eye,
  BarChart3, Archive, Tag, CheckCircle
} from 'lucide-react'

const INVENTORY_ITEMS = [
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

const STATUS_CONFIG = {
  critical: { label: 'Critical', bg: 'bg-danger-light', text: 'text-danger', icon: AlertTriangle },
  low: { label: 'Low', bg: 'bg-warning-light', text: 'text-warning', icon: TrendingDown },
  ok: { label: 'In Stock', bg: 'bg-success-light', text: 'text-success', icon: CheckCircle },
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

export default function InventoryPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sortBy, setSortBy] = useState('name')

  const filtered = INVENTORY_ITEMS.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.sku.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'All' || item.category === category
    const matchStatus = statusFilter === 'All' || item.status === statusFilter.toLowerCase()
    return matchSearch && matchCat && matchStatus
  })

  const criticalCount = INVENTORY_ITEMS.filter(i => i.status === 'critical').length
  const lowCount = INVENTORY_ITEMS.filter(i => i.status === 'low').length
  const totalValue = INVENTORY_ITEMS.reduce((sum, i) => sum + i.quantity * i.cost, 0)

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-700 text-elavon-navy">Inventory</h1>
          <p className="text-sm text-neutral-500 mt-0.5">{INVENTORY_ITEMS.length} items tracked · Last synced just now</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-secondary flex items-center gap-2">
            <Download size={15} />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button className="btn btn-secondary flex items-center gap-2">
            <RefreshCw size={15} />
            <span className="hidden sm:inline">Sync</span>
          </button>
          <button className="btn btn-teal flex items-center gap-2">
            <Plus size={15} />
            <span className="hidden sm:inline">Add Item</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="metric-card">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#0A163815' }}>
              <Package size={20} style={{ color: '#0A1638' }} />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-700 text-money" style={{ color: 'var(--elavon-navy)' }}>{INVENTORY_ITEMS.length}</div>
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
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#FF8B0015' }}>
              <TrendingDown size={20} style={{ color: '#FF8B00' }} />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-700 text-money" style={{ color: '#FF8B00' }}>{lowCount}</div>
            <div className="text-xs font-500 text-neutral-400 uppercase tracking-wide mt-1">Low Stock</div>
          </div>
        </div>
        <div className="metric-card">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#00A3AD15' }}>
              <BarChart3 size={20} style={{ color: '#00A3AD' }} />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-700 text-money" style={{ color: 'var(--elavon-navy)' }}>
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <div className="text-xs font-500 text-neutral-400 uppercase tracking-wide mt-1">Inventory Value</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by name or SKU…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-9 w-full"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-500 transition-colors ${
                category === cat
                  ? 'bg-elavon-navy text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="input w-36"
        >
          <option>All</option>
          <option>Critical</option>
          <option>Low</option>
          <option>Ok</option>
        </select>
      </div>

      {/* Table */}
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
                    <td className="px-4 py-3">
                      <span className="text-xs font-600 text-neutral-400 font-mono">{item.sku}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-600 text-sm text-elavon-navy">{item.name}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge badge-navy">{item.category}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-600 text-sm text-neutral-700">{item.quantity} <span className="text-neutral-400 font-400">{item.unit}</span></span>
                    </td>
                    <td className="px-4 py-3">
                      <StockBar quantity={item.quantity} min={item.min} max={item.max} />
                      <div className="text-xs text-neutral-400 mt-1">{item.quantity}/{item.max}</div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-600 text-neutral-700">${item.cost.toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-neutral-600">{item.supplier}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${st.bg} ${st.text} flex items-center gap-1 w-fit`}>
                        <StIcon size={10} />
                        {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-elavon-navy transition-colors">
                          <Eye size={14} />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-elavon-teal transition-colors">
                          <Edit2 size={14} />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-danger-light text-neutral-400 hover:text-danger transition-colors">
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
          Showing {filtered.length} of {INVENTORY_ITEMS.length} items
        </div>
      </div>
    </div>
  )
}
