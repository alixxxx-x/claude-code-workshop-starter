import { Link, useNavigate } from 'react-router-dom'
import { logout, getToken } from '../lib/api'

export default function Navbar() {
  const navigate = useNavigate()
  const isLoggedIn = !!getToken()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
      <Link to="/" className="text-xl font-bold text-emerald-600">دَوَاء</Link>

      <div className="flex items-center gap-4 text-sm">
        {isLoggedIn ? (
          <>
            <Link to="/profile" className="text-gray-600 hover:text-emerald-600">Profile</Link>
            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-500 transition"
            >
              Sign out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-600 hover:text-emerald-600">Sign in</Link>
            <Link
              to="/signup"
              className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg hover:bg-emerald-700 transition"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
