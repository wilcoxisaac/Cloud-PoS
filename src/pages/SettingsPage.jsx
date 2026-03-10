import React, { useState } from 'react'
import {
  Settings, Store, CreditCard, Users, Bell, Shield,
  Palette, Printer, Wifi, ChevronRight, CheckCircle,
  Save, Edit2, ToggleLeft as Toggle, Globe, DollarSign, Clock,
  Zap, Building, Phone, Mail, MapPin
} from 'lucide-react'
import { useApp } from '../context/AppContext'

const SECTIONS = [
  { key: 'business', label: 'Business Info', icon: Store },
  { key: 'payments', label: 'Payments & Elavon', icon: CreditCard },
  { key: 'tax', label: 'Tax & Receipts', icon: DollarSign },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'security', label: 'Security', icon: Shield },
  { key: 'display', label: 'Display', icon: Palette },
  { key: 'hardware', label: 'Hardware', icon: Printer },
]

function ToggleSwitch({ value, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-neutral-50 last:border-b-0">
      <div>
        <div className="text-sm font-500 text-neutral-700">{label}</div>
        {description && <div className="text-xs text-neutral-400 mt-0.5">{description}</div>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-10 h-5.5 rounded-full transition-colors flex-shrink-0 ${value ? 'bg-elavon-teal' : 'bg-neutral-200'}`}
        style={{ height: '22px', width: '40px' }}
      >
        <div className={`absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow-sm transition-transform ${value ? 'translate-x-[19px]' : 'translate-x-0.5'}`}
          style={{ width: '18px', height: '18px', transform: value ? 'translateX(19px)' : 'translateX(2px)' }}
        />
      </button>
    </div>
  )
}

function SettingsField({ label, value, type = 'text', onChange, helper }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-600 text-neutral-500 uppercase tracking-wide">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="input w-full"
      />
      {helper && <p className="text-xs text-neutral-400">{helper}</p>}
    </div>
  )
}

export default function SettingsPage() {
  const { business, setBusiness, businessType, setBusinessType, theme, setTheme } = useApp()
  const [activeSection, setActiveSection] = useState('business')
  const [notifications, setNotifications] = useState({
    lowStock: true,
    newOrder: true,
    settlement: true,
    loyaltyMilestone: false,
    staffClock: true,
    dailySummary: true,
  })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-700 text-elavon-navy">Settings</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Configure your Cloud POS system</p>
        </div>
        <button
          onClick={handleSave}
          className={`btn flex items-center gap-2 transition-all w-fit ${saved ? 'btn-secondary text-success border-success' : 'btn-teal'}`}
        >
          {saved ? <CheckCircle size={15} /> : <Save size={15} />}
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        <div className="sm:w-52 flex-shrink-0">
          <div className="card p-2 flex sm:flex-col gap-0.5 overflow-x-auto">
            {SECTIONS.map(sec => (
              <button
                key={sec.key}
                onClick={() => setActiveSection(sec.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-500 transition-colors whitespace-nowrap flex-shrink-0 ${
                  activeSection === sec.key
                    ? 'bg-elavon-navy text-white'
                    : 'text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <sec.icon size={15} />
                {sec.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 min-w-0 space-y-5">
          {activeSection === 'business' && (
            <div className="card p-5 space-y-5">
              <h3 className="font-700 text-elavon-navy border-b border-neutral-100 pb-3">Business Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SettingsField label="Business Name" value={business.name} onChange={v => setBusiness(b => ({ ...b, name: v }))} />
                <div className="space-y-1">
                  <label className="text-xs font-600 text-neutral-500 uppercase tracking-wide">Business Type</label>
                  <select
                    value={businessType}
                    onChange={e => setBusinessType(e.target.value)}
                    className="input w-full"
                  >
                    <option value="restaurant">Restaurant / Food Service</option>
                    <option value="retail">Retail</option>
                    <option value="services">Services / Appointments</option>
                  </select>
                </div>
                <SettingsField label="Phone" value={business.phone} onChange={v => setBusiness(b => ({ ...b, phone: v }))} />
                <SettingsField label="Tax Rate (%)" type="number" value={(business.tax_rate * 100).toFixed(3)} onChange={v => setBusiness(b => ({ ...b, tax_rate: parseFloat(v) / 100 }))} helper="e.g. 8.875 for Minneapolis, MN" />
                <div className="sm:col-span-2">
                  <SettingsField label="Address" value={business.address} onChange={v => setBusiness(b => ({ ...b, address: v }))} />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'payments' && (
            <div className="space-y-4">
              <div className="card p-5 space-y-4">
                <h3 className="font-700 text-elavon-navy border-b border-neutral-100 pb-3">Elavon Payment Gateway</h3>
                <div className="flex items-center gap-3 p-3 bg-success-light rounded-xl">
                  <CheckCircle size={16} className="text-success" />
                  <span className="text-sm font-500 text-success">Connected to Elavon · Terminal T001 Ready</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Merchant ID', value: business.elavon.merchant_id },
                    { label: 'Terminal ID', value: business.elavon.terminal_id },
                    { label: 'SSL Merchant ID', value: business.elavon.ssl_merchant_id },
                    { label: 'Mode', value: business.elavon.mode },
                  ].map(f => (
                    <div key={f.label} className="space-y-1">
                      <label className="text-xs font-600 text-neutral-500 uppercase tracking-wide">{f.label}</label>
                      <div className="input bg-neutral-50 text-neutral-500 font-mono text-sm cursor-not-allowed">{f.value}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card p-5">
                <h3 className="font-700 text-elavon-navy border-b border-neutral-100 pb-3 mb-4">Payment Methods</h3>
                <div className="space-y-0">
                  {[
                    { label: 'Accept Credit Cards', description: 'Visa, Mastercard, Discover', value: true },
                    { label: 'Accept AMEX', description: '3.10% processing fee', value: true },
                    { label: 'Accept Contactless / NFC', description: 'Apple Pay, Google Pay, tap-to-pay', value: true },
                    { label: 'Accept Cash', description: 'Manual cash drawer management', value: true },
                    { label: 'Allow Split Payments', description: 'Split a single order across multiple payment methods', value: false },
                    { label: 'Allow Refunds', description: 'Managers and above can process refunds', value: true },
                  ].map(item => (
                    <ToggleSwitch key={item.label} {...item} onChange={() => {}} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'tax' && (
            <div className="card p-5 space-y-5">
              <h3 className="font-700 text-elavon-navy border-b border-neutral-100 pb-3">Tax & Receipt Settings</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SettingsField label="Tax Rate (%)" type="number" value={(business.tax_rate * 100).toFixed(3)} onChange={v => setBusiness(b => ({ ...b, tax_rate: parseFloat(v) / 100 }))} helper="Minneapolis, MN: 8.875%" />
                <div className="space-y-1">
                  <label className="text-xs font-600 text-neutral-500 uppercase tracking-wide">Currency</label>
                  <select className="input w-full">
                    <option>USD — US Dollar</option>
                    <option>CAD — Canadian Dollar</option>
                    <option>EUR — Euro</option>
                  </select>
                </div>
              </div>
              <div>
                <h4 className="font-600 text-sm text-elavon-navy mb-3">Receipt Options</h4>
                <div className="space-y-0">
                  {[
                    { label: 'Print Receipt by Default', description: 'Auto-print after every transaction', value: false },
                    { label: 'Email Receipt Option', description: 'Offer digital receipt to customers', value: true },
                    { label: 'Show Tax Breakdown', description: 'Display itemized tax on receipt', value: true },
                    { label: 'Include Logo on Receipt', description: 'Print business logo at top', value: true },
                    { label: 'Show Loyalty Points', description: 'Display earned and total points', value: true },
                  ].map(item => (
                    <ToggleSwitch key={item.label} {...item} onChange={() => {}} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="card p-5 space-y-4">
              <h3 className="font-700 text-elavon-navy border-b border-neutral-100 pb-3">Notification Preferences</h3>
              <div className="space-y-0">
                {[
                  { key: 'lowStock', label: 'Low Inventory Alerts', description: 'Alert when items fall below minimum threshold' },
                  { key: 'newOrder', label: 'New Order Notifications', description: 'Notify kitchen display on new orders' },
                  { key: 'settlement', label: 'Settlement Notifications', description: 'Confirm daily Elavon deposits to US Bank' },
                  { key: 'loyaltyMilestone', label: 'Loyalty Milestones', description: 'Alert when customers reach new loyalty tiers' },
                  { key: 'staffClock', label: 'Staff Clock-In/Out', description: 'Notify manager when employees clock in or out' },
                  { key: 'dailySummary', label: 'Daily Summary Report', description: 'Send end-of-day sales summary at closing' },
                ].map(item => (
                  <ToggleSwitch
                    key={item.key}
                    label={item.label}
                    description={item.description}
                    value={notifications[item.key]}
                    onChange={v => setNotifications(n => ({ ...n, [item.key]: v }))}
                  />
                ))}
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="card p-5 space-y-5">
              <h3 className="font-700 text-elavon-navy border-b border-neutral-100 pb-3">Security Settings</h3>
              <div className="space-y-0">
                {[
                  { label: 'Require PIN for Refunds', description: 'Manager PIN required to process refunds', value: true },
                  { label: 'Require PIN for Discounts', description: 'Manager PIN required for discounts over 15%', value: true },
                  { label: 'Auto-Lock After Inactivity', description: 'Lock POS after 5 minutes of inactivity', value: false },
                  { label: 'Log All Transactions', description: 'Maintain full audit trail for compliance', value: true },
                  { label: 'Mask Card Numbers', description: 'Display only last 4 digits of card number', value: true },
                ].map(item => (
                  <ToggleSwitch key={item.label} {...item} onChange={() => {}} />
                ))}
              </div>
              <div className="p-4 bg-info-light rounded-xl border border-info/20">
                <div className="flex items-center gap-2 mb-1">
                  <Shield size={14} className="text-info" />
                  <span className="text-sm font-600 text-info">PCI DSS Compliance</span>
                </div>
                <p className="text-xs text-neutral-600">Your payment data is processed and secured by Elavon in compliance with PCI DSS Level 1 standards. No card data is stored on this device.</p>
              </div>
            </div>
          )}

          {activeSection === 'display' && (
            <div className="card p-5 space-y-5">
              <h3 className="font-700 text-elavon-navy border-b border-neutral-100 pb-3">Display & Appearance</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-600 text-neutral-500 uppercase tracking-wide block mb-2">Theme</label>
                  <div className="flex gap-3">
                    {['light', 'dark'].map(t => (
                      <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={`flex-1 py-3 rounded-xl border-2 font-500 text-sm capitalize transition-all ${
                          theme === t ? 'border-elavon-teal text-elavon-teal bg-elavon-teal/5' : 'border-neutral-200 text-neutral-500'
                        }`}
                      >
                        {t === 'light' ? '☀️ Light' : '🌙 Dark'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-0">
                {[
                  { label: 'Show Quick Actions Bar', description: 'Display shortcut buttons in POS header', value: true },
                  { label: 'Compact Table Layout', description: 'Show more items per page in lists', value: false },
                  { label: 'Animate Transitions', description: 'Enable smooth page transitions', value: true },
                  { label: 'High Contrast Mode', description: 'Increase contrast for accessibility', value: false },
                ].map(item => (
                  <ToggleSwitch key={item.label} {...item} onChange={() => {}} />
                ))}
              </div>
            </div>
          )}

          {activeSection === 'hardware' && (
            <div className="space-y-4">
              {[
                { title: 'Card Reader', status: 'connected', detail: 'Elavon iSC250 · Terminal T001', icon: CreditCard, color: 'success' },
                { title: 'Receipt Printer', status: 'connected', detail: 'Epson TM-T88VI · USB', icon: Printer, color: 'success' },
                { title: 'Cash Drawer', status: 'connected', detail: 'APG Vasario · Auto-open on cash sale', icon: DollarSign, color: 'success' },
                { title: 'Kitchen Display', status: 'disconnected', detail: 'Not configured', icon: Zap, color: 'warning' },
                { title: 'Barcode Scanner', status: 'disconnected', detail: 'Not configured', icon: Wifi, color: 'neutral' },
              ].map(device => (
                <div key={device.title} className="card p-4 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    device.color === 'success' ? 'bg-success-light' : device.color === 'warning' ? 'bg-warning-light' : 'bg-neutral-100'
                  }`}>
                    <device.icon size={18} className={
                      device.color === 'success' ? 'text-success' : device.color === 'warning' ? 'text-warning' : 'text-neutral-400'
                    } />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-600 text-sm text-elavon-navy">{device.title}</div>
                    <div className="text-xs text-neutral-400">{device.detail}</div>
                  </div>
                  <span className={`badge ${
                    device.status === 'connected' ? 'bg-success-light text-success' : 'bg-neutral-100 text-neutral-500'
                  }`}>
                    {device.status}
                  </span>
                  <ChevronRight size={16} className="text-neutral-300" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
