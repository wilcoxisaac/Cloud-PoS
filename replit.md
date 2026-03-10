# Cloud POS

A cloud-based Point of Sale solution powered by Elavon & US Bank.

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Routing**: React Router v6
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP**: Axios

## Project Structure

```
src/
  App.jsx              - Root component with routing
  main.jsx             - Entry point
  components/
    layout/            - Header, Sidebar, Layout components
  context/
    AppContext.jsx      - Global app state
    POSContext.jsx      - POS-specific state
  pages/               - Page components (Dashboard, POS, Inventory, etc.)
  styles/
    index.css          - Global styles with Tailwind
```

## Pages

- Dashboard
- POS (Point of Sale)
- Inventory
- Customers
- Employees
- Appointments
- Analytics
- Banking
- Loyalty
- Restaurant
- Settings

## Development

- Frontend runs on port 5000 (host: 0.0.0.0, allowedHosts: true)
- `npm run dev` - Start development server

## Deployment

- Static site deployment via `npm run build` → `dist/` directory
