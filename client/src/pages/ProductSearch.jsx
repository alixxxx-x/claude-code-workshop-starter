import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, ShoppingBag, Loader2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import { Badge } from '../components/ui/badge'
import { Card, CardContent } from '../components/ui/card'
import { getProducts } from '../lib/api'

const CATEGORIES = [
  { key: '',                 label: 'All' },
  { key: 'dermo_cosmetics',  label: 'Dermo-cosmetics' },
  { key: 'baby_care',        label: 'Baby care' },
  { key: 'supplements',      label: 'Supplements' },
  { key: 'orthopedics',      label: 'Orthopedics' },
  { key: 'wound_care',       label: 'Wound care' },
  { key: 'oral_hygiene',     label: 'Oral hygiene' },
  { key: 'hair_care',        label: 'Hair care' },
  { key: 'wellness_devices', label: 'Wellness' },
]

const STOCK_VARIANT = { high: 'default', medium: 'warning', low: 'orange', out: 'destructive' }
const STOCK_LABEL   = { high: 'In stock', medium: 'Available', low: 'Low stock', out: 'Out of stock' }

export default function ProductSearch() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => { load() }, [category])

  async function load(q = query, cat = category) {
    setLoading(true)
    const params = {}
    if (q) params.q = q
    if (cat) params.category = cat
    const data = await getProducts(params)
    setProducts(Array.isArray(data) ? data : [])
    setLoading(false)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const params = {}
    if (query) params.q = query
    if (category) params.category = category
    setSearchParams(params)
    load(query, category)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6">

        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
          </div>
          <h1 className="text-xl font-bold text-slate-800">Parapharmaceuticals</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search products (Avène, Mustela…)"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
            />
          </div>
          <button
            type="submit"
            className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition text-sm font-semibold shrink-0"
          >
            Search
          </button>
        </form>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 -mx-4 px-4">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition border ${
                category === cat.key
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-400'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-slate-400 text-sm py-8 justify-center">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading…
          </div>
        )}

        {!loading && products.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center">
              <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">No products found.</p>
            </CardContent>
          </Card>
        )}

        <div className="space-y-2">
          {products.map(p => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition border border-slate-100 gap-3"
            >
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-800 truncate">{p.name}</p>
                <p className="text-xs text-slate-500 truncate">{p.brand} · {p.pharmacy_name}</p>
                <div className="mt-1">
                  <Badge variant={STOCK_VARIANT[p.stock_level]}>
                    {STOCK_LABEL[p.stock_level]}
                  </Badge>
                </div>
              </div>
              <p className="font-bold text-slate-800 text-sm shrink-0">{p.price_dzd.toLocaleString()} <span className="text-xs font-normal text-slate-400">DZD</span></p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
