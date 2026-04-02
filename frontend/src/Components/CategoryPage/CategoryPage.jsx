import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { categoryData } from '../../data';
import './CategoryPage.css';

const CategoryPage = () => {
  const { categoryId } = useParams();
  const category = categoryData[categoryId] || categoryData['cots-and-beds'];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoryId]);

  return (
    <div className="category-page-container">
      <section className="category-hero">
        <img src={category.heroImage} alt={category.name} className="hero-bg-img" />
        <div className="hero-overlay"></div>
        <div className="category-hero-content">
          <div className="category-label">Our Collections</div>
          <h1 className="category-title">
            {category.accentName} <em>{category.name}</em>
          </h1>
          <p className="category-desc">{category.description}</p>
        </div>
      </section>

      <section className="category-products">
        <div className="variety-header">
            <div className="header-label">{category.label}</div>
            <h2 className="header-title">Explore <em>Varieties</em></h2>
        </div>

        <div className="products-grid">
          {category.products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                <img src={product.image} alt={product.name} />
                <div className="product-badge">{product.badge}</div>
              </div>
              <div className="product-details">
                <div className="product-mat">{product.material}</div>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-brief">{product.description}</p>
                <div className="product-card-footer">
                  <Link to={`/product/${product.id}`} className="view-details-btn">View Product Details <span>→</span></Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;
