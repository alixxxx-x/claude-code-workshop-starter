import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, Navigation, Loader2, Clock, MapPin } from 'lucide-react'
import Navbar from '../components/Navbar'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { getReservations, cancelReservation } from '../lib/api'

const STATUS_VARIANT = {
  pending:   'warning',
  confirmed: 'default',
  completed: 'secondary',
  cancelled: 'destructive',
}

export default function ReservationDetail() {
  const { id } = useParams()
  const [reservation, setReservation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    getReservations().then(data => {
      const found = Array.isArray(data) ? data.find(r => String(r.id) === id) : null
      setReservation(found || null)
      setLoading(false)
    })
  }, [id])

  async function handleCancel() {
    setCancelling(true)
    const updated = await cancelReservation(id)
    setReservation(updated)
    setCancelling(false)
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex items-center justify-center h-64 gap-2 text-slate-400 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading…
      </div>
    </div>
  )

  if (!reservation) return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <p className="text-slate-500">Reservation not found.</p>
      </div>
    </div>
  )

  const deadline = new Date(reservation.pickup_deadline)
  const isExpired = new Date() > deadline

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6">

        <Link to="/profile" className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 mb-4">
          <ChevronLeft className="w-4 h-4" /> My reservations
        </Link>

        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between gap-3 mb-5">
              <h1 className="text-lg font-bold text-slate-800">Reservation #{reservation.id}</h1>
              <Badge variant={STATUS_VARIANT[reservation.status]} className="capitalize">
                {reservation.status}
              </Badge>
            </div>

            <div className="space-y-3">
              <Row label="Product" value={reservation.product_name} />
              <Row
                label="Pharmacy"
                value={
                  <Link to={`/pharmacy/${reservation.pharmacy}`} className="text-emerald-600 hover:underline font-medium">
                    {reservation.pharmacy_name}
                  </Link>
                }
              />
              {reservation.pharmacy_address && (
                <Row
                  label="Address"
                  value={
                    <span className="flex items-center gap-1 text-right">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                      {reservation.pharmacy_address}
                    </span>
                  }
                />
              )}
              <Row
                label="Pickup deadline"
                value={
                  <span className={`flex items-center gap-1 font-medium ${isExpired ? 'text-red-500' : 'text-slate-800'}`}>
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    {deadline.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} today
                    {isExpired && ' (expired)'}
                  </span>
                }
              />
            </div>

            <div className="mt-6 flex gap-3">
              {reservation.pharmacy_lat && reservation.pharmacy_lng && (
                <a
                  href={`https://maps.google.com/?q=${reservation.pharmacy_lat},${reservation.pharmacy_lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button className="w-full gap-2">
                    <Navigation className="w-4 h-4" /> Navigate
                  </Button>
                </a>
              )}
              {reservation.status === 'pending' && (
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="flex-1 border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300"
                >
                  {cancelling ? <><Loader2 className="w-4 h-4 animate-spin" /> Cancelling…</> : 'Cancel'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm py-2 border-b border-slate-50 last:border-0">
      <span className="text-slate-500 shrink-0">{label}</span>
      <span className="text-slate-800 text-right">{value}</span>
    </div>
  )
}
