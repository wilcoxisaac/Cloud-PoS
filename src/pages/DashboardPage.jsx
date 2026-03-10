import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart,
  Users, Clock, ArrowRight, Zap, AlertTriangle,
  CreditCard, Star, Package, Calendar, ChevronRight
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
  { name: 'Entrees', value: 42, color: '#002D5C' },
  { name: 'Drinks', value: 28, color: '#00A3AD' },
  { name: 'Desserts', value: 15, color: '#0073B1' },
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

const ALERTS = [
  { type: 'warning', icon: AlertTriangle, msg: 'House Wine stock critical (3 bottles)', action: 'Reorder' },
  { type: 'info', icon: Star, msg: '3 customers reached Gold tier today', action: 'View' },
  { type: 'success', icon: Zap, msg: 'Daily sales target 87% achieved', action: null },
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

export default function DashboardPage() {
  const { business } = useApp()
  const { transactions } = usePOS()
  const navigate = useNavigate()
  const [timeRange, setTimeRange] = useState('today')
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  const todaySales = HOURLY_SALES.reduce((s, h) => s + h.sales, 0)

  return (
    <div className="p-6 space-y-6 max-w-screen-2xl mx-auto">
      {/* Welcome + Date */}
      <div className="flex items-center justify-between">
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

      {/* Alert Banner */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {ALERTS.map((a, i) => (
          <div key={i} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border flex-shrink-0 ${
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
              <button className="text-xs font-600 text-elavon-teal hover:underline ml-2">{a.action}</button>
            )}
          </div>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={DollarSign} label="Today's Revenue" value={todaySales}
          change="+14.2%" positive color="#002D5C"
        />
        <MetricCard
          icon={ShoppingCart} label="Transactions" value={284} prefix=""
          change="+8.7%" positive color="#00A3AD" raw
        />
        <MetricCard
          icon={Users} label="Customers Served" value={198} prefix=""
          change="+5.1%" positive color="#0073B1" raw
        />
        <MetricCard
          icon={Clock} label="Avg Order Value" value={47.82}
          change="+2.3%" positive color="#00875A"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sales Trend */}
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

        {/* Category Breakdown */}
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

      {/* Weekly + Top Items + Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly Chart */}
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
              <Bar dataKey="sales" fill="#002D5C" radius={[4, 4, 0, 0]} maxBarSize={32} />
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

        {/* Top Items */}
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

        {/* Recent Transactions */}
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

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'New Sale', icon: ShoppingCart, path: '/pos', color: '#002D5C' },
          { label: 'View Tables', icon: Calendar, path: '/restaurant', color: '#00A3AD' },
          { label: 'Add Customer', icon: Users, path: '/customers', color: '#0073B1' },
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
