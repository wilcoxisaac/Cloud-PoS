import React, { useState } from 'react'
import {
  Star, Gift, Award, TrendingUp, Users, DollarSign,
  Plus, Search, ChevronRight, Zap, Crown, Shield,
  Edit2, Trash2, CheckCircle, ArrowRight, X, Save
} from 'lucide-react'

const TIERS = [
  { name: 'Bronze', icon: Shield, min: 0, max: 499, multiplier: 1, color: '#CD7F32', bg: '#FFF3E0', perks: ['1 point per $1 spent', 'Birthday reward', 'Member discounts'] },
  { name: 'Silver', icon: Star, min: 500, max: 999, multiplier: 1.5, color: '#7B9AB5', bg: '#F5F7FA', perks: ['1.5x points', 'Free dessert on visits', 'Priority seating'] },
  { name: 'Gold', icon: Award, min: 1000, max: 2499, multiplier: 2, color: '#C06800', bg: '#FFF8E6', perks: ['2x points', 'Monthly complimentary item', 'Exclusive events access'] },
  { name: 'Platinum', icon: Crown, min: 2500, max: Infinity, multiplier: 3, color: '#0A1638', bg: '#EBF0F7', perks: ['3x points', 'Personal concierge', 'All Gold perks + more'] },
]

const INITIAL_REWARDS = [
  { id: 'r1', name: 'Free Dessert', points: 250, category: 'Food', active: true, redeemed: 48 },
  { id: 'r2', name: '$5 Off Next Visit', points: 500, category: 'Discount', active: true, redeemed: 124 },
  { id: 'r3', name: 'Free Appetizer', points: 350, category: 'Food', active: true, redeemed: 67 },
  { id: 'r4', name: '$15 Off $50+', points: 1000, category: 'Discount', active: true, redeemed: 31 },
  { id: 'r5', name: 'Free Bottle of Wine', points: 1500, category: 'Beverage', active: true, redeemed: 19 },
  { id: 'r6', name: 'Private Dining Experience', points: 5000, category: 'Premium', active: false, redeemed: 3 },
]

const RECENT_ACTIVITY = [
  { customer: 'Aisha Thompson', action: 'Earned', points: 124, detail: 'Purchase – $41.50', time: '2 min ago', tier: 'platinum' },
  { customer: 'Emily Chen', action: 'Redeemed', points: 250, detail: 'Free Dessert', time: '18 min ago', tier: 'gold' },
  { customer: 'Rachel Torres', action: 'Earned', points: 87, detail: 'Purchase – $29.00', time: '34 min ago', tier: 'gold' },
  { customer: 'Sarah Johnson', action: 'Tier Up', points: 0, detail: 'Reached Platinum!', time: '1h ago', tier: 'platinum' },
  { customer: 'Marcus Williams', action: 'Earned', points: 196, detail: 'Purchase – $65.25', time: '2h ago', tier: 'silver' },
  { customer: 'David Park', action: 'Redeemed', points: 500, detail: '$5 Off Next Visit', time: '3h ago', tier: 'bronze' },
]

const TIER_CONFIG = {
  platinum: { color: '#0A1638', bg: 'bg-elavon-navy/10', text: 'text-elavon-navy' },
  gold: { color: '#C06800', bg: 'bg-warning-light', text: 'text-warning' },
  silver: { color: '#7B9AB5', bg: 'bg-neutral-100', text: 'text-neutral-600' },
  bronze: { color: '#CD7F32', bg: 'bg-orange-50', text: 'text-orange-600' },
}

const STATS = {
  totalMembers: 441,
  activeThisMonth: 186,
  pointsIssued: 128420,
  pointsRedeemed: 34200,
  redemptionRate: '26.6%',
  avgPointsBalance: 891,
}

const REWARD_CATEGORIES = ['Food', 'Discount', 'Beverage', 'Premium', 'Experience']

// Mock member database for lookup
const MOCK_MEMBERS = [
  { name: 'Emily Chen', phone: '(612) 555-0101', email: 'emily.chen@email.com', points: 1284, tier: 'gold', visits: 42 },
  { name: 'Marcus Williams', phone: '(651) 555-0182', email: 'marcus.w@email.com', points: 892, tier: 'silver', visits: 28 },
  { name: 'Sarah Johnson', phone: '(612) 555-0234', email: 'sarah.j@email.com', points: 2341, tier: 'platinum', visits: 67 },
  { name: 'David Park', phone: '(763) 555-0318', email: 'david.park@email.com', points: 348, tier: 'bronze', visits: 12 },
  { name: 'Rachel Torres', phone: '(612) 555-0445', email: 'r.torres@email.com', points: 1876, tier: 'gold', visits: 55 },
  { name: 'Aisha Thompson', phone: '(612) 555-0677', email: 'aisha.t@email.com', points: 3124, tier: 'platinum', visits: 91 },
]

function RewardModal({ reward, onSave, onClose }) {
  const [form, setForm] = useState(reward || {
    name: '', points: 500, category: 'Food', active: true,
  })

  function handleSubmit(e) {
    e.preventDefault()
    onSave({
      ...form,
      id: reward?.id || `r${Date.now()}`,
      points: parseInt(form.points) || 500,
      redeemed: reward?.redeemed || 0,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-modal overflow-hidden animate-fade-in">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <h2 className="font-700 text-elavon-navy">{reward ? 'Edit Reward' : 'Add New Reward'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-neutral-100"><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-600 text-neutral-500 uppercase tracking-wide">Reward Name *</label>
            <input required className="input w-full" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Free Dessert" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-600 text-neutral-500 uppercase tracking-wide">Points Required</label>
              <input type="number" min="1" required className="input w-full" value={form.points} onChange={e => setForm(f => ({ ...f, points: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-600 text-neutral-500 uppercase tracking-wide">Category</label>
              <select className="input w-full" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {REWARD_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} className="rounded" />
            <span className="text-sm font-500 text-neutral-700">Active (visible to customers)</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn btn-teal flex-1 flex items-center justify-center gap-2">
              <Save size={15} /> {reward ? 'Save Changes' : 'Add Reward'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function MemberLookupModal({ onClose }) {
  const [query, setQuery] = useState('')
  const results = MOCK_MEMBERS.filter(m =>
    m.name.toLowerCase().includes(query.toLowerCase()) ||
    m.phone.includes(query) ||
    m.email.toLowerCase().includes(query.toLowerCase())
  )
  const [selected, setSelected] = useState(null)

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-modal overflow-hidden animate-fade-in">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <h2 className="font-700 text-elavon-navy">Look Up Member</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-neutral-100"><X size={16} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              autoFocus
              className="input pl-9 w-full"
              value={query}
              onChange={e => { setQuery(e.target.value); setSelected(null) }}
              placeholder="Search by name, phone, or email…"
            />
          </div>
          {query && !selected && (
            <div className="border border-neutral-200 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
              {results.length === 0 ? (
                <div className="p-4 text-sm text-neutral-400 text-center">No members found</div>
              ) : results.map((m, i) => {
                const tc = TIER_CONFIG[m.tier]
                return (
                  <button key={i} onClick={() => setSelected(m)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 border-b border-neutral-50 last:border-0 transition-colors">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${tc.bg}`}>
                      <span className="text-sm font-700" style={{ color: tc.color }}>{m.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <div className="font-600 text-sm text-elavon-navy">{m.name}</div>
                      <div className="text-xs text-neutral-400">{m.phone}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-700 text-sm text-elavon-teal">{m.points.toLocaleString()} pts</div>
                      <div className={`text-xs font-500 ${tc.text}`}>{m.tier}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
          {selected && (
            <div className="border border-neutral-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${TIER_CONFIG[selected.tier].bg}`}>
                  <span className="text-lg font-700" style={{ color: TIER_CONFIG[selected.tier].color }}>{selected.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div>
                  <div className="font-700 text-elavon-navy">{selected.name}</div>
                  <div className="text-xs text-neutral-400">{selected.email}</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Points', value: selected.points.toLocaleString(), icon: Star, color: '#C06800' },
                  { label: 'Visits', value: selected.visits, icon: Users, color: '#0A1638' },
                  { label: 'Tier', value: selected.tier.charAt(0).toUpperCase() + selected.tier.slice(1), icon: Award, color: '#00A3AD' },
                ].map(s => (
                  <div key={s.label} className="bg-neutral-50 rounded-xl p-3 text-center">
                    <s.icon size={14} style={{ color: s.color }} className="mx-auto mb-1" />
                    <div className="font-700 text-sm text-elavon-navy">{s.value}</div>
                    <div className="text-xs text-neutral-400">{s.label}</div>
                  </div>
                ))}
              </div>
              <button onClick={() => setSelected(null)} className="btn btn-secondary w-full text-sm">Search Again</button>
            </div>
          )}
          <button onClick={onClose} className="btn btn-secondary w-full">Close</button>
        </div>
      </div>
    </div>
  )
}

function DeleteConfirm({ reward, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-modal p-6 text-center animate-fade-in">
        <div className="w-14 h-14 rounded-full bg-danger-light flex items-center justify-center mx-auto mb-4">
          <Trash2 size={22} className="text-danger" />
        </div>
        <h3 className="font-700 text-elavon-navy mb-2">Remove Reward?</h3>
        <p className="text-sm text-neutral-500 mb-6">Remove <span className="font-600 text-neutral-700">{reward.name}</span> from the catalog?</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn btn-secondary flex-1">Cancel</button>
          <button onClick={onConfirm} className="btn flex-1 bg-danger text-white hover:bg-danger/90">Remove</button>
        </div>
      </div>
    </div>
  )
}

export default function LoyaltyPage() {
  const [rewards, setRewards] = useState(INITIAL_REWARDS)
  const [activeTab, setActiveTab] = useState('overview')
  const [search, setSearch] = useState('')
  const [showRewardModal, setShowRewardModal] = useState(false)
  const [editingReward, setEditingReward] = useState(null)
  const [showLookup, setShowLookup] = useState(false)
  const [deleteReward, setDeleteReward] = useState(null)

  function handleSaveReward(r) {
    setRewards(prev => {
      const exists = prev.find(x => x.id === r.id)
      if (exists) return prev.map(x => x.id === r.id ? r : x)
      return [...prev, r]
    })
    setShowRewardModal(false)
    setEditingReward(null)
  }

  function handleEditReward(r) {
    setEditingReward(r)
    setShowRewardModal(true)
  }

  function handleDeleteReward() {
    setRewards(prev => prev.filter(r => r.id !== deleteReward.id))
    setDeleteReward(null)
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-700 text-elavon-navy">Loyalty & Rewards</h1>
          <p className="text-sm text-neutral-500 mt-0.5">{STATS.totalMembers} members · {STATS.activeThisMonth} active this month</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowLookup(true)} className="btn btn-secondary flex items-center gap-2">
            <Search size={15} />
            Look Up Member
          </button>
          <button onClick={() => { setEditingReward(null); setShowRewardModal(true) }} className="btn btn-teal flex items-center gap-2">
            <Plus size={15} />
            Add Reward
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Members', value: STATS.totalMembers, icon: Users, color: '#0A1638' },
          { label: 'Points Issued', value: STATS.pointsIssued.toLocaleString(), icon: Star, color: '#C06800' },
          { label: 'Redemption Rate', value: STATS.redemptionRate, icon: TrendingUp, color: '#00A3AD' },
          { label: 'Avg Points Balance', value: STATS.avgPointsBalance.toLocaleString(), icon: Award, color: '#1E3A6E' },
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

      <div className="flex border-b border-neutral-200 gap-1 overflow-x-auto">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'tiers', label: 'Tiers' },
          { key: 'rewards', label: 'Rewards Catalog' },
          { key: 'activity', label: 'Activity' },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-600 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.key ? 'border-elavon-teal text-elavon-teal' : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card p-5">
            <h3 className="font-700 text-elavon-navy mb-5">Member Distribution by Tier</h3>
            <div className="space-y-4">
              {[
                { tier: 'Platinum', count: 34, pct: 7.7, color: '#0A1638' },
                { tier: 'Gold', count: 97, pct: 22.0, color: '#C06800' },
                { tier: 'Silver', count: 142, pct: 32.2, color: '#7B9AB5' },
                { tier: 'Bronze', count: 168, pct: 38.1, color: '#CD7F32' },
              ].map(seg => (
                <div key={seg.tier}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: seg.color }} />
                      <span className="text-sm font-500 text-neutral-700">{seg.tier}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-700 text-sm text-elavon-navy">{seg.count} members</span>
                      <span className="text-xs text-neutral-400 ml-2">{seg.pct}%</span>
                    </div>
                  </div>
                  <div className="h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${seg.pct}%`, background: seg.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-700 text-elavon-navy mb-4">Live Activity</h3>
            <div className="space-y-3">
              {RECENT_ACTIVITY.slice(0, 5).map((ev, i) => {
                const tc = TIER_CONFIG[ev.tier]
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${tc.bg}`}>
                      <Star size={12} style={{ color: tc.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-600 text-xs text-elavon-navy truncate">{ev.customer}</div>
                      <div className={`text-xs ${ev.action === 'Earned' ? 'text-success' : ev.action === 'Tier Up' ? 'text-elavon-teal' : 'text-warning'}`}>
                        {ev.action === 'Earned' ? `+${ev.points} pts` : ev.action === 'Redeemed' ? `-${ev.points} pts` : '🎉 Tier Up!'}
                      </div>
                      <div className="text-xs text-neutral-400">{ev.detail}</div>
                    </div>
                    <span className="text-xs text-neutral-400 flex-shrink-0">{ev.time}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tiers' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TIERS.map(tier => {
            const TierIcon = tier.icon
            return (
              <div key={tier.name} className="card p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: tier.bg }}>
                    <TierIcon size={22} style={{ color: tier.color }} />
                  </div>
                </div>
                <div>
                  <h3 className="font-700 text-lg" style={{ color: tier.color }}>{tier.name}</h3>
                  <div className="text-xs text-neutral-400 mt-0.5">
                    {tier.min.toLocaleString()}–{tier.max === Infinity ? '∞' : tier.max.toLocaleString()} pts
                  </div>
                </div>
                <div className="bg-neutral-50 rounded-xl p-3">
                  <div className="text-xs font-600 text-neutral-400 uppercase tracking-wide mb-1">Points Multiplier</div>
                  <div className="text-2xl font-700" style={{ color: tier.color }}>{tier.multiplier}x</div>
                </div>
                <div className="space-y-1.5">
                  {tier.perks.map(p => (
                    <div key={p} className="flex items-start gap-2">
                      <CheckCircle size={12} className="mt-0.5 flex-shrink-0" style={{ color: tier.color }} />
                      <span className="text-xs text-neutral-600">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {activeTab === 'rewards' && (
        <div className="space-y-4">
          <div className="card p-4 flex items-center gap-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input type="text" placeholder="Search rewards…" value={search} onChange={e => setSearch(e.target.value)} className="input pl-9 w-full" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewards.filter(r => r.name.toLowerCase().includes(search.toLowerCase())).map(reward => (
              <div key={reward.id} className={`card p-4 space-y-3 ${!reward.active ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-elavon-teal/10 flex items-center justify-center">
                    <Gift size={18} className="text-elavon-teal-dark" />
                  </div>
                  <div className="flex items-center gap-2">
                    {!reward.active && <span className="badge bg-neutral-100 text-neutral-500">Inactive</span>}
                    <button onClick={() => handleEditReward(reward)} className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400">
                      <Edit2 size={13} />
                    </button>
                    <button onClick={() => setDeleteReward(reward)} className="p-1.5 rounded-lg hover:bg-danger-light text-neutral-400 hover:text-danger">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <div>
                  <div className="font-700 text-sm text-elavon-navy">{reward.name}</div>
                  <span className="badge badge-navy mt-1">{reward.category}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                  <div className="flex items-center gap-1 text-elavon-teal">
                    <Star size={12} fill="currentColor" />
                    <span className="font-700 text-sm">{reward.points.toLocaleString()} pts</span>
                  </div>
                  <span className="text-xs text-neutral-400">{reward.redeemed} redeemed</span>
                </div>
              </div>
            ))}
            <div
              onClick={() => { setEditingReward(null); setShowRewardModal(true) }}
              className="card p-4 border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center gap-2 text-neutral-400 hover:border-elavon-teal hover:text-elavon-teal cursor-pointer transition-colors min-h-40"
            >
              <Plus size={24} />
              <span className="text-sm font-500">Add New Reward</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
            <h3 className="font-700 text-elavon-navy">Recent Loyalty Activity</h3>
            <span className="text-sm text-neutral-400">Today</span>
          </div>
          <div className="divide-y divide-neutral-50">
            {RECENT_ACTIVITY.map((ev, i) => {
              const tc = TIER_CONFIG[ev.tier]
              return (
                <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-neutral-50/50 transition-colors">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${tc.bg}`}>
                    <span className="text-sm font-700" style={{ color: tc.color }}>
                      {ev.customer.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-600 text-sm text-elavon-navy">{ev.customer}</div>
                    <div className="text-xs text-neutral-500">{ev.detail}</div>
                  </div>
                  <div className="text-right">
                    <div className={`font-700 text-sm ${
                      ev.action === 'Earned' ? 'text-success' :
                      ev.action === 'Redeemed' ? 'text-warning' : 'text-elavon-teal'
                    }`}>
                      {ev.action === 'Earned' ? `+${ev.points}` : ev.action === 'Redeemed' ? `-${ev.points}` : '🎉'} pts
                    </div>
                    <div className="text-xs text-neutral-400">{ev.action}</div>
                  </div>
                  <span className="text-xs text-neutral-400 w-16 text-right hidden sm:block">{ev.time}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {showRewardModal && (
        <RewardModal
          reward={editingReward}
          onSave={handleSaveReward}
          onClose={() => { setShowRewardModal(false); setEditingReward(null) }}
        />
      )}
      {showLookup && <MemberLookupModal onClose={() => setShowLookup(false)} />}
      {deleteReward && <DeleteConfirm reward={deleteReward} onConfirm={handleDeleteReward} onClose={() => setDeleteReward(null)} />}
    </div>
  )
}
