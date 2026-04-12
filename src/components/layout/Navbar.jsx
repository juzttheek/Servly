import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, Bell, MessageSquare, LogOut, User, Settings, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { logout } from '../../firebase/auth';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { currentUser, userProfile, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';
  const isTransparent = isHome && !scrolled;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navLinks = [
    { path: '/services', label: 'Browse Services' },
    { path: '/post-request', label: 'Post Request' },
    ...(isAuthenticated ? [
      { path: '/chat', label: 'Messages' },
    ] : [])
  ];

  return (
    <>
      <nav className={`navbar ${isTransparent ? 'navbar-transparent' : 'navbar-solid'} ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-container container">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <div className="navbar-logo-icon">S</div>
            <span className="navbar-logo-text">Servly</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="navbar-links hide-mobile">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`navbar-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="navbar-right">
            {isAuthenticated ? (
              <>
                <button className="navbar-icon-btn hide-mobile" title="Notifications">
                  <Bell size={20} />
                  <span className="navbar-notification-dot" />
                </button>
                
                <div className="navbar-profile" onClick={() => setProfileOpen(!profileOpen)}>
                  <Avatar
                    src={currentUser?.photoURL}
                    name={currentUser?.displayName || 'User'}
                    size="sm"
                  />
                  <span className="navbar-profile-name hide-mobile">
                    {currentUser?.displayName?.split(' ')[0] || 'User'}
                  </span>
                  <ChevronDown size={16} className={`navbar-chevron hide-mobile ${profileOpen ? 'rotated' : ''}`} />
                </div>

                {/* Profile Dropdown */}
                {profileOpen && (
                  <>
                    <div className="navbar-dropdown-backdrop" onClick={() => setProfileOpen(false)} />
                    <div className="navbar-dropdown">
                      <div className="navbar-dropdown-header">
                        <Avatar
                          src={currentUser?.photoURL}
                          name={currentUser?.displayName || 'User'}
                          size="md"
                        />
                        <div>
                          <p className="navbar-dropdown-name">{currentUser?.displayName}</p>
                          <p className="navbar-dropdown-email">{currentUser?.email}</p>
                        </div>
                      </div>
                      <div className="navbar-dropdown-divider" />
                      <Link to="/dashboard" className="navbar-dropdown-item">
                        <LayoutDashboard size={18} />
                        Dashboard
                      </Link>
                      <Link to={`/provider/${currentUser?.uid}`} className="navbar-dropdown-item">
                        <User size={18} />
                        My Profile
                      </Link>
                      <Link to="/chat" className="navbar-dropdown-item">
                        <MessageSquare size={18} />
                        Messages
                      </Link>
                      <Link to="/settings" className="navbar-dropdown-item">
                        <Settings size={18} />
                        Settings
                      </Link>
                      <div className="navbar-dropdown-divider" />
                      <button className="navbar-dropdown-item navbar-dropdown-logout" onClick={handleLogout}>
                        <LogOut size={18} />
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="navbar-auth-btns">
                <Link to="/login">
                  <Button variant={isTransparent ? 'outline' : 'ghost'} size="sm">Log In</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Get Started</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button className="navbar-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-overlay" onClick={() => setMobileOpen(false)} />
          <div className="mobile-menu-panel">
            <div className="mobile-menu-links">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`mobile-menu-link ${location.pathname === link.path ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="mobile-menu-link">Dashboard</Link>
                  <Link to="/settings" className="mobile-menu-link">Settings</Link>
                  <button className="mobile-menu-link mobile-menu-logout" onClick={handleLogout}>
                    <LogOut size={18} /> Logout
                  </button>
                </>
              ) : (
                <div className="mobile-menu-auth">
                  <Link to="/login">
                    <Button variant="secondary" fullWidth>Log In</Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="primary" fullWidth>Get Started</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
