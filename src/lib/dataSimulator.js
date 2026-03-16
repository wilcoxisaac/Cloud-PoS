import { saveAppState, loadAppState } from './offlineStorage'

export const TENDER_TYPES = [
  { method: 'Credit Card', weight: 0.45 },
  { method: 'Debit Card', weight: 0.20 },
  { method: 'Cash', weight: 0.25 },
  { method: 'Gift Card', weight: 0.05 },
  { method: 'Apple Pay', weight: 0.03 },
  { method: 'Google Pay', weight: 0.01 },
  { method: 'Check', weight: 0.01 },
]

const DOW_MULT = [0.85, 0.75, 0.80, 0.90, 1.05, 1.25, 1.30]
const MONTH_MULT = [0.80, 0.78, 0.88, 0.95, 1.05, 1.15, 1.10, 1.08, 1.02, 0.98, 1.05, 1.15]
const HOUR_WEIGHTS = [
  0.01, 0.02, 0.04, 0.06, 0.08,
  0.10, 0.12, 0.10, 0.07, 0.05,
  0.04, 0.06, 0.10, 0.10, 0.06,
  0.03, 0.01
]
const HOUR_TOTAL = HOUR_WEIGHTS.reduce((s, w) => s + w, 0)
const EMPLOYEES = ['Alex Rivera', 'Sam Chen', 'Jordan Kim', 'Casey Brooks']

const HISTORICAL_ANNUAL = 4800000
const HISTORICAL_DAILY = HISTORICAL_ANNUAL / 365

const PROCESSING_ANNUAL = 2000000
const CARD_SHARE = 0.65
const SIM_DAILY_TOTAL = (PROCESSING_ANNUAL / CARD_SHARE) / 365
const SIM_TX_PER_DAY = Math.round(SIM_DAILY_TOTAL / 47)

const CAT_WEIGHTS = { Entrees: 0.38, Pizza: 0.12, Drinks: 0.28, Salads: 0.07, Desserts: 0.15 }

function pickTender() {
  let r = Math.random(), acc = 0
  for (const t of TENDER_TYPES) { acc += t.weight; if (r < acc) return t.method }
  return 'Credit Card'
}

function pickHour() {
  let r = Math.random() * HOUR_TOTAL, acc = 0
  for (let i = 0; i < HOUR_WEIGHTS.length; i++) { acc += HOUR_WEIGHTS[i]; if (r < acc) return i + 6 }
  return 12
}

function sameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()
}

function buildTx(ts, prods, custs) {
  const rp = prods.filter(p => p.industry === 'restaurant')
  if (!rp.length) return null
  const n = 1 + Math.floor(Math.random() * 4)
  const items = []
  const pool = [...rp]
  for (let i = 0; i < n && pool.length; i++) {
    const j = Math.floor(Math.random() * pool.length)
    const p = pool.splice(j, 1)[0]
    items.push({
      id: p.id, name: p.name, price: p.price,
      category: p.category, qty: Math.random() > 0.75 ? 2 : 1, tax: p.tax
    })
  }
  const sub = items.reduce((s, i) => s + i.price * i.qty, 0)
  const taxAmt = items.filter(i => i.tax).reduce((s, i) => s + i.price * i.qty, 0) * 0.08875
  const tip = Math.random() > 0.3 ? Math.round(sub * (0.15 + Math.random() * 0.10) * 100) / 100 : 0
  const total = Math.round((sub + taxAmt + tip) * 100) / 100
  const cust = Math.random() > 0.5 ? custs[Math.floor(Math.random() * custs.length)] : null
  return {
    id: `TXN-${ts.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
    items,
    subtotal: Math.round(sub * 100) / 100,
    discount: 0,
    tax: Math.round(taxAmt * 100) / 100,
    tip,
    total,
    payment_method: pickTender(),
    amount_paid: total,
    change: 0,
    customer: cust ? { id: cust.id, name: cust.name } : null,
    tableId: Math.random() > 0.3 ? `T${Math.floor(Math.random() * 15) + 1}` : null,
    timestamp: ts.toISOString(),
    employee: EMPLOYEES[Math.floor(Math.random() * EMPLOYEES.length)],
    simulated: true,
  }
}

function buildDaySummary(date, dailyAvg) {
  const mult = DOW_MULT[date.getDay()] * MONTH_MULT[date.getMonth()] * (0.85 + Math.random() * 0.30)
  const rev = dailyAvg * mult
  const ticket = 42 + Math.random() * 10
  const cnt = Math.round(rev / ticket)

  const tenderMix = {}
  TENDER_TYPES.forEach(t => { tenderMix[t.method] = rev * t.weight * (0.85 + Math.random() * 0.30) })
  const tt = Object.values(tenderMix).reduce((s, v) => s + v, 0)
  Object.keys(tenderMix).forEach(k => { tenderMix[k] = Math.round((tenderMix[k] / tt) * rev * 100) / 100 })

  const categories = {}
  Object.entries(CAT_WEIGHTS).forEach(([c, w]) => { categories[c] = rev * w * (0.85 + Math.random() * 0.30) })
  const ct = Object.values(categories).reduce((s, v) => s + v, 0)
  Object.keys(categories).forEach(k => { categories[k] = Math.round((categories[k] / ct) * rev * 100) / 100 })

  return {
    date: date.toISOString().split('T')[0],
    revenue: Math.round(rev * 100) / 100,
    txCount: cnt,
    customers: Math.round(cnt * (0.6 + Math.random() * 0.2)),
    avgOrder: Math.round((rev / cnt) * 100) / 100,
    categories,
    tenderMix,
  }
}

export async function seedHistorical(prods, custs) {
  const done = await loadAppState('historicalDataSeeded')
  if (done) {
    const summaries = await loadAppState('historicalSummaries') || []
    return { summaries, alreadySeeded: true }
  }

  const summaries = []
  const txs = []
  const now = new Date()

  for (let d = 365; d >= 1; d--) {
    const dt = new Date(now)
    dt.setDate(dt.getDate() - d)
    dt.setHours(0, 0, 0, 0)

    const summary = buildDaySummary(dt, HISTORICAL_DAILY)
    summaries.push(summary)

    if (d <= 30) {
      for (let t = 0; t < summary.txCount; t++) {
        const h = pickHour()
        const txd = new Date(dt)
        txd.setHours(h, Math.floor(Math.random() * 60), Math.floor(Math.random() * 60))
        const tx = buildTx(txd, prods, custs)
        if (tx) txs.push(tx)
      }
    }
  }

  txs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

  await saveAppState('historicalSummaries', summaries)
  await saveAppState('transactions', txs)
  await saveAppState('historicalDataSeeded', true)

  return { summaries, transactions: txs }
}

export function backfillToday(prods, custs, existingTxs) {
  const now = new Date()
  const h = now.getHours()
  if (h < 6) return []

  const todaySim = existingTxs.filter(tx => tx.simulated && tx.timestamp && sameDay(new Date(tx.timestamp), now)).length

  let expected = 0
  for (let i = 6; i <= Math.min(h, 22); i++) {
    const wi = i - 6
    if (wi < HOUR_WEIGHTS.length) expected += (HOUR_WEIGHTS[wi] / HOUR_TOTAL) * SIM_TX_PER_DAY
  }
  const needed = Math.max(0, Math.floor(expected) - todaySim)
  if (!needed) return []

  const txs = []
  for (let i = 0; i < needed; i++) {
    const rh = 6 + Math.floor(Math.random() * Math.max(1, h - 5))
    const td = new Date(now)
    td.setHours(rh, Math.floor(Math.random() * 60), Math.floor(Math.random() * 60), 0)
    const tx = buildTx(td, prods, custs)
    if (tx) txs.push(tx)
  }
  return txs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
}

function poissonSample(lambda) {
  let L = Math.exp(-lambda), k = 0, p = 1
  do { k++; p *= Math.random() } while (p > L)
  return k - 1
}

export function startSimInterval(prodsRef, custsRef, addFn) {
  const id = setInterval(() => {
    const h = new Date().getHours()
    if (h < 6 || h > 22) return
    if (!prodsRef.current.some(p => p.industry === 'restaurant')) return
    const wi = h - 6
    const w = HOUR_WEIGHTS[wi] || 0
    const lambda = (w / HOUR_TOTAL) * SIM_TX_PER_DAY / 15
    const count = poissonSample(lambda)
    for (let i = 0; i < count; i++) {
      const td = new Date()
      td.setSeconds(Math.floor(Math.random() * 60))
      td.setMilliseconds(Math.floor(Math.random() * 1000))
      const tx = buildTx(td, prodsRef.current, custsRef.current)
      if (tx) addFn(tx)
    }
  }, 4 * 60 * 1000)
  return () => clearInterval(id)
}

export { SIM_DAILY_TOTAL }
