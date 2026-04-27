import React, { useEffect } from 'react';
import { ArrowDownOutlined } from '@ant-design/icons';
import './About.css';

const About = () => {
    useEffect(() => {
        window.scrollTo(0, 0);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                } else {
                    entry.target.classList.remove('is-visible');
                }
            });
        }, { threshold: 0.1 });

        const elements = document.querySelectorAll('.animate-on-scroll');
        elements.forEach(el => observer.observe(el));

        return () => {
            elements.forEach(el => {
                if(el) observer.unobserve(el);
            });
        };
    }, []);

    return (
        <div className="about-page-container">
            {/* HERO SECTION */}
            <section className="about-hero">
                <div className="about-hero-overlay"></div>
                <img className="about-hero-bg fade-in" src="https://images.unsplash.com/photo-1634253539560-692feb6aeebb?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHdvb2RlbiUyMGZ1cm5pdHVyZSUyMGFib3V0JTIwcGFnZSUyMGltYWdlfGVufDB8MHwwfHx8MA%3D%3D" alt="Premium timber workshop" />
                <div className="about-hero-content">
                    <div className="about-hero-eyebrow fade-up">Our Story</div>
                    <h1 className="about-hero-title fade-up">The Roots of <br /><em>Our Legacy</em></h1>
                    <p className="about-hero-desc fade-up">Crafting timeless stories from timber, preserving the soul of fine woodworking since 1963.</p>
                </div>
                <div className="scroll-indicator">
                    <span>Explore Our Story</span>
                    <div className="scroll-arrow">
                        <ArrowDownOutlined />
                    </div>
                </div>
            </section>

            {/* MAIN CONTENT SECTION 1 */}
            <section className="tale-section">
                <div className="tale-container row-reverse">
                    <h2 className="tale-title animate-on-scroll fade-in-right">The Tale of Teakwood</h2>
                    {/* Content */}
                    <div className="tale-content animate-on-scroll fade-in-right">
                        <div className="tale-text">
                            <p>It all started in 1963 in a small 10*10 room which has now transformed into a big manufacturing unit. Launched by two young brothers and currently managed by their sons. We were very keen on choosing unique and quality teakwood that lasts for decades so after much research we came up with one of the finest and most durable woods on earth, which is nothing but the Burma teakwood.</p>
                            <p>We as a crew focused only on making furnitures in Burma teak wood and never let other wood varieties enter our site. The finesse and the pronounced quality of our products speaks beyond generations. The standard of our products fetched 1000+ customers in a short span of time even without brand promotion.</p>
                            <p>It was again when the company had to search for an alternative wood with the same quality and durability. One fine day, we came across Benin teak wood with exact same features as Burma teak wood in Benin country. The Benin teakwood underwent a lot of inspection then finally we came to a conclusion that Benin teak is no less than Burma teak.</p>
                        </div>
                    </div>
                    {/* Image */}
                    <div className="tale-image-wrapper animate-on-scroll fade-in-left">
                        <div className="tale-image-container">
                            <img src="/teakwood_founders.png" alt="Founders" className="tale-image" />
                        </div>
                        <div className="tale-image-caption">The founders in our early manufacturing unit (1963)</div>
                    </div>
                </div>
            </section>

            {/* MAIN CONTENT SECTION 2 */}
            <section className="tale-section bg-cream">
                <div className="tale-container">
                    <h2 className="tale-title animate-on-scroll fade-in-left">Uncompromising <br/><em>Craftsmanship</em></h2>
                    {/* Content */}
                    <div className="tale-content animate-on-scroll fade-in-left">
                        <div className="tale-text">
                            <p>The woods were enriched with natural oils that gave a leather-like smell, ravishing grain patterns and everything was just perfect and precise to make wooden furniture out of it. By choosing Benin teak wood we overcame the biggest problem which the company was about to face.</p>
                            <p>In addition, we also made sure that our manufacturing unit travels again with the same vision, but this time even more stronger, tightly held on to its core value. Every cut, every joint, and every polish reflects a singular dedication to timeless quality.</p>
                            <p>Today, our craftsmen blend generational techniques with exquisite precision. From sourcing raw timber from sustainable certified origins to delivering a flawlessly finished masterpiece, the spirit of what started in that small 10*10 room endures.</p>
                        </div>
                    </div>
                    {/* Image */}
                    <div className="tale-image-wrapper animate-on-scroll fade-in-right">
                        <div className="tale-image-container">
                            <img src="/teakwood_crafting.png" alt="Master craftsman" className="tale-image" />
                        </div>
                        <div className="tale-image-caption">Master craftsman working on premium teakwood</div>
                    </div>
                </div>
            </section>

            {/* MAIN CONTENT SECTION 3 */}
            <section className="tale-section">
                <div className="tale-container row-reverse">
                    <h2 className="tale-title animate-on-scroll fade-in-right">A Legacy <br/><em>Built to Last</em></h2>
                    {/* Content */}
                    <div className="tale-content animate-on-scroll fade-in-right">
                        <div className="tale-text">
                            <p>From a humble 10x10 room to a sprawling manufacturing hub, Marutham Timbers stands as a testament to hard work and uncompromising values. Our expansive showrooms are designed not just to display furniture, but to showcase the infinite possibilities of premium teakwood.</p>
                            <p>With an eye toward the future, we continue to source our materials sustainably and refine our artistry. We believe that true luxury lies in longevity, creating pieces that will be cherished and passed down rather than replaced.</p>
                            <p className='last_desc'>Every piece we deliver carries the Marutham promise — absolute durability, masterful craftsmanship, and a breathtaking natural finish that brings the warmth of the forest straight into the heart of your home.</p>
                        </div>
                    </div>
                    {/* Image */}
                    <div className="tale-image-wrapper animate-on-scroll fade-in-left">
                        <div className="tale-image-container">
                            <img src="/teakwood_showroom.png" alt="High-end showroom" className="tale-image" />
                        </div>
                        <div className="tale-image-caption">Our modern showroom displaying timeless craftsmanship</div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
