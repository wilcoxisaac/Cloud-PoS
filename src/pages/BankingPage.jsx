import React, { useState } from 'react'
import {
  Landmark, DollarSign, TrendingUp, TrendingDown, ArrowUpRight,
  ArrowDownLeft, RefreshCw, Download, Shield, CreditCard,
  CheckCircle, Clock, AlertCircle, Building, Lock, ChevronRight
} from 'lucide-react'
import { useApp } from '../context/AppContext'

const TRANSACTIONS = [
  { id: 'TXN-20260310-001', type: 'deposit', description: 'Daily Settlement – Elavon', amount: 4821.50, date: '2026-03-10', status: 'completed', method: 'ACH' },
  { id: 'TXN-20260309-001', type: 'deposit', description: 'Daily Settlement – Elavon', amount: 5234.75, date: '2026-03-09', status: 'completed', method: 'ACH' },
  { id: 'TXN-20260309-002', type: 'withdrawal', description: 'Payroll Direct Deposit', amount: 3420.00, date: '2026-03-09', status: 'completed', method: 'ACH' },
  { id: 'TXN-20260308-001', type: 'deposit', description: 'Daily Settlement – Elavon', amount: 6128.25, date: '2026-03-08', status: 'completed', method: 'ACH' },
  { id: 'TXN-20260308-002', type: 'withdrawal', description: 'Food Vendor – Metro Meats', amount: 842.50, date: '2026-03-08', status: 'completed', method: 'Wire' },
  { id: 'TXN-20260307-001', type: 'deposit', description: 'Daily Settlement – Elavon', amount: 4380.00, date: '2026-03-07', status: 'completed', method: 'ACH' },
  { id: 'TXN-20260307-002', type: 'withdrawal', description: 'Utilities – Xcel Energy', amount: 284.00, date: '2026-03-07', status: 'pending', method: 'ACH' },
  { id: 'TXN-20260306-001', type: 'deposit', description: 'Daily Settlement – Elavon', amount: 3892.00, date: '2026-03-06', status: 'completed', method: 'ACH' },
  { id: 'TXN-20260306-002', type: 'withdrawal', description: 'Beverage Supplier – Valley Wines', amount: 1240.00, date: '2026-03-06', status: 'completed', method: 'Check' },
  { id: 'TXN-20260305-001', type: 'deposit', description: 'Daily Settlement – Elavon', amount: 7214.50, date: '2026-03-05', status: 'completed', method: 'ACH' },
]

const SETTLEMENT_BATCHES = [
  { date: '2026-03-10', transactions: 68, gross: 4971.00, fees: 149.50, net: 4821.50, status: 'settled' },
  { date: '2026-03-09', transactions: 74, gross: 5402.25, fees: 167.50, net: 5234.75, status: 'settled' },
  { date: '2026-03-08', transactions: 86, gross: 6318.75, fees: 190.50, net: 6128.25, status: 'settled' },
  { date: '2026-03-07', transactions: 62, gross: 4524.00, fees: 144.00, net: 4380.00, status: 'settled' },
  { date: '2026-03-10', transactions: 12, gross: 892.00, fees: 26.50, net: 865.50, status: 'pending' },
]

export default function BankingPage() {
  const { business } = useApp()
  const [activeTab, setActiveTab] = useState('overview')
  const usbank = business.usbank

  const totalDeposits = TRANSACTIONS.filter(t => t.type === 'deposit' && t.status === 'completed').reduce((s, t) => s + t.amount, 0)
  const totalWithdrawals = TRANSACTIONS.filter(t => t.type === 'withdrawal' && t.status === 'completed').reduce((s, t) => s + t.amount, 0)
  const pendingAmount = TRANSACTIONS.filter(t => t.status === 'pending').reduce((s, t) => s + t.amount, 0)

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-700 text-elavon-navy">Banking</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Powered by US Bank · Integrated Elavon settlements</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-secondary flex items-center gap-2">
            <RefreshCw size={15} />
            Sync
          </button>
          <button className="btn btn-secondary flex items-center gap-2">
            <Download size={15} />
            Export
          </button>
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #060E24 0%, #0A1638 50%, #142252 100%)' }}>
        <div className="p-4 sm:p-6">
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Building size={16} className="text-white/60" />
                <span className="text-white/60 text-sm font-500">US Bank Business Checking</span>
              </div>
              <div className="text-white/90 text-sm">{usbank.account_name}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse-soft" />
              <span className="text-white/70 text-xs font-500">Connected</span>
            </div>
          </div>
          <div className="mb-6">
            <div className="text-white/50 text-xs uppercase tracking-widest mb-1">Available Balance</div>
            <div className="text-white text-3xl sm:text-4xl font-700 tracking-tight">
              ${usbank.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            {usbank.pending > 0 && (
              <div className="text-white/50 text-sm mt-1">
                + ${usbank.pending.toLocaleString('en-US', { minimumFractionDigits: 2 })} pending
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="text-white/40 text-xs uppercase tracking-wide mb-0.5">Account</div>
              <div className="text-white/80 text-sm font-600 font-mono">{usbank.account_number}</div>
            </div>
            <div>
              <div className="text-white/40 text-xs uppercase tracking-wide mb-0.5">Routing</div>
              <div className="text-white/80 text-sm font-600 font-mono">{usbank.routing_number}</div>
            </div>
            <div className="flex items-center gap-1 bg-white/10 rounded-lg px-3 py-1.5">
              <Lock size={12} className="text-white/60" />
              <span className="text-white/60 text-xs font-500">Secured</span>
            </div>
          </div>
        </div>
        <div className="px-4 sm:px-6 py-3 bg-white/5 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-usbank-gold" />
            <span className="text-white/60 text-xs">US Bank FDIC Insured · Elavon Merchant #{business.elavon.merchant_id}</span>
          </div>
          <CreditCard size={20} className="text-white/30" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Deposits (7d)', value: `$${totalDeposits.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: ArrowDownLeft, color: '#00875A', bg: '#E8F8F0' },
          { label: 'Withdrawals (7d)', value: `$${totalWithdrawals.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: ArrowUpRight, color: '#DE350B', bg: '#FFECEB' },
          { label: 'Pending', value: `$${pendingAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: Clock, color: '#FF8B00', bg: '#FFF8E6' },
          { label: 'Elavon Fees (7d)', value: '$677.50', icon: CreditCard, color: '#0A1638', bg: '#0A163815' },
        ].map(m => (
          <div key={m.label} className="metric-card">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: m.bg }}>
              <m.icon size={20} style={{ color: m.color }} />
            </div>
            <div className="mt-4">
              <div className="text-xl font-700 text-money" style={{ color: 'var(--elavon-navy)' }}>{m.value}</div>
              <div className="text-xs font-500 text-neutral-400 uppercase tracking-wide mt-1">{m.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex border-b border-neutral-200 gap-1 overflow-x-auto">
        {[
          { key: 'overview', label: 'Transactions' },
          { key: 'settlements', label: 'Elavon Settlements' },
          { key: 'elavon', label: 'Elavon Account' },
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
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100">
                  {['Date', 'Description', 'Method', 'Amount', 'Status'].map(h => (
                    <th key={h} className={`px-5 py-3 text-xs font-600 text-neutral-400 uppercase tracking-wide ${h === 'Amount' ? 'text-right' : 'text-left'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {TRANSACTIONS.map(txn => (
                  <tr key={txn.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="text-sm text-neutral-600">{txn.date}</div>
                      <div className="text-xs text-neutral-400 font-mono">{txn.id}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${txn.type === 'deposit' ? 'bg-success-light' : 'bg-danger-light'}`}>
                          {txn.type === 'deposit'
                            ? <ArrowDownLeft size={14} className="text-success" />
                            : <ArrowUpRight size={14} className="text-danger" />}
                        </div>
                        <span className="font-500 text-sm text-neutral-700">{txn.description}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="badge badge-navy">{txn.method}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className={`font-700 text-sm ${txn.type === 'deposit' ? 'text-success' : 'text-danger'}`}>
                        {txn.type === 'deposit' ? '+' : '-'}${txn.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`badge flex items-center gap-1 w-fit ${
                        txn.status === 'completed' ? 'bg-success-light text-success' : 'bg-warning-light text-warning'
                      }`}>
                        {txn.status === 'completed' ? <CheckCircle size={10} /> : <Clock size={10} />}
                        {txn.status === 'completed' ? 'Settled' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'settlements' && (
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-neutral-100">
            <h3 className="font-700 text-elavon-navy">Elavon Daily Settlement Batches</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100">
                  {['Date', 'Transactions', 'Gross', 'Fees', 'Net Deposited', 'Status'].map(h => (
                    <th key={h} className={`px-5 py-3 text-xs font-600 text-neutral-400 uppercase tracking-wide ${['Transactions', 'Gross', 'Fees', 'Net Deposited'].includes(h) ? 'text-right' : 'text-left'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {SETTLEMENT_BATCHES.map((b, i) => (
                  <tr key={i} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-5 py-3.5 text-sm text-neutral-700 font-500">{b.date}</td>
                    <td className="px-5 py-3.5 text-right font-600 text-sm text-neutral-700">{b.transactions}</td>
                    <td className="px-5 py-3.5 text-right font-600 text-sm text-neutral-700">${b.gross.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-5 py-3.5 text-right text-sm text-danger font-500">-${b.fees.toFixed(2)}</td>
                    <td className="px-5 py-3.5 text-right font-700 text-sm text-success">${b.net.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="px-5 py-3.5">
                      <span className={`badge flex items-center gap-1 w-fit ${
                        b.status === 'settled' ? 'bg-success-light text-success' : 'bg-warning-light text-warning'
                      }`}>
                        {b.status === 'settled' ? <CheckCircle size={10} /> : <Clock size={10} />}
                        {b.status === 'settled' ? 'Settled' : 'Processing'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'elavon' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="card p-5 space-y-4">
            <h3 className="font-700 text-elavon-navy">Elavon Merchant Account</h3>
            <div className="space-y-3">
              {[
                { label: 'Merchant ID', value: business.elavon.merchant_id },
                { label: 'Terminal ID', value: business.elavon.terminal_id },
                { label: 'Mode', value: business.elavon.mode === 'test' ? 'Test / Sandbox' : 'Production' },
                { label: 'SSL Merchant ID', value: business.elavon.ssl_merchant_id },
              ].map(field => (
                <div key={field.label} className="flex items-center justify-between py-2.5 border-b border-neutral-50">
                  <span className="text-sm text-neutral-500">{field.label}</span>
                  <span className="font-600 text-sm text-elavon-navy font-mono">{field.value}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 p-3 bg-success-light rounded-xl">
              <CheckCircle size={16} className="text-success" />
              <span className="text-sm font-500 text-success">Elavon payment gateway connected</span>
            </div>
          </div>
          <div className="card p-5 space-y-4">
            <h3 className="font-700 text-elavon-navy">Fee Schedule</h3>
            <div className="space-y-2.5">
              {[
                { type: 'Credit Card (Visa/MC)', rate: '2.65%', per: '$0.10' },
                { type: 'Debit Card', rate: '1.50%', per: '$0.10' },
                { type: 'AMEX', rate: '3.10%', per: '$0.10' },
                { type: 'Contactless / NFC', rate: '2.65%', per: '$0.10' },
                { type: 'Monthly Service Fee', rate: '$25.00', per: 'flat' },
                { type: 'Chargeback Fee', rate: '$25.00', per: 'per dispute' },
              ].map(fee => (
                <div key={fee.type} className="flex items-center justify-between py-2 border-b border-neutral-50">
                  <span className="text-sm text-neutral-600">{fee.type}</span>
                  <div className="text-right">
                    <span className="font-700 text-sm text-elavon-navy">{fee.rate}</span>
                    <span className="text-xs text-neutral-400 ml-1">+ {fee.per}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
