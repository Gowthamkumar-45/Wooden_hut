import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Form, Input, Button, Rate, message as antMessage, Spin } from 'antd';
import { SITE_CONTENT } from '../../constants/content';
import WhatsAppEnquiryButton from '../WhatsAppEnquiryButton/WhatsAppEnquiryButton';
import './ProductDetail.css';

const reviewSchema = yup.object().shape({
  rating: yup.number().min(1, "Please provide a rating").required("Rating is required"),
  subject: yup.string().required("Subject is required"),
  review: yup.string().min(10, "Review should be at least 10 characters").required("Review is required"),
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email address").required("Email is required"),
});

const ProductDetail = () => {
  const { productSlug } = useParams();
  const [product, setProduct] = useState(null);
  // const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [retryMessage, setRetryMessage] = useState('');
  const [activeImg, setActiveImg] = useState('');
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const imgRef = useRef(null);

  const { handleSubmit, control, reset, formState: { errors } } = useForm({
    resolver: yupResolver(reviewSchema),
    defaultValues: { rating: 0, subject: '', review: '', name: '', email: '' }
  });

  const getImageUrl = useCallback((path) => {
    if (!path) return 'https://via.placeholder.com/800x600?text=No+Image';
    if (path.startsWith('http')) return path;
    const base = SITE_CONTENT.api.base.endsWith('/') ? SITE_CONTENT.api.base.slice(0, -1) : SITE_CONTENT.api.base;
    const imgPath = path.startsWith('/') ? path : `/${path}`;
    return `${base}${imgPath}`;
  }, []);

  const fetchProductAndReviews = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    setRetryMessage('');
    
    const maxRetries = 5;
    let attempt = 0;
    let success = false;
    
    while (attempt < maxRetries && !success) {
      try {
        if (attempt > 0) {
          setRetryMessage(`Connection slow or server warming up. Retrying... (Attempt ${attempt}/${maxRetries})`);
        }
        
        const productRes = await fetch(`${SITE_CONTENT.api.base}/api/products/${productSlug}/`);
        
        if (productRes.ok) {
          const prodData = await productRes.json();
          setProduct(prodData);
          setActiveImg(getImageUrl(prodData.main_image));
          success = true;
          setRetryMessage('');
          setErrorMsg('');
        } else {
          if (productRes.status === 404) {
            setErrorMsg("Product not found");
            setProduct(null);
            success = true;
          } else {
            throw new Error(`Server returned status ${productRes.status}`);
          }
        }
      } catch (err) {
        console.error(`Fetch attempt ${attempt + 1} failed:`, err);
        attempt++;
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 2500));
        } else {
          setErrorMsg("Failed to load product. The server might be temporarily down. Please try again.");
        }
      }
    }
    setLoading(false);
  }, [productSlug, getImageUrl]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProductAndReviews();
  }, [fetchProductAndReviews]);

  // Related products: same sub-category when the product has one, otherwise
  // same category — same filter params CategoryPage already uses server-side.
  useEffect(() => {
    if (!product) { setRelatedProducts([]); return; }
    const filterParam = product.sub_category_slug
      ? `subcategory=${product.sub_category_slug}`
      : product.category_slug
        ? `category=${product.category_slug}`
        : null;
    if (!filterParam) { setRelatedProducts([]); return; }

    let cancelled = false;
    fetch(`${SITE_CONTENT.api.base}/api/products/?${filterParam}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (cancelled) return;
        const items = Array.isArray(data) ? data : (data.results || []);
        setRelatedProducts(items.filter((p) => p.id !== product.id).slice(0, 8));
      })
      .catch(() => { if (!cancelled) setRelatedProducts([]); });
    return () => { cancelled = true; };
  }, [product]);

  // Gallery Images definition moved up
  const galleryImages = React.useMemo(() => product 
    ? [product.main_image, product.image2, product.image3, product.image4, product.image5]
        .filter(img => img)
        .map(img => getImageUrl(img))
    : [], [product, getImageUrl]);

  // Preload every gallery image up front so each auto-scroll swap (below)
  // renders instantly instead of landing on a not-yet-loaded frame.
  useEffect(() => {
    galleryImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [galleryImages]);

  // Auto-scroll pauses the moment the customer starts zooming in — cycling
  // the image out from under them mid-inspection is exactly the confusing
  // behavior this fixes (confirmed live: it kept advancing every ~3s even
  // during continuous hovering, so the zoomed view never held still long
  // enough to actually look at). Resumes, with a fresh 3s countdown, the
  // instant the mouse leaves.
  useEffect(() => {
    if (galleryImages.length <= 1 || isZooming) return;

    const interval = setInterval(() => {
      setActiveImg((prev) => {
        const currentIndex = galleryImages.indexOf(prev);
        const nextIndex = (currentIndex + 1) % galleryImages.length;
        return galleryImages[nextIndex];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [galleryImages, isZooming]);

  // Throttled to once per animation frame via rAF — handleMouseMove was
  // firing (and re-rendering the whole page) on every raw mousemove event,
  // easily 100+/sec. That render pressure while actively hovering is the
  // most likely real cause of the auto-scroll *feeling* stuck: its own
  // state update has to fight through a queue of zoom-position renders.
  const rafRef = useRef(null);
  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  const handleMouseMove = (e) => {
    if (!imgRef.current) return;
    const { clientX, clientY } = e;
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      if (!imgRef.current) return;
      const { left, top, width, height } = imgRef.current.getBoundingClientRect();
      let x = ((clientX - left) / width) * 100;
      let y = ((clientY - top) / height) * 100;
      x = Math.max(0, Math.min(100, x));
      y = Math.max(0, Math.min(100, y));
      setZoomPos({ x, y });
    });
  };

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${SITE_CONTENT.api.base}/api/reviews/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, product: product.id })
      });
      if (response.ok) {
        antMessage.success("Thank you! Your review has been submitted for approval.");
        reset();
      } else {
        antMessage.error("Failed to submit review. Please try again.");
      }
    } catch (err) {
      console.error("Submit Error:", err);
      antMessage.error("Something went wrong. Please check your connection.");
    }
  };

  const logWhatsAppContact = async (productName, branch) => {
    try {
      await fetch(`${SITE_CONTENT.api.base}/api/whatsapp-contacts/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_name: productName, branch })
      });
    } catch (err) {
      console.error("Failed to log contact:", err);
    }
  };

  if (loading) {
    return (
      <div className="detail-loader">
        <Spin size="large" />
        <span className="loading-text">Preparing details...</span>
        {retryMessage && <span className="retry-message">{retryMessage}</span>}
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="detail-error-container">
        <div className="error-icon">⚠️</div>
        <h3>{errorMsg}</h3>
        {errorMsg !== "Product not found" && (
          <button onClick={fetchProductAndReviews} className="retry-btn">
            Retry Loading
          </button>
        )}
        <Link to="/" className="back-home-btn">Go Back Home</Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="detail-error-container">
        <div className="error-icon">❓</div>
        <h3>Product not found</h3>
        <Link to="/" className="back-home-btn">Go Back Home</Link>
      </div>
    );
  }



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
              onError={(e) => {
                if (e.target.src !== 'https://via.placeholder.com/800x600?text=Product+Hero') {
                  e.target.src = 'https://via.placeholder.com/800x600?text=Product+Hero';
                }
              }}
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
          <div className={`status-badge ${product.in_stock ? 'in-stock' : 'out-of-stock'}`}>
            {product.in_stock ? '● In Stock' : '● Out of Stock'}
          </div>

          <p className="detail-desc">{product.description}</p>

          <div className="specs-container">
            <h4 className="specs-title">Specifications</h4>
            <table className="specs-table">
              <tbody>
                <tr><td>Category</td><td>{product.category_name} - {product.sub_category_name}</td></tr>
                <tr><td>Material</td><td>{product.material}</td></tr>
                <tr><td>Color</td><td>{product.color}</td></tr>
                {product.dimensions && <tr><td>Dimensions</td><td>{product.dimensions}</td></tr>}
                {product.storage && <tr><td>Storage</td><td>{product.storage}</td></tr>}
              </tbody>
            </table>
          </div>

          <div className="product-actions-row">
            <WhatsAppEnquiryButton
              productName={product.name}
              className="whatsapp-btn"
              onContact={logWhatsAppContact}
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" />
              Message Us
            </WhatsAppEnquiryButton>
            <div className="feature-item">
              <div className="icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M1 10h15m-1 0l3-5h4l1 5v7h-3m-12 0h11" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="7" cy="17" r="2" /><circle cx="18" cy="17" r="2" />
                </svg>
              </div>
              <div className="feature-text"><strong>Doorstep Delivery</strong><span>all over Tamil Nadu</span></div>
            </div>

            <div className="feature-item">
              <div className="icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="feature-text"><strong>Lifetime</strong><span>Guarantee</span></div>
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="related-section">
          <h3 className="related-title">You May Also Like</h3>
          <div className="related-grid">
            {relatedProducts.map((rp, idx) => (
              <Link key={rp.id} to={`/product/${rp.slug}`} className="related-card">
                <img
                  src={getImageUrl(rp.main_image)}
                  alt={rp.name}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400?text=Masterpiece'; }}
                />
                <div className="related-card-overlay"></div>
                <div className="related-card-body">
                  <div className="related-num">{(idx + 1).toString().padStart(2, '0')}</div>
                  <div className="related-line"></div>
                  <h4 className="related-name">{rp.name}</h4>
                  <div className="related-action">
                    <span className="related-view-btn">View Details →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="reviews-section-minimal">
        <div className="review-form-wrap centered">
          <h3>Add a Review</h3>
          <p className="form-sub">Your email address will not be published. Required fields are marked *</p>

          <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className="review-form">
            <Form.Item label="Your Rating *" validateStatus={errors.rating ? "error" : ""} help={errors.rating?.message}>
              <Controller name="rating" control={control} render={({ field }) => (<Rate {...field} />)} />
            </Form.Item>

            <Form.Item label="Subject *" validateStatus={errors.subject ? "error" : ""} help={errors.subject?.message} className="full-width" >
              <Controller name="subject" control={control} render={({ field }) => (<Input {...field} placeholder="Review Subject (e.g. Excellent Product)" />)} />
            </Form.Item>

            <Form.Item label="Your Review *" validateStatus={errors.review ? "error" : ""} help={errors.review?.message} className="full-width" >
              <Controller name="review" control={control} render={({ field }) => (<Input.TextArea {...field} placeholder="Write your comments here..." rows={4} />)} />
            </Form.Item>

            <div className="form-row">
              <Form.Item label="Name *" validateStatus={errors.name ? "error" : ""} help={errors.name?.message} >
                <Controller name="name" control={control} render={({ field }) => (<Input {...field} placeholder="Your Name" />)} />
              </Form.Item>

              <Form.Item label="Email *" validateStatus={errors.email ? "error" : ""} help={errors.email?.message} >
                <Controller name="email" control={control} render={({ field }) => (<Input {...field} placeholder="Your Email" />)} />
              </Form.Item>
            </div>

            <Form.Item className="submit-row">
              <div className="submit-btn-wrap">
                <Button type="primary" htmlType="submit" size="large" className="submit-review-btn">
                  Submit Review
                </Button>
                <Link to="/reviews" className="view-all-reviews-btn">View All Customer Reviews →</Link>
              </div>
            </Form.Item>
          </Form>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
