import React, { useState, useEffect } from 'react';
import { SITE_CONTENT } from '../../constants/content';
import './Reviews.css';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchReviews = async () => {
            try {
                const response = await fetch(`${SITE_CONTENT.api.base}/api/reviews/`);
                if (response.ok) {
                    const data = await response.json();
                    setReviews(data);
                }
            } catch (err) {
                console.error("Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    if (loading) {
        return <div className="reviews-loading">Loading testimonials...</div>;
    }

    return (
        <div className="reviews-page">
            <header className="reviews-hero">
                <div className="hero-wrapper">
                    <div className="hero-info">
                        <span className="hero-label">Community Love</span>
                        <h1 className="hero-title">Customer <em>Testimonials</em></h1>
                        <p className="hero-desc">Discover what our clients have to say about their {SITE_CONTENT.brand.name} experience. Real stories from real homes.</p>
                    </div>
                    <div className="hero-visual">
                        <img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1600&q=80" alt={`${SITE_CONTENT.brand.name} interior`} />
                        <div className="experience-badge">
                            <strong>{SITE_CONTENT.brand.experience}</strong>
                            <span>of Excellence</span>
                        </div>
                    </div>
                </div>
            </header>

            <section className="reviews-listing-section">
                <div className="reviews-grid">
                    {reviews.length > 0 ? (
                        reviews.map(rev => (
                            <div key={rev.id} className="testimonial-card">
                                <div className="card-top">
                                    <div className="stars">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className={`star ${i < rev.rating ? 'active' : ''}`}>★</span>
                                        ))}
                                    </div>
                                    <span className="rev-date">{new Date(rev.created_at).toLocaleDateString()}</span>
                                </div>
                                <h3 className="rev-name">{rev.name}</h3>
                                <span className="rev-product">Purchased: {rev.product_name}</span>
                                {rev.subject && <h4 className="rev-subject">{rev.subject}</h4>}
                                <div className="rev-quotation">
                                    <svg viewBox="0 0 24 24" width="40" height="40" fill="var(--gold)" opacity="0.1">
                                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.887z" />
                                    </svg>
                                </div>
                                <p className="rev-comment">"{rev.review}"</p>
                            </div>
                        ))
                    ) : (
                        <div className="no-reviews">
                            <p>No reviews yet. Be the first to share your experience!</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Reviews;
