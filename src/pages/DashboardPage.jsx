import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart,
  Users, Clock, ArrowRight, Zap, AlertTriangle,
  Star, Package, Calendar, ChevronRight,
  X, Minus, Plus, CheckCircle, Award, Crown, ExternalLink, Truck,
  CreditCard, Banknote, Smartphone, Gift, FileText
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { usePOS } from '../context/POSContext'
import { SIM_DAILY_TOTAL } from '../lib/dataSimulator'

const LOW_STOCK_ITEMS = [
  { id: 1, name: 'House Wine (Red)', sku: 'BVG-001', quantity: 3, min: 10, max: 50, cost: 12.00, unit: 'bottle', supplier: 'Valley Wines Co.', status: 'critical' },
  { id: 2, name: 'Craft Beer (IPA)', sku: 'BVG-002', quantity: 18, min: 24, max: 96, cost: 2.50, unit: 'bottle', supplier: 'Local Brews LLC', status: 'low' },
  { id: 5, name: 'Caesar Dressing', sku: 'FD-003', quantity: 6, min: 8, max: 24, cost: 4.20, unit: 'bottle', supplier: 'FoodService Pro', status: 'low' },
  { id: 8, name: 'Mozzarella Cheese', sku: 'FD-005', quantity: 8, min: 10, max: 30, cost: 7.00, unit: 'lb', supplier: 'Dairy Direct', status: 'low' },
]

const NEW_GOLD_CUSTOMERS = [
  { name: 'Rachel Torres', points: 1042, previousTier: 'Silver', visits: 55, totalSpent: 2847.50, reachedAt: '11:24 AM' },
  { name: 'James Mitchell', points: 1015, previousTier: 'Silver', visits: 38, totalSpent: 2190.00, reachedAt: '1:47 PM' },
  { name: 'Lisa Nguyen', points: 1003, previousTier: 'Silver', visits: 44, totalSpent: 2512.75, reachedAt: '3:12 PM' },
]

const TENDER_ICONS = {
  'Credit Card': CreditCard,
  'Debit Card': CreditCard,
  'Cash': Banknote,
  'Gift Card': Gift,
  'Apple Pay': Smartphone,
  'Google Pay': Smartphone,
  'Check': FileText,
}

const TENDER_COLORS = {
  'Credit Card': '#0A1638',
  'Debit Card': '#1E3A6E',
  'Cash': '#00875A',
  'Gift Card': '#FF8B00',
  'Apple Pay': '#333333',
  'Google Pay': '#4285F4',
  'Check': '#7B9AB5',
}

function isToday(dateStr) {
  const d = new Date(dateStr)
  const now = new Date()
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
}

function isThisWeek(dateStr) {
  const d = new Date(dateStr)
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)
  return d >= startOfWeek
}

function isThisMonth(dateStr) {
  const d = new Date(dateStr)
  const now = new Date()
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function MetricCard({ icon: Icon, label, value, change, positive, color, prefix = '$', raw = false }) {
  return (
    <div className="metric-card">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
          <Icon size={20} style={{ color }} />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-600 ${positive ? 'text-success' : 'text-danger'}`}>
            {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {change}
          </div>
        )}
      </div>
      <div className="mt-4">
        <div className="text-2xl font-700 text-money" style={{ color: 'var(--elavon-navy)' }}>
          {raw ? value : `${prefix}${typeof value === 'number' ? value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : value}`}
        </div>
        <div className="text-xs font-500 text-neutral-400 uppercase tracking-wide mt-1">{label}</div>
      </div>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-neutral-200 rounded-xl p-3 shadow-dropdown text-sm">
        <p className="font-600 text-elavon-navy mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-neutral-600">
            {p.name}: <span className="font-600">${typeof p.value === 'number' ? p.value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : p.value}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

function ReorderModal({ onClose, navigate }) {
  const [quantities, setQuantities] = useState(() => {
    const q = {}
    LOW_STOCK_ITEMS.forEach(item => { q[item.id] = item.max - item.quantity })
    return q
  })
  const [submitted, setSubmitted] = useState(false)

  function adjustQty(id, delta) {
    setQuantities(prev => ({ ...prev, [id]: Math.max(1, (prev[id] || 1) + delta) }))
  }

  const totalCost = LOW_STOCK_ITEMS.reduce((sum, item) => sum + (quantities[item.id] || 0) * item.cost, 0)
  const totalItems = LOW_STOCK_ITEMS.reduce((sum, item) => sum + (quantities[item.id] || 0), 0)

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-modal overflow-hidden animate-fade-in max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-warning-light flex items-center justify-center">
              <Package size={18} className="text-warning" />
            </div>
            <div>
              <h3 className="font-700 text-elavon-navy text-sm">Reorder Low Stock Items</h3>
              <p className="text-xs text-neutral-400">{LOW_STOCK_ITEMS.length} items below minimum</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-neutral-100 transition-colors">
            <X size={18} className="text-neutral-400" />
          </button>
        </div>
        {!submitted ? (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {LOW_STOCK_ITEMS.map(item => (
                <div key={item.id} className={`rounded-xl border p-4 ${item.status === 'critical' ? 'border-danger/30 bg-danger-light/30' : 'border-neutral-200'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-sm font-600 text-elavon-navy">{item.name}</div>
                      <div className="text-xs text-neutral-400 mt-0.5">{item.sku} · {item.supplier}</div>
                    </div>
                    <span className={`text-xs font-600 px-2 py-0.5 rounded-full ${item.status === 'critical' ? 'bg-danger-light text-danger' : 'bg-warning-light text-warning'}`}>
                      {item.quantity} {item.unit}s left
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1">
                      <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden w-24">
                        <div className="h-full rounded-full" style={{ width: `${Math.min((item.quantity / item.max) * 100, 100)}%`, background: item.status === 'critical' ? '#DE350B' : '#FF8B00' }} />
                      </div>
                      <span className="text-xs text-neutral-400 ml-1">min: {item.min}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-neutral-500">Order:</span>
                      <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden">
                        <button onClick={() => adjustQty(item.id, -5)} className="px-2 py-1.5 hover:bg-neutral-50 transition-colors"><Minus size={12} className="text-neutral-500" /></button>
                        <input type="number" value={quantities[item.id] || 0} onChange={(e) => setQuantities(prev => ({ ...prev, [item.id]: Math.max(1, parseInt(e.target.value) || 1) }))} className="w-12 text-center text-sm font-600 text-elavon-navy border-x border-neutral-200 py-1.5 focus:outline-none" />
                        <button onClick={() => adjustQty(item.id, 5)} className="px-2 py-1.5 hover:bg-neutral-50 transition-colors"><Plus size={12} className="text-neutral-500" /></button>
                      </div>
                      <span className="text-xs text-neutral-400">{item.unit}s</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-100">
                    <span className="text-xs text-neutral-400">${item.cost.toFixed(2)} / {item.unit}</span>
                    <span className="text-xs font-600 text-elavon-navy">${((quantities[item.id] || 0) * item.cost).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-4 border-t border-neutral-100 bg-neutral-50">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-xs text-neutral-500">Total Order</div>
                  <div className="text-lg font-700 text-elavon-navy text-money">${totalCost.toFixed(2)}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-neutral-500">{totalItems} items</div>
                  <div className="text-xs text-neutral-400">Est. delivery 1-2 days</div>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => navigate('/inventory')} className="flex-1 btn-secondary text-sm py-2.5 flex items-center justify-center gap-2"><ExternalLink size={14} />View Inventory</button>
                <button onClick={() => setSubmitted(true)} className="flex-1 btn-primary text-sm py-2.5 flex items-center justify-center gap-2"><Truck size={14} />Place Order</button>
              </div>
            </div>
          </>
        ) : (
          <div className="px-5 py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-success-light flex items-center justify-center mx-auto mb-4"><CheckCircle size={32} className="text-success" /></div>
            <h4 className="font-700 text-elavon-navy text-lg mb-1">Order Placed</h4>
            <p className="text-sm text-neutral-500 mb-1">{totalItems} items totaling ${totalCost.toFixed(2)}</p>
            <p className="text-xs text-neutral-400 mb-6">Suppliers have been notified. Estimated delivery in 1-2 business days.</p>
            <div className="space-y-2">
              {LOW_STOCK_ITEMS.map(item => (
                <div key={item.id} className="flex items-center justify-between text-xs px-4 py-2 bg-neutral-50 rounded-lg">
                  <span className="text-neutral-600">{item.name}</span>
                  <span className="font-600 text-elavon-navy">{quantities[item.id]} {item.unit}s → {item.supplier}</span>
                </div>
              ))}
            </div>
            <button onClick={onClose} className="btn-primary text-sm py-2.5 px-8 mt-6">Done</button>
          </div>
        )}
      </div>
    </div>
  )
}

function GoldCustomersModal({ onClose, navigate }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-modal overflow-hidden animate-fade-in">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-warning-light flex items-center justify-center"><Award size={18} className="text-warning" /></div>
            <div>
              <h3 className="font-700 text-elavon-navy text-sm">New Gold Tier Members</h3>
              <p className="text-xs text-neutral-400">{NEW_GOLD_CUSTOMERS.length} customers reached Gold today</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"><X size={18} className="text-neutral-400" /></button>
        </div>
        <div className="px-5 py-4 space-y-3">
          {NEW_GOLD_CUSTOMERS.map((customer, i) => (
            <div key={i} className="rounded-xl border border-warning/20 bg-gradient-to-r from-warning-light/40 to-white p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-warning/15 flex items-center justify-center"><Crown size={18} className="text-warning" /></div>
                  <div>
                    <div className="text-sm font-700 text-elavon-navy">{customer.name}</div>
                    <div className="text-xs text-neutral-400 flex items-center gap-1"><ArrowRight size={10} />Promoted from {customer.previousTier} at {customer.reachedAt}</div>
                  </div>
                </div>
                <span className="badge-teal text-xs font-600">{customer.points.toLocaleString()} pts</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-lg p-2.5 text-center border border-neutral-100">
                  <div className="text-sm font-700 text-elavon-navy">{customer.visits}</div>
                  <div className="text-xs text-neutral-400">Visits</div>
                </div>
                <div className="bg-white rounded-lg p-2.5 text-center border border-neutral-100">
                  <div className="text-sm font-700 text-elavon-navy">${customer.totalSpent.toLocaleString()}</div>
                  <div className="text-xs text-neutral-400">Total Spent</div>
                </div>
                <div className="bg-white rounded-lg p-2.5 text-center border border-neutral-100">
                  <div className="text-sm font-700 text-success">2x</div>
                  <div className="text-xs text-neutral-400">Points Rate</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="px-5 py-4 border-t border-neutral-100 bg-neutral-50">
          <div className="rounded-xl bg-white border border-neutral-200 p-3 mb-4">
            <div className="text-xs font-600 text-elavon-navy mb-1">Gold Tier Perks Unlocked</div>
            <div className="flex flex-wrap gap-2">
              {['2x points', 'Monthly complimentary item', 'Exclusive events access'].map(perk => (
                <span key={perk} className="text-xs bg-warning-light text-warning px-2 py-1 rounded-full font-500 flex items-center gap-1"><CheckCircle size={10} />{perk}</span>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { onClose(); navigate('/loyalty'); }} className="flex-1 btn-secondary text-sm py-2.5 flex items-center justify-center gap-2"><ExternalLink size={14} />Loyalty Program</button>
            <button onClick={() => { onClose(); navigate('/customers'); }} className="flex-1 btn-primary text-sm py-2.5 flex items-center justify-center gap-2"><Users size={14} />View Customers</button>
          </div>
        </div>
      </div>
    </div>
  )
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function DashboardPage() {
  const { business } = useApp()
  const { transactions, customers, historicalSummaries } = usePOS()
  const navigate = useNavigate()
  const [timeRange, setTimeRange] = useState('today')
  const [showReorder, setShowReorder] = useState(false)
  const [showGoldCustomers, setShowGoldCustomers] = useState(false)
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  const metrics = useMemo(() => {
    const filterFn = timeRange === 'today' ? isToday : timeRange === 'week' ? isThisWeek : isThisMonth
    const filtered = transactions.filter(tx => tx.timestamp && filterFn(tx.timestamp))

    const revenue = filtered.reduce((sum, tx) => sum + (tx.total || 0), 0)
    const txCount = filtered.length
    const uniqueCustomerIds = new Set(filtered.filter(tx => tx.customer?.id).map(tx => tx.customer.id)).size
    const anonymousTxCount = filtered.filter(tx => !tx.customer?.id).length
    const customersServed = uniqueCustomerIds + anonymousTxCount
    const avgOrder = txCount > 0 ? revenue / txCount : 0

    return { revenue, txCount, customersServed, avgOrder }
  }, [transactions, timeRange])

  const hourlySales = useMemo(() => {
    const todayTxs = transactions.filter(tx => tx.timestamp && isToday(tx.timestamp))
    const hours = Array.from({ length: 17 }, (_, i) => {
      const hour = i + 6
      const label = hour === 12 ? '12pm' : hour > 12 ? `${hour - 12}pm` : `${hour}am`
      const sales = todayTxs
        .filter(tx => new Date(tx.timestamp).getHours() === hour)
        .reduce((sum, tx) => sum + (tx.total || 0), 0)
      return { hour: label, sales: Math.round(sales * 100) / 100 }
    })
    return hours
  }, [transactions])

  const weeklyData = useMemo(() => {
    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    startOfWeek.setHours(0, 0, 0, 0)

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return days.map((day, i) => {
      const dayDate = new Date(startOfWeek)
      dayDate.setDate(startOfWeek.getDate() + i)
      const dateStr = dayDate.toISOString().split('T')[0]

      const txSales = transactions.filter(tx => {
        if (!tx.timestamp) return false
        const d = new Date(tx.timestamp)
        return d.getFullYear() === dayDate.getFullYear() && d.getMonth() === dayDate.getMonth() && d.getDate() === dayDate.getDate()
      })
      let sales = txSales.reduce((sum, tx) => sum + (tx.total || 0), 0)
      let txCount = txSales.length

      if (txCount === 0 && historicalSummaries.length > 0) {
        const summary = historicalSummaries.find(s => s.date === dateStr)
        if (summary) {
          sales = summary.revenue
          txCount = summary.txCount
        }
      }

      return { day, sales: Math.round(sales * 100) / 100, transactions: txCount }
    })
  }, [transactions, historicalSummaries])

  const weekTotal = weeklyData.reduce((sum, d) => sum + d.sales, 0)

  const monthlyTrend = useMemo(() => {
    if (!historicalSummaries.length) return []
    const months = {}
    historicalSummaries.forEach(s => {
      const key = s.date.slice(0, 7)
      if (!months[key]) months[key] = { month: key, revenue: 0, txCount: 0 }
      months[key].revenue += s.revenue
      months[key].txCount += s.txCount
    })
    const currentMonth = new Date().toISOString().slice(0, 7)
    const thisMonthTxRevenue = transactions
      .filter(tx => tx.timestamp && isThisMonth(tx.timestamp))
      .reduce((s, tx) => s + (tx.total || 0), 0)
    if (!months[currentMonth]) months[currentMonth] = { month: currentMonth, revenue: 0, txCount: 0 }
    months[currentMonth].revenue = thisMonthTxRevenue
    months[currentMonth].txCount = transactions.filter(tx => tx.timestamp && isThisMonth(tx.timestamp)).length

    return Object.values(months).sort((a, b) => a.month.localeCompare(b.month)).slice(-12).map(m => ({
      ...m,
      label: MONTH_NAMES[parseInt(m.month.split('-')[1]) - 1],
      revenue: Math.round(m.revenue),
    }))
  }, [historicalSummaries, transactions])

  const yearTotal = monthlyTrend.reduce((s, m) => s + m.revenue, 0)

  const categoryData = useMemo(() => {
    const todayTxs = transactions.filter(tx => tx.timestamp && isToday(tx.timestamp))
    const cats = {}
    todayTxs.forEach(tx => {
      if (tx.items) {
        tx.items.forEach(item => {
          const cat = item.category || 'Other'
          cats[cat] = (cats[cat] || 0) + (item.price || 0) * (item.qty || 1)
        })
      }
    })
    const colors = ['#0A1638', '#00A3AD', '#1E3A6E', '#00BFC9', '#D1DCE8']
    const total = Object.values(cats).reduce((s, v) => s + v, 0) || 1
    const sorted = Object.entries(cats).sort((a, b) => b[1] - a[1]).slice(0, 5)
    if (sorted.length === 0) {
      return [{ name: 'No data', value: 100, color: '#D1DCE8' }]
    }
    return sorted.map(([name, val], i) => ({
      name,
      value: Math.round((val / total) * 100),
      color: colors[i % colors.length],
    }))
  }, [transactions])

  const tenderBreakdown = useMemo(() => {
    const todayTxs = transactions.filter(tx => tx.timestamp && isToday(tx.timestamp))
    const methods = {}
    todayTxs.forEach(tx => {
      const m = tx.payment_method || 'Other'
      if (!methods[m]) methods[m] = { amount: 0, count: 0 }
      methods[m].amount += tx.total || 0
      methods[m].count += 1
    })
    const total = Object.values(methods).reduce((s, v) => s + v.amount, 0) || 1
    return Object.entries(methods)
      .sort((a, b) => b[1].amount - a[1].amount)
      .map(([name, data]) => ({
        name,
        amount: Math.round(data.amount * 100) / 100,
        count: data.count,
        pct: Math.round((data.amount / total) * 100),
        color: TENDER_COLORS[name] || '#7B9AB5',
        icon: TENDER_ICONS[name] || CreditCard,
      }))
  }, [transactions])

  const topItems = useMemo(() => {
    const filterFn = timeRange === 'today' ? isToday : timeRange === 'week' ? isThisWeek : isThisMonth
    const filtered = transactions.filter(tx => tx.timestamp && filterFn(tx.timestamp))
    const items = {}
    filtered.forEach(tx => {
      if (tx.items) {
        tx.items.forEach(item => {
          const key = item.name || item.id
          if (!items[key]) items[key] = { name: key, sales: 0, revenue: 0 }
          items[key].sales += item.qty || 1
          items[key].revenue += (item.price || 0) * (item.qty || 1)
        })
      }
    })
    const sorted = Object.values(items).sort((a, b) => b.revenue - a.revenue).slice(0, 5)
    if (sorted.length === 0) return []
    return sorted
  }, [transactions, timeRange])

  const recentTxs = useMemo(() => {
    return transactions.slice(0, 5).map(tx => ({
      id: tx.id,
      customer: tx.customer?.name || 'Walk-in',
      items: tx.items ? tx.items.reduce((s, i) => s + (i.qty || 1), 0) : 0,
      amount: tx.total || 0,
      method: tx.payment_method || 'Card',
      time: tx.timestamp ? timeAgo(tx.timestamp) : '',
      table: tx.tableId || '—',
    }))
  }, [transactions])

  const alerts = useMemo(() => {
    const list = [
      { id: 'reorder', type: 'warning', icon: AlertTriangle, msg: 'House Wine stock critical (3 bottles)', action: 'Reorder' },
      { id: 'gold', type: 'info', icon: Star, msg: '3 customers reached Gold tier today', action: 'View' },
    ]
    const target = SIM_DAILY_TOTAL + 4700
    const pct = metrics.revenue > 0 ? Math.min(Math.round((metrics.revenue / target) * 100), 100) : 0
    list.push({ id: 'target', type: pct >= 80 ? 'success' : 'info', icon: Zap, msg: `Daily sales target ${pct}% achieved`, action: null })
    return list
  }, [metrics.revenue])

  function handleAlertAction(alertId) {
    if (alertId === 'reorder') setShowReorder(true)
    else if (alertId === 'gold') setShowGoldCustomers(true)
  }

  const hasTodayData = transactions.some(tx => tx.timestamp && isToday(tx.timestamp))

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-screen-2xl mx-auto">
      {showReorder && <ReorderModal onClose={() => setShowReorder(false)} navigate={navigate} />}
      {showGoldCustomers && <GoldCustomersModal onClose={() => setShowGoldCustomers(false)} navigate={navigate} />}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-700" style={{ color: 'var(--elavon-navy)' }}>
            Good afternoon, Alex 👋
          </h2>
          <p className="text-sm text-neutral-500 mt-0.5">{today} · {business.name}</p>
        </div>
        <div className="flex gap-2">
          {['today', 'week', 'month'].map(r => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-4 py-2 rounded-lg text-sm font-500 transition-all ${
                timeRange === r
                  ? 'bg-elavon-navy text-white shadow-card'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:border-elavon-teal'
              }`}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1">
        {alerts.map((a) => (
          <div key={a.id} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border flex-shrink-0 ${
            a.type === 'warning' ? 'bg-warning-light border-warning/30' :
            a.type === 'success' ? 'bg-success-light border-success/30' :
            'bg-info-light border-info/30'
          }`}>
            <a.icon size={14} className={a.type === 'warning' ? 'text-warning' : a.type === 'success' ? 'text-success' : 'text-info'} />
            <span className="text-xs font-500 text-neutral-700">{a.msg}</span>
            {a.action && (
              <button onClick={() => handleAlertAction(a.id)} className="text-xs font-600 text-elavon-teal hover:underline ml-2">{a.action}</button>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={DollarSign} label={`${timeRange === 'today' ? "Today's" : timeRange === 'week' ? "This Week's" : "This Month's"} Revenue`} value={metrics.revenue} color="#0A1638" />
        <MetricCard icon={ShoppingCart} label="Transactions" value={metrics.txCount.toLocaleString()} prefix="" color="#00A3AD" raw />
        <MetricCard icon={Users} label="Customers Served" value={metrics.customersServed.toLocaleString()} prefix="" color="#1E3A6E" raw />
        <MetricCard icon={Clock} label="Avg Order Value" value={metrics.avgOrder} color="#00875A" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-600 text-elavon-navy">Sales by Hour</h3>
            <span className="badge-teal">{today.split(',')[0]}</span>
          </div>
          {hasTodayData ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={hourlySales} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00A3AD" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#00A3AD" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#EBF0F7" />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#7B9AB5' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#7B9AB5' }} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="sales" stroke="#00A3AD" strokeWidth={2.5} fill="url(#salesGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-neutral-400 text-sm">
              No sales today yet. <button onClick={() => navigate('/pos')} className="text-elavon-teal font-600 ml-1 hover:underline">Start selling</button>
            </div>
          )}
        </div>

        <div className="card p-5">
          <h3 className="font-600 text-elavon-navy mb-5">Revenue by Category</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {categoryData.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-3">
            {categoryData.map((c, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: c.color }} />
                <span className="text-xs text-neutral-600 flex-1">{c.name}</span>
                <span className="text-xs font-600" style={{ color: 'var(--elavon-navy)' }}>{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {monthlyTrend.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="card p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-600 text-elavon-navy">12-Month Revenue</h3>
              <span className="text-xs text-neutral-400 font-500">
                YTD: ${(yearTotal / 1000).toFixed(0)}K
              </span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={monthlyTrend} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EBF0F7" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#7B9AB5' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#7B9AB5' }} tickLine={false} axisLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" name="Revenue" fill="#00A3AD" radius={[4, 4, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card p-5">
            <h3 className="font-600 text-elavon-navy mb-4">Payment Methods</h3>
            {tenderBreakdown.length > 0 ? (
              <div className="space-y-3">
                {tenderBreakdown.map((t, i) => {
                  const Icon = t.icon
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${t.color}12` }}>
                        <Icon size={14} style={{ color: t.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-600 text-neutral-800">{t.name}</span>
                          <span className="text-xs font-600 text-elavon-navy">{t.pct}%</span>
                        </div>
                        <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${t.pct}%`, background: t.color }} />
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-xs font-700 text-elavon-navy text-money">${t.amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                        <div className="text-xs text-neutral-400">{t.count} tx</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="h-32 flex items-center justify-center text-neutral-400 text-sm">
                No transactions yet
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-600 text-elavon-navy">This Week</h3>
            <span className="text-xs text-neutral-400 font-500">{weeklyData.reduce((s, d) => s + d.transactions, 0).toLocaleString()} transactions</span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={weeklyData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EBF0F7" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#7B9AB5' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#7B9AB5' }} tickLine={false} axisLine={false} tickFormatter={v => v > 0 ? `$${(v / 1000).toFixed(0)}k` : '$0'} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="sales" name="Sales" fill="#0A1638" radius={[4, 4, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 pt-4 border-t border-neutral-100 flex justify-between">
            <div>
              <div className="text-lg font-700 text-elavon-navy text-money">${weekTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
              <div className="text-xs text-neutral-400">Week Total</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-neutral-400">{weeklyData.reduce((s, d) => s + d.transactions, 0).toLocaleString()} sales</div>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-600 text-elavon-navy">Top Sellers</h3>
            <button onClick={() => navigate('/analytics')} className="text-xs text-elavon-teal font-500 hover:underline flex items-center gap-1">All <ChevronRight size={11} /></button>
          </div>
          {topItems.length > 0 ? (
            <div className="space-y-3">
              {topItems.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-700 flex-shrink-0"
                    style={{ background: i === 0 ? '#FFD700' : '#EBF0F7', color: i === 0 ? '#7A5C00' : '#5A7A96' }}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-600 text-neutral-800 truncate">{item.name}</div>
                    <div className="text-xs text-neutral-400">{item.sales.toLocaleString()} sold</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-700 text-elavon-navy text-money">${item.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center text-neutral-400 text-sm">
              No sales data yet
            </div>
          )}
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-600 text-elavon-navy">Recent Sales</h3>
            <button onClick={() => navigate('/analytics')} className="text-xs text-elavon-teal font-500 hover:underline flex items-center gap-1">All <ChevronRight size={11} /></button>
          </div>
          {recentTxs.length > 0 ? (
            <div className="space-y-3">
              {recentTxs.map((tx, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-neutral-50 last:border-0">
                  <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center flex-shrink-0 text-xs font-700 text-neutral-500">
                    {tx.table}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-600 text-neutral-800 truncate">{tx.customer}</div>
                    <div className="text-xs text-neutral-400">{tx.items} items · {tx.time}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-700 text-elavon-navy text-money">${tx.amount.toFixed(2)}</div>
                    <div className="text-xs text-neutral-400">{tx.method}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center text-neutral-400 text-sm">
              No transactions yet
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'New Sale', icon: ShoppingCart, path: '/pos', color: '#0A1638' },
          { label: 'View Tables', icon: Calendar, path: '/restaurant', color: '#00A3AD' },
          { label: 'Add Customer', icon: Users, path: '/customers', color: '#1E3A6E' },
          { label: 'Run Report', icon: TrendingUp, path: '/analytics', color: '#00875A' },
        ].map(action => (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className="card p-4 flex items-center gap-3 hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5 text-left"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${action.color}15` }}>
              <action.icon size={18} style={{ color: action.color }} />
            </div>
            <span className="text-sm font-600" style={{ color: 'var(--elavon-navy)' }}>{action.label}</span>
            <ArrowRight size={14} className="ml-auto text-neutral-300" />
          </button>
        ))}
      </div>
    </div>
  )
}
