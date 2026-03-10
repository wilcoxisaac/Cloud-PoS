import React, { useState, useMemo } from 'react'
import { usePOS, SAMPLE_PRODUCTS } from '../context/POSContext'
import { useApp } from '../context/AppContext'
import {
  Search, Plus, Minus, Trash2, X, CreditCard, Banknote,
  Smartphone, ChevronDown, ChevronUp, User, Tag, Hash,
  Printer, Mail, CheckCircle, RotateCcw, Percent, UtensilsCrossed
} from 'lucide-react'
import clsx from 'clsx'

const CATEGORIES_BY_TYPE = {
  restaurant: ['All', 'Entrees', 'Pizza', 'Salads', 'Drinks', 'Desserts'],
  retail: ['All', 'Apparel', 'Accessories', 'Electronics', 'Home'],
  services: ['All', 'Hair', 'Nails', 'Spa', 'Packages'],
}

const QUICK_AMOUNTS = [20, 50, 100, 'Exact']
const TIP_PRESETS = [0, 15, 18, 20, 25]

function PaymentModal({ total, onClose, onComplete }) {
  const [method, setMethod] = useState('card')
  const [cashInput, setCashInput] = useState('')
  const [tipPct, setTipPct] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [done, setDone] = useState(false)
  const [receiptMethod, setReceiptMethod] = useState(null)

  const tipAmount = (total * tipPct) / 100
  const finalTotal = total + tipAmount
  const cashAmt = parseFloat(cashInput) || 0
  const change = Math.max(0, cashAmt - finalTotal)

  async function handleCharge() {
    setProcessing(true)
    // Simulated Elavon Converge API call
    await new Promise(r => setTimeout(r, 1800))
    setProcessing(false)
    setDone(true)
    onComplete(method, method === 'cash' ? cashAmt : finalTotal)
  }

  if (done) {
    return (
      <div className="modal-backdrop">
        <div className="modal-content max-w-sm animate-fade-in">
          <div className="p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-success-light flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={36} className="text-success" />
            </div>
            <h2 className="text-xl font-700 text-elavon-navy mb-2">Payment Approved!</h2>
            <p className="text-neutral-500 text-sm mb-1">
              ${finalTotal.toFixed(2)} charged via {method === 'card' ? 'Elavon' : method === 'cash' ? 'Cash' : 'Contactless'}
            </p>
            {method === 'cash' && change > 0 && (
              <p className="text-lg font-700 text-success mt-2">Change: ${change.toFixed(2)}</p>
            )}
            <div className="mt-6 space-y-2">
              <div className="flex gap-2">
                <button onClick={() => setReceiptMethod('print')} className="btn-secondary flex-1 justify-center">
                  <Printer size={15} /> Print Receipt
                </button>
                <button onClick={() => setReceiptMethod('email')} className="btn-secondary flex-1 justify-center">
                  <Mail size={15} /> Email
                </button>
              </div>
              <button onClick={onClose} className="btn-teal w-full justify-center btn-lg">
                New Sale
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-content max-w-md">
        <div className="modal-header">
          <h2 className="text-lg font-700">Checkout · Elavon</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-5 space-y-5">
          {/* Tip Selection */}
          <div>
            <label className="text-xs font-600 text-neutral-500 uppercase tracking-wide mb-2 block">Add Tip</label>
            <div className="grid grid-cols-5 gap-2">
              {TIP_PRESETS.map(pct => (
                <button key={pct} onClick={() => setTipPct(pct)}
                  className={clsx('py-2 rounded-xl text-sm font-600 border-2 transition-all', tipPct === pct
                    ? 'border-elavon-teal bg-elavon-teal text-white'
                    : 'border-neutral-200 text-neutral-600 hover:border-elavon-teal'
                  )}>
                  {pct === 0 ? 'No Tip' : `${pct}%`}
                </button>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="bg-neutral-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm text-neutral-600"><span>Subtotal</span><span className="text-money">${total.toFixed(2)}</span></div>
            {tipAmount > 0 && <div className="flex justify-between text-sm text-neutral-600"><span>Tip ({tipPct}%)</span><span className="text-money">${tipAmount.toFixed(2)}</span></div>}
            <div className="flex justify-between text-lg font-700 pt-2 border-t border-neutral-200">
              <span style={{ color: 'var(--elavon-navy)' }}>Total Due</span>
              <span className="text-money" style={{ color: 'var(--elavon-navy)' }}>${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="text-xs font-600 text-neutral-500 uppercase tracking-wide mb-2 block">Payment Method</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'card', icon: CreditCard, label: 'Card / Tap' },
                { id: 'cash', icon: Banknote, label: 'Cash' },
                { id: 'digital', icon: Smartphone, label: 'Apple / Google' },
              ].map(m => (
                <button key={m.id} onClick={() => setMethod(m.id)}
                  className={clsx('payment-method-btn', method === m.id && 'selected')}>
                  <m.icon size={22} className={method === m.id ? 'text-elavon-teal' : 'text-neutral-400'} />
                  <span className={clsx('text-xs font-600', method === m.id ? 'text-elavon-teal-dark' : 'text-neutral-500')}>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Cash Entry */}
          {method === 'cash' && (
            <div>
              <label className="text-xs font-600 text-neutral-500 uppercase tracking-wide mb-2 block">Cash Received</label>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {QUICK_AMOUNTS.map(amt => (
                  <button key={amt} onClick={() => setCashInput(amt === 'Exact' ? finalTotal.toFixed(2) : String(amt))}
                    className={clsx('py-2 rounded-lg text-sm font-600 border-2 transition-all',
                      cashInput === String(amt) ? 'border-elavon-teal bg-elavon-teal/10' : 'border-neutral-200 hover:border-elavon-teal'
                    )}>
                    {amt === 'Exact' ? 'Exact' : `$${amt}`}
                  </button>
                ))}
              </div>
              <input type="number" value={cashInput} onChange={e => setCashInput(e.target.value)}
                placeholder="Enter amount" className="input-lg text-money font-700" min="0" step="0.01" />
              {change > 0 && (
                <div className="mt-2 p-3 bg-success-light rounded-lg text-center">
                  <span className="text-success font-700 text-lg">Change: ${change.toFixed(2)}</span>
                </div>
              )}
            </div>
          )}

          {/* Card / Digital Instructions */}
          {(method === 'card' || method === 'digital') && (
            <div className="bg-elavon-navy/5 rounded-xl p-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-elavon-teal/15 flex items-center justify-center mx-auto mb-2">
                {method === 'card' ? <CreditCard size={22} className="text-elavon-teal" /> : <Smartphone size={22} className="text-elavon-teal" />}
              </div>
              <p className="text-sm font-500 text-neutral-600">
                {method === 'card'
                  ? 'Present card or tap on Elavon terminal'
                  : 'Customer can tap with Apple Pay or Google Pay'}
              </p>
              <p className="text-xs text-neutral-400 mt-1">Processing via Elavon Converge · Encrypted · Secure</p>
            </div>
          )}

          {/* Charge Button */}
          <button
            onClick={handleCharge}
            disabled={processing || (method === 'cash' && cashAmt < finalTotal)}
            className={clsx('btn btn-xl w-full justify-center', processing && 'opacity-75 cursor-not-allowed')}
            style={{ background: 'var(--elavon-navy)' }}
          >
            {processing ? (
              <>
                <div className="spinner w-5 h-5" />
                <span>Processing via Elavon...</span>
              </>
            ) : (
              <>
                <CreditCard size={18} />
                <span>Charge ${finalTotal.toFixed(2)}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function POSPage() {
  const { businessType } = useApp()
  const {
    cart, products, customers, addToCart, removeFromCart, updateQty, clearCart,
    setDiscount, setCustomer, setTip, subtotal, discountAmount, taxAmount, tipAmount, total,
    completeTransaction, activeCategory, setActiveCategory
  } = usePOS()
  const [search, setSearch] = useState('')
  const [showPayment, setShowPayment] = useState(false)
  const [showCustomerPicker, setShowCustomerPicker] = useState(false)
  const [showDiscount, setShowDiscount] = useState(false)
  const [discountInput, setDiscountInput] = useState({ type: 'percent', value: '' })

  const categories = CATEGORIES_BY_TYPE[businessType] || CATEGORIES_BY_TYPE.restaurant
  const filtered = useMemo(() => {
    return products
      .filter(p => p.industry === businessType || businessType === 'all')
      .filter(p => activeCategory === 'All' || p.category === activeCategory)
      .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()))
  }, [products, businessType, activeCategory, search])

  function applyDiscount() {
    const val = parseFloat(discountInput.value)
    if (val > 0) {
      setDiscount({ type: discountInput.type, value: val })
      setShowDiscount(false)
    }
  }

  function handlePaymentComplete(method, amount) {
    completeTransaction(method, amount)
    setShowPayment(false)
  }

  return (
    <div className="flex h-full">
      {/* Product Panel */}
      <div className="flex-1 flex flex-col min-w-0 border-r border-neutral-200">
        {/* Search + Categories */}
        <div className="p-4 space-y-3 bg-white border-b border-neutral-100">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search items or scan barcode..." className="search-input"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={clsx('flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-500 transition-all',
                  activeCategory === cat
                    ? 'bg-elavon-navy text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                )}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-neutral-400">
              <Search size={40} strokeWidth={1} className="mb-3" />
              <p className="font-500">No items found</p>
              <p className="text-sm mt-1">Try a different search or category</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {filtered.map(product => (
                <button key={product.id} onClick={() => addToCart(product)} className="product-tile">
                  <div className="text-3xl">{product.emoji}</div>
                  <div className="text-xs font-600 text-neutral-800 leading-tight line-clamp-2">{product.name}</div>
                  <div className="text-sm font-700 text-money" style={{ color: 'var(--elavon-teal-dark)' }}>
                    ${product.price.toFixed(2)}
                  </div>
                  {product.stock !== undefined && product.stock <= 5 && (
                    <span className="badge-warning text-xs">Low Stock</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cart Panel */}
      <div className="w-80 xl:w-96 flex flex-col bg-white">
        {/* Cart Header */}
        <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UtensilsCrossed size={16} style={{ color: 'var(--elavon-navy)' }} />
            <span className="font-700 text-sm" style={{ color: 'var(--elavon-navy)' }}>
              Order {cart.tableName ? `· ${cart.tableName}` : ''}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {/* Customer */}
            <button onClick={() => setShowCustomerPicker(!showCustomerPicker)}
              className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors">
              <User size={15} className={cart.customer ? 'text-elavon-teal' : 'text-neutral-400'} />
            </button>
            {/* Discount */}
            <button onClick={() => setShowDiscount(!showDiscount)}
              className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors">
              <Percent size={15} className={cart.discount ? 'text-elavon-teal' : 'text-neutral-400'} />
            </button>
            {/* Clear */}
            {cart.items.length > 0 && (
              <button onClick={clearCart} className="p-1.5 rounded-lg hover:bg-danger/10 transition-colors">
                <RotateCcw size={15} className="text-neutral-400 hover:text-danger" />
              </button>
            )}
          </div>
        </div>

        {/* Customer Badge */}
        {showCustomerPicker && (
          <div className="border-b border-neutral-100 p-3 bg-neutral-50">
            <div className="text-xs font-600 text-neutral-500 mb-2">Select Customer</div>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              <button onClick={() => { setCustomer(null); setShowCustomerPicker(false) }}
                className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-neutral-100 text-xs text-neutral-500">
                Walk-in Customer
              </button>
              {customers.map(c => (
                <button key={c.id}
                  onClick={() => { setCustomer(c); setShowCustomerPicker(false) }}
                  className={clsx('w-full text-left px-2 py-1.5 rounded-lg hover:bg-neutral-100 text-xs',
                    cart.customer?.id === c.id && 'bg-elavon-teal/10')}>
                  <div className="font-600 text-neutral-800">{c.name}</div>
                  <div className="text-neutral-400">{c.points} pts · {c.tier}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Discount Entry */}
        {showDiscount && (
          <div className="border-b border-neutral-100 p-3 bg-neutral-50">
            <div className="text-xs font-600 text-neutral-500 mb-2">Apply Discount</div>
            <div className="flex gap-2 mb-2">
              {['percent', 'amount'].map(t => (
                <button key={t} onClick={() => setDiscountInput(d => ({ ...d, type: t }))}
                  className={clsx('flex-1 py-1.5 rounded-lg text-xs font-600 border-2 transition-all',
                    discountInput.type === t ? 'border-elavon-teal bg-elavon-teal/10 text-elavon-teal-dark' : 'border-neutral-200')}>
                  {t === 'percent' ? '% Off' : '$ Off'}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="number" value={discountInput.value}
                onChange={e => setDiscountInput(d => ({ ...d, value: e.target.value }))}
                placeholder={discountInput.type === 'percent' ? '10' : '5.00'}
                className="input flex-1 text-sm" min="0" />
              <button onClick={applyDiscount} className="btn-teal px-3 text-sm">Apply</button>
            </div>
          </div>
        )}

        {/* Customer Info */}
        {cart.customer && (
          <div className="mx-3 mt-2 px-3 py-2 rounded-lg bg-elavon-teal/8 border border-elavon-teal/20 flex items-center gap-2">
            <User size={13} className="text-elavon-teal flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-xs font-600 text-elavon-teal-dark">{cart.customer.name}</span>
              <span className="text-xs text-neutral-400 ml-2">{cart.customer.points} pts</span>
            </div>
            <button onClick={() => setCustomer(null)} className="text-neutral-300 hover:text-neutral-500">
              <X size={12} />
            </button>
          </div>
        )}

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-neutral-300">
              <ShoppingCart size={40} strokeWidth={1} className="mb-3" />
              <p className="text-sm font-500 text-neutral-400">Cart is empty</p>
              <p className="text-xs text-neutral-300 mt-1">Tap items to add them</p>
            </div>
          ) : (
            cart.items.map(item => (
              <div key={item.id} className="flex items-center gap-2 p-2 rounded-xl hover:bg-neutral-50 transition-colors group">
                <span className="text-xl flex-shrink-0">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-600 text-neutral-800 leading-tight">{item.name}</div>
                  <div className="text-xs text-money text-neutral-500 mt-0.5">${item.price.toFixed(2)}</div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button onClick={() => updateQty(item.id, item.qty - 1)}
                    className="w-6 h-6 rounded-full border border-neutral-200 flex items-center justify-center hover:border-danger hover:text-danger transition-colors">
                    <Minus size={10} />
                  </button>
                  <span className="text-sm font-700 w-5 text-center" style={{ color: 'var(--elavon-navy)' }}>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.qty + 1)}
                    className="w-6 h-6 rounded-full border border-neutral-200 flex items-center justify-center hover:border-elavon-teal hover:text-elavon-teal transition-colors">
                    <Plus size={10} />
                  </button>
                </div>
                <div className="text-sm font-700 text-money w-14 text-right" style={{ color: 'var(--elavon-navy)' }}>
                  ${(item.price * item.qty).toFixed(2)}
                </div>
                <button onClick={() => removeFromCart(item.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:text-danger transition-all">
                  <Trash2 size={13} className="text-neutral-300 hover:text-danger" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Order Totals */}
        <div className="border-t border-neutral-100 p-4 space-y-2">
          <div className="flex justify-between text-sm text-neutral-600">
            <span>Subtotal</span>
            <span className="text-money">${subtotal.toFixed(2)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-sm text-success">
              <span className="flex items-center gap-1"><Tag size={12} /> Discount</span>
              <span className="text-money">-${discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm text-neutral-600">
            <span>Tax (8.875%)</span>
            <span className="text-money">${taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-700 pt-2 border-t border-neutral-200">
            <span style={{ color: 'var(--elavon-navy)' }}>Total</span>
            <span className="text-money" style={{ color: 'var(--elavon-navy)' }}>${total.toFixed(2)}</span>
          </div>

          {/* Charge Button */}
          <button
            onClick={() => setShowPayment(true)}
            disabled={cart.items.length === 0}
            className={clsx(
              'btn btn-xl w-full justify-center mt-2 transition-all',
              cart.items.length === 0 ? 'opacity-40 cursor-not-allowed bg-neutral-300' : 'bg-gradient-elavon hover:opacity-90 shadow-card'
            )}
            style={cart.items.length > 0 ? { background: 'var(--elavon-teal)' } : {}}
          >
            <CreditCard size={18} />
            <span>Charge ${total.toFixed(2)}</span>
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <PaymentModal
          total={total}
          onClose={() => setShowPayment(false)}
          onComplete={handlePaymentComplete}
        />
      )}
    </div>
  )
}

// ShoppingCart import fix
function ShoppingCart(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
    </svg>
  )
}
