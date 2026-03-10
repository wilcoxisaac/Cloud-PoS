import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  business, products, customers, transactions,
  inventory, employees, tables, kdsTickets,
  appointments, notifications, bankingTransactions
} from './data.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/business', (req, res) => {
  res.json(business)
})

app.patch('/api/business', (req, res) => {
  Object.assign(business, req.body)
  res.json(business)
})

app.get('/api/products', (req, res) => {
  const { industry, category } = req.query
  let result = products
  if (industry) result = result.filter(p => p.industry === industry)
  if (category && category !== 'All') result = result.filter(p => p.category === category)
  res.json(result)
})

app.post('/api/products', (req, res) => {
  const product = { id: `p${Date.now()}`, ...req.body }
  products.push(product)
  res.status(201).json(product)
})

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id)
  if (!product) return res.status(404).json({ error: 'Product not found' })
  res.json(product)
})

app.patch('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id)
  if (!product) return res.status(404).json({ error: 'Product not found' })
  Object.assign(product, req.body)
  res.json(product)
})

app.delete('/api/products/:id', (req, res) => {
  const idx = products.findIndex(p => p.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Product not found' })
  products.splice(idx, 1)
  res.json({ success: true })
})

app.get('/api/customers', (req, res) => {
  const { search, tier } = req.query
  let result = customers
  if (search) {
    const q = search.toLowerCase()
    result = result.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
  }
  if (tier && tier !== 'All') result = result.filter(c => c.tier.toLowerCase() === tier.toLowerCase())
  res.json(result)
})

app.post('/api/customers', (req, res) => {
  const customer = { id: `c${Date.now()}`, points: 0, tier: 'Bronze', visits: 0, total_spend: 0, ...req.body }
  customers.push(customer)
  res.status(201).json(customer)
})

app.get('/api/customers/:id', (req, res) => {
  const customer = customers.find(c => c.id === req.params.id)
  if (!customer) return res.status(404).json({ error: 'Customer not found' })
  res.json(customer)
})

app.patch('/api/customers/:id', (req, res) => {
  const customer = customers.find(c => c.id === req.params.id)
  if (!customer) return res.status(404).json({ error: 'Customer not found' })
  Object.assign(customer, req.body)
  res.json(customer)
})

app.patch('/api/customers/:id/loyalty', (req, res) => {
  const customer = customers.find(c => c.id === req.params.id)
  if (!customer) return res.status(404).json({ error: 'Customer not found' })
  if (req.body.points !== undefined) customer.points = req.body.points
  if (req.body.tier !== undefined) customer.tier = req.body.tier
  res.json(customer)
})

app.get('/api/transactions', (req, res) => {
  const { limit } = req.query
  let result = transactions
  if (limit) result = result.slice(0, parseInt(limit))
  res.json(result)
})

app.post('/api/transactions', (req, res) => {
  const tx = {
    id: `TXN-${Date.now()}`,
    timestamp: new Date().toISOString(),
    ...req.body
  }
  transactions.unshift(tx)

  if (tx.customer_id) {
    const customer = customers.find(c => c.id === tx.customer_id)
    if (customer) {
      customer.points += Math.floor(tx.total || 0)
      customer.total_spend += tx.total || 0
      customer.visits += 1
      customer.last_visit = new Date().toISOString().split('T')[0]
    }
  }

  res.status(201).json(tx)
})

app.get('/api/inventory', (req, res) => {
  const { category, status, search } = req.query
  let result = inventory
  if (category && category !== 'All') result = result.filter(i => i.category === category)
  if (status && status !== 'All') result = result.filter(i => i.status === status.toLowerCase())
  if (search) {
    const q = search.toLowerCase()
    result = result.filter(i => i.name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q))
  }
  res.json(result)
})

app.get('/api/inventory/:id', (req, res) => {
  const item = inventory.find(i => i.id === parseInt(req.params.id))
  if (!item) return res.status(404).json({ error: 'Item not found' })
  res.json(item)
})

app.patch('/api/inventory/:id', (req, res) => {
  const item = inventory.find(i => i.id === parseInt(req.params.id))
  if (!item) return res.status(404).json({ error: 'Item not found' })
  Object.assign(item, req.body)
  if (item.quantity <= item.min * 0.5) item.status = 'critical'
  else if (item.quantity <= item.min) item.status = 'low'
  else item.status = 'ok'
  res.json(item)
})

app.patch('/api/inventory/:id/stock', (req, res) => {
  const item = inventory.find(i => i.id === parseInt(req.params.id))
  if (!item) return res.status(404).json({ error: 'Item not found' })
  if (req.body.quantity !== undefined) item.quantity = req.body.quantity
  if (req.body.adjust !== undefined) item.quantity += req.body.adjust
  if (item.quantity <= item.min * 0.5) item.status = 'critical'
  else if (item.quantity <= item.min) item.status = 'low'
  else item.status = 'ok'
  res.json(item)
})

app.get('/api/employees', (req, res) => {
  const { role, status, search } = req.query
  let result = employees.map(e => ({ ...e, pin: '****' }))
  if (role && role !== 'All') result = result.filter(e => e.role === role)
  if (status) result = result.filter(e => e.status === status)
  if (search) {
    const q = search.toLowerCase()
    result = result.filter(e => e.name.toLowerCase().includes(q) || e.role.toLowerCase().includes(q))
  }
  res.json(result)
})

app.get('/api/employees/:id', (req, res) => {
  const emp = employees.find(e => e.id === req.params.id)
  if (!emp) return res.status(404).json({ error: 'Employee not found' })
  res.json({ ...emp, pin: '****' })
})

app.post('/api/employees', (req, res) => {
  const emp = { id: `emp${Date.now()}`, status: 'active', clockedIn: false, hoursThisWeek: 0, totalSales: 0, ...req.body }
  employees.push(emp)
  res.status(201).json({ ...emp, pin: '****' })
})

app.patch('/api/employees/:id', (req, res) => {
  const emp = employees.find(e => e.id === req.params.id)
  if (!emp) return res.status(404).json({ error: 'Employee not found' })
  Object.assign(emp, req.body)
  res.json({ ...emp, pin: '****' })
})

app.post('/api/employees/:id/clock-in', (req, res) => {
  const emp = employees.find(e => e.id === req.params.id)
  if (!emp) return res.status(404).json({ error: 'Employee not found' })
  emp.clockedIn = true
  emp.clockInTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  res.json({ ...emp, pin: '****' })
})

app.post('/api/employees/:id/clock-out', (req, res) => {
  const emp = employees.find(e => e.id === req.params.id)
  if (!emp) return res.status(404).json({ error: 'Employee not found' })
  emp.clockedIn = false
  emp.clockInTime = null
  res.json({ ...emp, pin: '****' })
})

app.get('/api/tables', (req, res) => {
  res.json(tables)
})

app.get('/api/tables/:id', (req, res) => {
  const table = tables.find(t => t.id === req.params.id)
  if (!table) return res.status(404).json({ error: 'Table not found' })
  res.json(table)
})

app.patch('/api/tables/:id', (req, res) => {
  const table = tables.find(t => t.id === req.params.id)
  if (!table) return res.status(404).json({ error: 'Table not found' })
  Object.assign(table, req.body)
  res.json(table)
})

app.get('/api/kds/tickets', (req, res) => {
  const { status } = req.query
  let result = kdsTickets
  if (status) result = result.filter(t => t.status === status)
  res.json(result)
})

app.patch('/api/kds/tickets/:id', (req, res) => {
  const ticket = kdsTickets.find(t => t.id === req.params.id)
  if (!ticket) return res.status(404).json({ error: 'Ticket not found' })
  Object.assign(ticket, req.body)
  res.json(ticket)
})

app.get('/api/appointments', (req, res) => {
  const { staff, status } = req.query
  let result = appointments
  if (staff && staff !== 'All Staff') result = result.filter(a => a.staff === staff)
  if (status) result = result.filter(a => a.status === status)
  res.json(result)
})

app.post('/api/appointments', (req, res) => {
  const apt = { id: `apt${Date.now()}`, status: 'confirmed', ...req.body }
  appointments.push(apt)
  res.status(201).json(apt)
})

app.patch('/api/appointments/:id', (req, res) => {
  const apt = appointments.find(a => a.id === req.params.id)
  if (!apt) return res.status(404).json({ error: 'Appointment not found' })
  Object.assign(apt, req.body)
  res.json(apt)
})

app.get('/api/notifications', (req, res) => {
  res.json(notifications)
})

app.patch('/api/notifications/:id/read', (req, res) => {
  const notif = notifications.find(n => n.id === parseInt(req.params.id))
  if (!notif) return res.status(404).json({ error: 'Notification not found' })
  notif.read = true
  res.json(notif)
})

app.post('/api/notifications/read-all', (req, res) => {
  notifications.forEach(n => n.read = true)
  res.json({ success: true })
})

app.get('/api/banking/balance', (req, res) => {
  res.json({
    account_number: business.usbank.account_number,
    account_name: business.usbank.account_name,
    balance: business.usbank.balance,
    pending: business.usbank.pending,
    available: business.usbank.balance - business.usbank.pending,
  })
})

app.get('/api/banking/transactions', (req, res) => {
  const { limit, type } = req.query
  let result = bankingTransactions
  if (type) result = result.filter(t => t.type === type)
  if (limit) result = result.slice(0, parseInt(limit))
  res.json(result)
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

const distPath = path.join(__dirname, '..', 'dist')
app.use(express.static(distPath))
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    res.sendFile(path.join(distPath, 'index.html'))
  } else {
    next()
  }
})

const PORT = process.env.PORT || 3001
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost'
app.listen(PORT, HOST, () => {
  console.log(`Cloud POS API server running on http://${HOST}:${PORT}`)
})
