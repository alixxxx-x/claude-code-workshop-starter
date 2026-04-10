import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getMe, getReservations, logout } from '../lib/api'

const STATUS_COLOR = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-emerald-100 text-emerald-700',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-600',
}

export default function Profile() {
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

  function handleLogout() {
    logout()
    navigate('/login')
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50"><Navbar />
      <div className="flex items-center justify-center h-64"><p className="text-gray-400">Loading…</p></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* User card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-800">{user?.name || 'Patient'}</p>
              <p className="text-sm text-gray-500">{user?.phone}</p>
              {user?.wilaya && <p className="text-sm text-gray-500">{user.wilaya}</p>}
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-red-500 hover:underline"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Reservations */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">My reservations</h2>
          {reservations.length === 0 ? (
            <div className="bg-white rounded-xl p-6 text-center">
              <p className="text-gray-500 text-sm">No reservations yet.</p>
              <Link to="/search/products" className="text-emerald-600 text-sm hover:underline mt-2 inline-block">
                Browse products →
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {reservations.map(r => (
                <Link
                  key={r.id}
                  to={`/reservation/${r.id}`}
                  className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition"
                >
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{r.product_name}</p>
                    <p className="text-xs text-gray-500">{r.pharmacy_name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(r.reserved_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLOR[r.status]}`}>
                    {r.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
