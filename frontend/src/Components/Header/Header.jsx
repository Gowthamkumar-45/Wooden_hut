import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SITE_CONTENT, NAV_LINKS, PRODUCTS_MENU } from '../../constants/content';
import './Header.css';

const Header = () => {
  const [activeTab, setActiveTab] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [notifications, setNotifications] = useState({ enquiries: 0, reviews: 0, whatsapp_contacts: 0, total: 0 });

  useEffect(() => {
    setIsAuthenticated(sessionStorage.getItem('isAuthenticated') === 'true');
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchNotifications = async () => {
        try {
          const token = sessionStorage.getItem('token');
          const response = await fetch(`${SITE_CONTENT.api.base}/api/notifications/`, {
            headers: { 'Authorization': `Token ${token}` }
          });
          if (response.ok) {
            const data = await response.json();
            setNotifications(data);
          }
        } catch (err) {
          console.error("Failed to fetch notifications:", err);
        }
      };
      
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 1000); // Poll every 5 seconds for real-time feel
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setIsAuthenticated(false);
    window.location.href = '/';
  };

  return (
    <nav id="main-nav" style={{ boxShadow: isScrolled ? '0 4px 28px rgba(44,26,14,0.1)' : 'none' }}>
      <Link to="/" className="nav-logo" style={{ textDecoration: 'none' }} onClick={() => setIsMobileMenuOpen(false)}>
        {SITE_CONTENT.brand.name}<span>{SITE_CONTENT.brand.subName}</span>
      </Link>

      <div className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        <span className="line"></span>
        <span className="line"></span>
        <span className="line"></span>
      </div>

      <ul className={`nav-links ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
        {/* Home Link */}
        <li><Link to="/" onClick={() => setIsMobileMenuOpen(false)}>{NAV_LINKS.find(l => l.name === "Home")?.name || "Home"}</Link></li>

        {/* Our Products Dropdown - Moved next to Home */}
        <li className="dropdown">
          <span style={{cursor: 'pointer', color: 'inherit'}}>Our Products ▾</span>

          <div className="mega-menu" onMouseLeave={() => setActiveTab(null)}>
            <div className="menu-column cat-column">
              <h4>Categories</h4>
              <Link
                to="/category/living"
                className={`cat-link ${activeTab === 'living' ? 'active' : ''}`}
                onMouseEnter={() => setActiveTab('living')}
              >
                Living
              </Link>

              <Link
                to="/category/doors-and-windows"
                className={`cat-link ${activeTab === 'doors-and-windows' ? 'active' : ''}`}
                onMouseEnter={() => setActiveTab('doors-and-windows')}
              >
                Doors & Windows
              </Link>

              <Link
                to="/category/dining"
                className={`cat-link ${activeTab === 'dining' ? 'active' : ''}`}
                onMouseEnter={() => setActiveTab('dining')}
              >
                Dining
              </Link>

              <Link
                to="/category/bedroom"
                className={`cat-link ${activeTab === 'bedroom' ? 'active' : ''}`}
                onMouseEnter={() => setActiveTab('bedroom')}
              >
                Bedroom
              </Link>

              <Link
                to="/category/office"
                className={`cat-link ${activeTab === 'office' ? 'active' : ''}`}
                onMouseEnter={() => setActiveTab('office')}
              >
                Office
              </Link>

            </div>

            {Object.keys(PRODUCTS_MENU).map((cat) => (
              <div key={cat} className={`menu-column products-pane ${activeTab === cat ? 'active' : ''}`} id={`pane-${cat}`}>
                <h4>Products</h4>
                {PRODUCTS_MENU[cat].map((product) => (
                  <Link key={product.name} to={product.path} onClick={() => setIsMobileMenuOpen(false)}>{product.name}</Link>
                ))}
              </div>
            ))}
          </div>
        </li>

        {/* Remaining Navigation Links */}
        {NAV_LINKS.filter(l => l.name !== "Home").map((link) => (
          <li key={link.name}>
            {link.path.startsWith('#') || (link.path.includes('#') && link.path !== '/#about') ? (
              <a href={link.path} onClick={() => setIsMobileMenuOpen(false)}>{link.name}</a>
            ) : link.name === "About Us" ? (
              <a href={link.path} onClick={() => setIsMobileMenuOpen(false)}>{link.name}</a>
            ) : (
              <Link to={link.path} onClick={() => setIsMobileMenuOpen(false)}>{link.name}</Link>
            )}
          </li>
        ))}

        {isAuthenticated ? (
          <li className="dropdown">
            <button className="user-avatar-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              {notifications.total > 0 && <span className="notification-badge">{notifications.total}</span>}
            </button>
            <div className="admin-dropdown-menu">
              <Link to="/admin/add-product">Add Products</Link>
              <hr />
              <Link to="/admin/products">Product List</Link>
              <hr />
              <Link to="/admin/reviews" className="badge-link">
                Manage Reviews {notifications.reviews > 0 && <span className="menu-badge">{notifications.reviews}</span>}
              </Link>
              <hr />
              <Link to="/admin/whatsapp-contacts" className="badge-link">
                Contact Logs {notifications.whatsapp_contacts > 0 && <span className="menu-badge">{notifications.whatsapp_contacts}</span>}
              </Link>
              <hr />
              <Link to="/admin/track-orders">Track Orders</Link>
              <hr />
              <Link to="/admin/making-videos">Making Video</Link>
              <hr />
              <Link to="/admin/media">Media</Link>
              <hr />
              <div className="logout-container">
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
              </div>
            </div>
          </li>
        ) : (
          <li>
            <Link to="/login">
              <button className="login-btn">Login</button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Header;
