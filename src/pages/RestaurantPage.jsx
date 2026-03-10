import React, { useState } from 'react'
import { usePOS } from '../context/POSContext'
import {
  UtensilsCrossed, Clock, Users, ChefHat, Plus,
  CheckCircle, AlertCircle, Timer, X, MoreHorizontal
} from 'lucide-react'
import clsx from 'clsx'

const INITIAL_TABLES = [
  { id: 't01', name: 'T1', seats: 2, status: 'available', server: null, order: null, openedAt: null, x: 0, y: 0 },
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

const KDS_TICKETS = [
  { id: 'K001', table: 'T3', server: 'Alex', items: [{ name: 'House Burger', qty: 1, mods: ['Extra Cheese'] }, { name: 'Caesar Salad', qty: 1, mods: ['No Croutons'] }], status: 'new', time: new Date(Date.now() - 4 * 60000), course: 'Mains' },
  { id: 'K002', table: 'T5', server: 'Maria', items: [{ name: 'Fish & Chips', qty: 2, mods: [] }, { name: 'Margherita Pizza', qty: 1, mods: ['Thin Crust'] }], status: 'preparing', time: new Date(Date.now() - 12 * 60000), course: 'Mains' },
  { id: 'K003', table: 'T7', server: 'James', items: [{ name: 'Tiramisu', qty: 3, mods: [] }], status: 'ready', time: new Date(Date.now() - 6 * 60000), course: 'Desserts' },
  { id: 'K004', table: 'Bar 1', server: 'Sam', items: [{ name: 'Craft Beer', qty: 2, mods: [] }], status: 'new', time: new Date(Date.now() - 2 * 60000), course: 'Drinks' },
  { id: 'K005', table: 'T9', server: 'Alex', items: [{ name: 'House Burger', qty: 2, mods: ['Bacon'] }, { name: 'Sparkling Water', qty: 2, mods: [] }], status: 'preparing', time: new Date(Date.now() - 8 * 60000), course: 'Mains' },
]

function getElapsed(since) {
  if (!since) return null
  const mins = Math.floor((Date.now() - since) / 60000)
  return mins < 60 ? `${mins}m` : `${Math.floor(mins / 60)}h ${mins % 60}m`
}

function TableCell({ table, onClick }) {
  const elapsed = getElapsed(table.openedAt)
  const isLong = table.openedAt && (Date.now() - table.openedAt) > 60 * 60000

  const statusConfig = {
    available: { cls: 'table-available', label: 'Open', icon: CheckCircle },
    occupied: { cls: 'table-occupied', label: 'Occupied', icon: UtensilsCrossed },
    reserved: { cls: 'table-reserved', label: 'Reserved', icon: Clock },
    cleaning: { cls: 'table-cleaning', label: 'Cleaning', icon: AlertCircle },
  }
  const { cls, label, icon: Icon } = statusConfig[table.status] || statusConfig.available

  return (
    <div className={clsx(table.status === 'occupied' ? 'table-occupied' : table.status === 'reserved' ? 'table-reserved' : table.status === 'cleaning' ? 'table-cleaning' : 'table-available', 'table-cell p-3 cursor-pointer hover:opacity-85 transition-opacity min-w-20 min-h-20')} onClick={() => onClick(table)}>
      <div className="font-700 text-sm">{table.name}</div>
      <Icon size={14} className="opacity-60" />
      <div className="text-xs opacity-75">{table.seats}p</div>
      {elapsed && (
        <div className={clsx('text-xs font-600', isLong && 'text-danger')}>{elapsed}</div>
      )}
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
    <div className={clsx(
      'kds-ticket',
      ticket.status === 'new' ? 'border-l-danger' : ticket.status === 'preparing' ? 'border-l-warning' : 'border-l-success'
    )}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="font-700 text-sm" style={{ color: 'var(--elavon-navy)' }}>{ticket.table}</span>
          <span className={clsx('badge', ticket.status === 'new' ? 'badge-danger' : ticket.status === 'preparing' ? 'badge-warning' : 'badge-success')}>
            {ticket.status}
          </span>
          <span className="badge-navy text-xs">{ticket.course}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={clsx('text-xs font-600', isUrgent ? 'text-danger' : 'text-neutral-500')}>
            <Timer size={11} className="inline mr-0.5" />{elapsed}
          </span>
        </div>
      </div>
      <div className="space-y-2 mb-3">
        {ticket.items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-sm font-700 text-elavon-navy min-w-5">{item.qty}x</span>
            <div>
              <div className="text-sm font-600 text-neutral-800">{item.name}</div>
              {item.mods.map((m, mi) => (
                <div key={mi} className="text-xs text-neutral-400">• {m}</div>
              ))}
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

export default function RestaurantPage() {
  const [tables, setTables] = useState(INITIAL_TABLES)
  const [kdsTickets, setKdsTickets] = useState(KDS_TICKETS)
  const [selectedTable, setSelectedTable] = useState(null)
  const [activeTab, setActiveTab] = useState('floor')

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

  return (
    <div className="flex h-full flex-col">
      {/* Stats Bar */}
      <div className="bg-white border-b border-neutral-100 px-6 py-3 flex items-center gap-6">
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
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-neutral-400">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      {/* Tabs */}
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

      <div className="flex-1 overflow-y-auto p-6">
        {/* Floor Plan */}
        {activeTab === 'floor' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-600 text-elavon-navy">Dining Room Floor Plan</h3>
              <button className="btn-secondary btn-sm">
                <Plus size={13} /> Add Table
              </button>
            </div>
            {/* Legend */}
            <div className="flex gap-4 mb-5">
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

        {/* KDS */}
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
            </div>
          </div>
        )}

        {/* Reservations */}
        {activeTab === 'reservations' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-600 text-elavon-navy">Today's Reservations</h3>
              <button className="btn-teal btn-sm"><Plus size={13} /> New Reservation</button>
            </div>
            <div className="card overflow-hidden">
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
                  {[
                    { name: 'Johnson Party', size: 4, time: '7:30 PM', table: 'T4', status: 'confirmed', notes: 'Anniversary dinner' },
                    { name: 'Chen Party', size: 6, time: '8:00 PM', table: 'T10', status: 'confirmed', notes: 'Birthday celebration' },
                    { name: 'Williams', size: 2, time: '6:00 PM', table: 'T1', status: 'seated', notes: '' },
                    { name: 'Garcia Family', size: 5, time: '7:00 PM', table: 'T5', status: 'confirmed', notes: 'High chair needed' },
                    { name: 'Park Group', size: 8, time: '8:30 PM', table: 'T7', status: 'pending', notes: 'Large group, need to confirm' },
                  ].map((r, i) => (
                    <tr key={i}>
                      <td><span className="font-600 text-neutral-800">{r.name}</span></td>
                      <td><span className="flex items-center gap-1"><Users size={13} className="text-neutral-400" /> {r.size}</span></td>
                      <td className="font-500">{r.time}</td>
                      <td><span className="badge-navy">{r.table}</span></td>
                      <td>
                        <span className={clsx('badge', r.status === 'confirmed' ? 'badge-info' : r.status === 'seated' ? 'badge-success' : 'badge-warning')}>
                          {r.status}
                        </span>
                      </td>
                      <td className="text-neutral-400 text-xs">{r.notes || '—'}</td>
                      <td>
                        <button className="p-1 hover:bg-neutral-100 rounded-lg"><MoreHorizontal size={14} className="text-neutral-400" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Table Detail Side Panel */}
      {selectedTable && (
        <div className="fixed right-0 top-16 h-full w-80 bg-white border-l border-neutral-200 shadow-modal z-40 p-5 overflow-y-auto animate-slide-in">
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
                  {selectedTable.order.items.map((item, i) => (
                    <div key={i} className="flex justify-between py-1.5 border-b border-neutral-50 text-sm">
                      <span className="text-neutral-700">{item}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2 font-700 text-elavon-navy">
                    <span>Total</span>
                    <span className="text-money">${selectedTable.order.total.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="btn-teal w-full justify-center">
                    <Plus size={15} /> Add Items
                  </button>
                  <button className="btn-primary w-full justify-center">
                    Process Payment
                  </button>
                </div>
              </>
            )}
            {selectedTable.status === 'available' && (
              <button className="btn-teal w-full justify-center">
                <Plus size={15} /> Open Table
              </button>
            )}
            {selectedTable.status === 'reserved' && (
              <div className="p-3 bg-warning-light rounded-xl">
                <div className="text-xs font-600 text-warning-dark mb-1">Reserved For</div>
                <div className="text-sm font-600 text-neutral-700">{selectedTable.reservedFor}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
