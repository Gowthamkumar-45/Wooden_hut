import { SITE_CONTENT, NAV_LINKS } from '../../constants/content';
import './Footer.css'

const Footer = () => {
  return (
    <footer>
      <div className="footer-top">
        <div className="footer-logo">{SITE_CONTENT.brand.name} Sawmill<span>{SITE_CONTENT.brand.subName} · {SITE_CONTENT.brand.est}</span></div>
        <nav className="footer-nav">
          {NAV_LINKS.filter(link => ["About Us", "Furniture Making", "Media", "Contact Us"].includes(link.name)).map(link => (
            <a key={link.name} href={link.path}>{link.name.replace(" Us", "")}</a>
          ))}
        </nav>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} {SITE_CONTENT.brand.fullName}. All rights reserved.</span>
        <span>Crafted with pride · Tamil Nadu, India</span>
      </div>
    </footer>

  );
};

export default Footer;