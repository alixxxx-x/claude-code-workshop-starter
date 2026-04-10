import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, Phone, ShieldCheck, Pill, ShoppingBag, ChevronLeft, Loader2, CheckCircle2, XCircle, Navigation } from 'lucide-react'
import Navbar from '../components/Navbar'
import { Badge } from '../components/ui/badge'
import { Card, CardContent } from '../components/ui/card'
import { getPharmacy, getPharmacyProducts, getPharmacyAvailability } from '../lib/api'

const CONFIDENCE_VARIANT = { high: 'default', medium: 'warning', low: 'orange', unknown: 'secondary' }
const STOCK_VARIANT       = { high: 'default', medium: 'warning', low: 'orange', out: 'destructive' }
const STOCK_LABEL         = { high: 'In stock', medium: 'Available', low: 'Low stock', out: 'Out of stock' }

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
        getPharmacy(id), getPharmacyProducts(id), getPharmacyAvailability(id),
      ])
      setPharmacy(ph)
      setProducts(Array.isArray(prods) ? prods : [])
      setAvailability(Array.isArray(avail) ? avail : [])
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="flex items-center justify-center h-64 gap-2 text-slate-400 text-sm">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading…
      </div>
    </div>
  )

  if (!pharmacy) return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <p className="text-slate-500">Pharmacy not found.</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6">

        <Link to="/search/medicine" className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 mb-4">
          <ChevronLeft className="w-4 h-4" /> Back
        </Link>

        {/* Header card */}
        <Card className="mb-4">
          <CardContent className="pt-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold text-slate-800">{pharmacy.name}</h1>
                  {pharmacy.is_verified && (
                    <Badge variant="default" className="gap-1">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-1.5">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{pharmacy.address}, {pharmacy.wilaya}</span>
                </div>
                {pharmacy.hours && (
                  <p className="text-xs text-slate-400 mt-1">{pharmacy.hours}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">
              {pharmacy.phone && (
                <a
                  href={`tel:${pharmacy.phone}`}
                  className="flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  <Phone className="w-4 h-4" /> {pharmacy.phone}
                </a>
              )}
              {pharmacy.lat && pharmacy.lng && (
                <a
                  href={`https://maps.google.com/?q=${pharmacy.lat},${pharmacy.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  <Navigation className="w-4 h-4" /> Navigate
                </a>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tab switcher */}
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-4">
          <button
            onClick={() => setTab('medicines')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium rounded-lg transition ${
              tab === 'medicines' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Pill className="w-4 h-4" /> Medicines
          </button>
          <button
            onClick={() => setTab('shop')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium rounded-lg transition ${
              tab === 'shop' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> Shop
          </button>
        </div>

        {/* Medicines tab */}
        {tab === 'medicines' && (
          availability.length === 0 ? (
            <Card><CardContent className="py-10 text-center">
              <p className="text-slate-500 text-sm">No availability reports yet for this pharmacy.</p>
            </CardContent></Card>
          ) : (
            <div className="space-y-2">
              {availability.map(r => (
                <div key={r.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-slate-800 truncate">{r.medicine_name}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      {r.status === 'found'
                        ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        : <XCircle className="w-3.5 h-3.5 text-red-400" />
                      }
                      <span className="text-xs text-slate-400">
                        {r.status === 'found' ? 'Found' : 'Not found'} · {new Date(r.reported_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Badge variant={CONFIDENCE_VARIANT[r.confidence] || 'secondary'} className="shrink-0">
                    {r.confidence}
                  </Badge>
                </div>
              ))}
            </div>
          )
        )}

        {/* Shop tab */}
        {tab === 'shop' && (
          products.length === 0 ? (
            <Card><CardContent className="py-10 text-center">
              <p className="text-slate-500 text-sm">No products listed yet.</p>
            </CardContent></Card>
          ) : (
            <div className="space-y-2">
              {products.map(p => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition border border-slate-100 gap-3"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-slate-800 truncate">{p.name}</p>
                    <p className="text-xs text-slate-500 truncate">{p.brand}</p>
                    <div className="mt-1">
                      <Badge variant={STOCK_VARIANT[p.stock_level]}>{STOCK_LABEL[p.stock_level]}</Badge>
                    </div>
                  </div>
                  <p className="font-bold text-slate-800 text-sm shrink-0">
                    {p.price_dzd.toLocaleString()} <span className="text-xs font-normal text-slate-400">DZD</span>
                  </p>
                </Link>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  )
}
