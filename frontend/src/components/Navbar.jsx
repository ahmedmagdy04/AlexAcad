import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap, LogIn, UserPlus, LayoutDashboard, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const PUBLIC_NAV = [
  { label: 'Home', to: '/' },
  { label: 'Departments', to: '/departments' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

const AUTH_NAV = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Chat', to: '/chat' },
  { label: 'Profile', to: '/profile' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const NAV_LINKS = user ? AUTH_NAV : PUBLIC_NAV;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname.startsWith(to);
  };

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar__gold-bar" />
      <div className="navbar__inner">
        <Link to={user ? '/dashboard' : '/'} className="navbar__logo">
          <div className="navbar__logo-icon">
            <GraduationCap size={20} />
          </div>
          <div className="navbar__logo-text">
            <span className="navbar__logo-title">Faculty of Business</span>
            <span className="navbar__logo-sub">Alexandria University</span>
          </div>
        </Link>

        <nav className="navbar__nav">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`navbar__link ${isActive(link.to) ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="navbar__actions">
          {user ? (
            <>
              <Link to="/dashboard" className="btn-nav-login">
                <LayoutDashboard size={14} />
                Dashboard
              </Link>
              <button className="btn-nav-signup" onClick={handleLogout}>
                <LogOut size={14} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-nav-login">
                <LogIn size={14} />
                Login
              </Link>
              <Link to="/signup" className="btn-nav-signup">
                <UserPlus size={14} />
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          className={`navbar__hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      <div className={`navbar__mobile ${menuOpen ? 'open' : ''}`}>
        {NAV_LINKS.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`navbar__mobile-link ${isActive(link.to) ? 'active' : ''}`}
          >
            {link.label}
          </Link>
        ))}
        <div className="navbar__mobile-actions">
          {user ? (
            <>
              <Link to="/profile" className="btn-nav-login">
                <User size={14} />
                Profile
              </Link>
              <button className="btn-nav-signup" onClick={handleLogout}>
                <LogOut size={14} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-nav-login">
                <LogIn size={14} />
                Login
              </Link>
              <Link to="/signup" className="btn-nav-signup">
                <UserPlus size={14} />
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
