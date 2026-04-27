import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { WhatsAppOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { SITE_CONTENT } from '../../constants/content';
import './SearchResults.css';

const SearchResults = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Get search query from URL params
  const query = new URLSearchParams(location.search).get('q') || '';

  const logWhatsAppContact = async (productName) => {
    try {
      await fetch(`${SITE_CONTENT.api.base}/api/whatsapp-contacts/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_name: productName })
      });
    } catch (err) {
      console.error("Failed to log contact:", err);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${SITE_CONTENT.api.base}/api/products/?search=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          const items = Array.isArray(data) ? data : (data.results || []);
          setProducts(items);
        }
      } catch (err) {
        console.error("Search Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    } else {
      setLoading(false);
    }
  }, [query]);

  const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/600x400?text=No+Image';
    if (path.startsWith('http')) return path;
    const base = SITE_CONTENT.api.base.endsWith('/') ? SITE_CONTENT.api.base.slice(0, -1) : SITE_CONTENT.api.base;
    return `${base}${path.startsWith('/') ? path : `/${path}`}`;
  };

  return (
    <div className="search-results-page">
      <section className="search-header">
        <div className="search-header-content">
          <Link to="/" className="back-link">
            <ArrowLeftOutlined /> Back to Home
          </Link>
          <h1 className="search-title">
            Search Results for <em>"{query}"</em>
          </h1>
          <p className="search-meta">
            We found {products.length} {products.length === 1 ? 'masterpiece' : 'masterpieces'} matching your search.
          </p>
        </div>
      </section>

      <section className="search-content">
        {loading ? (
          <div className="search-loader">
            <div className="premium-loader"></div>
            <p>Searching our collections...</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.length > 0 ? (
              products.map(product => (
                <div key={product.id} className="product-card">
                  <div className="product-image-container">
                    <img
                      src={getImageUrl(product.main_image)}
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/600x400?text=Masterpiece';
                      }}
                    />
                    <div className={`product-badge ${!product.in_stock ? 'out-of-stock' : ''}`}>
                      {product.in_stock ? (product.sub_category_name || 'Premium') : 'Out of Stock'}
                    </div>
                  </div>
                  <div className="product-details">
                    <div className="product-mat">{product.material}</div>
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-brief">{product.description?.substring(0, 85)}...</p>
                    <div className="product-card-footer">
                      <Link to={`/product/${product.slug}`} className="product-btn view-details-btn">
                        View Details <span>→</span>
                      </Link>
                       <a 
                        href={`https://wa.me/${SITE_CONTENT.contact.whatsapp}?text=I'm interested in ${product.name}`}
                        target="_blank"
                        rel="noreferrer"
                        className="product-btn whatsapp-btn"
                        onClick={() => logWhatsAppContact(product.name)}
                      >
                        <WhatsAppOutlined />
                        Contact Us
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results-found">
                <div className="no-data-icon">🔍</div>
                <h3>No masterpieces matching "{query}"</h3>
                <p>We couldn't find any products matching your search. Please try different keywords or browse our categories.</p>
                <div className="no-results-actions">
                    <Link to="/" className="search-action-btn">Return Home</Link>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default SearchResults;
