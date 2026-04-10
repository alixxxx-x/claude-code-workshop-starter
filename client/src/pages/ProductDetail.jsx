import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getProduct, createReservation, getToken } from '../lib/api'

const STOCK_LABEL = {
  high: 'High stock',
  medium: 'Available',
  low: 'Low stock',
  out: 'Out of stock',
}

const STOCK_COLOR = {
  high: 'text-emerald-600 bg-emerald-50',
  medium: 'text-yellow-600 bg-yellow-50',
  low: 'text-orange-600 bg-orange-50',
  out: 'text-red-500 bg-red-50',
}

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reserving, setReserving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getProduct(id).then(data => {
      setProduct(data)
      setLoading(false)
    })
  }, [id])

  async function reserve() {
    if (!getToken()) {
      navigate('/login')
      return
    }
    setReserving(true)
    setError('')
    const data = await createReservation(product.id, 'b2c')
    setReserving(false)
    if (data?.id) {
      navigate(`/reservation/${data.id}`)
    } else {
      setError('Could not create reservation. Please try again.')
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50"><Navbar />
      <div className="flex items-center justify-center h-64"><p className="text-gray-400">Loading…</p></div>
    </div>
  )

  if (!product?.id) return (
    <div className="min-h-screen bg-gray-50"><Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8"><p className="text-gray-500">Product not found.</p></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6">

        <Link to="/search/products" className="text-sm text-emerald-600 hover:underline mb-4 inline-block">← Back</Link>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {product.photo_url && (
            <img src={product.photo_url} alt={product.name} className="w-full h-48 object-cover" />
          )}
          <div className="p-5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h1 className="text-xl font-bold text-gray-800">{product.name}</h1>
                {product.brand && <p className="text-sm text-gray-500">{product.brand}</p>}
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STOCK_COLOR[product.stock_level]}`}>
                {STOCK_LABEL[product.stock_level]}
              </span>
            </div>

            <p className="text-2xl font-bold text-emerald-600 mt-3">{product.price_dzd.toLocaleString()} DZD</p>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link to={`/pharmacy/${product.pharmacy}`} className="flex items-center gap-2 hover:bg-gray-50 rounded-lg p-2 -mx-2 transition">
                <span className="text-lg">🏪</span>
                <div>
                  <p className="text-sm font-medium text-gray-800">{product.pharmacy_name}</p>
                  <p className="text-xs text-gray-500">{product.pharmacy_wilaya}</p>
                </div>
              </Link>
            </div>

            {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

            <button
              onClick={reserve}
              disabled={product.stock_level === 'out' || reserving}
              className="w-full mt-5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
            >
              {reserving ? 'Reserving…' : product.stock_level === 'out' ? 'Out of stock' : 'Reserve for pickup'}
            </button>
            <p className="text-xs text-gray-400 text-center mt-2">Held for 2 hours · pay in store</p>
          </div>
        </div>
      </div>
    </div>
  )
}
