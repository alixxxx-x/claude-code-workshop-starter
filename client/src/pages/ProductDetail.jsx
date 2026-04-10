import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ChevronLeft, Store, Loader2, AlertCircle } from 'lucide-react'
import Navbar from '../components/Navbar'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { getProduct, createReservation, getToken } from '../lib/api'

const STOCK_VARIANT = { high: 'default', medium: 'warning', low: 'orange', out: 'destructive' }
const STOCK_LABEL   = { high: 'High stock', medium: 'Available', low: 'Low stock', out: 'Out of stock' }

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [reserving, setReserving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getProduct(id).then(data => { setProduct(data); setLoading(false) })
  }, [id])

  async function reserve() {
    if (!getToken()) { navigate('/login'); return }
    setReserving(true); setError('')
    const data = await createReservation(product.id, 'b2c')
    setReserving(false)
    if (data?.id) navigate(`/reservation/${data.id}`)
    else setError('Could not create reservation. Please try again.')
  }

  if (loading) return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex items-center justify-center h-64 gap-2 text-slate-400 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading…
      </div>
    </div>
  )

  if (!product?.id) return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <p className="text-slate-500">Product not found.</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6">

        <Link to="/search/products" className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 mb-4">
          <ChevronLeft className="w-4 h-4" /> Back
        </Link>

        <Card className="overflow-hidden">
          {product.photo_url && (
            <img src={product.photo_url} alt={product.name} className="w-full h-52 object-cover" />
          )}

          <CardContent className="pt-5">
            <div className="flex items-start justify-between gap-3 mb-1">
              <div>
                <h1 className="text-xl font-bold text-slate-800">{product.name}</h1>
                {product.brand && <p className="text-sm text-slate-500 mt-0.5">{product.brand}</p>}
              </div>
              <Badge variant={STOCK_VARIANT[product.stock_level]} className="shrink-0 mt-1">
                {STOCK_LABEL[product.stock_level]}
              </Badge>
            </div>

            <p className="text-3xl font-bold text-emerald-600 mt-4">
              {product.price_dzd.toLocaleString()}
              <span className="text-base font-normal text-slate-400 ml-1">DZD</span>
            </p>

            <Link
              to={`/pharmacy/${product.pharmacy}`}
              className="flex items-center gap-3 mt-5 pt-4 border-t border-slate-100 hover:bg-slate-50 rounded-xl p-2 -mx-2 transition"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                <Store className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{product.pharmacy_name}</p>
                <p className="text-xs text-slate-500">{product.pharmacy_wilaya}</p>
              </div>
            </Link>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-xl px-3 py-2.5 text-sm mt-4">
                <AlertCircle className="w-4 h-4 shrink-0" /> {error}
              </div>
            )}

            <Button
              onClick={reserve}
              disabled={product.stock_level === 'out' || reserving}
              className="w-full mt-5 h-12 text-base"
            >
              {reserving
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Reserving…</>
                : product.stock_level === 'out' ? 'Out of stock' : 'Reserve for pickup'
              }
            </Button>
            <p className="text-xs text-slate-400 text-center mt-2">Held for 2 hours · pay in store</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
