import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, MapPin, Phone, LogOut, ShoppingBag, Loader2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { getMe, getReservations, logout } from '../lib/api'

const STATUS_VARIANT = {
  pending:   'warning',
  confirmed: 'default',
  completed: 'secondary',
  cancelled: 'destructive',
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

  function handleLogout() { logout(); navigate('/login') }

  if (loading) return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex items-center justify-center h-64 gap-2 text-slate-400 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading…
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

        {/* User card */}
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0">
                  <User className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">{user?.name || 'Patient'}</p>
                  {user?.phone && (
                    <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                      <Phone className="w-3.5 h-3.5" /> {user.phone}
                    </p>
                  )}
                  {user?.wilaya && (
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {user.wilaya}
                    </p>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Reservations */}
        <section>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 px-1">My reservations</h2>

          {reservations.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">No reservations yet.</p>
                <Link to="/search/products" className="text-emerald-600 text-sm hover:underline mt-2 inline-block">
                  Browse products →
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {reservations.map(r => (
                <Link
                  key={r.id}
                  to={`/reservation/${r.id}`}
                  className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition border border-slate-100 gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 text-sm truncate">{r.product_name}</p>
                    <p className="text-xs text-slate-500 truncate">{r.pharmacy_name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{new Date(r.reserved_at).toLocaleDateString()}</p>
                  </div>
                  <Badge variant={STATUS_VARIANT[r.status]} className="shrink-0 capitalize">{r.status}</Badge>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
