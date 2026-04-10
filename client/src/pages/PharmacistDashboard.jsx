import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getMe, getReservations, confirmReservation, completeReservation, logout } from '../lib/api'

const STATUS_COLOR = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-emerald-100 text-emerald-700',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-600',
}

export default function PharmacistDashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getMe(), getReservations()]).then(([u, r]) => {
      setUser(u)
      setReservations(Array.isArray(r) ? r : [])
      setLoading(false)
    })
  }, [])

  async function confirm(id) {
    const updated = await confirmReservation(id)
    setReservations(rs => rs.map(r => r.id === updated.id ? updated : r))
  }

  async function complete(id) {
    const updated = await completeReservation(id)
    setReservations(rs => rs.map(r => r.id === updated.id ? updated : r))
  }

  function handleLogout() {
    logout()
    navigate('/pharmacist/login')
  }

  const pending = reservations.filter(r => r.status === 'pending')
  const confirmed = reservations.filter(r => r.status === 'confirmed')

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-gray-400">Loading…</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Pharmacist nav */}
      <nav className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <span className="text-xl font-bold text-emerald-600">دَوَاء <span className="text-xs font-normal text-gray-400">Pharmacist</span></span>
        <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-500 transition">Sign out</button>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-3">
          <Link to="/pharmacist/catalogue" className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition text-center">
            <span className="text-2xl">📦</span>
            <p className="text-xs text-gray-600 mt-1 font-medium">Catalogue</p>
          </Link>
          <Link to="/pharmacist/exchange" className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition text-center">
            <span className="text-2xl">🔄</span>
            <p className="text-xs text-gray-600 mt-1 font-medium">Exchange</p>
          </Link>
          <div className="bg-emerald-50 rounded-xl p-4 text-center">
            <span className="text-2xl font-bold text-emerald-600">{pending.length}</span>
            <p className="text-xs text-gray-600 mt-1 font-medium">Pending</p>
          </div>
        </div>

        {/* Pending reservations */}
        {pending.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Pending reservations</h2>
            <div className="space-y-2">
              {pending.map(r => (
                <div key={r.id} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium text-gray-800">{r.product_name}</p>
                      <p className="text-xs text-gray-500">
                        {r.type === 'b2b' ? '🔄 Inter-pharmacy' : '👤 Patient'} · Reserved {new Date(r.reserved_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLOR[r.status]}`}>{r.status}</span>
                  </div>
                  <button
                    onClick={() => confirm(r.id)}
                    className="w-full bg-emerald-600 text-white text-sm py-2 rounded-lg hover:bg-emerald-700 transition"
                  >
                    Confirm pickup
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Confirmed reservations */}
        {confirmed.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Confirmed — awaiting pickup</h2>
            <div className="space-y-2">
              {confirmed.map(r => (
                <div key={r.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{r.product_name}</p>
                    <p className="text-xs text-gray-400">Deadline: {new Date(r.pickup_deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <button
                    onClick={() => complete(r.id)}
                    className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-lg hover:bg-gray-200 transition"
                  >
                    Mark complete
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {reservations.length === 0 && (
          <div className="bg-white rounded-xl p-8 text-center">
            <p className="text-gray-500 text-sm">No reservations yet.</p>
            <Link to="/pharmacist/catalogue" className="text-emerald-600 text-sm hover:underline mt-2 inline-block">Add products to your catalogue →</Link>
          </div>
        )}
      </div>
    </div>
  )
}
