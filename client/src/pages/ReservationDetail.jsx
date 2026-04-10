import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getReservations, cancelReservation } from '../lib/api'

const STATUS_COLOR = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-emerald-100 text-emerald-700',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-600',
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
    <div className="min-h-screen bg-gray-50"><Navbar />
      <div className="flex items-center justify-center h-64"><p className="text-gray-400">Loading…</p></div>
    </div>
  )

  if (!reservation) return (
    <div className="min-h-screen bg-gray-50"><Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8"><p className="text-gray-500">Reservation not found.</p></div>
    </div>
  )

  const deadline = new Date(reservation.pickup_deadline)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6">

        <Link to="/profile" className="text-sm text-emerald-600 hover:underline mb-4 inline-block">← My reservations</Link>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-800">Reservation #{reservation.id}</h1>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLOR[reservation.status]}`}>
              {reservation.status}
            </span>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Product</span>
              <span className="font-medium text-gray-800">{reservation.product_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Pharmacy</span>
              <Link to={`/pharmacy/${reservation.pharmacy}`} className="font-medium text-emerald-600 hover:underline">
                {reservation.pharmacy_name}
              </Link>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Address</span>
              <span className="text-gray-700 text-right max-w-48">{reservation.pharmacy_address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Pickup deadline</span>
              <span className={`font-medium ${new Date() > deadline ? 'text-red-500' : 'text-gray-800'}`}>
                {deadline.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} today
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            {reservation.pharmacy_lat && reservation.pharmacy_lng && (
              <a
                href={`https://maps.google.com/?q=${reservation.pharmacy_lat},${reservation.pharmacy_lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center bg-emerald-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-700 transition"
              >
                🗺️ Navigate
              </a>
            )}
            {reservation.status === 'pending' && (
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="flex-1 text-center border border-red-300 text-red-500 py-2.5 rounded-xl text-sm font-medium hover:bg-red-50 transition disabled:opacity-50"
              >
                {cancelling ? 'Cancelling…' : 'Cancel'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
