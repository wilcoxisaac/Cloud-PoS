import React, { useState } from 'react'
import {
  Star, Gift, Award, TrendingUp, Users, DollarSign,
  Plus, Search, ChevronRight, Zap, Crown, Shield,
  Edit2, Trash2, CheckCircle, ArrowRight
} from 'lucide-react'

const TIERS = [
  { name: 'Bronze', icon: Shield, min: 0, max: 499, multiplier: 1, color: '#CD7F32', bg: '#FFF3E0', perks: ['1 point per $1 spent', 'Birthday reward', 'Member discounts'] },
  { name: 'Silver', icon: Star, min: 500, max: 999, multiplier: 1.5, color: '#7B9AB5', bg: '#F5F7FA', perks: ['1.5x points', 'Free dessert on visits', 'Priority seating'] },
  { name: 'Gold', icon: Award, min: 1000, max: 2499, multiplier: 2, color: '#C06800', bg: '#FFF8E6', perks: ['2x points', 'Monthly complimentary item', 'Exclusive events access'] },
  { name: 'Platinum', icon: Crown, min: 2500, max: Infinity, multiplier: 3, color: '#0A1638', bg: '#EBF0F7', perks: ['3x points', 'Personal concierge', 'All Gold perks + more'] },
]

const REWARDS = [
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

export default function LoyaltyPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [search, setSearch] = useState('')

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-700 text-elavon-navy">Loyalty & Rewards</h1>
          <p className="text-sm text-neutral-500 mt-0.5">{STATS.totalMembers} members · {STATS.activeThisMonth} active this month</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-secondary flex items-center gap-2">
            <Search size={15} />
            Look Up Member
          </button>
          <button className="btn btn-teal flex items-center gap-2">
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
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-600 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? 'border-elavon-teal text-elavon-teal'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
          >
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
                  <button className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400">
                    <Edit2 size={13} />
                  </button>
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
              <input
                type="text"
                placeholder="Search rewards…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input pl-9 w-full"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {REWARDS.filter(r => r.name.toLowerCase().includes(search.toLowerCase())).map(reward => (
              <div key={reward.id} className={`card p-4 space-y-3 ${!reward.active ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-elavon-teal/10 flex items-center justify-center">
                    <Gift size={18} className="text-elavon-teal-dark" />
                  </div>
                  <div className="flex items-center gap-2">
                    {!reward.active && <span className="badge bg-neutral-100 text-neutral-500">Inactive</span>}
                    <button className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400">
                      <Edit2 size={13} />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-danger-light text-neutral-400 hover:text-danger">
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
            <div className="card p-4 border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center gap-2 text-neutral-400 hover:border-elavon-teal hover:text-elavon-teal cursor-pointer transition-colors min-h-40">
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
    </div>
  )
}
