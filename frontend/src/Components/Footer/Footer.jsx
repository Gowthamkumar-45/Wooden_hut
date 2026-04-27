import { SITE_CONTENT, NAV_LINKS } from '../../constants/content';
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer-modern">
      <div className="footer-container">
        <div className="footer-grid">
          {/* COLUMN 1: BRAND */}
          <div className="footer-col brand-col">
            <div className="footer-logo">
              <img src="/Woodenhut_logo.jpeg" alt={SITE_CONTENT.brand.name} className="footer-logo-img" />
              <div className="footer-logo-text">
                <span className="brand-name">{SITE_CONTENT.brand.name}</span>
                <span className="brand-sub">{SITE_CONTENT.brand.subName}</span>
              </div>
            </div>
            <p className="footer-brand-desc">{SITE_CONTENT.brand.tagline}. Handcrafted pieces that tell a story of time and nature.</p>
            <div className="footer-social">
              <a href={SITE_CONTENT.social.whatsapp} target="_blank" rel="noreferrer" className="social-icon-link" aria-label="WhatsApp">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </a>
              <a href={SITE_CONTENT.social.instagram} target="_blank" rel="noreferrer" className="social-icon-link" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href={SITE_CONTENT.social.facebook} target="_blank" rel="noreferrer" className="social-icon-link" aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
            </div>
          </div>

          {/* COLUMN 2: QUICK LINKS */}
          <div className="footer-col">
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-links">
              {NAV_LINKS.map(link => (
                <li key={link.name}><a href={link.path}>{link.name}</a></li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: CATEGORIES */}
          <div className="footer-col">
            <h4 className="footer-col-title">Collections</h4>
            <ul className="footer-links">
              <li><a href="/category/living">Living Room</a></li>
              <li><a href="/category/dining">Dining Room</a></li>
              <li><a href="/category/bedroom">Bedroom Furniture</a></li>
              <li><a href="/category/office">Office Solutions</a></li>
              <li><a href="/category/doors">Doors & Windows</a></li>
            </ul>
          </div>

          {/* COLUMN 4: CONTACT */}
          <div className="footer-col contact-col">
            <h4 className="footer-col-title">Contact Us</h4>
            <div className="footer-contact-info">
              <div className="contact-item">
                <span className="contact-label">Email:</span>
                <a href={`mailto:${SITE_CONTENT.contact.email}`}>{SITE_CONTENT.contact.email}</a>
              </div>
              <div className="contact-item">
                <span className="contact-label">Phone:</span>
                <a href={`tel:${SITE_CONTENT.contact.phone.replace(/\s/g, '')}`}>{SITE_CONTENT.contact.phone}</a>
              </div>
              <div className="contact-item">
                <span className="contact-label">Hours:</span>
                <p>{SITE_CONTENT.contact.workingHours}<br />{SITE_CONTENT.contact.sunday}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <span>© {new Date().getFullYear()} {SITE_CONTENT.brand.fullName}. All rights reserved.</span>
          </div>
          <div className="footer-bottom-right">
            <span>Crafted with pride in Tamil Nadu, India</span>
          </div>
        </div>
      </div>
    </footer>

  );
};

export default Footer;