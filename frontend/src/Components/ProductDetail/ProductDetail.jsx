import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Form, Input, Button, Rate, message as antMessage } from 'antd';
import { getProductById, categoryData } from '../../data';
import { SITE_CONTENT } from '../../constants/content';
import './ProductDetail.css';

// ✅ Yup Schema for Review Form
const reviewSchema = yup.object().shape({
    rating: yup.number().min(1, "Please provide a rating").required("Rating is required"),
    review: yup.string().min(10, "Review should be at least 10 characters").required("Review is required"),
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email address").required("Email is required"),
});

const ProductDetail = () => {
  const { productId } = useParams();
  const product = getProductById(productId);
  const [activeImg, setActiveImg] = useState('');
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const imgRef = useRef(null);

  const {
      handleSubmit,
      control,
      reset,
      formState: { errors },
  } = useForm({
      resolver: yupResolver(reviewSchema),
      defaultValues: {
          rating: 0,
          review: '',
          name: '',
          email: ''
      }
  });

  const handleMouseMove = (e) => {
    if (!imgRef.current) return;
    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    
    // Using clientX/clientY for viewport-relative coordinates
    let x = ((e.clientX - left) / width) * 100;
    let y = ((e.clientY - top) / height) * 100;
    
    // Constrain within bounds
    x = Math.max(0, Math.min(100, x));
    y = Math.max(0, Math.min(100, y));
    
    setZoomPos({ x, y });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  useEffect(() => {
    if (product) {
        setActiveImg(product.image);
    }
  }, [product]);

  const onSubmit = (data) => {
      console.log("Review Data:", data);
      antMessage.success("Thank you! Your review has been submitted for approval.");
      reset();
  };

  if (!product) return <div className="not-found">Product not found</div>;

  const relatedProducts = categoryData[product.categoryKey]?.products.filter(p => p.id !== product.id) || [];

  return (
    <div className="product-detail-page">


      <div className="product-main-section">
        {/* LEFT: IMAGES */}
        <div className="image-gallery">
          <div 
            className="main-image-wrap" 
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsZooming(true)}
            onMouseLeave={() => { setIsZooming(false); setZoomPos({ x: 0, y: 0 }); }}
            ref={imgRef}
          >
            <img 
              src={activeImg} 
              alt={product.name} 
              className="main-detail-img"
            />
            {isZooming && <div className="zoom-lens" style={{ left: `${zoomPos.x}%`, top: `${zoomPos.y}%` }}></div>}
          </div>
          <div className="thumbnail-strip">
            {(product.gallery || [product.image]).map((img, idx) => (
              <div 
                key={idx} 
                className={`thumb-wrap ${activeImg === img ? 'active' : ''}`}
                onClick={() => setActiveImg(img)}
              >
                <img src={img} alt={`${product.name} thumb ${idx}`} />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: INFO & ZOOM PANEL */}
        <div className="product-info-wrap">
          {isZooming && (
            <div 
                className="side-zoom-panel"
                style={{
                    backgroundImage: `url(${activeImg})`,
                    backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                    backgroundSize: '250%'
                }}
            ></div>
          )}

          <h1 className="detail-title">{product.name}</h1>
          <div className="status-badge">● In Stock</div>
          
          <p className="detail-desc">{product.description}</p>

          {product.specs && (
            <div className="specs-container">
              <h4 className="specs-title">Specifications</h4>
              <table className="specs-table">
                <tbody>
                  <tr><td>Category</td><td>{product.specs.category}</td></tr>
                  <tr><td>Primary Material</td><td>{product.specs.material}</td></tr>
                  <tr><td>Storage</td><td>{product.specs.storage}</td></tr>
                  <tr><td>Assembly Required</td><td>{product.specs.assembly}</td></tr>
                  <tr><td>Color</td><td>{product.specs.color}</td></tr>
                </tbody>
              </table>
            </div>
          )}

          {/* HORIZONTAL ACTIONS ROW */}
          <div className="product-actions-row">
               <a href={`https://wa.me/${SITE_CONTENT.contact.whatsapp}?text=I'm interested in ${product.name}`} target="_blank" rel="noreferrer" className="whatsapp-btn">
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" />
              Message Us
            </a>
            <div className="feature-item">
              <div className="icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M1 10h15m-1 0l3-5h4l1 5v7h-3m-12 0h11" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="7" cy="17" r="2" /><circle cx="18" cy="17" r="2" />
                </svg>
              </div>
              <div className="feature-text"><strong>Doorstep Delivery</strong><span>all over Tamil Nadu</span></div>
            </div>

            <div className="feature-item">
              <div className="icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="feature-text"><strong>Lifetime</strong><span>Guarantee</span></div>
            </div>

         
          </div>

      </div>
      </div>

      {/* REVIEW FORM ONLY SECTION */}
      <section className="reviews-section-minimal">
        <div className="review-form-wrap centered">
          <h3>Add a Review</h3>
          <p className="form-sub">Your email address will not be published. Required fields are marked *</p>
          
          <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className="review-form">
            <Form.Item
              label="Your Rating *"
              validateStatus={errors.rating ? "error" : ""}
              help={errors.rating?.message}
            >
              <Controller
                name="rating"
                control={control}
                render={({ field }) => (
                  <Rate {...field} />
                )}
              />
            </Form.Item>

            <Form.Item
              label="Your Review *"
              validateStatus={errors.review ? "error" : ""}
              help={errors.review?.message}
              className="full-width"
            >
              <Controller
                name="review"
                control={control}
                render={({ field }) => (
                  <Input.TextArea {...field} placeholder="Write your comments here..." rows={4} />
                )}
              />
            </Form.Item>

            <div className="form-row">
              <Form.Item
                label="Name *"
                validateStatus={errors.name ? "error" : ""}
                help={errors.name?.message}
              >
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Your Name" size="large" />
                  )}
                />
              </Form.Item>

              <Form.Item
                label="Email *"
                validateStatus={errors.email ? "error" : ""}
                help={errors.email?.message}
              >
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input {...field} placeholder="Your Email" size="large" />
                  )}
                />
              </Form.Item>
            </div>

            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" className="submit-review-btn">
                Submit Review
              </Button>
            </Form.Item>
          </Form>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="related-section">
          <h2 className="related-title">Related products</h2>
          <div className="related-grid">{relatedProducts.slice(0, 4).map(item => (
            <Link to={`/product/${item.id}`} key={item.id} className="related-card">
              <div className="related-img-wrap">
                <img src={item.image} alt={item.name} />
                <div className="read-more-overlay">Read more</div>
              </div>
              <h4 className="related-name">{item.name}</h4>
            </Link>
          ))}</div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
