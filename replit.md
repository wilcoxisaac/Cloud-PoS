# Cloud POS

A cloud-based Progressive Web App (PWA) Point of Sale solution powered by Elavon & US Bank. Fully offline-capable, mobile responsive, installable on iOS and Android, with a REST API backend.

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Express.js REST API
- **Routing**: React Router v6
- **Charts**: Recharts
- **Icons**: Lucide React + Custom ElavonLogo component
- **HTTP**: Axios
- **PWA**: Service Worker + Web App Manifest
- **Offline Storage**: IndexedDB (via offlineStorage.js)

## Project Structure

```
src/
  App.jsx              - Root component with routing
  main.jsx             - Entry point (registers SW, starts background sync)
  pwa.js               - Service worker registration + install prompt logic
  components/
    ElavonLogo.jsx     - Elavon M-mark logo SVG component (reusable, configurable size/color)
    layout/            - Header (with offline indicator), Sidebar, Layout
    pwa/
      InstallPrompt.jsx - PWA install banner (Android + iOS guide)
  context/
    AppContext.jsx      - Global app state (persisted to IndexedDB)
    POSContext.jsx      - POS state (cart, products, customers, transactions - persisted)
  hooks/
    useOnlineStatus.js  - Online/offline detection hook
  lib/
    offlineStorage.js   - IndexedDB wrapper for offline data persistence
    syncManager.js      - Background sync queue processor
  pages/               - Page components (all mobile responsive)
  styles/
    index.css          - Global styles + standalone mode safe area insets
public/
  manifest.json        - Web App Manifest
  sw.js                - Service Worker (full offline caching)
  favicon.svg          - Elavon M-mark favicon (navy background, white mark)
  apple-touch-icon.png - iOS home screen icon
  icons/               - PNG icons (72-512px + maskable variants)
  fonts/               - Self-hosted Inter + JetBrains Mono fonts (offline-ready)
server/
  index.js             - Express API server (serves static in production)
  data.js              - In-memory data store with sample data
```

## Pages

- Dashboard, POS, Restaurant, Inventory, Customers
- Employees, Appointments, Analytics, Banking
- Loyalty & Rewards, Settings

## API Endpoints

All endpoints are prefixed with `/api`:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/PATCH | /business | Business profile |
| GET/POST | /products | Product catalog |
| GET/POST | /transactions | Sales/transactions |
| GET/POST/PATCH | /customers | CRM & loyalty |
| GET/PATCH | /inventory | Inventory management |
| GET/POST/PATCH | /employees | Staff management |
| POST | /employees/:id/clock-in | Clock in |
| POST | /employees/:id/clock-out | Clock out |
| GET/PATCH | /tables | Restaurant tables |
| GET/PATCH | /kds/tickets | Kitchen display |
| GET/POST/PATCH | /appointments | Scheduling |
| GET | /banking/balance | Account balance |
| GET | /banking/transactions | Banking transactions |
| GET | /notifications | Notifications |
| GET | /health | Health check |

## Development

- Frontend: port 5000 (Vite, host 0.0.0.0, allowedHosts: true)
- Backend: port 3001 (Express, localhost)
- `npm run dev` runs both concurrently
- Vite proxies `/api/*` to the backend

## Deployment

- Autoscale deployment
- Build: `npm run build` -> `dist/`
- Run: `node server/index.js` (serves static files + API on port 5000)
- Production PORT env var set to 5000

## Offline Architecture

- **Workbox Precaching**: VitePWA plugin (vite-plugin-pwa) generates a Workbox-based service worker at build time that deterministically precaches all 25+ assets (HTML, JS, CSS, 8 font files, 10 icons)
- **API Caching**: NetworkFirst strategy with 5-second timeout for /api/ routes; falls back to cached responses when offline
- **SPA Navigation**: NavigationRoute with fallback to cached index.html for all non-API routes
- **Self-hosted Fonts**: Inter and JetBrains Mono served from /fonts/ (no CDN dependency)
- **IndexedDB Persistence**: All app state (business, customers, transactions, products, notifications, activeEmployee) persisted to IndexedDB via offlineStorage.js
- **Sync Queue**: Mutations made offline (transactions, customer updates) queued in IndexedDB; automatically synced to server when connection restored or immediately when online
- **Online/Offline Indicator**: Header shows "Offline Mode" badge + "Elavon Offline" status when disconnected; reverts to "Elavon Live" when online

## Progressive Web App (PWA)

- Installable on Android (Add to Home Screen prompt) and iOS (Safari share > Add to Home Screen)
- Web App Manifest with full icon set (72-512px), maskable icons, app shortcuts
- iOS meta tags: apple-mobile-web-app-capable, status bar style, touch icon, startup image
- Standalone mode CSS: safe area insets for notch devices, disabled text selection, overscroll containment
- Install prompt component: native prompt on Android, guided instructions on iOS Safari
- Auto-update detection: prompts user when new service worker is available

## Mobile Responsiveness

- Sidebar: slide-out overlay on mobile with hamburger menu toggle
- All pages: responsive grids (1-col mobile -> 2-col tablet -> 4-col desktop)
- POS page: toggle between product grid and cart on mobile
- Tables and data: horizontal scroll on mobile
- Modals: full-screen on mobile
- Detail panels: overlay on mobile, side panel on desktop
