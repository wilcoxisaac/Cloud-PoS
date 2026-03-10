import React, { createContext, useContext, useState, useCallback, useReducer } from 'react'

const POSContext = createContext(null)

// ─── Sample Products ────────────────────────────────────────────────────────

export const SAMPLE_PRODUCTS = [
  // Restaurant menu items
  { id: 'p001', name: 'House Burger', price: 14.99, category: 'Entrees', sku: 'BURG-001', emoji: '🍔', industry: 'restaurant', modifiers: ['Cheese', 'Bacon', 'Avocado'], tax: true },
  { id: 'p002', name: 'Caesar Salad', price: 11.50, category: 'Salads', sku: 'SAL-001', emoji: '🥗', industry: 'restaurant', modifiers: ['Extra Dressing', 'No Croutons', 'Add Chicken'], tax: true },
  { id: 'p003', name: 'Fish & Chips', price: 17.99, category: 'Entrees', sku: 'FISH-001', emoji: '🐟', industry: 'restaurant', modifiers: [], tax: true },
  { id: 'p004', name: 'Margherita Pizza', price: 16.50, category: 'Pizza', sku: 'PIZ-001', emoji: '🍕', industry: 'restaurant', modifiers: ['Extra Cheese', 'Thin Crust', 'Gluten-Free +2'], tax: true },
  { id: 'p005', name: 'Craft Beer', price: 7.00, category: 'Drinks', sku: 'BEV-001', emoji: '🍺', industry: 'restaurant', modifiers: [], tax: true },
  { id: 'p006', name: 'House Wine', price: 9.00, category: 'Drinks', sku: 'BEV-002', emoji: '🍷', industry: 'restaurant', modifiers: ['Red', 'White', 'Rosé'], tax: true },
  { id: 'p007', name: 'Sparkling Water', price: 3.50, category: 'Drinks', sku: 'BEV-003', emoji: '💧', industry: 'restaurant', modifiers: [], tax: false },
  { id: 'p008', name: 'Tiramisu', price: 8.00, category: 'Desserts', sku: 'DES-001', emoji: '🍰', industry: 'restaurant', modifiers: [], tax: true },
  { id: 'p009', name: 'Chocolate Lava Cake', price: 9.50, category: 'Desserts', sku: 'DES-002', emoji: '🍫', industry: 'restaurant', modifiers: ['Ice Cream +1.50'], tax: true },
  { id: 'p010', name: 'Coffee', price: 4.00, category: 'Drinks', sku: 'BEV-004', emoji: '☕', industry: 'restaurant', modifiers: ['Oat Milk +0.75', 'Extra Shot +0.75'], tax: false },
  // Retail items
  { id: 'r001', name: 'T-Shirt (M)', price: 24.99, category: 'Apparel', sku: 'APP-001', emoji: '👕', industry: 'retail', stock: 42, barcode: '123456789', tax: true },
  { id: 'r002', name: 'Denim Jeans', price: 59.99, category: 'Apparel', sku: 'APP-002', emoji: '👖', industry: 'retail', stock: 18, barcode: '987654321', tax: true },
  { id: 'r003', name: 'Sunglasses', price: 34.99, category: 'Accessories', sku: 'ACC-001', emoji: '🕶️', industry: 'retail', stock: 25, tax: true },
  { id: 'r004', name: 'Backpack', price: 49.99, category: 'Accessories', sku: 'ACC-002', emoji: '🎒', industry: 'retail', stock: 8, tax: true },
  { id: 'r005', name: 'Water Bottle', price: 19.99, category: 'Accessories', sku: 'ACC-003', emoji: '🧴', industry: 'retail', stock: 55, tax: true },
  // Services
  { id: 's001', name: 'Haircut', price: 45.00, category: 'Hair', sku: 'SVC-001', emoji: '✂️', industry: 'services', duration: 45, tax: false },
  { id: 's002', name: 'Color Treatment', price: 120.00, category: 'Hair', sku: 'SVC-002', emoji: '🎨', industry: 'services', duration: 120, tax: false },
  { id: 's003', name: 'Manicure', price: 35.00, category: 'Nails', sku: 'SVC-003', emoji: '💅', industry: 'services', duration: 30, tax: false },
  { id: 's004', name: 'Massage (60 min)', price: 90.00, category: 'Spa', sku: 'SVC-004', emoji: '💆', industry: 'services', duration: 60, tax: false },
]

// ─── Sample Customers ───────────────────────────────────────────────────────

export const SAMPLE_CUSTOMERS = [
  { id: 'c001', name: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '(612) 555-0201', points: 2450, tier: 'Gold', visits: 34, total_spend: 1847.50, last_visit: '2026-03-05', notes: 'Prefers window seat. Allergic to shellfish.' },
  { id: 'c002', name: 'Marcus Williams', email: 'm.williams@email.com', phone: '(612) 555-0202', points: 890, tier: 'Silver', visits: 12, total_spend: 624.00, last_visit: '2026-03-01', notes: '' },
  { id: 'c003', name: 'Emily Chen', email: 'emily.chen@email.com', phone: '(651) 555-0303', points: 5200, tier: 'Platinum', visits: 78, total_spend: 4200.00, last_visit: '2026-03-07', notes: 'VIP. Loves the tiramisu. Birthday: April 12.' },
  { id: 'c004', name: 'Robert Garcia', email: 'rgarcia@email.com', phone: '(763) 555-0404', points: 150, tier: 'Bronze', visits: 3, total_spend: 89.50, last_visit: '2026-02-28', notes: '' },
  { id: 'c005', name: 'Jennifer Park', email: 'jpark@email.com', phone: '(952) 555-0505', points: 3100, tier: 'Gold', visits: 45, total_spend: 2890.00, last_visit: '2026-03-06', notes: 'Vegetarian. Large groups on weekends.' },
]

// ─── Reducer ────────────────────────────────────────────────────────────────

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.item.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i
          )
        }
      }
      return { ...state, items: [...state.items, { ...action.item, qty: 1, modifiers: [], note: '' }] }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.id) }
    case 'UPDATE_QTY': {
      if (action.qty <= 0) {
        return { ...state, items: state.items.filter(i => i.id !== action.id) }
      }
      return {
        ...state,
        items: state.items.map(i => i.id === action.id ? { ...i, qty: action.qty } : i)
      }
    }
    case 'SET_NOTE':
      return {
        ...state,
        items: state.items.map(i => i.id === action.id ? { ...i, note: action.note } : i)
      }
    case 'SET_MODIFIER':
      return {
        ...state,
        items: state.items.map(i => i.id === action.id ? { ...i, modifiers: action.modifiers } : i)
      }
    case 'CLEAR':
      return { ...state, items: [], discount: null, customer: null, tip: 0 }
    case 'SET_DISCOUNT':
      return { ...state, discount: action.discount }
    case 'SET_CUSTOMER':
      return { ...state, customer: action.customer }
    case 'SET_TIP':
      return { ...state, tip: action.tip }
    case 'SET_TABLE':
      return { ...state, tableId: action.tableId, tableName: action.tableName }
    default:
      return state
  }
}

const INITIAL_CART = { items: [], discount: null, customer: null, tip: 0, tableId: null, tableName: null }

// ─── Provider ───────────────────────────────────────────────────────────────

export function POSProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, INITIAL_CART)
  const [products] = useState(SAMPLE_PRODUCTS)
  const [customers, setCustomers] = useState(SAMPLE_CUSTOMERS)
  const [transactions, setTransactions] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [activeCategory, setActiveCategory] = useState('All')

  const addToCart = useCallback((item) => dispatch({ type: 'ADD_ITEM', item }), [])
  const removeFromCart = useCallback((id) => dispatch({ type: 'REMOVE_ITEM', id }), [])
  const updateQty = useCallback((id, qty) => dispatch({ type: 'UPDATE_QTY', id, qty }), [])
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR' }), [])
  const setDiscount = useCallback((discount) => dispatch({ type: 'SET_DISCOUNT', discount }), [])
  const setCustomer = useCallback((customer) => dispatch({ type: 'SET_CUSTOMER', customer }), [])
  const setTip = useCallback((tip) => dispatch({ type: 'SET_TIP', tip }), [])
  const setTable = useCallback((tableId, tableName) => dispatch({ type: 'SET_TABLE', tableId, tableName }), [])

  const subtotal = cart.items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const discountAmount = cart.discount
    ? cart.discount.type === 'percent'
      ? subtotal * (cart.discount.value / 100)
      : Math.min(cart.discount.value, subtotal)
    : 0
  const taxableAmount = cart.items
    .filter(i => i.tax)
    .reduce((sum, i) => sum + i.price * i.qty, 0) - discountAmount
  const taxAmount = Math.max(0, taxableAmount * 0.08875)
  const tipAmount = cart.tip || 0
  const total = subtotal - discountAmount + taxAmount + tipAmount

  const completeTransaction = useCallback((paymentMethod, amountPaid) => {
    const tx = {
      id: `TXN-${Date.now()}`,
      items: cart.items,
      subtotal,
      discount: discountAmount,
      tax: taxAmount,
      tip: tipAmount,
      total,
      payment_method: paymentMethod,
      amount_paid: amountPaid,
      change: Math.max(0, amountPaid - total),
      customer: cart.customer,
      tableId: cart.tableId,
      timestamp: new Date().toISOString(),
      employee: 'Alex Rivera',
    }
    setTransactions(prev => [tx, ...prev])
    if (cart.customer) {
      setCustomers(prev => prev.map(c =>
        c.id === cart.customer.id
          ? { ...c, points: c.points + Math.floor(total), total_spend: c.total_spend + total, visits: c.visits + 1, last_visit: new Date().toISOString().split('T')[0] }
          : c
      ))
    }
    clearCart()
    return tx
  }, [cart, subtotal, discountAmount, taxAmount, tipAmount, total, clearCart])

  return (
    <POSContext.Provider value={{
      cart, products, customers, setCustomers, transactions,
      addToCart, removeFromCart, updateQty, clearCart,
      setDiscount, setCustomer, setTip, setTable,
      selectedProduct, setSelectedProduct,
      activeCategory, setActiveCategory,
      subtotal, discountAmount, taxAmount, tipAmount, total,
      completeTransaction,
    }}>
      {children}
    </POSContext.Provider>
  )
}

export const usePOS = () => {
  const ctx = useContext(POSContext)
  if (!ctx) throw new Error('usePOS must be used within POSProvider')
  return ctx
}
