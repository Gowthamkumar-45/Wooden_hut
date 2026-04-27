import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { SITE_CONTENT, NAV_LINKS, PRODUCTS_MENU } from '../../constants/content';
import './Header.css';

const Header = () => {


  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Flatten all products for searching
  const allProducts = Object.entries(PRODUCTS_MENU).flatMap(([category, products]) => 
    products.map(p => ({ ...p, category: category.replace(/-/g, ' ') }))
  );

  const filteredResults = searchQuery.trim() === '' 
    ? [] 
    : allProducts.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8);

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleResultClick = (path) => {
    navigate(path);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const isAdminLoggedIn = !!sessionStorage.getItem('token');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll Lock for Mobile Menu
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (isMobileMenuOpen) {
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
      body.style.touchAction = 'none'; // Prevent touch scroll
    } else {
      html.style.overflow = 'unset';
      body.style.overflow = 'unset';
      body.style.touchAction = 'unset';
    }
    return () => {
      html.style.overflow = 'unset';
      body.style.overflow = 'unset';
      body.style.touchAction = 'unset';
    };
  }, [isMobileMenuOpen]);

  const toggleMobileDropdown = (category, e) => {
    if (window.innerWidth <= 1200) {
      e.preventDefault();
      e.stopPropagation();
      setMobileActiveDropdown(mobileActiveDropdown === category ? null : category);
    }
  };

  const closeMenus = () => {
    setIsMobileMenuOpen(false);

    setMobileActiveDropdown(null);
  };

  const exitPreview = () => {
    localStorage.removeItem('admin_preview');
    closeMenus();
  };

  return (
    <nav id="main-nav" style={{ boxShadow: isScrolled ? '0 4px 28px rgba(44,26,14,0.1)' : 'none' }}>
      <Link to="/" className="nav-logo" onClick={closeMenus}>
        <img src="/Woodenhut_logo_transparent.png" alt={SITE_CONTENT.brand.name} className="nav-logo-img" />
        <div className="nav-logo-text">
          <span className="brand-name">{SITE_CONTENT.brand.name}</span>
          <span className="brand-sub">{SITE_CONTENT.brand.subName}</span>
        </div>
      </Link>

      <div className={`hamburger ${isMobileMenuOpen ? 'open' : ''} ${mobileActiveDropdown ? 'hide-for-dropdown' : ''}`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        <span className="line"></span>
        <span className="line"></span>
        <span className="line"></span>
      </div>

      <ul className={`nav-links ${isMobileMenuOpen ? 'mobile-active' : ''}`}>
        <li><Link to="/" onClick={closeMenus}>Home</Link></li>
        <li><Link to="/about" onClick={closeMenus}>About Us</Link></li>

        {Object.entries(PRODUCTS_MENU).map(([category, products]) => (
          <li key={category} className={`dropdown link-dropdown ${mobileActiveDropdown === category ? 'active-mobile' : ''}`}>
            <Link
              to={`/category/${category}`}
              className="nav-dropdown-trigger"
              onClick={(e) => toggleMobileDropdown(category, e)}
            >
              {category.replace(/-/g, ' ')} ▾
            </Link>
            {/* Desktop Only Dropdown */}
            <ul className="simple-dropdown desktop-only">
              {products.map((product) => (
                <li key={product.name}>
                  <Link to={product.path} onClick={closeMenus}>{product.name}</Link>
                </li>
              ))}
            </ul>
          </li>
        ))}

        {/* Explore More Dropdown */}
        <li className={`dropdown link-dropdown ${mobileActiveDropdown === 'explore-more' ? 'active-mobile' : ''}`}>
          <span 
            className="nav-dropdown-trigger"
            onClick={(e) => toggleMobileDropdown('explore-more', e)}
          >
            Explore More ▾
          </span>
          {/* Desktop Only Dropdown */}
          <ul className="simple-dropdown desktop-only">
            <li><Link to="/furniture-making" onClick={closeMenus}>Furniture Making</Link></li>
            <li><Link to="/media" onClick={closeMenus}>Media</Link></li>
            <li><Link to="/reviews" onClick={closeMenus}>Reviews</Link></li>
          </ul>
        </li>

        {/* Other Nav Links */}
        {NAV_LINKS.filter(l => !["Home", "Furniture Making", "Media", "Reviews", "About Us"].includes(l.name)).map((link) => (
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

      <div className="nav-actions">
        <div className={`search-container ${isSearchOpen ? 'active' : ''}`}>
          <button 
            className="search-btn" 
            aria-label="Search"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search size={17} />
          </button>
          
          {isSearchOpen && (
            <div className="search-dropdown">
              <div className="search-input-wrapper">
                <Search size={14} className="search-icon-inner" />
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  className="search-input"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim() !== '') {
                      handleSearchSubmit();
                    }
                  }}
                  onBlur={() => setTimeout(() => {
                    if (searchQuery === '') setIsSearchOpen(false);
                  }, 200)}
                />
              </div>
              
              {searchQuery.trim() !== '' && (
                <div className="search-results-list">
                  {filteredResults.length > 0 ? (
                    filteredResults.map((product, idx) => (
                      <div 
                        key={idx} 
                        className="search-result-item"
                        onClick={() => handleResultClick(product.path)}
                      >
                        <div className="result-info">
                          <span className="result-name">{product.name}</span>
                          <span className="result-category">{product.category}</span>
                        </div>
                        <Search size={12} className="result-arrow" />
                      </div>
                    ))
                  ) : (
                    <div className="no-results">No products found</div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* GLOBAL MOBILE MODAL - Renders outside transforms to fix alignment */}
      {mobileActiveDropdown && (
        <div className="mobile-modal-overlay" onClick={() => setMobileActiveDropdown(null)}>
          <div className="mobile-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-modal-header">
              <span>{mobileActiveDropdown === 'explore-more' ? 'Explore More' : mobileActiveDropdown.replace(/-/g, ' ')}</span>
              <button className="close-modal-btn" onClick={() => setMobileActiveDropdown(null)}>×</button>
            </div>
            <ul className="mobile-modal-list">
              {mobileActiveDropdown === 'explore-more' ? (
                <>
                  <li><Link to="/furniture-making" onClick={closeMenus}>Furniture Making</Link></li>
                  <li><Link to="/media" onClick={closeMenus}>Media</Link></li>
                  <li><Link to="/reviews" onClick={closeMenus}>Reviews</Link></li>
                </>
              ) : (
                PRODUCTS_MENU[mobileActiveDropdown]?.map((product) => (
                  <li key={product.name}>
                    <Link to={product.path} onClick={closeMenus}>{product.name}</Link>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}

    </nav>
  );
};

export default Header;
