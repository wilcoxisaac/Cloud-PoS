import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart,
  Users, Clock, ArrowRight, Zap, AlertTriangle,
  CreditCard, Star, Package, Calendar, ChevronRight,
  X, Minus, Plus, CheckCircle, Award, Crown, ExternalLink, Truck
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { usePOS } from '../context/POSContext'

const HOURLY_SALES = [
  { hour: '6am', sales: 120 }, { hour: '7am', sales: 340 },
  { hour: '8am', sales: 520 }, { hour: '9am', sales: 480 },
  { hour: '10am', sales: 380 }, { hour: '11am', sales: 690 },
  { hour: '12pm', sales: 1240 }, { hour: '1pm', sales: 1380 },
  { hour: '2pm', sales: 890 }, { hour: '3pm', sales: 620 },
  { hour: '4pm', sales: 480 }, { hour: '5pm', sales: 780 },
  { hour: '6pm', sales: 1540 }, { hour: '7pm', sales: 1820 },
  { hour: '8pm', sales: 1640 }, { hour: '9pm', sales: 980 },
  { hour: '10pm', sales: 460 },
]

const WEEKLY_DATA = [
  { day: 'Mon', sales: 3240, transactions: 48 },
  { day: 'Tue', sales: 4180, transactions: 62 },
  { day: 'Wed', sales: 3820, transactions: 55 },
  { day: 'Thu', sales: 5100, transactions: 73 },
  { day: 'Fri', sales: 7240, transactions: 104 },
  { day: 'Sat', sales: 8920, transactions: 128 },
  { day: 'Sun', sales: 6340, transactions: 91 },
]

const CATEGORY_DATA = [
  { name: 'Entrees', value: 42, color: '#0A1638' },
  { name: 'Drinks', value: 28, color: '#00A3AD' },
  { name: 'Desserts', value: 15, color: '#1E3A6E' },
  { name: 'Salads', value: 10, color: '#00BFC9' },
  { name: 'Other', value: 5, color: '#D1DCE8' },
]

const TOP_ITEMS = [
  { name: 'House Burger', sales: 148, revenue: 2218.52, trend: '+12%' },
  { name: 'Margherita Pizza', sales: 124, revenue: 2046.00, trend: '+8%' },
  { name: 'House Wine', sales: 198, revenue: 1782.00, trend: '+22%' },
  { name: 'Caesar Salad', sales: 92, revenue: 1058.00, trend: '-3%' },
  { name: 'Craft Beer', sales: 216, revenue: 1512.00, trend: '+18%' },
]

const RECENT_TRANSACTIONS = [
  { id: 'TXN-8821', customer: 'Emily Chen', items: 3, amount: 68.50, method: 'Card', time: '2 min ago', table: 'T12' },
  { id: 'TXN-8820', customer: 'Walk-in', items: 2, amount: 29.00, method: 'Card', time: '8 min ago', table: 'Bar' },
  { id: 'TXN-8819', customer: 'Sarah Johnson', items: 5, amount: 124.75, method: 'Card', time: '15 min ago', table: 'T7' },
  { id: 'TXN-8818', customer: 'Walk-in', items: 1, amount: 14.99, method: 'Cash', time: '22 min ago', table: 'T4' },
  { id: 'TXN-8817', customer: 'Marcus Williams', items: 4, amount: 87.00, method: 'Apple Pay', time: '31 min ago', table: 'T9' },
]

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

const ALERTS = [
  { id: 'reorder', type: 'warning', icon: AlertTriangle, msg: 'House Wine stock critical (3 bottles)', action: 'Reorder' },
  { id: 'gold', type: 'info', icon: Star, msg: '3 customers reached Gold tier today', action: 'View' },
  { id: 'target', type: 'success', icon: Zap, msg: 'Daily sales target 87% achieved', action: null },
]

function MetricCard({ icon: Icon, label, value, change, positive, color, prefix = '$', raw = false }) {
  return (
    <div className="metric-card">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center`} style={{ background: `${color}15` }}>
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
            {p.name}: <span className="font-600">${p.value.toLocaleString()}</span>
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
    LOW_STOCK_ITEMS.forEach(item => {
      q[item.id] = item.max - item.quantity
    })
    return q
  })
  const [submitted, setSubmitted] = useState(false)

  function adjustQty(id, delta) {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta)
    }))
  }

  function handleSubmit() {
    setSubmitted(true)
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
                    <span className={`text-xs font-600 px-2 py-0.5 rounded-full ${
                      item.status === 'critical' ? 'bg-danger-light text-danger' : 'bg-warning-light text-warning'
                    }`}>
                      {item.quantity} {item.unit}s left
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1">
                      <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden w-24">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min((item.quantity / item.max) * 100, 100)}%`,
                            background: item.status === 'critical' ? '#DE350B' : '#FF8B00'
                          }}
                        />
                      </div>
                      <span className="text-xs text-neutral-400 ml-1">min: {item.min}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-neutral-500">Order:</span>
                      <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => adjustQty(item.id, -5)}
                          className="px-2 py-1.5 hover:bg-neutral-50 transition-colors"
                        >
                          <Minus size={12} className="text-neutral-500" />
                        </button>
                        <input
                          type="number"
                          value={quantities[item.id] || 0}
                          onChange={(e) => setQuantities(prev => ({ ...prev, [item.id]: Math.max(1, parseInt(e.target.value) || 1) }))}
                          className="w-12 text-center text-sm font-600 text-elavon-navy border-x border-neutral-200 py-1.5 focus:outline-none"
                        />
                        <button
                          onClick={() => adjustQty(item.id, 5)}
                          className="px-2 py-1.5 hover:bg-neutral-50 transition-colors"
                        >
                          <Plus size={12} className="text-neutral-500" />
                        </button>
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
                <button
                  onClick={() => navigate('/inventory')}
                  className="flex-1 btn-secondary text-sm py-2.5 flex items-center justify-center gap-2"
                >
                  <ExternalLink size={14} />
                  View Inventory
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 btn-primary text-sm py-2.5 flex items-center justify-center gap-2"
                >
                  <Truck size={14} />
                  Place Order
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="px-5 py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-success-light flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-success" />
            </div>
            <h4 className="font-700 text-elavon-navy text-lg mb-1">Order Placed</h4>
            <p className="text-sm text-neutral-500 mb-1">
              {totalItems} items totaling ${totalCost.toFixed(2)}
            </p>
            <p className="text-xs text-neutral-400 mb-6">
              Suppliers have been notified. Estimated delivery in 1-2 business days.
            </p>
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
            <div className="w-9 h-9 rounded-xl bg-warning-light flex items-center justify-center">
              <Award size={18} className="text-warning" />
            </div>
            <div>
              <h3 className="font-700 text-elavon-navy text-sm">New Gold Tier Members</h3>
              <p className="text-xs text-neutral-400">{NEW_GOLD_CUSTOMERS.length} customers reached Gold today</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-neutral-100 transition-colors">
            <X size={18} className="text-neutral-400" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-3">
          {NEW_GOLD_CUSTOMERS.map((customer, i) => (
            <div key={i} className="rounded-xl border border-warning/20 bg-gradient-to-r from-warning-light/40 to-white p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-warning/15 flex items-center justify-center">
                    <Crown size={18} className="text-warning" />
                  </div>
                  <div>
                    <div className="text-sm font-700 text-elavon-navy">{customer.name}</div>
                    <div className="text-xs text-neutral-400 flex items-center gap-1">
                      <ArrowRight size={10} />
                      Promoted from {customer.previousTier} at {customer.reachedAt}
                    </div>
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
                <span key={perk} className="text-xs bg-warning-light text-warning px-2 py-1 rounded-full font-500 flex items-center gap-1">
                  <CheckCircle size={10} />
                  {perk}
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { onClose(); navigate('/loyalty'); }}
              className="flex-1 btn-secondary text-sm py-2.5 flex items-center justify-center gap-2"
            >
              <ExternalLink size={14} />
              Loyalty Program
            </button>
            <button
              onClick={() => { onClose(); navigate('/customers'); }}
              className="flex-1 btn-primary text-sm py-2.5 flex items-center justify-center gap-2"
            >
              <Users size={14} />
              View Customers
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { business } = useApp()
  const { transactions } = usePOS()
  const navigate = useNavigate()
  const [timeRange, setTimeRange] = useState('today')
  const [showReorder, setShowReorder] = useState(false)
  const [showGoldCustomers, setShowGoldCustomers] = useState(false)
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  const todaySales = HOURLY_SALES.reduce((s, h) => s + h.sales, 0)

  function handleAlertAction(alertId) {
    if (alertId === 'reorder') setShowReorder(true)
    else if (alertId === 'gold') setShowGoldCustomers(true)
  }

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
        {ALERTS.map((a) => (
          <div key={a.id} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border flex-shrink-0 ${
            a.type === 'warning' ? 'bg-warning-light border-warning/30' :
            a.type === 'success' ? 'bg-success-light border-success/30' :
            'bg-info-light border-info/30'
          }`}>
            <a.icon size={14} className={
              a.type === 'warning' ? 'text-warning' :
              a.type === 'success' ? 'text-success' : 'text-info'
            } />
            <span className="text-xs font-500 text-neutral-700">{a.msg}</span>
            {a.action && (
              <button
                onClick={() => handleAlertAction(a.id)}
                className="text-xs font-600 text-elavon-teal hover:underline ml-2"
              >
                {a.action}
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={DollarSign} label="Today's Revenue" value={todaySales}
          change="+14.2%" positive color="#0A1638"
        />
        <MetricCard
          icon={ShoppingCart} label="Transactions" value={284} prefix=""
          change="+8.7%" positive color="#00A3AD" raw
        />
        <MetricCard
          icon={Users} label="Customers Served" value={198} prefix=""
          change="+5.1%" positive color="#1E3A6E" raw
        />
        <MetricCard
          icon={Clock} label="Avg Order Value" value={47.82}
          change="+2.3%" positive color="#00875A"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-600 text-elavon-navy">Sales by Hour</h3>
            <span className="badge-teal">{today.split(',')[0]}</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={HOURLY_SALES} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
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
        </div>

        <div className="card p-5">
          <h3 className="font-600 text-elavon-navy mb-5">Revenue by Category</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={CATEGORY_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {CATEGORY_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-3">
            {CATEGORY_DATA.map((c, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: c.color }} />
                <span className="text-xs text-neutral-600 flex-1">{c.name}</span>
                <span className="text-xs font-600" style={{ color: 'var(--elavon-navy)' }}>{c.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-600 text-elavon-navy">This Week</h3>
            <span className="text-xs text-neutral-400 font-500">vs last week</span>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={WEEKLY_DATA} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EBF0F7" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#7B9AB5' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#7B9AB5' }} tickLine={false} axisLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="sales" fill="#0A1638" radius={[4, 4, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 pt-4 border-t border-neutral-100 flex justify-between">
            <div>
              <div className="text-lg font-700 text-elavon-navy text-money">${(38840).toLocaleString()}</div>
              <div className="text-xs text-neutral-400">Week Total</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-700 text-success text-money">+18.4%</div>
              <div className="text-xs text-neutral-400">vs last week</div>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-600 text-elavon-navy">Top Sellers</h3>
            <button onClick={() => navigate('/analytics')} className="text-xs text-elavon-teal font-500 hover:underline flex items-center gap-1">
              All <ChevronRight size={11} />
            </button>
          </div>
          <div className="space-y-3">
            {TOP_ITEMS.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-700 flex-shrink-0"
                  style={{ background: i === 0 ? '#FFD700' : '#EBF0F7', color: i === 0 ? '#7A5C00' : '#5A7A96' }}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-600 text-neutral-800 truncate">{item.name}</div>
                  <div className="text-xs text-neutral-400">{item.sales} sold</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-700 text-elavon-navy text-money">${item.revenue.toLocaleString()}</div>
                  <div className={`text-xs font-600 ${item.trend.startsWith('+') ? 'text-success' : 'text-danger'}`}>
                    {item.trend}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-600 text-elavon-navy">Recent Sales</h3>
            <button onClick={() => navigate('/analytics')} className="text-xs text-elavon-teal font-500 hover:underline flex items-center gap-1">
              All <ChevronRight size={11} />
            </button>
          </div>
          <div className="space-y-3">
            {RECENT_TRANSACTIONS.map((tx, i) => (
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
