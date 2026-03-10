export const business = {
  name: 'The Corner Bistro',
  type: 'restaurant',
  address: '123 Main St, Minneapolis, MN 55401',
  phone: '(612) 555-0100',
  tax_rate: 0.08875,
  currency: 'USD',
  timezone: 'America/Chicago',
  logo: null,
  elavon: {
    merchant_id: 'ELV-DEMO-12345',
    ssl_merchant_id: '003',
    ssl_user_id: 'apiuser',
    connected: true,
    terminal_id: 'T001',
    mode: 'test',
  },
  usbank: {
    account_number: '****4821',
    routing_number: '091000022',
    account_name: 'Corner Bistro LLC Business Checking',
    connected: true,
    balance: 24847.32,
    pending: 1342.50,
  }
}

export const products = [
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
  { id: 'r001', name: 'T-Shirt (M)', price: 24.99, category: 'Apparel', sku: 'APP-001', emoji: '👕', industry: 'retail', stock: 42, barcode: '123456789', tax: true },
  { id: 'r002', name: 'Denim Jeans', price: 59.99, category: 'Apparel', sku: 'APP-002', emoji: '👖', industry: 'retail', stock: 18, barcode: '987654321', tax: true },
  { id: 'r003', name: 'Sunglasses', price: 34.99, category: 'Accessories', sku: 'ACC-001', emoji: '🕶️', industry: 'retail', stock: 25, tax: true },
  { id: 'r004', name: 'Backpack', price: 49.99, category: 'Accessories', sku: 'ACC-002', emoji: '🎒', industry: 'retail', stock: 8, tax: true },
  { id: 'r005', name: 'Water Bottle', price: 19.99, category: 'Accessories', sku: 'ACC-003', emoji: '🧴', industry: 'retail', stock: 55, tax: true },
  { id: 's001', name: 'Haircut', price: 45.00, category: 'Hair', sku: 'SVC-001', emoji: '✂️', industry: 'services', duration: 45, tax: false },
  { id: 's002', name: 'Color Treatment', price: 120.00, category: 'Hair', sku: 'SVC-002', emoji: '🎨', industry: 'services', duration: 120, tax: false },
  { id: 's003', name: 'Manicure', price: 35.00, category: 'Nails', sku: 'SVC-003', emoji: '💅', industry: 'services', duration: 30, tax: false },
  { id: 's004', name: 'Massage (60 min)', price: 90.00, category: 'Spa', sku: 'SVC-004', emoji: '💆', industry: 'services', duration: 60, tax: false },
]

export const customers = [
  { id: 'c001', name: 'Sarah Johnson', email: 'sarah.j@email.com', phone: '(612) 555-0201', points: 2450, tier: 'Gold', visits: 34, total_spend: 1847.50, last_visit: '2026-03-05', notes: 'Prefers window seat. Allergic to shellfish.' },
  { id: 'c002', name: 'Marcus Williams', email: 'm.williams@email.com', phone: '(612) 555-0202', points: 890, tier: 'Silver', visits: 12, total_spend: 624.00, last_visit: '2026-03-01', notes: '' },
  { id: 'c003', name: 'Emily Chen', email: 'emily.chen@email.com', phone: '(651) 555-0303', points: 5200, tier: 'Platinum', visits: 78, total_spend: 4200.00, last_visit: '2026-03-07', notes: 'VIP. Loves the tiramisu. Birthday: April 12.' },
  { id: 'c004', name: 'Robert Garcia', email: 'rgarcia@email.com', phone: '(763) 555-0404', points: 150, tier: 'Bronze', visits: 3, total_spend: 89.50, last_visit: '2026-02-28', notes: '' },
  { id: 'c005', name: 'Jennifer Park', email: 'jpark@email.com', phone: '(952) 555-0505', points: 3100, tier: 'Gold', visits: 45, total_spend: 2890.00, last_visit: '2026-03-06', notes: 'Vegetarian. Large groups on weekends.' },
]

export let transactions = []

export const inventory = [
  { id: 1, sku: 'BVG-001', name: 'House Wine (Red)', category: 'Beverages', quantity: 3, min: 10, max: 50, cost: 12.00, price: 9.00, unit: 'bottle', supplier: 'Valley Wines Co.', lastOrdered: '2026-02-15', status: 'critical' },
  { id: 2, sku: 'BVG-002', name: 'Craft Beer (IPA)', category: 'Beverages', quantity: 18, min: 24, max: 96, cost: 2.50, price: 7.00, unit: 'bottle', supplier: 'Local Brews LLC', lastOrdered: '2026-03-01', status: 'low' },
  { id: 3, sku: 'FD-001', name: 'Ground Beef (80/20)', category: 'Proteins', quantity: 15, min: 10, max: 40, cost: 5.50, price: null, unit: 'lb', supplier: 'Metro Meats', lastOrdered: '2026-03-05', status: 'ok' },
  { id: 4, sku: 'FD-002', name: 'Russet Potatoes', category: 'Produce', quantity: 42, min: 20, max: 80, cost: 0.80, price: null, unit: 'lb', supplier: 'Fresh Farms', lastOrdered: '2026-03-06', status: 'ok' },
  { id: 5, sku: 'FD-003', name: 'Caesar Dressing', category: 'Sauces', quantity: 6, min: 8, max: 24, cost: 4.20, price: null, unit: 'bottle', supplier: 'FoodService Pro', lastOrdered: '2026-02-28', status: 'low' },
  { id: 6, sku: 'BVG-003', name: 'Sparkling Water', category: 'Beverages', quantity: 48, min: 20, max: 100, cost: 0.90, price: 3.50, unit: 'bottle', supplier: 'Pure Springs', lastOrdered: '2026-03-03', status: 'ok' },
  { id: 7, sku: 'FD-004', name: 'Pizza Dough', category: 'Bakery', quantity: 24, min: 12, max: 60, cost: 1.50, price: null, unit: 'ball', supplier: 'Artisan Bakery', lastOrdered: '2026-03-07', status: 'ok' },
  { id: 8, sku: 'FD-005', name: 'Mozzarella Cheese', category: 'Dairy', quantity: 8, min: 10, max: 30, cost: 7.00, price: null, unit: 'lb', supplier: 'Dairy Direct', lastOrdered: '2026-02-27', status: 'low' },
  { id: 9, sku: 'SUP-001', name: 'Takeout Containers', category: 'Supplies', quantity: 200, min: 100, max: 500, cost: 0.15, price: null, unit: 'ea', supplier: 'PackRight', lastOrdered: '2026-02-20', status: 'ok' },
  { id: 10, sku: 'BVG-004', name: 'House Wine (White)', category: 'Beverages', quantity: 12, min: 10, max: 50, cost: 10.00, price: 9.00, unit: 'bottle', supplier: 'Valley Wines Co.', lastOrdered: '2026-02-15', status: 'ok' },
]

export const employees = [
  { id: 'emp001', name: 'Alex Rivera', role: 'Manager', email: 'alex.r@bistro.com', phone: '(612) 555-0201', pin: '1234', status: 'active', hoursThisWeek: 38, hourlyRate: 22.00, totalSales: 18420.50, avgTransaction: 45.80, clockedIn: true, clockInTime: '8:02 AM', permissions: ['pos', 'refunds', 'reports', 'employees', 'settings'] },
  { id: 'emp002', name: 'Jordan Lee', role: 'Server', email: 'jordan.l@bistro.com', phone: '(651) 555-0342', pin: '2345', status: 'active', hoursThisWeek: 32, hourlyRate: 14.00, totalSales: 12840.00, avgTransaction: 38.20, clockedIn: true, clockInTime: '10:15 AM', permissions: ['pos', 'refunds'] },
  { id: 'emp003', name: 'Morgan Scott', role: 'Bartender', email: 'morgan.s@bistro.com', phone: '(612) 555-0456', pin: '3456', status: 'active', hoursThisWeek: 28, hourlyRate: 16.50, totalSales: 9240.75, avgTransaction: 32.50, clockedIn: false, clockInTime: null, permissions: ['pos', 'refunds'] },
  { id: 'emp004', name: 'Taylor Kim', role: 'Host', email: 'taylor.k@bistro.com', phone: '(763) 555-0512', pin: '4567', status: 'active', hoursThisWeek: 24, hourlyRate: 13.50, totalSales: 3120.00, avgTransaction: 28.90, clockedIn: true, clockInTime: '11:00 AM', permissions: ['pos'] },
  { id: 'emp005', name: 'Jamie Chen', role: 'Kitchen', email: 'jamie.c@bistro.com', phone: '(952) 555-0634', pin: '5678', status: 'active', hoursThisWeek: 40, hourlyRate: 18.00, totalSales: 0, avgTransaction: 0, clockedIn: true, clockInTime: '7:45 AM', permissions: [] },
  { id: 'emp006', name: 'Sam Patel', role: 'Server', email: 'sam.p@bistro.com', phone: '(612) 555-0718', pin: '6789', status: 'inactive', hoursThisWeek: 0, hourlyRate: 14.00, totalSales: 7820.25, avgTransaction: 36.40, clockedIn: false, clockInTime: null, permissions: ['pos'] },
]

export const tables = [
  { id: 't01', name: 'T1', seats: 2, status: 'available', server: null, order: null, openedAt: null },
  { id: 't02', name: 'T2', seats: 2, status: 'available', server: null, order: null, openedAt: null },
  { id: 't03', name: 'T3', seats: 4, status: 'occupied', server: 'Alex', order: { items: ['House Burger', 'Caesar Salad', 'Craft Beer x2'], total: 46.50 }, openedAt: new Date(Date.now() - 25 * 60000).toISOString() },
  { id: 't04', name: 'T4', seats: 4, status: 'reserved', server: null, order: null, openedAt: null, reservedFor: 'Johnson Party - 7:30PM' },
  { id: 't05', name: 'T5', seats: 6, status: 'occupied', server: 'Maria', order: { items: ['Margherita Pizza', 'Fish & Chips', 'House Wine x3'], total: 84.00 }, openedAt: new Date(Date.now() - 45 * 60000).toISOString() },
  { id: 't06', name: 'T6', seats: 4, status: 'available', server: null, order: null, openedAt: null },
  { id: 't07', name: 'T7', seats: 8, status: 'occupied', server: 'James', order: { items: ['Group Special x8'], total: 240.00 }, openedAt: new Date(Date.now() - 72 * 60000).toISOString() },
  { id: 't08', name: 'T8', seats: 2, status: 'cleaning', server: null, order: null, openedAt: null },
  { id: 't09', name: 'T9', seats: 4, status: 'occupied', server: 'Alex', order: { items: ['House Burger x2', 'Sparkling Water x2'], total: 37.00 }, openedAt: new Date(Date.now() - 12 * 60000).toISOString() },
  { id: 't10', name: 'T10', seats: 6, status: 'reserved', server: null, order: null, openedAt: null, reservedFor: 'Chen Party - 8:00PM' },
  { id: 'bar1', name: 'Bar 1', seats: 1, status: 'occupied', server: 'Sam', order: { items: ['Craft Beer x2', 'Tiramisu'], total: 22.00 }, openedAt: new Date(Date.now() - 8 * 60000).toISOString() },
  { id: 'bar2', name: 'Bar 2', seats: 1, status: 'available', server: null, order: null, openedAt: null },
]

export const kdsTickets = [
  { id: 'K001', table: 'T3', server: 'Alex', items: [{ name: 'House Burger', qty: 1, mods: ['Extra Cheese'] }, { name: 'Caesar Salad', qty: 1, mods: ['No Croutons'] }], status: 'new', time: new Date(Date.now() - 4 * 60000).toISOString(), course: 'Mains' },
  { id: 'K002', table: 'T5', server: 'Maria', items: [{ name: 'Fish & Chips', qty: 2, mods: [] }, { name: 'Margherita Pizza', qty: 1, mods: ['Thin Crust'] }], status: 'preparing', time: new Date(Date.now() - 12 * 60000).toISOString(), course: 'Mains' },
  { id: 'K003', table: 'T7', server: 'James', items: [{ name: 'Tiramisu', qty: 3, mods: [] }], status: 'ready', time: new Date(Date.now() - 6 * 60000).toISOString(), course: 'Desserts' },
  { id: 'K004', table: 'Bar 1', server: 'Sam', items: [{ name: 'Craft Beer', qty: 2, mods: [] }], status: 'new', time: new Date(Date.now() - 2 * 60000).toISOString(), course: 'Drinks' },
  { id: 'K005', table: 'T9', server: 'Alex', items: [{ name: 'House Burger', qty: 2, mods: ['Bacon'] }, { name: 'Sparkling Water', qty: 2, mods: [] }], status: 'preparing', time: new Date(Date.now() - 8 * 60000).toISOString(), course: 'Mains' },
]

export const appointments = [
  { id: 'apt001', time: '9:00 AM', duration: 45, client: 'Sarah Chen', phone: '(612) 555-0101', service: 'Haircut & Style', staff: 'Jordan Lee', status: 'completed', notes: '' },
  { id: 'apt002', time: '10:00 AM', duration: 90, client: 'Maria Lopez', phone: '(651) 555-0202', service: 'Color Treatment', staff: 'Morgan Scott', status: 'completed', notes: 'Wants auburn highlights' },
  { id: 'apt003', time: '11:30 AM', duration: 60, client: 'David Kim', phone: '(763) 555-0303', service: 'Deep Tissue Massage', staff: 'Taylor Kim', status: 'in-progress', notes: 'Back pain focus' },
  { id: 'apt004', time: '1:00 PM', duration: 30, client: 'Amy Taylor', phone: '(612) 555-0404', service: 'Manicure', staff: 'Jordan Lee', status: 'confirmed', notes: '' },
  { id: 'apt005', time: '2:00 PM', duration: 45, client: 'James Wilson', phone: '(952) 555-0505', service: 'Haircut & Style', staff: 'Morgan Scott', status: 'confirmed', notes: 'First-time customer' },
  { id: 'apt006', time: '3:30 PM', duration: 45, client: 'Lisa Brown', phone: '(612) 555-0606', service: 'Pedicure', staff: 'Taylor Kim', status: 'confirmed', notes: '' },
]

export const notifications = [
  { id: 1, type: 'warning', message: 'Low stock alert: House Wine (3 bottles remaining)', time: '5m ago', read: false },
  { id: 2, type: 'info', message: 'Table 7 has been waiting 45 minutes', time: '12m ago', read: false },
  { id: 3, type: 'success', message: 'Settlement complete: $4,821.50 deposited to US Bank', time: '2h ago', read: false },
]

export const bankingTransactions = [
  { id: 'BT001', date: '2026-03-10', description: 'Card Settlement - Elavon', amount: 4821.50, type: 'credit', status: 'completed' },
  { id: 'BT002', date: '2026-03-09', description: 'Card Settlement - Elavon', amount: 3942.00, type: 'credit', status: 'completed' },
  { id: 'BT003', date: '2026-03-09', description: 'Vendor Payment - Valley Wines', amount: -840.00, type: 'debit', status: 'completed' },
  { id: 'BT004', date: '2026-03-08', description: 'Card Settlement - Elavon', amount: 5124.75, type: 'credit', status: 'completed' },
  { id: 'BT005', date: '2026-03-08', description: 'Payroll - Weekly', amount: -4200.00, type: 'debit', status: 'completed' },
  { id: 'BT006', date: '2026-03-07', description: 'Card Settlement - Elavon', amount: 3890.25, type: 'credit', status: 'completed' },
  { id: 'BT007', date: '2026-03-10', description: 'Pending Settlement', amount: 1342.50, type: 'credit', status: 'pending' },
]
