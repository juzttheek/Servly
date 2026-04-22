import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, Bell, MessageSquare, LogOut, User, Settings, LayoutDashboard, ChevronDown, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { logout } from '../../firebase/auth';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { currentUser, userProfile, isAuthenticated } = useAuth();
  const { t, i18n } = useTranslation();
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
    setLangOpen(false);
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
    { path: '/services', label: t('navbar.browse_services') },
    { path: '/post-request', label: t('navbar.post_request') },
    ...(isAuthenticated ? [
      { path: '/chat', label: t('navbar.messages') },
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
            
            {/* Language Selector */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <div 
                onClick={() => {
                  setLangOpen(!langOpen);
                  setProfileOpen(false);
                }}
                className="navbar-link"
                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '6px', padding: '8px 12px' }}
              >
                <Globe size={18} />
                <span className="hide-mobile" style={{ fontSize: '14px', fontWeight: 600 }}>
                  {i18n.language.toUpperCase().substring(0, 2)}
                </span>
                <ChevronDown size={14} className={langOpen ? 'rotated' : ''} />
              </div>
              
              {langOpen && (
                <>
                  <div className="navbar-dropdown-backdrop" onClick={() => setLangOpen(false)} />
                  <div className="navbar-dropdown" style={{ top: '100%', right: 0, marginTop: '0.5rem', minWidth: '140px' }}>
                     <button className="navbar-dropdown-item" onClick={() => { i18n.changeLanguage('en'); setLangOpen(false); }}>English</button>
                     <button className="navbar-dropdown-item" onClick={() => { i18n.changeLanguage('si'); setLangOpen(false); }}>සිංහල (Sinhala)</button>
                     <button className="navbar-dropdown-item" onClick={() => { i18n.changeLanguage('ta'); setLangOpen(false); }}>தமிழ் (Tamil)</button>
                  </div>
                </>
              )}
            </div>

            {isAuthenticated ? (
              <>
                <button className="navbar-icon-btn hide-mobile" title="Notifications">
                  <Bell size={20} />
                  <span className="navbar-notification-dot" />
                </button>
                
                <div className="navbar-profile" onClick={() => {
                  setProfileOpen(!profileOpen);
                  setLangOpen(false);
                }}>
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
                        {t('navbar.dashboard')}
                      </Link>
                      <Link to={`/provider/${currentUser?.uid}`} className="navbar-dropdown-item">
                        <User size={18} />
                        {t('navbar.my_profile')}
                      </Link>
                      <Link to="/chat" className="navbar-dropdown-item">
                        <MessageSquare size={18} />
                        {t('navbar.messages')}
                      </Link>
                      <Link to="/settings" className="navbar-dropdown-item">
                        <Settings size={18} />
                        {t('navbar.settings')}
                      </Link>
                      <div className="navbar-dropdown-divider" />
                      <button className="navbar-dropdown-item navbar-dropdown-logout" onClick={handleLogout}>
                        <LogOut size={18} />
                        {t('navbar.logout')}
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="navbar-auth-btns">
                <Link to="/login">
                  <Button variant={isTransparent ? 'outline' : 'ghost'} size="sm">{t('navbar.login')}</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">{t('navbar.get_started')}</Button>
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
                  <Link to="/dashboard" className="mobile-menu-link">{t('navbar.dashboard')}</Link>
                  <Link to="/settings" className="mobile-menu-link">{t('navbar.settings')}</Link>
                  <button className="mobile-menu-link mobile-menu-logout" onClick={handleLogout}>
                    <LogOut size={18} /> {t('navbar.logout')}
                  </button>
                </>
              ) : (
                <div className="mobile-menu-auth">
                  <Link to="/login">
                    <Button variant="secondary" fullWidth>{t('navbar.login')}</Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="primary" fullWidth>{t('navbar.get_started')}</Button>
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
