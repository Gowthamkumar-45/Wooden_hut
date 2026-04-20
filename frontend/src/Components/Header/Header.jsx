import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SITE_CONTENT, NAV_LINKS, PRODUCTS_MENU } from '../../constants/content';
import './Header.css';

const Header = () => {

  const [activeTab, setActiveTab] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState(null);

  const isAdminLoggedIn = !!sessionStorage.getItem('token');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileDropdown = (category, e) => {
    if (window.innerWidth <= 968) {
      e.preventDefault();
      e.stopPropagation();
      setMobileActiveDropdown(mobileActiveDropdown === category ? null : category);
    }
  };

  const closeMenus = () => {
    setIsMobileMenuOpen(false);
    setActiveTab(null);
    setMobileActiveDropdown(null);
  };

  const exitPreview = () => {
    localStorage.removeItem('admin_preview');
    closeMenus();
  };

  return (
    <nav id="main-nav" style={{ boxShadow: isScrolled ? '0 4px 28px rgba(44,26,14,0.1)' : 'none' }}>
      <Link to="/" className="nav-logo" style={{ textDecoration: 'none' }} onClick={closeMenus}>
        {SITE_CONTENT.brand.name}<span>{SITE_CONTENT.brand.subName}</span>
      </Link>

      <div className={`hamburger ${isMobileMenuOpen ? 'open' : ''} ${mobileActiveDropdown ? 'hide-for-dropdown' : ''}`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        <span className="line"></span>
        <span className="line"></span>
        <span className="line"></span>
      </div>

      <ul className={`nav-links ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
        <li><Link to="/" onClick={closeMenus}>Home</Link></li>

        {Object.entries(PRODUCTS_MENU).map(([category, products]) => (
          <li key={category} className={`dropdown link-dropdown ${mobileActiveDropdown === category ? 'active-mobile' : ''}`}>
            <Link 
              to={`/category/${category}`} 
              className="nav-dropdown-trigger" 
              onClick={(e) => toggleMobileDropdown(category, e)}
            >
              {category.replace(/-/g, ' ')} ▾
            </Link>
            <ul className={`simple-dropdown ${mobileActiveDropdown === category ? 'visible' : ''}`}>
              <li className="mobile-only mobile-dropdown-header">
                <span>{category.replace(/-/g, ' ')}</span>
                <button className="close-sub-btn" onClick={(e) => { e.stopPropagation(); setMobileActiveDropdown(null); }}>×</button>
              </li>
              {products.map((product) => (
                <li key={product.name}>
                  <Link to={product.path} onClick={closeMenus}>{product.name}</Link>
                </li>
              ))}
            </ul>
          </li>
        ))}

        {NAV_LINKS.filter(l => l.name !== "Home").map((link) => (
          <li key={link.name}>
            {link.path.startsWith('#') ? (
              <a href={link.path} onClick={closeMenus}>{link.name}</a>
            ) : (
              <Link to={link.path} onClick={closeMenus}>{link.name}</Link>
            )}
          </li>
        ))}

        {isAdminLoggedIn && (
          <li className="admin-nav-item">
            <Link to="/admin/dashboard" onClick={exitPreview} className="back-to-admin-btn">
              Dashboard <span>→</span>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Header;
