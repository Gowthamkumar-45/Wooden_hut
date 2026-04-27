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
              <a href={SITE_CONTENT.social.whatsapp} target="_blank" rel="noreferrer" className="social-link">WhatsApp</a>
              <a href={SITE_CONTENT.social.instagram} target="_blank" rel="noreferrer" className="social-link">Instagram</a>
              <a href={SITE_CONTENT.social.facebook} target="_blank" rel="noreferrer" className="social-link">Facebook</a>
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
                <p>{SITE_CONTENT.contact.workingHours}<br/>{SITE_CONTENT.contact.sunday}</p>
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