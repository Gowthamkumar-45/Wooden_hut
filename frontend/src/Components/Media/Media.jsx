import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { SITE_CONTENT } from '../../constants/content';
import './Media.css';

const Media = () => {
    const [filter, setFilter] = useState(() => localStorage.getItem('mediaFilter') || 'all');

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
        localStorage.setItem('mediaFilter', newFilter);
    };

    const [galleryData, setGalleryData] = useState([]);
    const [loading, setLoading] = useState(true);

    const getImageUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        const base = SITE_CONTENT.api.base.endsWith('/') ? SITE_CONTENT.api.base.slice(0, -1) : SITE_CONTENT.api.base;
        const imgPath = path.startsWith('/') ? path : `/${path}`;
        return `${base}${imgPath}`;
    };

    useEffect(() => {
        const fetchMedia = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${SITE_CONTENT.api.base}/api/media-items/`);
                if (res.ok) {
                    const data = await res.json();
                    // Format backend data for the gallery UI
                    const formatted = data.map(item => {
                        const originalUrl = getImageUrl(item.file);
                        
                        // Extension-aware Cloudinary URL builder
                        const fixUrl = (url, transformations, type, isPoster = false) => {
                            if (!url || !url.includes('res.cloudinary.com')) return url;
                            let newUrl = url;
                            // 1. Force correct resource type
                            if (type === 'video') {
                                newUrl = newUrl.replace('/image/upload/', '/video/upload/');
                            } else {
                                newUrl = newUrl.replace('/image/upload/', '/image/upload/');
                            }
                            // 2. Insert transformations
                            newUrl = newUrl.replace('/upload/', `/upload/${transformations}/`);
                            // 3. Handle extensions carefully (don't break on dots in filenames)
                            const extMatch = /\.(mp4|webm|ogg|mov|webp|jpg|jpeg|png|gif|avif)$/i.test(newUrl);
                            if (isPoster) {
                                newUrl = extMatch ? newUrl.replace(/\.[^/.]+$/, '.jpg') : `${newUrl}.jpg`;
                            } else if (!extMatch) {
                                newUrl = `${newUrl}.${type === 'video' ? 'mp4' : 'webp'}`;
                            }
                            return newUrl;
                        };

                        let poster = originalUrl;
                        let preview = originalUrl;

                        if (item.media_type === 'video' && originalUrl.includes('res.cloudinary.com')) {
                            // Robust previews for all videos
                            poster = fixUrl(originalUrl, 'f_auto,q_auto,so_0,w_800,c_limit', 'video', true);
                            preview = fixUrl(originalUrl, 'e_preview:duration_5.0,f_auto,q_auto', 'video');
                        } else if (item.media_type === 'photo' && originalUrl.includes('res.cloudinary.com')) {
                            poster = fixUrl(originalUrl, 'f_auto,q_auto', 'photo');
                            preview = poster;
                        }
                        
                        return {
                            id: item.id,
                            type: item.media_type,
                            poster: poster,
                            preview: preview,
                            title: item.title,
                            desc: item.description,
                            url: originalUrl
                        };
                    });
                    setGalleryData(formatted);
                }
            } catch (err) {
                console.error("Failed to load media:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMedia();
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
                        <button className={filter === 'all' ? 'active' : ''} onClick={() => handleFilterChange('all')}>All</button>
                        <button className={filter === 'photo' ? 'active' : ''} onClick={() => handleFilterChange('photo')}>Photos</button>
                        <button className={filter === 'video' ? 'active' : ''} onClick={() => handleFilterChange('video')}>Videos</button>
                    </div>
                </div>

                <div className="media-grid">
                    {loading ? (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px 0' }}>
                            <Spin size="large" />
                            <p style={{ marginTop: '20px', color: '#999' }}>Loading our gallery...</p>
                        </div>
                    ) : filteredData.length > 0 ? (
                        filteredData.map(item => (
                            <div key={item.id} className={`media-item ${item.type === 'video' ? 'video-item' : ''}`} onClick={() => window.open(item.type === 'video' ? item.preview.replace('e_preview:duration_5.0,', '') : item.url, '_blank')} style={{ cursor: 'pointer' }}>
                                <div className="media-wrap">
                                    {item.type === 'video' ? (
                                        <video
                                            src={item.preview}
                                            poster={item.poster}
                                            className="gallery-media"
                                            muted
                                            loop
                                            autoPlay
                                            playsInline
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <img src={item.poster} alt={item.title} className="gallery-media" />
                                    )}
                                    <div className="media-overlay">
                                        {item.type === 'video' && (
                                            <div className="play-icon">
                                                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </div>
                                        )}
                                        <h3 className="media-title">{item.title}</h3>
                                        <p className="media-desc">{item.desc}</p>
                                        {item.type === 'video' && <span className="duration">Play Video</span>}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px 0' }}>
                            <p style={{ color: '#999' }}>No media items found yet.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Media;
