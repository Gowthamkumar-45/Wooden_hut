import React, { useEffect } from 'react';
import { SITE_CONTENT } from '../../constants/content';
import './Reviews.css';

const Reviews = () => {
    const reviewsData = [
        { id: 1, name: "Arun Kumar", date: "October 12, 2023", rating: 5, product: "Classic Teak Sofa", comment: "The craftsmanship is outstanding. We've been using it for months and the wood finish is still as vibrant as day one. Highly recommended!" },
        { id: 2, name: "Priya Singh", date: "September 28, 2023", rating: 4, product: "Minimalist Dining Table", comment: "Sturdy build and very elegant design. The delivery was slightly delayed but the product quality more than made up for it." },
        { id: 3, name: "Vikram Reddy", date: "August 15, 2023", rating: 5, product: "Royal Carved Bed", comment: "A masterpiece in our bedroom. You can really feel the weight and quality of the solid teak. Worth every rupee." },
        { id: 4, name: "Snehitha M.", date: "July 22, 2023", rating: 5, product: "Custom TV Console", comment: "The design team was very patient with my customization requests. The result is exactly what I envisioned." },
        { id: 5, name: "Anand Krishna", date: "June 05, 2023", rating: 4, product: "Office Desk", comment: "Great ergonomic design and very smooth finish. Excellent addition to my home office." }
    ];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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
                    {reviewsData.map(rev => (
                        <div key={rev.id} className="testimonial-card">
                            <div className="card-top">
                                <div className="stars">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className={`star ${i < rev.rating ? 'active' : ''}`}>★</span>
                                    ))}
                                </div>
                                <span className="rev-date">{rev.date}</span>
                            </div>
                            <h3 className="rev-name">{rev.name}</h3>
                            <span className="rev-product">Purchased: {rev.product}</span>
                            <div className="rev-quotation">
                                <svg viewBox="0 0 24 24" width="40" height="40" fill="var(--gold)" opacity="0.1">
                                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.887z" />
                                </svg>
                            </div>
                            <p className="rev-comment">"{rev.comment}"</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Reviews;
