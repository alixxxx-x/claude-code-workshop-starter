import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProducts, createReservation } from '../lib/api'

export default function PharmacistExchange() {
  const [products, setProducts] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [reserving, setReserving] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    load()
  }, [])

  async function load(q = '') {
    setLoading(true)
    const data = await getProducts({ b2b: 'true', ...(q ? { q } : {}) })
    setProducts(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  function handleSearch(e) {
    e.preventDefault()
    load(query)
  }

  async function reserve(productId) {
    setReserving(productId)
    const data = await createReservation(productId, 'b2b')
    setReserving(null)
    if (data?.id) {
      setSuccess(`Reservation #${data.id} sent. The pharmacy will confirm.`)
      setProducts(ps => ps.filter(p => p.id !== productId))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <Link to="/pharmacist/dashboard" className="text-emerald-600 text-sm hover:underline">← Dashboard</Link>
        <span className="text-gray-300">|</span>
        <span className="font-semibold text-gray-800">Inter-pharmacy exchange</span>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <p className="text-sm text-gray-500 mb-4">
          Browse surplus stock listed by nearby pharmacies. Send a reservation request — the seller confirms in-app.
        </p>

        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Search surplus (Mustela, Avène, supplements…)"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <button type="submit" className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-700 transition">
            Search
          </button>
        </form>

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-sm text-emerald-700 mb-4">
            ✅ {success}
          </div>
        )}

        {loading && <p className="text-gray-500 text-sm">Loading…</p>}

        {!loading && products.length === 0 && (
          <div className="bg-white rounded-xl p-8 text-center">
            <p className="text-gray-500 text-sm">No surplus stock listed yet.</p>
          </div>
        )}

        <div className="space-y-2">
          {products.map(p => (
            <div key={p.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.brand}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    From: <Link to={`/pharmacy/${p.pharmacy}`} className="text-emerald-600 hover:underline">{p.pharmacy_name}</Link>
                    {p.pharmacy_wilaya && ` · ${p.pharmacy_wilaya}`}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    {p.wholesale_price_dzd && (
                      <span className="text-sm font-semibold text-emerald-600">{p.wholesale_price_dzd.toLocaleString()} DZD wholesale</span>
                    )}
                    <span className="text-xs text-gray-400">Retail: {p.price_dzd.toLocaleString()} DZD</span>
                  </div>
                </div>
                <button
                  onClick={() => reserve(p.id)}
                  disabled={reserving === p.id}
                  className="ml-3 bg-emerald-600 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
                >
                  {reserving === p.id ? '…' : 'Request'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
