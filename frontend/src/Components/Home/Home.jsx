import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Form, Input, Select, Button, message as antMessage } from 'antd';
import { SITE_CONTENT } from '../../constants/content';
import './Home.css';

// ✅ Yup Schema for Home Enquiry Form
const enquirySchema = yup.object().shape({
    name: yup.string().required("Full Name is required"),
    phone: yup.string()
        .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
        .required("Phone number is required"),
    email: yup.string().email("Please enter a valid email address").required("Email address is required"),
    service: yup.string().required("Please select a service"),
    message: yup.string().min(10, "Message should be at least 10 characters")
});

const { Option } = Select;

const Home = () => {
    const navigate = useNavigate();

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(enquirySchema),
        defaultValues: {
            name: '',
            phone: '',
            email: '',
            service: '',
            message: ''
        }
    });

    const onSubmit = async (data) => {
        try {
            const response = await fetch(`${SITE_CONTENT.api.base}/api/enquiries/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                antMessage.success("Enquiry sent successfully! We will contact you soon.");
                reset();
            } else {
                antMessage.error("Failed to send enquiry. Please try again.");
            }
        } catch (error) {
            console.error("Home Enquiry Error:", error);
            antMessage.error("Something went wrong. Please check your connection.");
        }
    };

    return (
        <div className="home-container">
            {/* HERO SECTION */}
            <section className="hero">
                <div className="hero-left">
                    <div className="hero-eyebrow">{SITE_CONTENT.brand.est} · Premium Craftsmanship</div>
                    <h1 className="hero-title">Where <em>Timber</em><br />Becomes<br />Legacy</h1>
                    <p className="hero-desc">Premium sawmill timbers, bespoke furniture, and handcrafted interiors — built from the finest wood, shaped by decades of mastery.</p>
                    <div className="hero-actions">
                        <a href="#services" className="btn-primary">Explore Our Products</a>
                        <a href="#contact" className="btn-ghost">Request a Consultation</a>
                    </div>
                    <div className="hero-stats">
                        <div><div className="stat-num">{SITE_CONTENT.brand.experience}</div><div className="stat-label">Years of Excellence</div></div>
                        <div><div className="stat-num">{SITE_CONTENT.brand.projectsLine.split(' ')[0]}</div><div className="stat-label">Projects Delivered</div></div>
                        <div><div className="stat-num">100%</div><div className="stat-label">{SITE_CONTENT.brand.promise}</div></div>
                    </div>
                </div>

                <div className="hero-right">
                    <img src="https://images.unsplash.com/photo-1542621334-a254cf47733d?w=900&q=80&fit=crop" alt="Premium timber workshop" />
                    <div className="hero-right-overlay"></div>
                    <div className="hero-badge">
                        <div className="hero-badge-inner">
                            <span>Pure</span><b>Wood</b><span>Since Est.</span>
                        </div>
                    </div>
                    <div className="hero-overlay">
                        <div className="hero-overlay-title">Crafted from Nature, Built for Eternity</div>
                        <div className="hero-overlay-sub">Premium Timbers · Bespoke Furniture · Tamil Nadu</div>
                    </div>
                </div>

                {/* MARQUEE Moved Inside Hero */}
                <div className="marquee-strip">
                    <div className="marquee-inner">
                        <div className="marquee-item"><span className="marquee-dot"></span>Timber Supply</div>
                        <div className="marquee-item"><span className="marquee-dot"></span>Custom Furniture</div>
                        <div className="marquee-item"><span className="marquee-dot"></span>Sofa Sets</div>
                        <div className="marquee-item"><span className="marquee-dot"></span>Single Beds</div>
                        <div className="marquee-item"><span className="marquee-dot"></span>Dining Tables</div>
                        <div className="marquee-item"><span className="marquee-dot"></span>Premium Hardwood</div>
                        <div className="marquee-item"><span className="marquee-dot"></span>Teak Wood</div>
                        <div className="marquee-item"><span className="marquee-dot"></span>Rosewood</div>
                        <div className="marquee-item"><span className="marquee-dot"></span>Timber Supply</div>
                        <div className="marquee-item"><span className="marquee-dot"></span>Custom Furniture</div>
                        <div className="marquee-item"><span className="marquee-dot"></span>Sofa Sets</div>
                        <div className="marquee-item"><span className="marquee-dot"></span>Single Beds</div>
                        <div className="marquee-item"><span className="marquee-dot"></span>Dining Tables</div>
                        <div className="marquee-item"><span className="marquee-dot"></span>Premium Hardwood</div>
                        <div className="marquee-item"><span className="marquee-dot"></span>Teak Wood</div>
                        <div className="marquee-item"><span className="marquee-dot"></span>Rosewood</div>
                    </div>
                </div>
            </section>

            {/* ABOUT */}
            <section className="about" id="about">
                <div className="about-visual">
                    <img src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=900&q=80&fit=crop" alt="Wood craftsmanship" />
                    <div className="about-img-overlay"></div>
                    <div className="about-img-caption">Every grain tells a story of time and nature.</div>
                </div>
                <div className="about-content">
                    <div className="section-label fade-up">Our Heritage</div>
                    <h2 className="section-title fade-up">Rooted in Craft,<br /><em>Refined by Time</em></h2>
                    <p className="about-text fade-up">{SITE_CONTENT.brand.fullName} has been a trusted name in premium timber and bespoke furniture for over two decades. From raw forest timber to polished masterpieces, every piece that leaves our workshop carries the signature of uncompromising quality.</p>
                    <p className="about-text fade-up">We source only the finest hardwoods — teak, rosewood, mahogany, and more — and transform them into furniture that becomes part of your family's story for generations.</p>
                    <div className="about-pillars fade-up">
                        <div className="pillar"><div className="pillar-icon"></div><div className="pillar-title">Sustainably Sourced</div><div className="pillar-text">Responsibly harvested timber from certified forests.</div></div>
                        <div className="pillar"><div className="pillar-icon"></div><div className="pillar-title">Master Craftsmen</div><div className="pillar-text">Every joint, curve, and finish by experienced hands.</div></div>
                        <div className="pillar"><div className="pillar-icon"></div><div className="pillar-title">Lifetime Durability</div><div className="pillar-text">Built to outlast trends, outlast generations.</div></div>
                    </div>
                </div>
            </section>

            {/* SERVICES */}
            <section className="services" id="services">
                <div className="services-header">
                    <div className="services-header-left">
                        <div className="section-label">What We Create</div>
                        <h2 className="section-title">Our <em>Collections</em></h2>
                    </div>
                    <a href="#contact" className="btn-ghost">View All →</a>
                </div>
                <div className="services-grid">

                    <div className="service-card fade-up" onClick={() => navigate('/category/timber-supply')}>
                        <img src="https://images.unsplash.com/photo-1603380353725-f8a4d39cc41e?w=600&q=80&fit=crop" alt="Timber Supply" />
                        <div className="service-card-overlay"></div>
                        <div className="service-card-body">
                            <div className="service-num">01</div><div className="service-line"></div>
                            <div className="service-name">Timber Supply</div>
                            <div className="service-desc">Premium quality raw and processed timbers — teak, rosewood, mahogany — cut to your exact specifications for construction and interior work.</div>
                        </div>
                    </div>

                    <div className="service-card fade-up" onClick={() => navigate('/category/custom-furniture')}>
                        <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80&fit=crop" alt="Custom Furniture" />
                        <div className="service-card-overlay"></div>
                        <div className="service-card-body">
                            <div className="service-num">02</div><div className="service-line"></div>
                            <div className="service-name">Custom Furniture</div>
                            <div className="service-desc">Bespoke furniture crafted entirely to your design vision. Every dimension, every finish, every detail — exactly as you imagine it.</div>
                        </div>
                    </div>

                    <div className="service-card fade-up" onClick={() => navigate('/category/sofa-sets')}>
                        <img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80&fit=crop" alt="Sofa Sets" />
                        <div className="service-card-overlay"></div>
                        <div className="service-card-body">
                            <div className="service-num">03</div><div className="service-line"></div>
                            <div className="service-name">Sofa Sets</div>
                            <div className="service-desc">Solid wood sofa frames with premium upholstery options. Classic, contemporary, or heritage designs that anchor any living space with elegance.</div>
                        </div>
                    </div>

                    <div className="service-card fade-up" onClick={() => navigate('/category/bedroom')}>
                        <img src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80&fit=crop" alt="Bedroom Collection" />
                        <div className="service-card-overlay"></div>
                        <div className="service-card-body">
                            <div className="service-num">04</div><div className="service-line"></div>
                            <div className="service-name">Bedroom</div>
                            <div className="service-desc">Handcrafted wooden beds and frames built for lasting comfort and timeless beauty. Available in single, queen, and king sizes.</div>
                        </div>
                    </div>

                    <div className="service-card fade-up" onClick={() => navigate('/category/dining-tables')}>
                        <img src="https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&q=80&fit=crop" alt="Dining Tables" />
                        <div className="service-card-overlay"></div>
                        <div className="service-card-body">
                            <div className="service-num">05</div><div className="service-line"></div>
                            <div className="service-name">Dining Tables</div>
                            <div className="service-desc">From intimate 4-seater tables to grand 12-seater dining sets — each piece a statement of craftsmanship, built to gather families for generations.</div>
                        </div>
                    </div>

                    <div className="service-card fade-up" onClick={() => navigate('/category/wood-finishing')}>
                        <img src="https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=600&q=80&fit=crop" alt="Wood Finishing" />
                        <div className="service-card-overlay"></div>
                        <div className="service-card-body">
                            <div className="service-num">06</div><div className="service-line"></div>
                            <div className="service-name">Wood Finishing</div>
                            <div className="service-desc">Expert polishing, lacquering, and wood treatment services to restore, protect, and elevate your existing furniture to its finest form.</div>
                        </div>
                    </div>

                </div>
            </section>

            {/* GALLERY STRIP */}
            <section className="gallery-section" style={{ background: "var(--cream)" }}>
                <h1 className="gallery-section-title">Our <em>Gallery</em></h1>
                <div className="gallery-strip">
                    <div className="gallery-pane" onClick={() => navigate('/category/timber-supply')}>
                        <img src="https://images.unsplash.com/photo-1542621334-a254cf47733d?w=500&q=80&fit=crop" alt="Teak Timber" />
                        <div className="gallery-g-overlay"></div>
                        <div className="gallery-pane-tag">Wood</div>
                        <div className="gallery-pane-label">Teak Timber</div>
                    </div>
                    <div className="gallery-pane" onClick={() => navigate('/category/custom-furniture')}>
                        <img src="https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=500&q=80&fit=crop" alt="Craftsman" />
                        <div className="gallery-g-overlay"></div>
                        <div className="gallery-pane-tag">Craft</div>
                        <div className="gallery-pane-label">Master Craftsmen</div>
                    </div>
                    <div className="gallery-pane" onClick={() => navigate('/category/sofa-sets')}>
                        <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80&fit=crop" alt="Sofa" />
                        <div className="gallery-g-overlay"></div>
                        <div className="gallery-pane-tag">Living</div>
                        <div className="gallery-pane-label">Sofa Collection</div>
                    </div>
                    <div className="gallery-pane" onClick={() => navigate('/category/dining-tables')}>
                        <img src="https://images.unsplash.com/photo-1617806118233-18e1de247200?w=500&q=80&fit=crop" alt="Dining" />
                        <div className="gallery-g-overlay"></div>
                        <div className="gallery-pane-tag">Dining</div>
                        <div className="gallery-pane-label">Dining Sets</div>
                    </div>
                    <div className="gallery-pane" onClick={() => navigate('/category/bedroom')}>
                        <img src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&q=80&fit=crop" alt="Bedroom" />
                        <div className="gallery-g-overlay"></div>
                        <div className="gallery-pane-tag">Bedroom</div>
                        <div className="gallery-pane-label">Bedroom Sets</div>
                    </div>
                </div>
            </section>

            {/* PROCESS */}
            <section className="process" id="process">
                <div className="section-label">How We Work</div>
                <h2 className="section-title">From <em>Forest to Your Home</em></h2>
                <div className="process-steps">
                    <div className="step fade-up"><div className="step-num">01</div><div className="step-name">Consultation</div><div className="step-desc">We listen to your vision, lifestyle needs, and budget to shape the perfect brief for your furniture or timber requirement.</div></div>
                    <div className="step fade-up"><div className="step-num">02</div><div className="step-name">Wood Selection</div><div className="step-desc">Our experts guide you through wood species — grain, durability, and finish — to find the perfect match for your project.</div></div>
                    <div className="step fade-up"><div className="step-num">03</div><div className="step-name">Crafting</div><div className="step-desc">Skilled craftsmen transform raw timber with traditional joinery and modern precision tools, with meticulous attention.</div></div>
                    <div className="step fade-up"><div className="step-num">04</div><div className="step-name">Delivery</div><div className="step-desc">Your finished piece is quality-checked and delivered to your home with professional installation if needed.</div></div>
                </div>
            </section>

            {/* QUOTE with full-bleed background image */}
            <section className="quote-section">
                <img src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1400&q=80&fit=crop" alt="Wood workshop background" />
                <div className="quote-overlay"></div>
                <div className="quote-content">
                    <div className="quote-mark">"</div>
                    <p className="quote-text">Good furniture is not purchased — it is inherited. We build every piece as if it will be passed down for three generations.</p>
                    <div className="quote-author">— {SITE_CONTENT.brand.name} Sawmill, Our Promise</div>
                </div>
            </section>

            {/* CONTACT */}
            <section className="contact" id="contact">
                <div className="contact-info">
                    <div className="section-label">Get in Touch</div>
                    <h2 className="section-title">Let's Build<br /><em>Something Together</em></h2>
                    <div className="contact-divider"></div>
                    <div className="contact-detail"><div className="contact-detail-label">Location</div><div className="contact-detail-value">{SITE_CONTENT.brand.name} Sawmill<br />{SITE_CONTENT.brand.subName}<br />Tamil Nadu, India</div></div>
                    <div className="contact-detail"><div className="contact-detail-label">Phone</div><div className="contact-detail-value">{SITE_CONTENT.contact.phone}</div></div>
                    <div className="contact-detail"><div className="contact-detail-label">Working Hours</div><div className="contact-detail-value">{SITE_CONTENT.contact.workingHours}<br />{SITE_CONTENT.contact.sunday}</div></div>
                    <div className="contact-detail"><div className="contact-detail-label">Services</div><div className="contact-detail-value">Timber · Custom Furniture<br />Sofas · Cots · Dining Tables</div></div>
                </div>
                <div className="contact-form">
                    <div className="section-label">Send an Enquiry</div>
                    <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", fontWeight: "300", color: "var(--brown-deep)", marginBottom: "40px" }}>Request a <em style={{ fontStyle: "italic", color: "var(--brown-warm)" }}>Quote</em></h3>

                    <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                        <Form.Item
                            label="Your Name"
                            validateStatus={errors.name ? "error" : ""}
                            help={errors.name?.message}
                        >
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} placeholder="Full name" size="large" />
                                )}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Phone Number"
                            validateStatus={errors.phone ? "error" : ""}
                            help={errors.phone?.message}
                        >
                            <Controller
                                name="phone"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} placeholder={SITE_CONTENT.contact.phone} size="large" />
                                )}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Email Address"
                            validateStatus={errors.email ? "error" : ""}
                            help={errors.email?.message}
                        >
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} placeholder="youremail@example.com" size="large" type="email" />
                                )}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Service Required"
                            validateStatus={errors.service ? "error" : ""}
                            help={errors.service?.message}
                        >
                            <Controller
                                name="service"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field} placeholder="Select a service" size="large">
                                        <Option value="Timber Supply">Timber Supply</Option>
                                        <Option value="Custom Furniture">Custom Furniture</Option>
                                        <Option value="Sofa Set">Sofa Set</Option>
                                        <Option value="Cot / Bed">Cot / Bed</Option>
                                        <Option value="Dining Table">Dining Table</Option>
                                        <Option value="Wood Finishing">Wood Finishing</Option>
                                        <Option value="Other">Other</Option>
                                    </Select>
                                )}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Message"
                            validateStatus={errors.message ? "error" : ""}
                            help={errors.message?.message}
                        >
                            <Controller
                                name="message"
                                control={control}
                                render={({ field }) => (
                                    <Input.TextArea {...field} placeholder="Tell us about your requirements — wood type, dimensions, design preferences..." rows={3} />
                                )}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" size="large" className="form-submit" id="submit-btn">
                                Send Enquiry
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </section>
        </div>
    );
};

export default Home;