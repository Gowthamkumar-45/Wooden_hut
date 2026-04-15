import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SITE_CONTENT, NAV_LINKS, PRODUCTS_MENU } from '../../constants/content';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuVisible, setIsMegaMenuVisible] = useState(false);

  // Check if we are in preview mode or if an admin is logged in
  const isPreview = new URLSearchParams(location.search).get('preview') === 'true';
  const isAdminLoggedIn = !!sessionStorage.getItem('token');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenus = () => {
    setIsMobileMenuOpen(false);
    setIsMegaMenuVisible(false);
    setActiveTab(null);
  };

  return (
    <nav id="main-nav" style={{ boxShadow: isScrolled ? '0 4px 28px rgba(44,26,14,0.1)' : 'none' }}>
      <Link to="/" className="nav-logo" style={{ textDecoration: 'none' }} onClick={closeMenus}>
        {SITE_CONTENT.brand.name}<span>{SITE_CONTENT.brand.subName}</span>
      </Link>

      <div className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        <span className="line"></span>
        <span className="line"></span>
        <span className="line"></span>
      </div>

      <ul className={`nav-links ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
        {/* Always show Customer Navigation now that we have a separate Admin Dashboard */}
        <li><Link to="/" onClick={closeMenus}>{NAV_LINKS.find(l => l.name === "Home")?.name || "Home"}</Link></li>

        {/* OUR PRODUCTS Dropdown */}
        <li 
          className="dropdown" 
          onMouseEnter={() => setIsMegaMenuVisible(true)}
          onMouseLeave={() => setIsMegaMenuVisible(false)}
        >
          <span className="nav-dropdown-trigger">Our Products ▾</span>

          <div className={`mega-menu ${isMegaMenuVisible ? 'visible' : ''}`} onMouseLeave={() => setActiveTab(null)}>
            <div className="menu-column cat-column">
              <h4>Categories</h4>
              <Link to="/category/living" className={`cat-link ${activeTab === 'living' ? 'active' : ''}`} onMouseEnter={() => setActiveTab('living')} onClick={closeMenus}>Living</Link>
              <Link to="/category/doors-and-windows" className={`cat-link ${activeTab === 'doors-and-windows' ? 'active' : ''}`} onMouseEnter={() => setActiveTab('doors-and-windows')} onClick={closeMenus}>Doors & Windows</Link>
              <Link to="/category/dining" className={`cat-link ${activeTab === 'dining' ? 'active' : ''}`} onMouseEnter={() => setActiveTab('dining')} onClick={closeMenus}>Dining</Link>
              <Link to="/category/bedroom" className={`cat-link ${activeTab === 'bedroom' ? 'active' : ''}`} onMouseEnter={() => setActiveTab('bedroom')} onClick={closeMenus}>Bedroom</Link>
              <Link to="/category/office" className={`cat-link ${activeTab === 'office' ? 'active' : ''}`} onMouseEnter={() => setActiveTab('office')} onClick={closeMenus}>Office</Link>
            </div>

            {Object.keys(PRODUCTS_MENU).map((cat) => (
              <div key={cat} className={`menu-column products-pane ${activeTab === cat ? 'active' : ''}`} id={`pane-${cat}`}>
                <h4>Products</h4>
                {PRODUCTS_MENU[cat].map((product) => (
                  <Link key={product.name} to={product.path} onClick={closeMenus}>{product.name}</Link>
                ))}
              </div>
            ))}
          </div>
        </li>

        {NAV_LINKS.filter(l => l.name !== "Home").map((link) => (
          <li key={link.name}>
            {link.path.startsWith('#') || (link.path.includes('#') && link.path !== '/#about') ? (
              <a href={link.path} onClick={closeMenus}>{link.name}</a>
            ) : link.name === "About Us" ? (
              <a href={link.path} onClick={closeMenus}>{link.name}</a>
            ) : (
              <Link to={link.path} onClick={closeMenus}>{link.name}</Link>
            )}
          </li>
        ))}

        {isAdminLoggedIn ? (
          <li>
            <Link to="/admin/dashboard">
              <button className="admin-back-btn">Go to Dashboard</button>
            </Link>
          </li>
        ) : (
          <li><Link to="/login"><button className="login-btn">Login</button></Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Header;
