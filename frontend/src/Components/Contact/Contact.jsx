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
    message: yup.string().min(10, "Message should be at least 10 characters")
});

const Contact = () => {
    const [form] = Form.useForm();

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

    const onSubmit = (data) => {
        console.log("Enquiry Data:", data);
        message.success("Thank you! Your enquiry has been sent successfully.");
        reset();
    };

    const showroomGallery = [
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80",
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80",
        "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&q=80"
    ];

    const factoryGallery = [
        "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=800&q=80",
        "https://images.unsplash.com/photo-1504148455328-497c2718219c?w=800&q=80",
        "https://images.unsplash.com/photo-1510674485131-dc88d96369b4?w=800&q=80",
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80"
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
                            <span className="info-label">Direct Contact</span>
                            <h3 className="info-value">{SITE_CONTENT.contact.email}</h3>
                            <h3 className="info-value">{SITE_CONTENT.contact.phone}</h3>
                        </div>

                        <div className="location-divider"></div>

                        {SITE_CONTENT.locations.map((loc) => (
                            <div className="location-card" key={loc.id}>
                                <h2 className="location-title">{loc.name} — <em>{loc.type}</em></h2>
                                <p className="location-addr">
                                    {loc.address1} <br/>
                                    {loc.address2}<br/>
                                    {loc.cityZip}
                                </p>
                                <div className="map-holder">
                                    <iframe 
                                        title={loc.name}
                                        src={loc.mapEmbed}
                                        width="100%" height="250" style={{border:0}} allowFullScreen="" loading="lazy"></iframe>
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
                                                <Input {...field} placeholder={SITE_CONTENT.contact.phone} size="large" />
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
                                        label="Subject *"
                                        validateStatus={errors.subject ? "error" : ""}
                                        help={errors.subject?.message}
                                    >
                                        <Controller
                                            name="subject"
                                            control={control}
                                            render={({ field }) => (
                                                <Input {...field} placeholder="Customization / Inquiry" size="large" />
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

