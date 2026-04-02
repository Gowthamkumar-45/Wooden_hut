import React, { useState, useEffect } from 'react';
import './Media.css';

const Media = () => {
    const [filter, setFilter] = useState('all');

    const galleryData = [
        { id: 1, type: 'photo', src: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=800&q=80', title: 'Precision Cutting' },
        { id: 2, type: 'video', src: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=80', title: 'Luxury Polishing', duration: '2:45' },
        { id: 3, type: 'photo', src: 'https://images.unsplash.com/photo-1603380353725-f8a4d39cc41e?w=800&q=80', title: 'Handmade Joints' },
        { id: 4, type: 'photo', src: 'https://images.unsplash.com/photo-1549497538-301288c8545b?w=800&q=80', title: 'Custom Bedroom' },
        { id: 5, type: 'video', src: 'https://images.unsplash.com/photo-1542621334-a254cf47733d?w=800&q=80', title: 'Carving Art', duration: '4:12' },
        { id: 6, type: 'photo', src: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=800&q=80', title: 'Living Room Sets' },
        { id: 7, type: 'video', src: 'https://images.unsplash.com/photo-1506806732259-39c2d7168935?w=800&q=80', title: 'Teak Selection', duration: '1:30' },
        { id: 8, type: 'photo', src: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80', title: 'Dining Collection' }
    ];

    const filteredData = filter === 'all' ? galleryData : galleryData.filter(item => item.type === filter);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="media-page">
            {/* VIDEO HERO SECTION */}
            <section className="media-hero">
                <div className="video-hero-container">
                    <video 
                        className="background-video"
                        autoPlay 
                        muted 
                        loop 
                        playsInline 
                        poster="https://images.unsplash.com/photo-1542621334-a254cf47733d?q=80&w=2000"
                    >
                        <source src="https://assets.mixkit.co/videos/download/mixkit-carpenter-measuring-a-piece-of-wood-4950.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    <div className="video-overlay"></div>
                    <div className="hero-content">
                        <span className="hero-subtitle">Woodenhut Creations</span>
                        <h1 className="hero-title">Experience <em>The Craftsmanship</em></h1>
                        <p className="hero-des">Explore our world of artisanal furniture making through our curated photography and cinematic films.</p>
                    </div>
                </div>
            </section>

            {/* GALLERY SECTION */}
            <section className="gallery-section">
                <div className="gallery-header">
                    <h2 className="section-title">Our <em>Media Gallery</em></h2>
                    <div className="filter-controls">
                        <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All</button>
                        <button className={filter === 'photo' ? 'active' : ''} onClick={() => setFilter('photo')}>Photos</button>
                        <button className={filter === 'video' ? 'active' : ''} onClick={() => setFilter('video')}>Videos</button>
                    </div>
                </div>

                <div className="media-grid">
                    {filteredData.map(item => (
                        <div key={item.id} className="media-item">
                            <div className="media-wrap">
                                <img src={item.src} alt={item.title} />
                                <div className="media-overlay">
                                    {item.type === 'video' && (
                                        <div className="play-icon">
                                            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                    )}
                                    <h3 className="media-title">{item.title}</h3>
                                    {item.type === 'video' && <span className="duration">{item.duration}</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Media;
