import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Package, ArrowLeftRight, Clock, CheckCircle2, LogOut, Loader2 } from 'lucide-react'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { getMe, getReservations, confirmReservation, completeReservation, logout } from '../lib/api'

const STATUS_VARIANT = {
  pending:   'warning',
  confirmed: 'default',
  completed: 'secondary',
  cancelled: 'destructive',
}

function PharmacistNav({ onLogout }) {
  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-slate-100 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold text-emerald-600" style={{ fontFamily: 'Georgia, serif' }}>دَوَاء</span>
        <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Pharmacist</span>
      </div>
      <Button variant="ghost" size="sm" onClick={onLogout} className="text-slate-400 hover:text-red-500 gap-1.5">
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline text-sm">Sign out</span>
      </Button>
    </nav>
  )
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

  function handleLogout() { logout(); navigate('/pharmacist/login') }

  const pending   = reservations.filter(r => r.status === 'pending')
  const confirmed = reservations.filter(r => r.status === 'confirmed')

  if (loading) return (
    <div className="min-h-screen bg-slate-50">
      <PharmacistNav onLogout={handleLogout} />
      <div className="flex items-center justify-center h-64 gap-2 text-slate-400 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading…
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <PharmacistNav onLogout={handleLogout} />
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

        {/* Welcome */}
        {user?.name && (
          <p className="text-slate-500 text-sm">Welcome back, <span className="font-semibold text-slate-700">{user.name}</span></p>
        )}

        {/* Quick actions */}
        <div className="grid grid-cols-3 gap-3">
          <Link to="/pharmacist/catalogue" className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition text-center border border-slate-100 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-2 group-hover:bg-emerald-100 transition">
              <Package className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-xs font-semibold text-slate-700">Catalogue</p>
          </Link>
          <Link to="/pharmacist/exchange" className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition text-center border border-slate-100 group">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-2 group-hover:bg-blue-100 transition">
              <ArrowLeftRight className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-xs font-semibold text-slate-700">Exchange</p>
          </Link>
          <div className="bg-linear-to-br from-emerald-500 to-emerald-600 rounded-2xl p-4 text-center shadow-sm">
            <p className="text-3xl font-bold text-white">{pending.length}</p>
            <p className="text-xs font-semibold text-emerald-100 mt-1">Pending</p>
          </div>
        </div>

        {/* Pending reservations */}
        {pending.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 px-1">Pending reservations</h2>
            <div className="space-y-2">
              {pending.map(r => (
                <Card key={r.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="font-semibold text-slate-800">{r.product_name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {r.type === 'b2b' ? 'Inter-pharmacy' : 'Patient'} · Reserved {new Date(r.reserved_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <Badge variant={STATUS_VARIANT[r.status]}>{r.status}</Badge>
                    </div>
                    <Button onClick={() => confirm(r.id)} className="w-full gap-2" size="sm">
                      <CheckCircle2 className="w-4 h-4" /> Confirm pickup
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Confirmed */}
        {confirmed.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 px-1">Awaiting pickup</h2>
            <div className="space-y-2">
              {confirmed.map(r => (
                <div key={r.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 text-sm truncate">{r.product_name}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      Deadline {new Date(r.pickup_deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => complete(r.id)}>
                    Mark done
                  </Button>
                </div>
              ))}
            </div>
          </section>
        )}

        {reservations.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-slate-500 text-sm">No reservations yet.</p>
              <Link to="/pharmacist/catalogue" className="text-emerald-600 text-sm hover:underline mt-2 inline-block">
                Add products to your catalogue →
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
