import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SITE_CONTENT, NAV_LINKS, PRODUCTS_MENU } from '../../constants/content';
import './Header.css';

const Header = () => {
  const [activeTab, setActiveTab] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav id="main-nav" style={{ boxShadow: isScrolled ? '0 4px 28px rgba(44,26,14,0.1)' : 'none' }}>
      <Link to="/" className="nav-logo" style={{ textDecoration: 'none' }}>
        {SITE_CONTENT.brand.name}<span>{SITE_CONTENT.brand.subName}</span>
      </Link>

      <ul className="nav-links">
        {/* Home Link */}
        <li><Link to="/">{NAV_LINKS.find(l => l.name === "Home")?.name || "Home"}</Link></li>

        {/* Our Products Dropdown - Moved next to Home */}
        <li className="dropdown">
          <a href="#">Our Products ▾</a>

          <div className="mega-menu" onMouseLeave={() => setActiveTab(null)}>
            <div className="menu-column cat-column">
              <h4>Categories</h4>
              <Link 
                to="/category/sofa-sets" 
                className={`cat-link ${activeTab === 'living' ? 'active' : ''}`} 
                onMouseEnter={() => setActiveTab('living')}
              >
                Living
              </Link>
              <Link 
                to="/category/dining-tables" 
                className={`cat-link ${activeTab === 'dining' ? 'active' : ''}`} 
                onMouseEnter={() => setActiveTab('dining')}
              >
                Dining
              </Link>
              <Link 
                to="/category/cots-and-beds" 
                className={`cat-link ${activeTab === 'bedroom' ? 'active' : ''}`} 
                onMouseEnter={() => setActiveTab('bedroom')}
              >
                Bedroom
              </Link>
            </div>

            {Object.keys(PRODUCTS_MENU).map((cat) => (
              <div key={cat} className={`menu-column products-pane ${activeTab === cat ? 'active' : ''}`} id={`pane-${cat}`}>
                <h4>Products</h4>
                {PRODUCTS_MENU[cat].map((product) => (
                  <Link key={product.name} to={product.path}>{product.name}</Link>
                ))}
              </div>
            ))}
          </div>
        </li>

        {/* Remaining Navigation Links */}
        {NAV_LINKS.filter(l => l.name !== "Home").map((link) => (
          <li key={link.name}>
            {link.path.startsWith('#') || (link.path.includes('#') && link.path !== '/#about') ? (
              <a href={link.path}>{link.name}</a>
            ) : link.name === "About Us" ? (
              <a href={link.path}>{link.name}</a>
            ) : (
              <Link to={link.path}>{link.name}</Link>
            )}
          </li>
        ))}

        <li><button className="login-btn">Login</button></li>
      </ul>
    </nav>
  );
};

export default Header;
