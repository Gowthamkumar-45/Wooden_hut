import React, { useEffect } from 'react';
import './About.css';

const About = () => {
    useEffect(() => {
        window.scrollTo(0, 0);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Stop observing once it's visible so it doesn't fade in again
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

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
                <img className="about-hero-bg" src="https://images.unsplash.com/photo-1542621334-a254cf47733d?w=1600&q=80&fit=crop" alt="Premium timber workshop" />
                <div className="about-hero-content">
                    <div className="about-hero-eyebrow fade-up">Our Story</div>
                    <h1 className="about-hero-title fade-up">The Roots of <br /><em>Our Legacy</em></h1>
                </div>
            </section>

            {/* MAIN CONTENT SECTION 1: THE TALE OF TEAKWOOD (Image Left, Content Right) */}
            <section className="tale-section">
                <div className="tale-container row-reverse">
                    {/* Content on the Right */}
                    <div className="tale-content animate-on-scroll fade-in-right">
                        <h2 className="tale-title">The Tale of Teakwood</h2>
                        <div className="tale-text">
                            <p>It all started in 1963 in a small 10*10 room which has now transformed into a big manufacturing unit. Launched by two young brothers and currently managed by their sons. We were very keen on choosing unique and quality teakwood that lasts for decades so after much research we came up with one of the finest and most durable woods on earth, which is nothing but the Burma teakwood.</p>
                            
                            <p>We as a crew focused only on making furnitures in Burma teak wood and never let other wood varieties enter our site. The finesse and the pronounced quality of our products speaks beyond generations. The standard of our products fetched 1000+ customers in a short span of time even without brand promotion. As days passed, the demand for Burma teak wood started increasing and the origin country had planned to stop exporting.</p>

                            <p>It was again when the company had to search for an alternative wood with the same quality and durability. One fine day, we came across Benin teak wood with exact same features as Burma teak wood in Benin country. The Benin teakwood underwent a lot of inspection for its oil content, appearance, water content, grain patterns, and so on, then finally we came to a conclusion that Benin teak is no less than Burma teak.</p>
                        </div>
                    </div>
                    {/* Image on the Left */}
                    <div className="tale-image-wrapper animate-on-scroll fade-in-left">
                        <img src="/teakwood_founders.png" alt="Founders of Marutham Timbers" className="tale-image" />
                        <div className="tale-image-caption">The founders in our early manufacturing unit (1963)</div>
                    </div>
                </div>
            </section>

            {/* MAIN CONTENT SECTION 2: THE JOURNEY CONTINUES (Content Left, Image Right) */}
            <section className="tale-section bg-cream">
                <div className="tale-container">
                    {/* Content on the Left */}
                    <div className="tale-content animate-on-scroll fade-in-left">
                        <h2 className="tale-title">Uncompromising <br/><em>Craftsmanship</em></h2>
                        <div className="tale-text">
                            <p>The woods were enriched with natural oils that gave a leather-like smell, ravishing grain patterns and everything was just perfect and precise to make wooden furniture out of it. By choosing Benin teak wood we overcame the biggest problem which the company was about to face.</p>
                            
                            <p>In addition, we also made sure that our manufacturing unit travels again with the same vision, but this time even more stronger, tightly held on to its core value of manufacturing products out of premium quality teakwood. Every cut, every joint, and every polish reflects a singular dedication to timeless quality.</p>

                            <p>Today, our craftsmen blend generational techniques with exquisite precision. From sourcing raw timber from sustainable certified origins to delivering a flawlessly finished masterpiece, the spirit of what started in that small 10*10 room endures in every piece that graces your home.</p>
                        </div>
                    </div>
                    {/* Image on the Right */}
                    <div className="tale-image-wrapper animate-on-scroll fade-in-right">
                        <img src="/teakwood_crafting.png" alt="Master craftsman working on Teakwood" className="tale-image" />
                        <div className="tale-image-caption">Master craftsman working on premium teakwood</div>
                    </div>
                </div>
            </section>

            {/* MAIN CONTENT SECTION 3: A LEGACY BUILT TO LAST (Image Left, Content Right) */}
            <section className="tale-section">
                <div className="tale-container row-reverse">
                    {/* Content on the Right */}
                    <div className="tale-content animate-on-scroll fade-in-right">
                        <h2 className="tale-title">A Legacy <br/><em>Built to Last</em></h2>
                        <div className="tale-text">
                            <p>From a humble 10x10 room to a sprawling manufacturing hub, Marutham Timbers stands as a testament to hard work and uncompromising values. Our expansive showrooms are designed not just to display furniture, but to showcase the infinite possibilities of premium teakwood.</p>
                            
                            <p>With an eye toward the future, we continue to source our materials sustainably and refine our artistry. We believe that true luxury lies in longevity, creating pieces that will be cherished and passed down rather than replaced.</p>

                            <p>Every piece we deliver carries the Marutham promise — absolute durability, masterful craftsmanship, and a breathtaking natural finish that brings the warmth of the forest straight into the heart of your home. Experience the difference of true legacy.</p>
                        </div>
                    </div>
                    {/* Image on the Left */}
                    <div className="tale-image-wrapper animate-on-scroll fade-in-left">
                        <img src="/teakwood_showroom.png" alt="High-end teakwood showroom" className="tale-image" />
                        <div className="tale-image-caption">Our modern showroom displaying timeless craftsmanship</div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
