import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { WhatsAppOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { categoryData } from '../../constants/data';
import { SITE_CONTENT } from '../../constants/content';
import './CategoryPage.css';

// Maps sub-category slugs to their parent category for hero/branding inheritance
const SUB_TO_CAT_MAP = {
  'king-size-beds': 'bedroom',
  'queen-size-beds': 'bedroom',
  'single-beds': 'bedroom',
  'cradle': 'bedroom',
  'wardrobes': 'bedroom',
  'dressing-tables': 'bedroom',
  'sofa-sets': 'living',
  'teapoy': 'living',
  'pooja-unit': 'living',
  'dining-tables': 'dining',
  'dining-chairs': 'dining',
  'crockery-units': 'dining',
  'bar-cabinets': 'dining',
  'dinning': 'dining',
  'office-tables': 'office',
  'office-chairs': 'office',
  'bookshelves': 'office',
  'office-storage': 'office',
  'office-storage-cabinets': 'office',
  'storage-cabinets': 'office',
  'bed-side-table': 'bedroom',
  'tv-unit': 'living',
  'storage-unit': 'living',
  'swing': 'living',
  'chairs': 'living',
  'doors': 'doors-and-windows',
  'windows': 'doors-and-windows',
  'nilai': 'doors-and-windows'
};

// Maps common aliases to the actual database slugs
const ALIAS_MAP = {
  'sofa': 'sofa-sets',
  'living-room': 'living',
  'dining-room': 'dining',
  'cots': 'bedroom',
  'beds': 'bedroom',
  'swings': 'swing',
  'pooja': 'pooja-unit',
  'side-table': 'bed-side-table',
  'tv-cabinet': 'tv-unit',
  'dining-table-sets': 'dining-tables',
  'office-storage-cabinets': 'office-storage-cabinets',
  'doors-windows': 'doors-and-windows'  
};

const CategoryPage = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Resolve actual slug from alias (e.g. 'sofa' -> 'sofa-sets')
  const resolvedSlug = ALIAS_MAP[categoryId] || categoryId;
  
  // Check if it's a sub-category that points to a parent for branding
  const parentCategorySlug = SUB_TO_CAT_MAP[resolvedSlug];
  const isSubCategory = !!parentCategorySlug;
  const dbCategorySlug = parentCategorySlug || resolvedSlug;

  const categoryInfo = categoryData[resolvedSlug] || categoryData[dbCategorySlug] || {
    name: 'Fine Furniture',
    accentName: 'Woodenhut',
    heroImage: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1600&q=80&fit=crop',
    label: 'Timeless Crafts',
    description: 'Bespoke wooden furniture designed for those who appreciate pure craftsmanship.'
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Query the database using the resolved slug
        const filterParam = isSubCategory ? `subcategory=${resolvedSlug}` : `category=${resolvedSlug}`;
        const response = await fetch(`${SITE_CONTENT.api.base}/api/products/?${filterParam}`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryId, dbCategorySlug, isSubCategory, resolvedSlug]);

  const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/600x400?text=No+Image';
    if (path.startsWith('http')) return path;
    const base = SITE_CONTENT.api.base.endsWith('/') ? SITE_CONTENT.api.base.slice(0, -1) : SITE_CONTENT.api.base;
    const imgPath = path.startsWith('/') ? path : `/${path}`;
    return `${base}${imgPath}`;
  };

  return (
    <div className="category-page-container">
      <section className="category-hero">
        <img
          src={categoryInfo.heroImage}
          alt={categoryInfo.name}
          className="hero-bg-img"
          onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1600'}
        />
        <div className="hero-overlay"></div>
        <div className="category-hero-content">
          <div className="category-label">Collections / {categoryInfo.name}</div>
          <h1 className="category-title">
            {categoryInfo.accentName} <em>{categoryInfo.name}</em>
          </h1>
          <p className="category-desc">{categoryInfo.description}</p>
        </div>
        <div className="scroll-indicator">
          <span>Explore Collection</span>
          <div className="scroll-arrow">
            <ArrowDownOutlined />
          </div>
        </div>
      </section>

      <section className="category-products">
        <div className="variety-header">
          <div className="header-label">{categoryInfo.label}</div>
          <h2 className="header-title">Explore <em>Varieties</em></h2>
        </div>

        {loading ? (
          <div className="loader-container">
            <div className="premium-loader"></div>
            <p>Fetching your masterpieces...</p>
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
                      onError={(e) => e.target.src = 'https://via.placeholder.com/600x400?text=Masterpiece'}
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
              <div className="no-products">
                <div className="no-data-icon">🪑</div>
                <h3>No masterpieces here yet</h3>
                <p>We are currently updating our {categoryInfo.name} collection. Please check back soon!</p>
                <Link to="/" className="back-home-minimal">Return Home</Link>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default CategoryPage;
