import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

const CATEGORIES = [
  { key: 'dermo_cosmetics', label: 'Dermo-cosmetics', emoji: '✨' },
  { key: 'baby_care', label: 'Baby care', emoji: '👶' },
  { key: 'supplements', label: 'Supplements', emoji: '💊' },
  { key: 'orthopedics', label: 'Orthopedics', emoji: '🦴' },
  { key: 'wound_care', label: 'Wound care', emoji: '🩹' },
  { key: 'oral_hygiene', label: 'Oral hygiene', emoji: '🦷' },
  { key: 'hair_care', label: 'Hair care', emoji: '💆' },
  { key: 'wellness_devices', label: 'Wellness', emoji: '🏥' },
]

export default function Home() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  function searchMedicine(e) {
    e.preventDefault()
    if (query.trim()) navigate(`/search/medicine?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div className="bg-emerald-600 text-white px-4 py-12 text-center">
        <h1 className="text-4xl font-bold mb-2">دَوَاء</h1>
        <p className="text-emerald-100 mb-8 text-lg">Your medicine is one click away</p>

        <form onSubmit={searchMedicine} className="max-w-lg mx-auto flex gap-2">
          <input
            type="text"
            placeholder="Search by molecule or brand (e.g. Metformin, Glucophage…)"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
          />
          <button
            type="submit"
            className="bg-white text-emerald-700 font-semibold px-5 py-3 rounded-xl hover:bg-emerald-50 transition"
          >
            Search
          </button>
        </form>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-10">

        {/* Parapharmaceutical categories */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Browse parapharmaceuticals</h2>
          <div className="grid grid-cols-4 gap-3">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.key}
                to={`/search/products?category=${cat.key}`}
                className="flex flex-col items-center gap-1 bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition text-center"
              >
                <span className="text-2xl">{cat.emoji}</span>
                <span className="text-xs text-gray-600 leading-tight">{cat.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick links */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick access</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/search/medicine"
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition flex items-center gap-3"
            >
              <span className="text-2xl">💊</span>
              <div>
                <p className="font-medium text-gray-800 text-sm">Find medicine</p>
                <p className="text-xs text-gray-500">Check availability nearby</p>
              </div>
            </Link>
            <Link
              to="/search/products"
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition flex items-center gap-3"
            >
              <span className="text-2xl">🛍️</span>
              <div>
                <p className="font-medium text-gray-800 text-sm">Shop products</p>
                <p className="text-xs text-gray-500">Reserve for pickup</p>
              </div>
            </Link>
          </div>
        </section>

      </div>
    </div>
  )
}
