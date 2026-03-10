import React, { useState } from 'react'
import {
  Calendar, Plus, Clock, User, Phone, CheckCircle,
  XCircle, AlertCircle, ChevronLeft, ChevronRight,
  Search, Filter, Scissors, Spa, Dumbbell, Edit2
} from 'lucide-react'

const SERVICES = [
  { id: 's1', name: 'Haircut & Style', duration: 45, price: 65.00, category: 'Hair', color: '#002D5C' },
  { id: 's2', name: 'Color Treatment', duration: 90, price: 125.00, category: 'Hair', color: '#0073B1' },
  { id: 's3', name: 'Deep Tissue Massage', duration: 60, price: 95.00, category: 'Massage', color: '#00A3AD' },
  { id: 's4', name: 'Manicure', duration: 30, price: 35.00, category: 'Nails', color: '#00BFC9' },
  { id: 's5', name: 'Pedicure', duration: 45, price: 55.00, category: 'Nails', color: '#007A83' },
  { id: 's6', name: 'Facial Treatment', duration: 60, price: 85.00, category: 'Skin', color: '#154273' },
]

const STAFF = ['All Staff', 'Alex Rivera', 'Jordan Lee', 'Morgan Scott', 'Taylor Kim']

const TODAY_APPOINTMENTS = [
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

function AppointmentCard({ appt }) {
  const st = STATUS_CONFIG[appt.status]
  const StIcon = st.icon
  const service = SERVICES.find(s => s.name === appt.service)
  return (
    <div className="card p-4 hover:shadow-card-hover transition-all cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ background: service?.color || '#002D5C' }} />
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
        <span className="font-700 text-sm text-elavon-navy">${SERVICES.find(s => s.name === appt.service)?.price.toFixed(2)}</span>
        <div className="flex gap-2">
          <button className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-elavon-teal transition-colors">
            <Edit2 size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const HOURS = ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM']

export default function AppointmentsPage() {
  const [view, setView] = useState('list')
  const [staffFilter, setStaffFilter] = useState('All Staff')
  const [search, setSearch] = useState('')

  const filtered = TODAY_APPOINTMENTS.filter(a => {
    const matchSearch = a.client.toLowerCase().includes(search.toLowerCase()) || a.service.toLowerCase().includes(search.toLowerCase())
    const matchStaff = staffFilter === 'All Staff' || a.staff === staffFilter
    return matchSearch && matchStaff
  })

  const completedCount = TODAY_APPOINTMENTS.filter(a => a.status === 'completed').length
  const confirmedCount = TODAY_APPOINTMENTS.filter(a => a.status === 'confirmed' || a.status === 'in-progress').length
  const pendingCount = TODAY_APPOINTMENTS.filter(a => a.status === 'pending').length
  const totalRevenue = TODAY_APPOINTMENTS
    .filter(a => a.status === 'completed' || a.status === 'in-progress')
    .reduce((s, a) => s + (SERVICES.find(svc => svc.name === a.service)?.price || 0), 0)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-700 text-elavon-navy">Appointments</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Monday, March 10, 2026 · {TODAY_APPOINTMENTS.length} appointments today</p>
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
          <button className="btn btn-teal flex items-center gap-2">
            <Plus size={15} />
            New Appointment
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Completed', value: completedCount, icon: CheckCircle, color: '#00875A' },
          { label: 'Upcoming', value: confirmedCount, icon: Clock, color: '#00A3AD' },
          { label: 'Pending', value: pendingCount, icon: AlertCircle, color: '#FF8B00' },
          { label: 'Revenue Today', value: `$${totalRevenue.toFixed(2)}`, icon: Calendar, color: '#002D5C' },
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

      {/* Filters */}
      <div className="card p-4 flex items-center gap-3">
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
        {STAFF.map(s => (
          <button
            key={s}
            onClick={() => setStaffFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-500 transition-colors ${
              staffFilter === s ? 'bg-elavon-navy text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {view === 'list' ? (
        <div className="grid grid-cols-3 gap-4">
          {filtered.map(a => <AppointmentCard key={a.id} appt={a} />)}
          {/* New slot card */}
          <div className="card p-4 border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center gap-2 text-neutral-400 hover:border-elavon-teal hover:text-elavon-teal cursor-pointer transition-colors min-h-40">
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
              {/* Header */}
              <div className="border-b border-neutral-100 border-r border-neutral-100" />
              {DAYS.map(d => (
                <div key={d} className="text-center py-3 text-xs font-600 text-neutral-400 uppercase border-b border-neutral-100 border-r border-neutral-100 last:border-r-0">{d}</div>
              ))}
              {/* Time rows */}
              {HOURS.map(h => (
                <React.Fragment key={h}>
                  <div className="text-xs text-neutral-400 px-2 py-4 border-r border-neutral-100 border-b border-neutral-50">{h}</div>
                  {DAYS.map(d => (
                    <div key={d} className="border-r border-neutral-50 border-b border-neutral-50 last:border-r-0 h-16 hover:bg-neutral-50/50 transition-colors" />
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
