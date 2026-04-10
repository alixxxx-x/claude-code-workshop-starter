import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { getProducts } from '../lib/api'

const CATEGORIES = [
  { key: '', label: 'All' },
  { key: 'dermo_cosmetics', label: 'Dermo-cosmetics' },
  { key: 'baby_care', label: 'Baby care' },
  { key: 'supplements', label: 'Supplements' },
  { key: 'orthopedics', label: 'Orthopedics' },
  { key: 'wound_care', label: 'Wound care' },
  { key: 'oral_hygiene', label: 'Oral hygiene' },
  { key: 'hair_care', label: 'Hair care' },
  { key: 'wellness_devices', label: 'Wellness' },
]

const STOCK_COLOR = {
  high: 'text-emerald-600',
  medium: 'text-yellow-600',
  low: 'text-orange-600',
  out: 'text-red-500',
}

export default function ProductSearch() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    load()
  }, [category])

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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-gray-800 mb-4">Parapharmaceuticals</h1>

        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Search products (Avène, Mustela…)"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <button
            type="submit"
            className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition text-sm font-medium"
          >
            Search
          </button>
        </form>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition ${
                category === cat.key
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-400'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {loading && <p className="text-gray-500 text-sm">Loading…</p>}

        {!loading && products.length === 0 && (
          <div className="bg-white rounded-xl p-8 text-center">
            <p className="text-gray-500 text-sm">No products found.</p>
          </div>
        )}

        <div className="space-y-2">
          {products.map(p => (
            <Link
              key={p.id}
              to={`/product/${p.id}`}
              className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-800">{p.name}</p>
                <p className="text-xs text-gray-500">{p.brand} · {p.pharmacy_name}</p>
                <p className={`text-xs mt-0.5 font-medium ${STOCK_COLOR[p.stock_level]}`}>
                  {p.stock_level === 'out' ? 'Out of stock' : `In stock`}
                </p>
              </div>
              <p className="font-semibold text-gray-800 text-sm ml-4">{p.price_dzd.toLocaleString()} DZD</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
