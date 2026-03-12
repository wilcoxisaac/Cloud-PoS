import React, { useState } from 'react'
import { usePOS } from '../context/POSContext'
import {
  UtensilsCrossed, Clock, Users, ChefHat, Plus,
  CheckCircle, AlertCircle, Timer, X, MoreHorizontal,
  Edit2, Trash2, Save
} from 'lucide-react'
import clsx from 'clsx'

const INITIAL_TABLES = [
  { id: 't01', name: 'T1', seats: 2, status: 'available', server: null, order: null, openedAt: null },
  { id: 't02', name: 'T2', seats: 2, status: 'available', server: null, order: null, openedAt: null },
  { id: 't03', name: 'T3', seats: 4, status: 'occupied', server: 'Alex', order: { items: ['House Burger', 'Caesar Salad', 'Craft Beer x2'], total: 46.50 }, openedAt: new Date(Date.now() - 25 * 60000) },
  { id: 't04', name: 'T4', seats: 4, status: 'reserved', server: null, order: null, openedAt: null, reservedFor: 'Johnson Party · 7:30PM' },
  { id: 't05', name: 'T5', seats: 6, status: 'occupied', server: 'Maria', order: { items: ['Margherita Pizza', 'Fish & Chips', 'House Wine x3'], total: 84.00 }, openedAt: new Date(Date.now() - 45 * 60000) },
  { id: 't06', name: 'T6', seats: 4, status: 'available', server: null, order: null, openedAt: null },
  { id: 't07', name: 'T7', seats: 8, status: 'occupied', server: 'James', order: { items: ['Group Special x8'], total: 240.00 }, openedAt: new Date(Date.now() - 72 * 60000) },
  { id: 't08', name: 'T8', seats: 2, status: 'cleaning', server: null, order: null, openedAt: null },
  { id: 't09', name: 'T9', seats: 4, status: 'occupied', server: 'Alex', order: { items: ['House Burger x2', 'Sparkling Water x2'], total: 37.00 }, openedAt: new Date(Date.now() - 12 * 60000) },
  { id: 't10', name: 'T10', seats: 6, status: 'reserved', server: null, order: null, openedAt: null, reservedFor: 'Chen Party · 8:00PM' },
  { id: 'bar1', name: 'Bar 1', seats: 1, status: 'occupied', server: 'Sam', order: { items: ['Craft Beer x2', 'Tiramisu'], total: 22.00 }, openedAt: new Date(Date.now() - 8 * 60000) },
  { id: 'bar2', name: 'Bar 2', seats: 1, status: 'available', server: null, order: null, openedAt: null },
]

const INITIAL_KDS_TICKETS = [
  { id: 'K001', table: 'T3', server: 'Alex', items: [{ name: 'House Burger', qty: 1, mods: ['Extra Cheese'] }, { name: 'Caesar Salad', qty: 1, mods: ['No Croutons'] }], status: 'new', time: new Date(Date.now() - 4 * 60000), course: 'Mains' },
  { id: 'K002', table: 'T5', server: 'Maria', items: [{ name: 'Fish & Chips', qty: 2, mods: [] }, { name: 'Margherita Pizza', qty: 1, mods: ['Thin Crust'] }], status: 'preparing', time: new Date(Date.now() - 12 * 60000), course: 'Mains' },
  { id: 'K003', table: 'T7', server: 'James', items: [{ name: 'Tiramisu', qty: 3, mods: [] }], status: 'ready', time: new Date(Date.now() - 6 * 60000), course: 'Desserts' },
  { id: 'K004', table: 'Bar 1', server: 'Sam', items: [{ name: 'Craft Beer', qty: 2, mods: [] }], status: 'new', time: new Date(Date.now() - 2 * 60000), course: 'Drinks' },
  { id: 'K005', table: 'T9', server: 'Alex', items: [{ name: 'House Burger', qty: 2, mods: ['Bacon'] }, { name: 'Sparkling Water', qty: 2, mods: [] }], status: 'preparing', time: new Date(Date.now() - 8 * 60000), course: 'Mains' },
]

const INITIAL_RESERVATIONS = [
  { id: 'res1', name: 'Johnson Party', size: 4, time: '7:30 PM', table: 'T4', status: 'confirmed', notes: 'Anniversary dinner' },
  { id: 'res2', name: 'Chen Party', size: 6, time: '8:00 PM', table: 'T10', status: 'confirmed', notes: 'Birthday celebration' },
  { id: 'res3', name: 'Williams', size: 2, time: '6:00 PM', table: 'T1', status: 'seated', notes: '' },
  { id: 'res4', name: 'Garcia Family', size: 5, time: '7:00 PM', table: 'T5', status: 'confirmed', notes: 'High chair needed' },
  { id: 'res5', name: 'Park Group', size: 8, time: '8:30 PM', table: 'T7', status: 'pending', notes: 'Large group, need to confirm' },
]

const SERVERS = ['Alex', 'Maria', 'James', 'Sam', 'Jordan']
const TIME_SLOTS = ['5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM']

function getElapsed(since) {
  if (!since) return null
  const mins = Math.floor((Date.now() - since) / 60000)
  return mins < 60 ? `${mins}m` : `${Math.floor(mins / 60)}h ${mins % 60}m`
}

function TableCell({ table, onClick }) {
  const elapsed = getElapsed(table.openedAt)
  const isLong = table.openedAt && (Date.now() - table.openedAt) > 60 * 60000

  const statusConfig = {
    available: { icon: CheckCircle },
    occupied: { icon: UtensilsCrossed },
    reserved: { icon: Clock },
    cleaning: { icon: AlertCircle },
  }
  const { icon: Icon } = statusConfig[table.status] || statusConfig.available

  return (
    <div className={clsx(
      table.status === 'occupied' ? 'table-occupied' : table.status === 'reserved' ? 'table-reserved' :
      table.status === 'cleaning' ? 'table-cleaning' : 'table-available',
      'table-cell p-3 cursor-pointer hover:opacity-85 transition-opacity min-w-20 min-h-20'
    )} onClick={() => onClick(table)}>
      <div className="font-700 text-sm">{table.name}</div>
      <Icon size={14} className="opacity-60" />
      <div className="text-xs opacity-75">{table.seats}p</div>
      {elapsed && <div className={clsx('text-xs font-600', isLong && 'text-danger')}>{elapsed}</div>}
      {table.status === 'reserved' && (
        <div className="text-xs opacity-60 text-center leading-tight">{table.reservedFor?.split('·')[0]}</div>
      )}
    </div>
  )
}

function KDSTicket({ ticket, onStatusChange }) {
  const elapsed = getElapsed(ticket.time)
  const mins = ticket.time ? Math.floor((Date.now() - ticket.time) / 60000) : 0
  const isUrgent = mins > 10

  return (
    <div className={clsx('kds-ticket', ticket.status === 'new' ? 'border-l-danger' : ticket.status === 'preparing' ? 'border-l-warning' : 'border-l-success')}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-700 text-sm" style={{ color: 'var(--elavon-navy)' }}>{ticket.table}</span>
          <span className={clsx('badge', ticket.status === 'new' ? 'badge-danger' : ticket.status === 'preparing' ? 'badge-warning' : 'badge-success')}>
            {ticket.status}
          </span>
          <span className="badge-navy text-xs">{ticket.course}</span>
        </div>
        <span className={clsx('text-xs font-600', isUrgent ? 'text-danger' : 'text-neutral-500')}>
          <Timer size={11} className="inline mr-0.5" />{elapsed}
        </span>
      </div>
      <div className="space-y-2 mb-3">
        {ticket.items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-sm font-700 text-elavon-navy min-w-5">{item.qty}x</span>
            <div>
              <div className="text-sm font-600 text-neutral-800">{item.name}</div>
              {item.mods.map((m, mi) => <div key={mi} className="text-xs text-neutral-400">• {m}</div>)}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        {ticket.status === 'new' && (
          <button onClick={() => onStatusChange(ticket.id, 'preparing')} className="btn-teal btn-sm flex-1 justify-center">
            <ChefHat size={13} /> Start
          </button>
        )}
        {ticket.status === 'preparing' && (
          <button onClick={() => onStatusChange(ticket.id, 'ready')} className="btn-sm flex-1 justify-center" style={{ background: '#00875A', color: 'white' }}>
            <CheckCircle size={13} /> Ready
          </button>
        )}
        {ticket.status === 'ready' && (
          <button onClick={() => onStatusChange(ticket.id, 'served')} className="btn-sm flex-1 justify-center bg-neutral-100 text-neutral-600">
            Served
          </button>
        )}
        <div className="text-xs text-neutral-400 flex items-center">{ticket.server}</div>
      </div>
    </div>
  )
}

function AddTableModal({ onSave, onClose }) {
  const [form, setForm] = useState({ name: '', seats: 4 })
  function handleSubmit(e) {
    e.preventDefault()
    onSave({
      id: `t${Date.now()}`,
      name: form.name,
      seats: parseInt(form.seats) || 4,
      status: 'available',
      server: null,
      order: null,
      openedAt: null,
    })
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-modal p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-700 text-elavon-navy">Add New Table</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-neutral-100"><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-600 text-neutral-500 uppercase tracking-wide">Table Name *</label>
            <input required className="input w-full" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. T11, Patio 1, Bar 3" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-600 text-neutral-500 uppercase tracking-wide">Seats</label>
            <input type="number" min="1" max="20" className="input w-full" value={form.seats} onChange={e => setForm(f => ({ ...f, seats: e.target.value }))} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn btn-teal flex-1">Add Table</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function OpenTableModal({ table, onOpen, onClose }) {
  const [server, setServer] = useState(SERVERS[0])
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-modal p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-700 text-elavon-navy">Open {table.name}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-neutral-100"><X size={16} /></button>
        </div>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-600 text-neutral-500 uppercase tracking-wide">Assign Server</label>
            <select className="input w-full" value={server} onChange={e => setServer(e.target.value)}>
              {SERVERS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <p className="text-sm text-neutral-500">{table.seats}-seat table will be marked as occupied.</p>
          <div className="flex gap-3">
            <button onClick={onClose} className="btn btn-secondary flex-1">Cancel</button>
            <button onClick={() => onOpen(table, server)} className="btn btn-teal flex-1">Open Table</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ReservationModal({ reservation, onSave, onClose, tables }) {
  const [form, setForm] = useState(reservation || {
    name: '', size: 2, time: '7:00 PM', table: '', status: 'pending', notes: ''
  })
  function handleSubmit(e) {
    e.preventDefault()
    onSave({ ...form, id: reservation?.id || `res${Date.now()}`, size: parseInt(form.size) || 2 })
  }
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-modal overflow-hidden animate-fade-in">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <h2 className="font-700 text-elavon-navy">{reservation ? 'Edit Reservation' : 'New Reservation'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-neutral-100"><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 col-span-2">
              <label className="text-xs font-600 text-neutral-500 uppercase tracking-wide">Guest Name *</label>
              <input required className="input w-full" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Party name" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-600 text-neutral-500 uppercase tracking-wide">Party Size</label>
              <input type="number" min="1" max="20" className="input w-full" value={form.size} onChange={e => setForm(f => ({ ...f, size: e.target.value }))} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-600 text-neutral-500 uppercase tracking-wide">Time</label>
              <select className="input w-full" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))}>
                {TIME_SLOTS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-600 text-neutral-500 uppercase tracking-wide">Table</label>
              <select className="input w-full" value={form.table} onChange={e => setForm(f => ({ ...f, table: e.target.value }))}>
                <option value="">— Select —</option>
                {tables.filter(t => t.status === 'available' || t.status === 'reserved').map(t => (
                  <option key={t.id} value={t.name}>{t.name} ({t.seats}p)</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-600 text-neutral-500 uppercase tracking-wide">Status</label>
              <select className="input w-full" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="seated">Seated</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="space-y-1 col-span-2">
              <label className="text-xs font-600 text-neutral-500 uppercase tracking-wide">Notes</label>
              <input className="input w-full" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Special requests, dietary needs…" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn btn-teal flex-1 flex items-center justify-center gap-2">
              <Save size={15} /> {reservation ? 'Save Changes' : 'Book Reservation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function ProcessPaymentModal({ table, onComplete, onClose }) {
  const [processing, setProcessing] = useState(false)
  const [done, setDone] = useState(false)

  async function handleProcess() {
    setProcessing(true)
    await new Promise(r => setTimeout(r, 1800))
    setProcessing(false)
    setDone(true)
  }

  if (done) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="fixed inset-0 bg-black/40" onClick={onClose} />
        <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-modal p-8 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-success-light flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-success" />
          </div>
          <h3 className="font-700 text-elavon-navy mb-2">Payment Complete!</h3>
          <p className="text-neutral-500 text-sm mb-1">${table.order.total.toFixed(2)} charged for {table.name}</p>
          <button onClick={() => onComplete(table)} className="btn btn-teal w-full mt-4">Close Table</button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-modal p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-700 text-elavon-navy">Process Payment · {table.name}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-neutral-100"><X size={16} /></button>
        </div>
        <div className="space-y-3 mb-5">
          {table.order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-neutral-600">{item}</span>
            </div>
          ))}
          <div className="flex justify-between font-700 text-elavon-navy pt-2 border-t border-neutral-100">
            <span>Total</span>
            <span>${table.order.total.toFixed(2)}</span>
          </div>
        </div>
        <button onClick={handleProcess} disabled={processing} className="btn btn-teal w-full flex items-center justify-center gap-2">
          {processing ? <><div className="spinner w-4 h-4" /> Processing…</> : `Charge $${table.order.total.toFixed(2)}`}
        </button>
      </div>
    </div>
  )
}

export default function RestaurantPage() {
  const [tables, setTables] = useState(INITIAL_TABLES)
  const [kdsTickets, setKdsTickets] = useState(INITIAL_KDS_TICKETS)
  const [reservations, setReservations] = useState(INITIAL_RESERVATIONS)
  const [selectedTable, setSelectedTable] = useState(null)
  const [activeTab, setActiveTab] = useState('floor')
  const [showAddTable, setShowAddTable] = useState(false)
  const [showOpenTable, setShowOpenTable] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [showReservationModal, setShowReservationModal] = useState(false)
  const [editingReservation, setEditingReservation] = useState(null)
  const [reservationAction, setReservationAction] = useState(null)

  const stats = {
    occupied: tables.filter(t => t.status === 'occupied').length,
    available: tables.filter(t => t.status === 'available').length,
    reserved: tables.filter(t => t.status === 'reserved').length,
    pending: kdsTickets.filter(t => t.status !== 'ready').length,
  }

  function handleKDSStatus(ticketId, newStatus) {
    setKdsTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: newStatus } : t))
  }

  function handleTableClick(table) {
    setSelectedTable(table)
  }

  function handleAddTable(table) {
    setTables(prev => [...prev, table])
    setShowAddTable(false)
  }

  function handleOpenTable(table, server) {
    setTables(prev => prev.map(t => t.id === table.id ? {
      ...t, status: 'occupied', server,
      order: { items: [], total: 0 },
      openedAt: new Date(),
    } : t))
    setSelectedTable(null)
    setShowOpenTable(false)
  }

  function handleCloseTable(table) {
    setTables(prev => prev.map(t => t.id === table.id ? {
      ...t, status: 'cleaning', server: null, order: null, openedAt: null
    } : t))
    setSelectedTable(null)
    setShowPayment(false)
  }

  function handleSaveReservation(res) {
    setReservations(prev => {
      const exists = prev.find(r => r.id === res.id)
      if (exists) return prev.map(r => r.id === res.id ? res : r)
      return [...prev, res]
    })
    setShowReservationModal(false)
    setEditingReservation(null)
  }

  function handleReservationAction(res) {
    // Cycle status: pending -> confirmed -> seated -> cancelled
    const next = { pending: 'confirmed', confirmed: 'seated', seated: 'cancelled', cancelled: 'pending' }
    setReservations(prev => prev.map(r => r.id === res.id ? { ...r, status: next[r.status] || 'pending' } : r))
  }

  function handleDeleteReservation(res) {
    setReservations(prev => prev.filter(r => r.id !== res.id))
  }

  return (
    <div className="flex h-full flex-col">
      <div className="bg-white border-b border-neutral-100 px-4 sm:px-6 py-3 flex flex-wrap items-center gap-3 sm:gap-6">
        {[
          { label: 'Tables Occupied', value: `${stats.occupied}/${tables.length}`, color: '#00A3AD' },
          { label: 'Available', value: stats.available, color: '#00875A' },
          { label: 'Reserved', value: stats.reserved, color: '#FF8B00' },
          { label: 'Kitchen Queue', value: stats.pending, color: '#DE350B' },
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
            <span className="text-xs text-neutral-500 font-500">{s.label}:</span>
            <span className="text-sm font-700" style={{ color: 'var(--elavon-navy)' }}>{s.value}</span>
          </div>
        ))}
        <div className="ml-auto hidden sm:flex items-center gap-2">
          <span className="text-xs text-neutral-400">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      <div className="tab-bar bg-white px-6">
        {[
          { id: 'floor', label: 'Floor Plan' },
          { id: 'kds', label: `Kitchen Display (${kdsTickets.filter(t => t.status !== 'served').length})` },
          { id: 'reservations', label: 'Reservations' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={clsx('tab-item', activeTab === tab.id && 'active')}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {activeTab === 'floor' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-600 text-elavon-navy">Dining Room Floor Plan</h3>
              <button onClick={() => setShowAddTable(true)} className="btn-secondary btn-sm flex items-center gap-1">
                <Plus size={13} /> Add Table
              </button>
            </div>
            <div className="flex flex-wrap gap-4 mb-5">
              {[
                { color: 'bg-success border-success', label: 'Available' },
                { color: 'bg-elavon-teal/10 border-elavon-teal', label: 'Occupied' },
                { color: 'bg-warning-light border-warning', label: 'Reserved' },
                { color: 'bg-neutral-100 border-neutral-300', label: 'Cleaning' },
              ].map((l, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className={`w-3 h-3 rounded border ${l.color}`} />
                  <span className="text-xs text-neutral-500 font-500">{l.label}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
              {tables.map(table => (
                <TableCell key={table.id} table={table} onClick={handleTableClick} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'kds' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-600 text-elavon-navy">Kitchen Display System</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse-soft" />
                <span className="text-xs text-neutral-500 font-500">Live Updates</span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {kdsTickets.filter(t => t.status !== 'served').map(ticket => (
                <KDSTicket key={ticket.id} ticket={ticket} onStatusChange={handleKDSStatus} />
              ))}
              {kdsTickets.filter(t => t.status !== 'served').length === 0 && (
                <div className="col-span-full text-center py-16 text-neutral-400">
                  <ChefHat size={40} strokeWidth={1} className="mx-auto mb-3" />
                  <p className="font-500">Kitchen queue is clear</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'reservations' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-600 text-elavon-navy">Today's Reservations</h3>
              <button onClick={() => { setEditingReservation(null); setShowReservationModal(true) }} className="btn-teal btn-sm flex items-center gap-1">
                <Plus size={13} /> New Reservation
              </button>
            </div>
            <div className="card overflow-hidden overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Guest Name</th>
                    <th>Party Size</th>
                    <th>Time</th>
                    <th>Table</th>
                    <th>Status</th>
                    <th>Notes</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map(r => (
                    <tr key={r.id}>
                      <td><span className="font-600 text-neutral-800">{r.name}</span></td>
                      <td><span className="flex items-center gap-1"><Users size={13} className="text-neutral-400" /> {r.size}</span></td>
                      <td className="font-500">{r.time}</td>
                      <td><span className="badge-navy">{r.table || '—'}</span></td>
                      <td>
                        <button onClick={() => handleReservationAction(r)}
                          className={clsx('badge cursor-pointer hover:opacity-80 transition-opacity',
                            r.status === 'confirmed' ? 'badge-info' :
                            r.status === 'seated' ? 'badge-success' :
                            r.status === 'cancelled' ? 'bg-neutral-100 text-neutral-500' : 'badge-warning')}>
                          {r.status}
                        </button>
                      </td>
                      <td className="text-neutral-400 text-xs">{r.notes || '—'}</td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button onClick={() => { setEditingReservation(r); setShowReservationModal(true) }}
                            className="p-1 hover:bg-neutral-100 rounded-lg">
                            <Edit2 size={13} className="text-neutral-400" />
                          </button>
                          <button onClick={() => handleDeleteReservation(r)}
                            className="p-1 hover:bg-danger-light rounded-lg">
                            <Trash2 size={13} className="text-neutral-400 hover:text-danger" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {selectedTable && (
        <div className="fixed right-0 top-16 h-full w-full sm:w-80 bg-white border-l border-neutral-200 shadow-modal z-40 p-5 overflow-y-auto animate-slide-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-700" style={{ color: 'var(--elavon-navy)' }}>{selectedTable.name} Details</h3>
            <button onClick={() => setSelectedTable(null)} className="p-1.5 rounded-lg hover:bg-neutral-100">
              <X size={16} className="text-neutral-400" />
            </button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="stat-card">
                <div className="stat-label">Status</div>
                <div className="capitalize font-600 text-sm mt-1">{selectedTable.status}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Seats</div>
                <div className="font-600 text-sm mt-1">{selectedTable.seats} guests</div>
              </div>
            </div>
            {selectedTable.status === 'occupied' && selectedTable.order && (
              <>
                <div className="divider" />
                <div>
                  <div className="text-xs font-600 text-neutral-400 uppercase tracking-wide mb-2">Current Order</div>
                  {selectedTable.order.items.length > 0 ? selectedTable.order.items.map((item, i) => (
                    <div key={i} className="flex justify-between py-1.5 border-b border-neutral-50 text-sm">
                      <span className="text-neutral-700">{item}</span>
                    </div>
                  )) : <p className="text-sm text-neutral-400 italic">No items added yet</p>}
                  {selectedTable.order.total > 0 && (
                    <div className="flex justify-between pt-2 font-700 text-elavon-navy">
                      <span>Total</span>
                      <span className="text-money">${selectedTable.order.total.toFixed(2)}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  {selectedTable.order.total > 0 && (
                    <button onClick={() => setShowPayment(true)} className="btn-primary w-full justify-center">
                      Process Payment
                    </button>
                  )}
                  <button onClick={() => {
                    setTables(prev => prev.map(t => t.id === selectedTable.id ? { ...t, status: 'cleaning', server: null, order: null, openedAt: null } : t))
                    setSelectedTable(null)
                  }} className="btn-secondary w-full justify-center text-sm">
                    Mark as Cleaning
                  </button>
                </div>
              </>
            )}
            {selectedTable.status === 'available' && (
              <button onClick={() => setShowOpenTable(true)} className="btn-teal w-full justify-center">
                <Plus size={15} /> Open Table
              </button>
            )}
            {selectedTable.status === 'cleaning' && (
              <button onClick={() => {
                setTables(prev => prev.map(t => t.id === selectedTable.id ? { ...t, status: 'available' } : t))
                setSelectedTable(null)
              }} className="btn-secondary w-full justify-center">
                Mark as Available
              </button>
            )}
            {selectedTable.status === 'reserved' && (
              <div className="space-y-3">
                <div className="p-3 bg-warning-light rounded-xl">
                  <div className="text-xs font-600 text-warning-dark mb-1">Reserved For</div>
                  <div className="text-sm font-600 text-neutral-700">{selectedTable.reservedFor}</div>
                </div>
                <button onClick={() => setShowOpenTable(true)} className="btn-teal w-full justify-center">
                  Seat Party
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showAddTable && <AddTableModal onSave={handleAddTable} onClose={() => setShowAddTable(false)} />}
      {showOpenTable && selectedTable && (
        <OpenTableModal table={selectedTable} onOpen={handleOpenTable} onClose={() => setShowOpenTable(false)} />
      )}
      {showPayment && selectedTable && selectedTable.order?.total > 0 && (
        <ProcessPaymentModal table={selectedTable} onComplete={handleCloseTable} onClose={() => setShowPayment(false)} />
      )}
      {showReservationModal && (
        <ReservationModal
          reservation={editingReservation}
          onSave={handleSaveReservation}
          onClose={() => { setShowReservationModal(false); setEditingReservation(null) }}
          tables={tables}
        />
      )}
    </div>
  )
}
