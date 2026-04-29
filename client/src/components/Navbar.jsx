import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Signed out');
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <header className="border-b border-ink-200 bg-paper-50 sticky top-0 z-50">
      {/* Top strip */}
      <div className="bg-ink-900 py-1.5 text-center">
        <span className="font-sans text-xs text-ink-300 tracking-[0.2em] uppercase">
          BlogSpace — Ideas Worth Sharing
        </span>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="font-display text-2xl font-bold text-ink-900 hover:text-accent transition-colors">
            Blog<span className="text-accent">Space</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`font-sans text-sm tracking-wide transition-colors ${
                location.pathname === '/'
                  ? 'text-accent font-medium'
                  : 'text-ink-600 hover:text-ink-900'
              }`}
            >
              Home
            </Link>

            {user ? (
              <>
                <Link
                  to="/create"
                  className="btn-primary text-xs tracking-widest uppercase"
                >
                  + Write Post
                </Link>
                <div className="relative group">
                  <button className="flex items-center gap-2 group">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full border border-ink-200 object-cover"
                    />
                    <span className="font-sans text-sm text-ink-700">{user.name.split(' ')[0]}</span>
                    <svg className="w-3 h-3 text-ink-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" />
                    </svg>
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-44 bg-paper-50 border border-ink-200 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2.5 font-sans text-sm text-ink-700 hover:bg-paper-200 hover:text-ink-900 transition-colors"
                    >
                      My Profile
                    </Link>
                    <div className="border-t border-ink-100" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 font-sans text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="btn-secondary text-xs tracking-widest uppercase">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-xs tracking-widest uppercase">
                  Join Free
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-ink-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-ink-100 bg-paper-50 px-4 py-4 space-y-3">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block font-sans text-sm text-ink-700 py-2"
          >
            Home
          </Link>
          {user ? (
            <>
              <Link
                to="/create"
                onClick={() => setMenuOpen(false)}
                className="block font-sans text-sm text-ink-700 py-2"
              >
                Write a Post
              </Link>
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="block font-sans text-sm text-ink-700 py-2"
              >
                My Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left font-sans text-sm text-red-600 py-2"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block font-sans text-sm text-ink-700 py-2">Sign In</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="block font-sans text-sm text-ink-700 py-2">Join Free</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
