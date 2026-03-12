import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { POSProvider } from './context/POSContext'
import Layout from './components/layout/Layout'
import DashboardPage from './pages/DashboardPage'
import POSPage from './pages/POSPage'
import RestaurantPage from './pages/RestaurantPage'
import InventoryPage from './pages/InventoryPage'
import CustomersPage from './pages/CustomersPage'
import EmployeesPage from './pages/EmployeesPage'
import AppointmentsPage from './pages/AppointmentsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import BankingPage from './pages/BankingPage'
import SettingsPage from './pages/SettingsPage'
import LoyaltyPage from './pages/LoyaltyPage'
import InstallPrompt from './components/pwa/InstallPrompt'

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <POSProvider>
          <InstallPrompt />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="pos" element={<POSPage />} />
              <Route path="restaurant" element={<RestaurantPage />} />
              <Route path="inventory" element={<InventoryPage />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="loyalty" element={<LoyaltyPage />} />
              <Route path="employees" element={<EmployeesPage />} />
              <Route path="appointments" element={<AppointmentsPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="banking" element={<BankingPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </POSProvider>
      </AppProvider>
    </BrowserRouter>
  )
}
