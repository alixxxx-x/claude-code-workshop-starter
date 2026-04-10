import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, Search, ArrowLeftRight, Loader2, CheckCircle2 } from 'lucide-react'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { getProducts, createReservation } from '../lib/api'

export default function PharmacistExchange() {
  const [products, setProducts] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [reserving, setReserving] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => { load() }, [])

  async function load(q = '') {
    setLoading(true)
    const data = await getProducts({ b2b: 'true', ...(q ? { q } : {}) })
    setProducts(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  function handleSearch(e) { e.preventDefault(); load(query) }

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
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white/95 backdrop-blur-sm border-b border-slate-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-20">
        <Link to="/pharmacist/dashboard" className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700">
          <ChevronLeft className="w-4 h-4" /> Dashboard
        </Link>
        <span className="text-slate-200">|</span>
        <div className="flex items-center gap-2">
          <ArrowLeftRight className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-800 text-sm">Inter-pharmacy exchange</span>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <p className="text-sm text-slate-500 mb-4">
          Browse surplus stock from nearby pharmacies. Send a reservation request — the seller confirms in-app.
        </p>

        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search surplus (Mustela, Avène, supplements…)"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
            />
          </div>
          <Button type="submit" className="shrink-0">Search</Button>
        </form>

        {success && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 text-sm text-emerald-700 mb-4">
            <CheckCircle2 className="w-4 h-4 shrink-0" /> {success}
          </div>
        )}

        {loading && (
          <div className="flex items-center gap-2 text-slate-400 text-sm py-8 justify-center">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading…
          </div>
        )}

        {!loading && products.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center">
              <ArrowLeftRight className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">No surplus stock listed yet.</p>
            </CardContent>
          </Card>
        )}

        <div className="space-y-2">
          {products.map(p => (
            <div key={p.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-800 truncate">{p.name}</p>
                  <p className="text-xs text-slate-500 truncate">{p.brand}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    From:{' '}
                    <Link to={`/pharmacy/${p.pharmacy}`} className="text-emerald-600 hover:underline font-medium">
                      {p.pharmacy_name}
                    </Link>
                    {p.pharmacy_wilaya && ` · ${p.pharmacy_wilaya}`}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    {p.wholesale_price_dzd && (
                      <span className="text-sm font-bold text-emerald-600">
                        {p.wholesale_price_dzd.toLocaleString()} DZD <span className="text-xs font-normal text-emerald-500">wholesale</span>
                      </span>
                    )}
                    <span className="text-xs text-slate-400">Retail: {p.price_dzd.toLocaleString()} DZD</span>
                    <Badge variant="blue">B2B</Badge>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => reserve(p.id)}
                  disabled={reserving === p.id}
                  className="shrink-0"
                >
                  {reserving === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Request'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
