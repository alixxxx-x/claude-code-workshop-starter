import { Routes, Route, Navigate } from 'react-router-dom'
import { getToken } from './lib/api'

import Login from './pages/Login'
import Signup from './pages/Signup'
import PharmacistLogin from './pages/PharmacistLogin'
import Home from './pages/Home'
import MedicineSearch from './pages/MedicineSearch'
import ProductSearch from './pages/ProductSearch'
import ProductDetail from './pages/ProductDetail'
import PharmacyDetail from './pages/PharmacyDetail'
import ReservationDetail from './pages/ReservationDetail'
import Profile from './pages/Profile'
import PharmacistDashboard from './pages/PharmacistDashboard'
import PharmacistCatalogue from './pages/PharmacistCatalogue'
import PharmacistExchange from './pages/PharmacistExchange'

function RequireAuth({ children }) {
  return getToken() ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/pharmacist/login" element={<PharmacistLogin />} />

      <Route path="/" element={<Home />} />
      <Route path="/search/medicine" element={<MedicineSearch />} />
      <Route path="/search/products" element={<ProductSearch />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/pharmacy/:id" element={<PharmacyDetail />} />

      <Route path="/reservation/:id" element={<RequireAuth><ReservationDetail /></RequireAuth>} />
      <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />

      <Route path="/pharmacist/dashboard" element={<RequireAuth><PharmacistDashboard /></RequireAuth>} />
      <Route path="/pharmacist/catalogue" element={<RequireAuth><PharmacistCatalogue /></RequireAuth>} />
      <Route path="/pharmacist/exchange" element={<RequireAuth><PharmacistExchange /></RequireAuth>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
