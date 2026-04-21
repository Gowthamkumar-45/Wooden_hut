import React, { useEffect, useState, useRef } from 'react';
import './FurnitureMaking.css';
import { SITE_CONTENT, FURNITURE_MAKING_CONTENT } from '../../constants/content';

const FurnitureMaking = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const timelineRef = useRef(null);

    const slides = FURNITURE_MAKING_CONTENT.heroSlides;
    const makingSteps = FURNITURE_MAKING_CONTENT.makingSteps;

    const [publishedVideos, setPublishedVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await fetch(`${SITE_CONTENT.api.base}/api/making-videos/`);
                if (res.ok) {
                    const data = await res.json();
                    setPublishedVideos(data);
                }
            } catch (err) {
                console.error("Failed to load making videos:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchVideos();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 3000);
        return () => clearInterval(timer);
    }, [slides.length]);

    useEffect(() => {
        window.scrollTo(0, 0);
        
        const timer = setTimeout(() => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, { threshold: 0.2 });

            const stepRows = document.querySelectorAll('.step-row');
            stepRows.forEach(el => observer.observe(el));

            return () => observer.disconnect();
        }, 400);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="furniture-making-page">
            {/* FULL WIDTH SLIDER HERO */}
            <section className="making-slider-hero">
                {slides.map((slide, idx) => (
                    <div 
                        key={idx} 
                        className={`slide-item ${idx === currentSlide ? 'active' : ''}`}
                        style={{ backgroundImage: `url(${slide.image})` }}
                    >
                        <div className="slide-overlay">
                            <div className="slide-content">
                                <span className="slide-badge">{slide.badge}</span>
                                <h2 className="slide-label">{slide.label}</h2>
                                <h1 className="slide-title">{slide.title}</h1>
                            </div>
                        </div>
                    </div>
                ))}
                <div className="slider-dots">
                    {slides.map((_, idx) => (
                        <button 
                            key={idx} 
                            className={`dot ${idx === currentSlide ? 'active' : ''}`}
                            onClick={() => setCurrentSlide(idx)}
                        ></button>
                    ))}
                </div>
            </section>

            {/* TREE STRUCTURE STEPS SECTION */}
            <section className="making-steps-section" ref={timelineRef}>
                <div className="steps-header">
                    <span className="process-label1">The Journey</span>
                    <h2 className="process-main-title">Steps of <em>Furniture Making</em></h2>
                </div>

                <div className="tree-container">
                    <div className="tree-line"></div>
                    {makingSteps.map((step, idx) => (
                        <div key={step.id} className={`step-row ${idx % 2 === 0 ? 'left' : 'right'}`}>
                            <div className="step-header-info">
                                <span className="step-number">{step.id}</span>
                                <h3 className="step-main-title">{step.title}</h3>
                            </div>
                            <div className="step-body">
                                {idx % 2 === 0 ? (
                                    <>
                                        <div className="step-visual">
                                            <img src={step.img} alt={step.title} />
                                        </div>
                                        <div className="step-details">
                                            <p>{step.desc}</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="step-details">
                                            <p>{step.desc}</p>
                                        </div>
                                        <div className="step-visual">
                                            <img src={step.img} alt={step.title} />
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="tree-dot"></div>
                        </div>
                    ))}
                </div>
            </section>

            {/* PROCESS VIDEOS GRID */}
            <section className="process-section">
                <div className="process-header">
                    <span className="process-label">Craftsmanship in Motion</span>
                    <h2 className="process-main-title">Our Making <em>Process Videos</em></h2>
                </div>
                <div className="process-grid">
                    {loading ? (
                        <div className="process-loading">Exploring our workshop...</div>
                    ) : publishedVideos.length > 0 ? (
                        publishedVideos.map(p => (
                            <div key={p.id} className="process-card" onClick={() => {
                                if (p.youtube_url) {
                                    window.open(p.youtube_url, '_blank');
                                } else if (p.video_file) {
                                    window.open(p.video_file, '_blank');
                                }
                            }}>
                                <div className="video-wrap">
                                    <img src={p.thumbnail || "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=800&q=80"} alt={p.title} />
                                    <div className="video-overlay">
                                        {p.youtube_url ? (
                                            <span className="watch-yt">Watch on <strong>YouTube</strong></span>
                                        ) : (
                                            <span className="watch-yt">Play <strong>Video</strong></span>
                                        )}
                                    </div>
                                    <span className="duration-tag">{p.youtube_url ? 'YouTube' : 'Original Piece'}</span>
                                </div>
                                <div className="process-info">
                                    <h3 className="process-video-title">{p.title}</h3>
                                    <p className="process-video-desc">{p.description || `Experience our traditional ${p.title.toLowerCase()} process in high definition detail.`}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="process-empty">No videos shared yet. Check back soon!</div>
                    )}
                </div>
            </section>

        </div>
    );
};

export default FurnitureMaking;
