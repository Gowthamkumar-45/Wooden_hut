import React, { useEffect, useState, useRef } from 'react';
import './FurnitureMaking.css';

const FurnitureMaking = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const timelineRef = useRef(null);

    const slides = [
        {
            image: "https://images.unsplash.com/photo-1503602642458-232111445657?w=1600&q=80&fit=crop",
            label: "Planning & Design",
            title: "Where Every Creation Begins",
            badge: "Phase 01"
        },
        {
            image: "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=1600&q=80&fit=crop",
            label: "Crafting in Progress",
            title: "Traditional Hand-Carved Joinery",
            badge: "Phase 02"
        },
        {
            image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1600&q=80&fit=crop",
            label: "The Masterpiece",
            title: "Final Polished Perfection",
            badge: "Phase 03"
        }
    ];

    const makingSteps = [
        { 
            id: "01", 
            title: "Choosing the right quality wood", 
            desc: "The foundation of every piece. We hand-select only the finest, A-grade teak and timber, ensuring superior grain structure and lasting durability.",
            img: "https://images.unsplash.com/photo-1603380353725-f8a4d39cc41e?w=800&q=80" 
        },
        { 
            id: "02", 
            title: "Chopping the woods", 
            desc: "Precision in every cut. Our master craftsmen carefully dimension the raw timber to extract the best possible sections for your furniture's framework.",
            img: "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=800&q=80" 
        },
        { 
            id: "03", 
            title: "Seasoning the wood", 
            desc: "A patient process. We slow-season the wood to reach the ideal moisture balance, preventing any future warping, shrinking, or seasonal cracking.",
            img: "https://images.unsplash.com/photo-1542621334-a254cf47733d?w=800&q=80" 
        },
        { 
            id: "04", 
            title: "Carpentry work", 
            desc: "The heart of our craft. Traditional interlocking joinery and hand-carving techniques come together to create a structure that's both strong and soulful.",
            img: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=800&q=80" 
        },
        { 
            id: "05", 
            title: "Polish to embrace the teak", 
            desc: "Bringing out the inner glow. Multiple layers of hand-rubbed polish protect the surface while celebrating the deep, natural warmth of the teak grain.",
            img: "https://images.unsplash.com/photo-1621319011735-99d29729851a?w=800&q=80" 
        },
        { 
            id: "06", 
            title: "We depart to make homes beautiful", 
            desc: "The final journey. Each finished masterpiece is carefully transported with the promise of bringing timeless elegance and warmth to your family home.",
            img: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80" 
        }
    ];

    const processes = [
        { id: 1, title: "Raw Teak Selection", time: "02:45", thumb: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&q=80" },
        { id: 2, title: "Precision Cutting", time: "01:30", thumb: "https://images.unsplash.com/photo-1542621334-a254cf47733d?w=800&q=80" },
        { id: 3, title: "Hand Carving Detail", time: "04:15", thumb: "https://images.unsplash.com/photo-1543332164-6e82f355badc?w=800&q=80" },
        { id: 4, title: "Traditional Polishing", time: "03:10", thumb: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80" }
    ];

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
                    <span className="process-label">The Journey</span>
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
                    {processes.map(p => (
                        <div key={p.id} className="process-card">
                            <div className="video-wrap">
                                <img src={p.thumb} alt={p.title} />
                                <div className="video-overlay">
                                    <span className="watch-yt">Watch on <strong>YouTube</strong></span>
                                </div>
                                <span className="duration-tag">{p.time}</span>
                            </div>
                            <div className="process-info">
                                <h3 className="process-video-title">{p.title}</h3>
                                <p className="process-video-desc">Experience our traditional {p.title.toLowerCase()} process in high definition detail.</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
};

export default FurnitureMaking;
