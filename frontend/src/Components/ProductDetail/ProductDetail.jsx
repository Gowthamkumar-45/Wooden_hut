import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Form, Input, Button, Rate, message as antMessage, Spin } from 'antd';
import { SITE_CONTENT } from '../../constants/content';
import './ProductDetail.css';

const reviewSchema = yup.object().shape({
    rating: yup.number().min(1, "Please provide a rating").required("Rating is required"),
    review: yup.string().min(10, "Review should be at least 10 characters").required("Review is required"),
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email address").required("Email is required"),
});

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState('');
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const imgRef = useRef(null);

  const { handleSubmit, control, reset, formState: { errors } } = useForm({
      resolver: yupResolver(reviewSchema),
      defaultValues: { rating: 0, review: '', name: '', email: '' }
  });

  const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/800x600?text=No+Image';
    if (path.startsWith('http')) return path;
    const base = SITE_CONTENT.api.base.endsWith('/') ? SITE_CONTENT.api.base.slice(0, -1) : SITE_CONTENT.api.base;
    const imgPath = path.startsWith('/') ? path : `/${path}`;
    return `${base}${imgPath}`;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${SITE_CONTENT.api.base}/api/products/${productId}/`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
          setActiveImg(getImageUrl(data.main_image));
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleMouseMove = (e) => {
    if (!imgRef.current) return;
    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    let x = ((e.clientX - left) / width) * 100;
    let y = ((e.clientY - top) / height) * 100;
    x = Math.max(0, Math.min(100, x));
    y = Math.max(0, Math.min(100, y));
    setZoomPos({ x, y });
  };

  const onSubmit = (data) => {
      console.log("Review Data:", data);
      antMessage.success("Thank you! Your review has been submitted for approval.");
      reset();
  };

  const logWhatsAppContact = async () => {
    try {
        await fetch(`${SITE_CONTENT.api.base}/api/whatsapp-contacts/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product_name: product.name })
        });
    } catch (err) {
        console.error("Failed to log contact:", err);
    }
  };

  if (loading) return <div className="detail-loader"><Spin size="large" /><span>Preparing details...</span></div>;
  if (!product) return <div className="not-found">Product not found</div>;

  const galleryImages = [
      product.main_image,
      product.image2,
      product.image3,
      product.image4,
      product.image5
  ].filter(img => img).map(img => getImageUrl(img));

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
              onError={(e) => e.target.src = 'https://via.placeholder.com/800x600?text=Product+Hero'}
            />
            {isZooming && <div className="zoom-lens" style={{ left: `${zoomPos.x}%`, top: `${zoomPos.y}%` }}></div>}
          </div>
          <div className="thumbnail-strip">
            {galleryImages.map((img, idx) => (
              <div 
                key={idx} 
                className={`thumb-wrap ${activeImg === img ? 'active' : ''}`}
                onClick={() => setActiveImg(img)}
              >
                <img src={img} alt={`${product.name} thumb ${idx}`} onError={(e) => e.target.src = 'https://via.placeholder.com/150x150'} />
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

          <div className="specs-container">
            <h4 className="specs-title">Specifications</h4>
            <table className="specs-table">
              <tbody>
                <tr><td>Category</td><td>{product.category_name} - {product.sub_category_name}</td></tr>
                <tr><td>Material</td><td>{product.material}</td></tr>
                <tr><td>Color</td><td>{product.color}</td></tr>
                <tr><td>Dimensions</td><td>{product.dimensions}</td></tr>
                {product.storage && <tr><td>Storage</td><td>{product.storage}</td></tr>}
              </tbody>
            </table>
          </div>

          <div className="product-actions-row">
               <a 
                href={`https://wa.me/${SITE_CONTENT.contact.whatsapp}?text=I'm interested in ${product.name}`} 
                target="_blank" 
                rel="noreferrer" 
                className="whatsapp-btn"
                onClick={logWhatsAppContact}
               >
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

      <section className="reviews-section-minimal">
        <div className="review-form-wrap centered">
          <h3>Add a Review</h3>
          <p className="form-sub">Your email address will not be published. Required fields are marked *</p>
          
          <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className="review-form">
            <Form.Item label="Your Rating *" validateStatus={errors.rating ? "error" : ""} help={errors.rating?.message}>
              <Controller name="rating" control={control} render={({ field }) => ( <Rate {...field} /> )} />
            </Form.Item>

            <Form.Item label="Your Review *" validateStatus={errors.review ? "error" : ""} help={errors.review?.message} className="full-width" >
              <Controller name="review" control={control} render={({ field }) => ( <Input.TextArea {...field} placeholder="Write your comments here..." rows={4} /> )} />
            </Form.Item>

            <div className="form-row">
              <Form.Item label="Name *" validateStatus={errors.name ? "error" : ""} help={errors.name?.message} >
                <Controller name="name" control={control} render={({ field }) => ( <Input {...field} placeholder="Your Name" size="large" /> )} />
              </Form.Item>

              <Form.Item label="Email *" validateStatus={errors.email ? "error" : ""} help={errors.email?.message} >
                <Controller name="email" control={control} render={({ field }) => ( <Input {...field} placeholder="Your Email" size="large" /> )} />
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
    </div>
  );
};

export default ProductDetail;
