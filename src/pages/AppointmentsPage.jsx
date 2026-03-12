import React, { useState } from 'react'
import {
  Calendar, Plus, Clock, User, Phone, CheckCircle,
  XCircle, AlertCircle, ChevronLeft, ChevronRight,
  Search, Filter, Scissors, Edit2, X, Save
} from 'lucide-react'

const SERVICES = [
  { id: 's1', name: 'Haircut & Style', duration: 45, price: 65.00, category: 'Hair', color: '#0A1638' },
  { id: 's2', name: 'Color Treatment', duration: 90, price: 125.00, category: 'Hair', color: '#1E3A6E' },
  { id: 's3', name: 'Deep Tissue Massage', duration: 60, price: 95.00, category: 'Massage', color: '#00A3AD' },
  { id: 's4', name: 'Manicure', duration: 30, price: 35.00, category: 'Nails', color: '#00BFC9' },
  { id: 's5', name: 'Pedicure', duration: 45, price: 55.00, category: 'Nails', color: '#007A83' },
  { id: 's6', name: 'Facial Treatment', duration: 60, price: 85.00, category: 'Skin', color: '#154273' },
]

const STAFF_LIST = ['Alex Rivera', 'Jordan Lee', 'Morgan Scott', 'Taylor Kim']
const STAFF = ['All Staff', ...STAFF_LIST]

const INITIAL_APPOINTMENTS = [
  { id: 'apt001', time: '9:00 AM', duration: 45, client: 'Sarah Chen', phone: '(612) 555-0101', service: 'Haircut & Style', staff: 'Jordan Lee', status: 'completed', notes: '' },
  { id: 'apt002', time: '10:00 AM', duration: 90, client: 'Maria Torres', phone: '(651) 555-0234', service: 'Color Treatment', staff: 'Jordan Lee', status: 'in-progress', notes: 'Balayage - bring ref photos' },
  { id: 'apt003', time: '10:30 AM', duration: 60, client: 'Emma Wilson', phone: '(612) 555-0345', service: 'Deep Tissue Massage', staff: 'Morgan Scott', status: 'confirmed', notes: 'Focus on shoulders' },
  { id: 'apt004', time: '11:30 AM', duration: 30, client: 'Lisa Park', phone: '(763) 555-0456', service: 'Manicure', staff: 'Taylor Kim', status: 'confirmed', notes: '' },
  { id: 'apt005', time: '12:00 PM', duration: 45, client: 'Rachel Brown', phone: '(952) 555-0567', service: 'Pedicure', staff: 'Taylor Kim', status: 'confirmed', notes: 'Allergic to shellac' },
  { id: 'apt006', time: '1:00 PM', duration: 60, client: 'Amy Johnson', phone: '(612) 555-0678', service: 'Facial Treatment', staff: 'Alex Rivera', status: 'no-show', notes: '' },
  { id: 'apt007', time: '2:00 PM', duration: 45, client: 'Christine Lee', phone: '(651) 555-0789', service: 'Haircut & Style', staff: 'Jordan Lee', status: 'pending', notes: '' },
  { id: 'apt008', time: '3:30 PM', duration: 60, client: 'Tanya Patel', phone: '(612) 555-0890', service: 'Deep Tissue Massage', staff: 'Morgan Scott', status: 'pending', notes: 'New client' },
  { id: 'apt009', time: '4:30 PM', duration: 90, client: 'Nicole Kim', phone: '(763) 555-0901', service: 'Color Treatment', staff: 'Jordan Lee', status: 'pending', notes: '' },
]

const STATUS_CONFIG = {
  completed: { label: 'Completed', bg: 'bg-success-light', text: 'text-success', icon: CheckCircle },
  'in-progress': { label: 'In Progress', bg: 'bg-info-light', text: 'text-info', icon: AlertCircle },
  confirmed: { label: 'Confirmed', bg: 'bg-elavon-teal/10', text: 'text-elavon-teal-dark', icon: CheckCircle },
  pending: { label: 'Pending', bg: 'bg-warning-light', text: 'text-warning', icon: Clock },
  'no-show': { label: 'No Show', bg: 'bg-danger-light', text: 'text-danger', icon: XCircle },
  cancelled: { label: 'Cancelled', bg: 'bg-neutral-100', text: 'text-neutral-500', icon: XCircle },
}

const TIME_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
]

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const HOURS = ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM']

// Map hour label to hour number for positioning
const HOUR_MAP = {
  '9 AM': 9, '10 AM': 10, '11 AM': 11, '12 PM': 12,
  '1 PM': 13, '2 PM': 14, '3 PM': 15, '4 PM': 16, '5 PM': 17, '6 PM': 18,
}

function timeToHour(timeStr) {
  const [time, ampm] = timeStr.split(' ')
  let [h] = time.split(':').map(Number)
  if (ampm === 'PM' && h !== 12) h += 12
  if (ampm === 'AM' && h === 12) h = 0
  return h
}

function AppointmentModal({ appt, onSave, onClose }) {
  const [form, setForm] = useState(appt || {
    client: '', phone: '', service: SERVICES[0].name, staff: STAFF_LIST[0],
    time: '9:00 AM', duration: 45, status: 'pending', notes: ''
  })

  function handleSubmit(e) {
    e.preventDefault()
    const svc = SERVICES.find(s => s.name === form.service)
    onSave({
      ...form,
      id: appt?.id || `apt${Date.now()}`,
      duration: svc?.duration || form.duration,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-modal overflow-hidden animate-fade-in">
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <h2 className="font-700 text-elavon-navy">{appt ? 'Edit Appointment' : 'New Appointment'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-neutral-100"><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-600 text-neutral-500 uppercase tracking-wide">Client Name *</label>
              <input required className="input w-full" value={form.client} onChange={e => setForm(f => ({ ...f, client: e.target.value }))} placeholder="Full name" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-600 text-neutral-500 uppercase tracking-wide">Phone</label>
              <input className="input w-full" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="(612) 555-0000" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-600 text-neutral-500 uppercase tracking-wide">Service *</label>
            <select required className="input w-full" value={form.service} onChange={e => {
              const svc = SERVICES.find(s => s.name === e.target.value)
              setForm(f => ({ ...f, service: e.target.value, duration: svc?.duration || f.duration }))
            }}>
              {SERVICES.map(s => <option key={s.id}>{s.name} — {s.duration}min · ${s.price}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-600 text-neutral-500 uppercase tracking-wide">Staff Member</label>
              <select className="input w-full" value={form.staff} onChange={e => setForm(f => ({ ...f, staff: e.target.value }))}>
                {STAFF_LIST.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-600 text-neutral-500 uppercase tracking-wide">Time Slot</label>
              <select className="input w-full" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))}>
                {TIME_SLOTS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-600 text-neutral-500 uppercase tracking-wide">Status</label>
            <select className="input w-full" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-600 text-neutral-500 uppercase tracking-wide">Notes</label>
            <textarea className="input w-full min-h-16 resize-none" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Special requests, allergies, notes…" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn btn-teal flex-1 flex items-center justify-center gap-2">
              <Save size={15} /> {appt ? 'Save Changes' : 'Book Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function AppointmentCard({ appt, onEdit }) {
  const st = STATUS_CONFIG[appt.status]
  const StIcon = st.icon
  const service = SERVICES.find(s => s.name === appt.service)
  return (
    <div className="card p-4 hover:shadow-card-hover transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ background: service?.color || '#0A1638' }} />
          <div>
            <div className="font-700 text-sm text-elavon-navy">{appt.time}</div>
            <div className="text-xs text-neutral-400">{appt.duration} min</div>
          </div>
        </div>
        <span className={`badge ${st.bg} ${st.text} flex items-center gap-1`}>
          <StIcon size={10} />
          {st.label}
        </span>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <User size={13} className="text-neutral-400" />
          <span className="font-600 text-sm text-elavon-navy">{appt.client}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={13} className="text-neutral-400" />
          <span className="text-xs text-neutral-500">{appt.phone}</span>
        </div>
        <div className="text-xs font-600 text-elavon-teal-dark mt-2">{appt.service}</div>
        <div className="text-xs text-neutral-400">with {appt.staff}</div>
        {appt.notes && (
          <div className="text-xs text-neutral-500 bg-neutral-50 rounded-lg px-2 py-1 mt-2 italic">{appt.notes}</div>
        )}
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-100">
        <span className="font-700 text-sm text-elavon-navy">${service?.price.toFixed(2)}</span>
        <button onClick={() => onEdit(appt)} className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-elavon-teal transition-colors">
          <Edit2 size={13} />
        </button>
      </div>
    </div>
  )
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS)
  const [view, setView] = useState('list')
  const [staffFilter, setStaffFilter] = useState('All Staff')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingAppt, setEditingAppt] = useState(null)

  const filtered = appointments.filter(a => {
    const matchSearch = a.client.toLowerCase().includes(search.toLowerCase()) || a.service.toLowerCase().includes(search.toLowerCase())
    const matchStaff = staffFilter === 'All Staff' || a.staff === staffFilter
    return matchSearch && matchStaff
  })

  const completedCount = appointments.filter(a => a.status === 'completed').length
  const confirmedCount = appointments.filter(a => a.status === 'confirmed' || a.status === 'in-progress').length
  const pendingCount = appointments.filter(a => a.status === 'pending').length
  const totalRevenue = appointments
    .filter(a => a.status === 'completed' || a.status === 'in-progress')
    .reduce((s, a) => s + (SERVICES.find(svc => svc.name === a.service)?.price || 0), 0)

  function handleSave(appt) {
    setAppointments(prev => {
      const exists = prev.find(a => a.id === appt.id)
      if (exists) return prev.map(a => a.id === appt.id ? appt : a)
      return [...prev, appt]
    })
    setShowModal(false)
    setEditingAppt(null)
  }

  function handleEdit(appt) {
    setEditingAppt(appt)
    setShowModal(true)
  }

  function openNew() {
    setEditingAppt(null)
    setShowModal(true)
  }

  // Build calendar slot map: time -> list of appts
  const calendarAppts = view === 'calendar' ? filtered : []
  const slotMap = {}
  calendarAppts.forEach(a => {
    const h = timeToHour(a.time)
    if (!slotMap[h]) slotMap[h] = []
    slotMap[h].push(a)
  })

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-700 text-elavon-navy">Appointments</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Monday, March 10, 2026 · {appointments.length} appointments today</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-neutral-100 rounded-lg p-1">
            {['list', 'calendar'].map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-md text-sm font-500 capitalize transition-colors ${
                  view === v ? 'bg-white text-elavon-navy shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <button onClick={openNew} className="btn btn-teal flex items-center gap-2">
            <Plus size={15} />
            New Appointment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Completed', value: completedCount, icon: CheckCircle, color: '#00875A' },
          { label: 'Upcoming', value: confirmedCount, icon: Clock, color: '#00A3AD' },
          { label: 'Pending', value: pendingCount, icon: AlertCircle, color: '#FF8B00' },
          { label: 'Revenue Today', value: `$${totalRevenue.toFixed(2)}`, icon: Calendar, color: '#0A1638' },
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

      <div className="card p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search client or service…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input pl-9 w-full"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          {STAFF.map(s => (
            <button
              key={s}
              onClick={() => setStaffFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-500 transition-colors whitespace-nowrap flex-shrink-0 ${
                staffFilter === s ? 'bg-elavon-navy text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {view === 'list' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(a => <AppointmentCard key={a.id} appt={a} onEdit={handleEdit} />)}
          <div
            onClick={openNew}
            className="card p-4 border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center gap-2 text-neutral-400 hover:border-elavon-teal hover:text-elavon-teal cursor-pointer transition-colors min-h-40"
          >
            <Plus size={24} />
            <span className="text-sm font-500">Book New Slot</span>
          </div>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
            <button className="p-2 hover:bg-neutral-100 rounded-lg"><ChevronLeft size={16} /></button>
            <span className="font-600 text-elavon-navy">Week of March 9 – 15, 2026</span>
            <button className="p-2 hover:bg-neutral-100 rounded-lg"><ChevronRight size={16} /></button>
          </div>
          <div className="overflow-x-auto">
            <div className="grid" style={{ gridTemplateColumns: '80px repeat(7, 1fr)', minWidth: 700 }}>
              <div className="border-b border-neutral-100 border-r border-neutral-100" />
              {DAYS.map(d => (
                <div key={d} className="text-center py-3 text-xs font-600 text-neutral-400 uppercase border-b border-neutral-100 border-r border-neutral-100 last:border-r-0">{d}</div>
              ))}
              {HOURS.map(h => {
                const hourNum = HOUR_MAP[h]
                const appsThisHour = slotMap[hourNum] || []
                return (
                  <React.Fragment key={h}>
                    <div className="text-xs text-neutral-400 px-2 py-4 border-r border-neutral-100 border-b border-neutral-50">{h}</div>
                    {DAYS.map((d, di) => {
                      // Show appointments only on Monday (di=0) for demo
                      const aptsHere = di === 0 ? appsThisHour : []
                      return (
                        <div
                          key={d}
                          className="border-r border-neutral-50 border-b border-neutral-50 last:border-r-0 h-16 hover:bg-neutral-50/50 transition-colors relative"
                          onClick={() => { openNew() }}
                        >
                          {aptsHere.map((a, i) => {
                            const svc = SERVICES.find(s => s.name === a.service)
                            return (
                              <div
                                key={a.id}
                                onClick={e => { e.stopPropagation(); handleEdit(a) }}
                                className="absolute inset-x-1 top-1 rounded text-xs px-1 py-0.5 cursor-pointer truncate font-600 text-white"
                                style={{ background: svc?.color || '#0A1638', fontSize: 10 }}
                                title={`${a.client} – ${a.service}`}
                              >
                                {a.client.split(' ')[0]}
                              </div>
                            )
                          })}
                        </div>
                      )
                    })}
                  </React.Fragment>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <AppointmentModal
          appt={editingAppt}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingAppt(null) }}
        />
      )}
    </div>
  )
}
