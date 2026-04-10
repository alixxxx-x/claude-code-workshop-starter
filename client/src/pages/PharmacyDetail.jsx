import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getPharmacy, getPharmacyProducts, getPharmacyAvailability } from '../lib/api'

const CONFIDENCE_COLOR = {
  high: 'bg-emerald-100 text-emerald-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-orange-100 text-orange-700',
  unknown: 'bg-gray-100 text-gray-500',
}

const STOCK_COLOR = {
  high: 'text-emerald-600',
  medium: 'text-yellow-600',
  low: 'text-orange-600',
  out: 'text-red-500',
}

export default function PharmacyDetail() {
  const { id } = useParams()
  const [pharmacy, setPharmacy] = useState(null)
  const [tab, setTab] = useState('medicines')
  const [products, setProducts] = useState([])
  const [availability, setAvailability] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [ph, prods, avail] = await Promise.all([
        getPharmacy(id),
        getPharmacyProducts(id),
        getPharmacyAvailability(id),
      ])
      setPharmacy(ph)
      setProducts(Array.isArray(prods) ? prods : [])
      setAvailability(Array.isArray(avail) ? avail : [])
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400">Loading…</p>
      </div>
    </div>
  )

  if (!pharmacy) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <p className="text-gray-500">Pharmacy not found.</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-800">{pharmacy.name}</h1>
              <p className="text-sm text-gray-500 mt-1">{pharmacy.address}</p>
              <p className="text-sm text-gray-500">{pharmacy.wilaya}</p>
            </div>
            {pharmacy.is_verified && (
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">Verified</span>
            )}
          </div>
          {pharmacy.phone && (
            <a href={`tel:${pharmacy.phone}`} className="inline-block mt-3 text-sm text-emerald-600 hover:underline">
              📞 {pharmacy.phone}
            </a>
          )}
          {pharmacy.lat && pharmacy.lng && (
            <a
              href={`https://maps.google.com/?q=${pharmacy.lat},${pharmacy.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block ml-4 mt-3 text-sm text-emerald-600 hover:underline"
            >
              🗺️ Navigate
            </a>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-4">
          {['medicines', 'shop'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${tab === t ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {t === 'medicines' ? '💊 Medicines' : '🛍️ Shop'}
            </button>
          ))}
        </div>

        {/* Medicines tab */}
        {tab === 'medicines' && (
          <div>
            {availability.length === 0 ? (
              <div className="bg-white rounded-xl p-6 text-center">
                <p className="text-gray-500 text-sm">No availability reports yet for this pharmacy.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {availability.map(r => (
                  <div key={r.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm text-gray-800">{r.medicine_name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {r.status === 'found' ? '✅ Found' : '❌ Not found'} · {new Date(r.reported_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${CONFIDENCE_COLOR[r.confidence] || CONFIDENCE_COLOR.unknown}`}>
                      {r.confidence}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Shop tab */}
        {tab === 'shop' && (
          <div>
            {products.length === 0 ? (
              <div className="bg-white rounded-xl p-6 text-center">
                <p className="text-gray-500 text-sm">No products listed yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {products.map(p => (
                  <Link
                    key={p.id}
                    to={`/product/${p.id}`}
                    className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition"
                  >
                    <div>
                      <p className="font-medium text-sm text-gray-800">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.brand}</p>
                      <p className={`text-xs mt-0.5 font-medium ${STOCK_COLOR[p.stock_level]}`}>
                        {p.stock_level === 'out' ? 'Out of stock' : `Stock: ${p.stock_level}`}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-800 text-sm">{p.price_dzd.toLocaleString()} DZD</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
