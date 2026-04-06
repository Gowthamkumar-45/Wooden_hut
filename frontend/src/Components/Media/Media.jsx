import React, { useState, useEffect } from 'react';
import './Media.css';

const Media = () => {
    const [filter, setFilter] = useState('all');

    const [galleryData, setGalleryData] = useState([]);

    useEffect(() => {
        const savedPhotos = JSON.parse(localStorage.getItem('admin_media_photos') || '[]');
        const savedVideos = JSON.parse(localStorage.getItem('admin_media_videos') || '[]');
        
        // Map common fields
        const formattedPhotos = savedPhotos.map(p => ({ ...p, src: p.url }));
        const formattedVideos = savedVideos.map(v => ({ ...v, src: v.thumbnail || v.thumb }));
        
        const combined = [...formattedPhotos, ...formattedVideos].sort((a, b) => b.id - a.id);
        
        if (combined.length > 0) {
            setGalleryData(combined);
        } else {
            // Default sample data
            setGalleryData([
                { id: 1, type: 'photo', src: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=800&q=80', title: 'Precision Cutting' },
                { id: 2, type: 'video', src: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg', title: 'Luxury Polishing', duration: '2:45', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
            ]);
        }
    }, []);

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
                        <div key={item.id} className="media-item" onClick={() => {
                            if (item.type === 'video') {
                                const videoId = item.url?.split('v=')[1]?.split('&')[0] || item.url?.split('/').pop();
                                window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
                            } else {
                                window.open(item.src, '_blank');
                            }
                        }} style={{ cursor: 'pointer' }}>
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
                                    {item.type === 'video' && <span className="duration">{item.duration || 'Play Video'}</span>}
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
