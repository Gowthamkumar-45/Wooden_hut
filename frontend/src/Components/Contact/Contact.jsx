import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Form, Input, Button, message } from 'antd';
import { SITE_CONTENT } from '../../constants/content';
import './Contact.css';

// ✅ Yup Schema for Contact Form
const contactSchema = yup.object().shape({
    name: yup.string().required("Full Name is required"),
    phone: yup.string()
        .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
        .required("Phone number is required"),
    email: yup.string().email("Invalid email address").required("Email is required"),
    subject: yup.string().required("Subject is required"),
    branch: yup.string().required("Please select a branch"),
    message: yup.string().min(10, "Message should be at least 10 characters")
});

const Contact = () => {
    // const [form] = Form.useForm();

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(contactSchema),
        defaultValues: {
            name: '',
            phone: '',
            email: '',
            subject: '',
            message: ''
        }
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const onSubmit = async (data) => {
        try {
            const response = await fetch(`${SITE_CONTENT.api.base}/api/enquiries/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                message.success("Thank you! Your enquiry has been sent successfully.");
                reset();
            } else {
                message.error("Failed to send enquiry. Please try again later.");
            }
        } catch (error) {
            console.error("Enquiry Error:", error);
            message.error("Something went wrong. Please check your connection.");
        }
    };

    // Real showroom/factory photos should replace these once uploaded via the
    // admin Media panel. Every URL below was individually downloaded and
    // visually confirmed before use — the previous set (including some
    // reused from FURNITURE_MAKING_CONTENT elsewhere in this codebase) looked
    // plausible from their labels/context but several actually depicted a
    // 3D printer, a wall clock, and blank stationery — completely unrelated
    // to wood or furniture. Don't reuse an Unsplash URL here without
    // downloading and looking at it first.
    const showroomGallery = [
        "https://images.unsplash.com/photo-1613906800797-d5d4fb2f7bbb?w=800&q=80", // wooden furniture lounge interior
        "https://images.unsplash.com/photo-1740759546813-6b58d44f5dce?w=800&q=80", // dining table set at a furniture showroom
        "https://images.unsplash.com/photo-1587006158786-7b79525a2147?w=800&q=80", // furniture store interior, wooden chairs
        "https://images.unsplash.com/photo-1732801134112-23827e7cbd0d?w=800&q=80"  // wooden chairs wall display
    ];

    const factoryGallery = [
        "https://images.unsplash.com/photo-1779031242515-205111711b23?w=800&q=80", // carpenter planing a wood plank
        "https://images.unsplash.com/photo-1749572855201-feb5cf658479?w=800&q=80", // sawmill cutting a log
        "https://images.unsplash.com/photo-1667689815944-9f72c0f59e74?w=800&q=80", // stacked rough-cut timber
        "https://images.unsplash.com/photo-1783779858962-5ec92319583c?w=800&q=80"  // worker in a lumber storage yard
    ];

    return (
        <div className="contact-page">
            {/* HERO SECTION */}
            <header className="contact-hero">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <span className="hero-label">We'd Love to Hear From You</span>
                    <h1 className="hero-title">Contact <em>{SITE_CONTENT.brand.name}</em></h1>
                    <p className="hero-des">Experience the beauty of handcrafted wooden furniture. Visit our showrooms in {SITE_CONTENT.locations[0].name} and {SITE_CONTENT.locations[1].name} or send us a message.</p>
                </div>
            </header>

            <main className="contact-container">
                <div className="contact-layout">

                    {/* LEFT SIDE: CONTACT INFO & MAPS */}
                    <div className="contact-info-section">
                        <div className="info-group">
                            <span className="info-label">Coimbatore</span>
                            <h3 className="info-value">{SITE_CONTENT.contact.emails[0]}</h3>
                            <h3 className="info-value">{SITE_CONTENT.contact.phones[0]}</h3>
                        </div>
                        <div className="info-group">
                            <span className="info-label">Thanjavur</span>
                            <h3 className="info-value">{SITE_CONTENT.contact.emails[1]}</h3>
                            <h3 className="info-value">{SITE_CONTENT.contact.phones[1]}</h3>
                        </div>

                        <div className="location-divider"></div>

                        {SITE_CONTENT.locations.map((loc) => (
                            <div className="location-card" key={loc.id}>
                                <h2 className="location-title">{loc.name} — <em>{loc.type}</em></h2>
                                <p className="location-addr">
                                    {loc.address1} <br />
                                    {loc.address2}<br />
                                    {loc.cityZip}
                                </p>
                                <div className="map-holder">
                                    <iframe
                                        title={loc.name}
                                        src={loc.mapEmbed}
                                        width="100%" height="250" style={{ border: 0 }} allowFullScreen="" loading="lazy"></iframe>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* RIGHT SIDE: CONTACT FORM */}
                    <div className="contact-form-section">
                        <div className="form-card">
                            <h2 className="form-title">Get In Touch</h2>
                            <p className="form-subtitle">Have a question or looking for a custom piece? Send us a message and our team will get back to you shortly.</p>

                            <Form layout="vertical" onFinish={handleSubmit(onSubmit)} className="main-contact-form">
                                <div className="contact-form-grid">
                                    <Form.Item
                                        label="Your Name *"
                                        validateStatus={errors.name ? "error" : ""}
                                        help={errors.name?.message}
                                    >
                                        <Controller
                                            name="name"
                                            control={control}
                                            render={({ field }) => (
                                                <Input {...field} placeholder="Full Name" size="large" />
                                            )}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="Your Phone *"
                                        validateStatus={errors.phone ? "error" : ""}
                                        help={errors.phone?.message}
                                    >
                                        <Controller
                                            name="phone"
                                            control={control}
                                            render={({ field }) => (
                                                <Input {...field} placeholder="+91 98765 43210" size="large" />
                                            )}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="Your Email *"
                                        validateStatus={errors.email ? "error" : ""}
                                        help={errors.email?.message}
                                    >
                                        <Controller
                                            name="email"
                                            control={control}
                                            render={({ field }) => (
                                                <Input {...field} placeholder="email@example.com" size="large" />
                                            )}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="Nearest Branch *"
                                        validateStatus={errors.branch ? "error" : ""}
                                        help={errors.branch?.message}
                                    >
                                        <Controller
                                            name="branch"
                                            control={control}
                                            render={({ field }) => (
                                                <select {...field} className="form-select-custom">
                                                    <option value="">Select Branch</option>
                                                    <option value="Coimbatore">Coimbatore</option>
                                                    <option value="Tanjavur">Tanjavur</option>
                                                </select>
                                            )}
                                        />
                                    </Form.Item>
                                </div>

                                <Form.Item
                                    label="Your Message"
                                    validateStatus={errors.message ? "error" : ""}
                                    help={errors.message?.message}
                                >
                                    <Controller
                                        name="message"
                                        control={control}
                                        render={({ field }) => (
                                            <Input.TextArea {...field} placeholder="Tell us about your requirements..." rows={4} />
                                        )}
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit" size="large" className="contact-submit-btn">
                                        SEND MESSAGE
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </div>
            </main>
            {/* GALLERIES SECTION */}
            <section className="contact-galleries">
                <div className="gallery-block">
                    <h2 className="gallery-title">Ottangadu — <em>Retail Showroom</em></h2>
                    <div className="photo-row">
                        {showroomGallery.map((img, i) => (
                            <div key={i} className="photo-item"><img src={img} alt="Showroom" /></div>
                        ))}
                    </div>
                </div>

                <div className="gallery-block">
                    <h2 className="gallery-title">Chettipalayam — <em>Factory</em></h2>
                    <div className="photo-row">
                        {factoryGallery.map((img, i) => (
                            <div key={i} className="photo-item"><img src={img} alt="Factory" /></div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;

