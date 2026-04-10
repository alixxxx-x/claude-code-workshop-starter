import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Search, Pill, ShoppingBag, Sparkles, Baby, Zap, Bandage, Smile, Scissors, Activity, Bone, Stethoscope } from 'lucide-react'
import Navbar from '../components/Navbar'

const CATEGORIES = [
  { key: 'dermo_cosmetics', label: 'Dermo-cosmetics', icon: Sparkles, color: 'text-pink-500 bg-pink-50' },
  { key: 'baby_care',       label: 'Baby care',        icon: Baby,     color: 'text-blue-500 bg-blue-50' },
  { key: 'supplements',     label: 'Supplements',      icon: Zap,      color: 'text-yellow-500 bg-yellow-50' },
  { key: 'orthopedics',     label: 'Orthopedics',      icon: Bone,     color: 'text-orange-500 bg-orange-50' },
  { key: 'wound_care',      label: 'Wound care',       icon: Bandage,  color: 'text-red-500 bg-red-50' },
  { key: 'oral_hygiene',    label: 'Oral hygiene',     icon: Smile,    color: 'text-cyan-500 bg-cyan-50' },
  { key: 'hair_care',       label: 'Hair care',        icon: Scissors, color: 'text-purple-500 bg-purple-50' },
  { key: 'wellness_devices',label: 'Wellness',         icon: Activity, color: 'text-emerald-500 bg-emerald-50' },
]

export default function Home() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  function searchMedicine(e) {
    e.preventDefault()
    if (query.trim()) navigate(`/search/medicine?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero */}
      <div className="relative bg-linear-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white px-4 pt-14 pb-24 text-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-8 -right-12 w-72 h-72 rounded-full bg-white/5" />
          <div className="absolute -bottom-12 -left-16 w-96 h-96 rounded-full bg-white/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full bg-white/2" />
        </div>

        <div className="relative max-w-lg mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-xs text-emerald-100 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
            Available in Constantine
          </div>

          <h1 className="text-6xl font-bold mb-3" style={{ fontFamily: 'Georgia, serif' }}>دَوَاء</h1>
          <p className="text-emerald-100 text-lg font-medium mb-1">Your medicine is one click away</p>
          <p className="text-emerald-300/80 text-sm mb-10">Find medicines · Browse parapharmaceuticals · Reserve for pickup</p>

          <form onSubmit={searchMedicine} className="flex gap-2 max-w-md mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Molecule or brand… (Metformin, Glucophage)"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-300 shadow-lg"
              />
            </div>
            <button
              type="submit"
              className="bg-white text-emerald-700 font-semibold px-5 py-3 rounded-xl hover:bg-emerald-50 transition shadow-lg text-sm shrink-0"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Cards lifted over the hero */}
      <div className="max-w-2xl mx-auto px-4 -mt-8 space-y-4 pb-12">

        {/* Quick access */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/search/medicine"
            className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition flex items-center gap-4 border border-slate-100 group"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition shrink-0">
              <Pill className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-slate-800 text-sm">Find medicine</p>
              <p className="text-xs text-slate-500 truncate">Check nearby availability</p>
            </div>
          </Link>
          <Link
            to="/search/products"
            className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition flex items-center gap-4 border border-slate-100 group"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition shrink-0">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-slate-800 text-sm">Shop products</p>
              <p className="text-xs text-slate-500 truncate">Reserve for pickup</p>
            </div>
          </Link>
        </div>

        {/* Category grid */}
        <section>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1">Browse parapharmaceuticals</p>
          <div className="grid grid-cols-4 gap-2">
            {CATEGORIES.map(cat => {
              const Icon = cat.icon
              return (
                <Link
                  key={cat.key}
                  to={`/search/products?category=${cat.key}`}
                  className="flex flex-col items-center gap-2 bg-white rounded-2xl p-3 shadow-sm hover:shadow-md transition text-center border border-slate-100"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-slate-600 leading-tight font-medium">{cat.label}</span>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Pharmacist CTA */}
        <div className="bg-linear-to-r from-slate-800 to-slate-900 rounded-2xl p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Stethoscope className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Are you a pharmacist?</p>
              <p className="text-slate-400 text-xs">Manage catalogue & B2B exchange</p>
            </div>
          </div>
          <Link
            to="/pharmacist/login"
            className="bg-white text-slate-800 text-xs font-semibold px-4 py-2 rounded-xl hover:bg-slate-100 transition shrink-0"
          >
            Access portal
          </Link>
        </div>
      </div>
    </div>
  )
}
