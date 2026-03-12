import React, { useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart,
  Users, Star, Download, Calendar, ChevronDown, BarChart3, X, Check
} from 'lucide-react'

const ALL_MONTHLY_DATA = {
  'This Month': [
    { month: 'Sep', revenue: 42800, transactions: 612, avgOrder: 69.93 },
    { month: 'Oct', revenue: 48200, transactions: 698, avgOrder: 69.05 },
    { month: 'Nov', revenue: 52100, transactions: 748, avgOrder: 69.65 },
    { month: 'Dec', revenue: 68400, transactions: 962, avgOrder: 71.10 },
    { month: 'Jan', revenue: 41200, transactions: 584, avgOrder: 70.55 },
    { month: 'Feb', revenue: 47900, transactions: 682, avgOrder: 70.23 },
    { month: 'Mar', revenue: 31200, transactions: 441, avgOrder: 70.75 },
  ],
  'Last Month': [
    { month: 'Aug', revenue: 38400, transactions: 548, avgOrder: 70.07 },
    { month: 'Sep', revenue: 42800, transactions: 612, avgOrder: 69.93 },
    { month: 'Oct', revenue: 48200, transactions: 698, avgOrder: 69.05 },
    { month: 'Nov', revenue: 52100, transactions: 748, avgOrder: 69.65 },
    { month: 'Dec', revenue: 68400, transactions: 962, avgOrder: 71.10 },
    { month: 'Jan', revenue: 41200, transactions: 584, avgOrder: 70.55 },
    { month: 'Feb', revenue: 47900, transactions: 682, avgOrder: 70.23 },
  ],
  'Last 3 Months': [
    { month: 'Oct', revenue: 48200, transactions: 698, avgOrder: 69.05 },
    { month: 'Nov', revenue: 52100, transactions: 748, avgOrder: 69.65 },
    { month: 'Dec', revenue: 68400, transactions: 962, avgOrder: 71.10 },
  ],
  'Last 6 Months': [
    { month: 'Sep', revenue: 42800, transactions: 612, avgOrder: 69.93 },
    { month: 'Oct', revenue: 48200, transactions: 698, avgOrder: 69.05 },
    { month: 'Nov', revenue: 52100, transactions: 748, avgOrder: 69.65 },
    { month: 'Dec', revenue: 68400, transactions: 962, avgOrder: 71.10 },
    { month: 'Jan', revenue: 41200, transactions: 584, avgOrder: 70.55 },
    { month: 'Feb', revenue: 47900, transactions: 682, avgOrder: 70.23 },
  ],
  'This Year': [
    { month: 'Jan', revenue: 41200, transactions: 584, avgOrder: 70.55 },
    { month: 'Feb', revenue: 47900, transactions: 682, avgOrder: 70.23 },
    { month: 'Mar', revenue: 31200, transactions: 441, avgOrder: 70.75 },
  ],
}

const WEEKLY_DATA = [
  { day: 'Mon', thisWeek: 3240, lastWeek: 2980 },
  { day: 'Tue', thisWeek: 4180, lastWeek: 3820 },
  { day: 'Wed', thisWeek: 3820, lastWeek: 4120 },
  { day: 'Thu', thisWeek: 5100, lastWeek: 4680 },
  { day: 'Fri', thisWeek: 7240, lastWeek: 6920 },
  { day: 'Sat', thisWeek: 8920, lastWeek: 8340 },
  { day: 'Sun', thisWeek: 6340, lastWeek: 5980 },
]

const CATEGORY_MIX = [
  { name: 'Entrees', value: 42, color: '#0A1638' },
  { name: 'Drinks', value: 28, color: '#00A3AD' },
  { name: 'Desserts', value: 15, color: '#1E3A6E' },
  { name: 'Salads', value: 10, color: '#00BFC9' },
  { name: 'Other', value: 5, color: '#D1DCE8' },
]

const TOP_ITEMS = [
  { rank: 1, name: 'House Burger', category: 'Entrees', units: 312, revenue: 4677.88, growth: '+14%', positive: true },
  { rank: 2, name: 'Craft Beer (IPA)', category: 'Drinks', units: 458, revenue: 3206.00, growth: '+22%', positive: true },
  { rank: 3, name: 'Margherita Pizza', category: 'Entrees', units: 264, revenue: 4356.00, growth: '+9%', positive: true },
  { rank: 4, name: 'House Wine (Red)', category: 'Drinks', units: 380, revenue: 3420.00, growth: '+18%', positive: true },
  { rank: 5, name: 'Caesar Salad', category: 'Salads', units: 196, revenue: 2254.00, growth: '-4%', positive: false },
  { rank: 6, name: 'Tiramisu', category: 'Desserts', units: 142, revenue: 1278.00, growth: '+31%', positive: true },
]

const PERIODS = ['This Month', 'Last Month', 'Last 3 Months', 'Last 6 Months', 'This Year']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-3 shadow-dropdown text-sm">
      <p className="font-600 text-elavon-navy mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="text-xs">
          {p.name}: <span className="font-600">${p.value?.toLocaleString()}</span>
        </p>
      ))}
    </div>
  )
}

function exportToCSV(data, filename) {
  if (!data || !data.length) return
  const headers = Object.keys(data[0]).join(',')
  const rows = data.map(row => Object.values(row).join(',')).join('\n')
  const csv = `${headers}\n${rows}`
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('This Month')
  const [activeTab, setActiveTab] = useState('overview')
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)

  const MONTHLY_REVENUE = ALL_MONTHLY_DATA[period] || ALL_MONTHLY_DATA['This Month']

  const currentRevenue = MONTHLY_REVENUE[MONTHLY_REVENUE.length - 1].revenue
  const prevRevenue = MONTHLY_REVENUE[MONTHLY_REVENUE.length - 2]?.revenue || currentRevenue
  const revenueGrowth = (((currentRevenue - prevRevenue) / prevRevenue) * 100).toFixed(1)

  const currentTransactions = MONTHLY_REVENUE[MONTHLY_REVENUE.length - 1].transactions
  const prevTransactions = MONTHLY_REVENUE[MONTHLY_REVENUE.length - 2]?.transactions || currentTransactions
  const txnGrowth = (((currentTransactions - prevTransactions) / prevTransactions) * 100).toFixed(1)

  function handleExport() {
    const exportData = activeTab === 'overview'
      ? MONTHLY_REVENUE.map(r => ({
          Month: r.month,
          Revenue: r.revenue,
          Transactions: r.transactions,
          'Avg Order Value': r.avgOrder,
        }))
      : activeTab === 'items'
      ? TOP_ITEMS.map(i => ({
          Rank: i.rank,
          Item: i.name,
          Category: i.category,
          'Units Sold': i.units,
          Revenue: i.revenue,
          'vs Last Month': i.growth,
        }))
      : MONTHLY_REVENUE.map(r => ({
          Month: r.month,
          Transactions: r.transactions,
        }))

    exportToCSV(exportData, `analytics-${activeTab}-${period.toLowerCase().replace(/\s+/g, '-')}.csv`)
    setExportSuccess(true)
    setTimeout(() => setExportSuccess(false), 2000)
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-700 text-elavon-navy">Analytics</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Business performance insights</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
              className="btn btn-secondary flex items-center gap-2"
            >
              <Calendar size={15} />
              {period}
              <ChevronDown size={13} className={`transition-transform ${showPeriodDropdown ? 'rotate-180' : ''}`} />
            </button>
            {showPeriodDropdown && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-neutral-200 rounded-xl shadow-dropdown z-20 overflow-hidden">
                {PERIODS.map(p => (
                  <button
                    key={p}
                    onClick={() => { setPeriod(p); setShowPeriodDropdown(false) }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-neutral-50 flex items-center justify-between transition-colors ${p === period ? 'text-elavon-teal font-600' : 'text-neutral-700'}`}
                  >
                    {p}
                    {p === period && <Check size={13} className="text-elavon-teal" />}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={handleExport}
            className={`btn flex items-center gap-2 transition-all ${exportSuccess ? 'btn-secondary text-success border-success' : 'btn-secondary'}`}
          >
            {exportSuccess ? <Check size={15} className="text-success" /> : <Download size={15} />}
            {exportSuccess ? 'Exported!' : 'Export Report'}
          </button>
        </div>
      </div>

      {showPeriodDropdown && (
        <div className="fixed inset-0 z-10" onClick={() => setShowPeriodDropdown(false)} />
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: `Revenue (${MONTHLY_REVENUE[MONTHLY_REVENUE.length - 1].month})`, value: `$${currentRevenue.toLocaleString()}`, change: `${revenueGrowth > 0 ? '+' : ''}${revenueGrowth}% vs prev`, positive: parseFloat(revenueGrowth) >= 0, icon: DollarSign, color: '#0A1638' },
          { label: 'Transactions', value: currentTransactions.toLocaleString(), change: `${txnGrowth > 0 ? '+' : ''}${txnGrowth}% vs prev`, positive: parseFloat(txnGrowth) >= 0, icon: ShoppingCart, color: '#00A3AD' },
          { label: 'Avg Order Value', value: `$${MONTHLY_REVENUE[MONTHLY_REVENUE.length - 1].avgOrder.toFixed(2)}`, change: '+0.7% vs prev', positive: true, icon: TrendingUp, color: '#1E3A6E' },
          { label: 'New Customers', value: '48', change: '+12% vs prev', positive: true, icon: Users, color: '#C06800' },
        ].map(m => (
          <div key={m.label} className="metric-card">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${m.color}15` }}>
                <m.icon size={20} style={{ color: m.color }} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-600 ${m.positive ? 'text-success' : 'text-danger'}`}>
                {m.positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {m.change}
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-700 text-money" style={{ color: 'var(--elavon-navy)' }}>{m.value}</div>
              <div className="text-xs font-500 text-neutral-400 uppercase tracking-wide mt-1">{m.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex border-b border-neutral-200 gap-1 overflow-x-auto">
        {['overview', 'items', 'customers'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-600 border-b-2 capitalize transition-colors whitespace-nowrap ${
              activeTab === tab
                ? 'border-elavon-teal text-elavon-teal'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-700 text-elavon-navy">Monthly Revenue Trend</h3>
              <span className="badge badge-teal">{MONTHLY_REVENUE.length} months</span>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={MONTHLY_REVENUE}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0A1638" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#0A1638" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#EBF0F7" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#7B9AB5' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={v => `$${(v/1000).toFixed(0)}k`} tick={{ fontSize: 12, fill: '#7B9AB5' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#0A1638" strokeWidth={2} fill="url(#revenueGrad)" name="Revenue" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="card p-5">
              <h3 className="font-700 text-elavon-navy mb-5">Week-over-Week Sales</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={WEEKLY_DATA} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EBF0F7" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#7B9AB5' }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={v => `$${(v/1000).toFixed(1)}k`} tick={{ fontSize: 12, fill: '#7B9AB5' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="thisWeek" fill="#0A1638" radius={[4, 4, 0, 0]} name="This Week" />
                  <Bar dataKey="lastWeek" fill="#D1DCE8" radius={[4, 4, 0, 0]} name="Last Week" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card p-5">
              <h3 className="font-700 text-elavon-navy mb-5">Revenue by Category</h3>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <ResponsiveContainer width={180} height={180}>
                  <PieChart>
                    <Pie data={CATEGORY_MIX} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" strokeWidth={0}>
                      {CATEGORY_MIX.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2.5 flex-1">
                  {CATEGORY_MIX.map(c => (
                    <div key={c.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                        <span className="text-sm text-neutral-600">{c.name}</span>
                      </div>
                      <span className="font-600 text-sm text-elavon-navy">{c.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'items' && (
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
            <h3 className="font-700 text-elavon-navy">Top Selling Items</h3>
            <span className="text-sm text-neutral-500">{period}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100">
                  {['#', 'Item', 'Category', 'Units Sold', 'Revenue', 'vs Last Month'].map(h => (
                    <th key={h} className={`px-5 py-3 text-xs font-600 text-neutral-400 uppercase tracking-wide ${h === 'Units Sold' || h === 'Revenue' ? 'text-right' : 'text-left'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {TOP_ITEMS.map(item => (
                  <tr key={item.rank} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="w-6 h-6 rounded-full bg-elavon-navy/10 flex items-center justify-center text-xs font-700 text-elavon-navy">{item.rank}</span>
                    </td>
                    <td className="px-5 py-3.5 font-600 text-sm text-elavon-navy">{item.name}</td>
                    <td className="px-5 py-3.5"><span className="badge badge-navy">{item.category}</span></td>
                    <td className="px-5 py-3.5 text-right font-600 text-sm text-neutral-700">{item.units}</td>
                    <td className="px-5 py-3.5 text-right font-700 text-sm text-elavon-navy">${item.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-5 py-3.5">
                      <span className={`flex items-center gap-1 text-xs font-600 ${item.positive ? 'text-success' : 'text-danger'}`}>
                        {item.positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {item.growth}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'customers' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="card p-5">
            <h3 className="font-700 text-elavon-navy mb-5">Customer Retention</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={MONTHLY_REVENUE}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EBF0F7" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#7B9AB5' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#7B9AB5' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="transactions" stroke="#00A3AD" strokeWidth={2.5} dot={false} name="Transactions" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="card p-5 space-y-4">
            <h3 className="font-700 text-elavon-navy">Customer Segments</h3>
            {[
              { label: 'New Customers', pct: 28, count: 124, color: '#00A3AD' },
              { label: 'Returning (2–5x)', pct: 42, count: 186, color: '#0A1638' },
              { label: 'Loyal (6–20x)', pct: 22, count: 97, color: '#1E3A6E' },
              { label: 'VIP (20x+)', pct: 8, count: 34, color: '#C06800' },
            ].map(seg => (
              <div key={seg.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-500 text-neutral-700">{seg.label}</span>
                  <span className="text-sm font-600 text-elavon-navy">{seg.count} · {seg.pct}%</span>
                </div>
                <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${seg.pct}%`, background: seg.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
