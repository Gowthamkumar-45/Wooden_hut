import React, { useEffect } from 'react';
import { SITE_CONTENT } from '../../constants/content';
import './LegalPage.css';

const SECTIONS = [
  { id: 'info-we-collect', title: 'Information We Collect' },
  { id: 'how-we-use', title: 'How We Use Your Information' },
  { id: 'whatsapp', title: 'WhatsApp & Phone Communication' },
  { id: 'cookies', title: 'Cookies & Local Storage' },
  { id: 'sharing', title: 'Sharing of Information' },
  { id: 'security', title: 'Data Security' },
  { id: 'retention', title: 'Data Retention' },
  { id: 'rights', title: 'Your Rights' },
  { id: 'children', title: "Children's Privacy" },
  { id: 'changes', title: 'Changes to This Policy' },
  { id: 'contact', title: 'Contact Us' },
];

const PrivacyPolicy = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="legal-page">
      <section className="legal-hero">
        <span className="legal-eyebrow">Legal</span>
        <h1>Privacy Policy</h1>
        <p className="legal-updated">Last updated: September 24, 2026</p>
      </section>

      <div className="legal-body">
        <aside className="legal-toc">
          <h4>On This Page</h4>
          <ul>
            {SECTIONS.map((s) => (
              <li key={s.id}><a href={`#${s.id}`}>{s.title}</a></li>
            ))}
          </ul>
        </aside>

        <article className="legal-content">
          <p className="legal-intro">
            {SITE_CONTENT.brand.fullName} ("we") respects your privacy.
            This Privacy Policy explains what information we collect when you visit our website or
            get in touch with us, how we use it, and the choices you have. By using this website, you
            agree to the practices described here.
          </p>

          <section id="info-we-collect" className="legal-section">
            <h2>1. Information We Collect</h2>
            <p>We only collect information that you choose to share with us, or that helps us understand how visitors use our website:</p>
            <h3>Information you provide</h3>
            <ul>
              <li><strong>Enquiry forms:</strong> name, phone number, email address, the branch you're closest to, and the message you send us.</li>
              <li><strong>Product reviews:</strong> name, email address, phone number, and the review or rating you submit for a product. Reviews are checked by our team before they appear publicly.</li>
              <li><strong>WhatsApp / phone contact:</strong> when you use a "Contact Us" or "Message Us" button, we note which product you were interested in and which branch you chose to reach, so our team can follow up. We do not see or store the content of the conversation itself — that happens inside WhatsApp, governed by WhatsApp's own privacy policy.</li>
            </ul>
            <h3>Information collected automatically</h3>
            <ul>
              <li><strong>Basic visit analytics:</strong> we record the page you visited and a one-way, anonymized (hashed) version of your IP address, purely to understand traffic to our site. This hashed value cannot be reversed to identify you or your actual IP address.</li>
            </ul>
          </section>

          <section id="how-we-use" className="legal-section">
            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Respond to your enquiries and follow up on product interest;</li>
              <li>Connect you with the correct branch (Coimbatore or Tanjavur) for your requirement;</li>
              <li>Review and publish customer testimonials, with your name as submitted;</li>
              <li>Understand which pages and products are most useful to visitors, so we can improve the website;</li>
              <li>Meet legal or regulatory obligations where applicable.</li>
            </ul>
            <p>We do not sell, rent, or trade your personal information to third parties.</p>
          </section>

          <section id="whatsapp" className="legal-section">
            <h2>3. WhatsApp & Phone Communication</h2>
            <p>
              Our website is a catalogue and enquiry platform — we do not process payments or take
              orders directly through it. When you click "Contact Us" or "Message Us," we open a
              WhatsApp chat (or a phone call) with the branch you selected, with a pre-filled message.
              Anything you send from that point on is a direct conversation between you and our branch
              team over WhatsApp or phone, subject to WhatsApp's/your telecom provider's own privacy
              practices, not ours.
            </p>
          </section>

          <section id="cookies" className="legal-section">
            <h2>4. Cookies & Local Storage</h2>
            <p>
              We do not use advertising or tracking cookies. Our website stores a small amount of data
              in your browser's local storage purely to make the site feel faster — for example, caching
              the product list you last viewed so it loads instantly on your next visit. This data stays
              on your own device, is not sent to us, and can be cleared at any time from your browser
              settings.
            </p>
          </section>

          <section id="sharing" className="legal-section">
            <h2>5. Sharing of Information</h2>
            <p>We only share information where necessary to run our website and business:</p>
            <ul>
              <li><strong>Our branch teams</strong> (Coimbatore and Tanjavur) — to respond to your enquiries;</li>
              <li><strong>Service providers</strong> who host our website and database, and who are bound to keep it confidential;</li>
              <li><strong>Google Maps</strong> — our Contact and Home pages embed a Google Map to show our branch locations; this is subject to Google's own privacy policy;</li>
              <li>Where required by law, court order, or to protect our legal rights.</li>
            </ul>
          </section>

          <section id="security" className="legal-section">
            <h2>6. Data Security</h2>
            <p>
              We take reasonable technical and organizational measures to protect the information you
              share with us, including restricting access to our admin systems to authorized staff only.
              No method of transmission or storage over the internet is completely secure, and while we
              work to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          <section id="retention" className="legal-section">
            <h2>7. Data Retention</h2>
            <p>
              We keep enquiry, contact, and review information for as long as needed to respond to you
              and maintain our business records, or until you ask us to delete it, whichever comes first.
            </p>
          </section>

          <section id="rights" className="legal-section">
            <h2>8. Your Rights</h2>
            <p>You can, at any time, ask us to:</p>
            <ul>
              <li>Tell you what personal information we hold about you;</li>
              <li>Correct inaccurate information;</li>
              <li>Delete your information from our records, including submitted reviews;</li>
              <li>Stop contacting you about your enquiry.</li>
            </ul>
            <p>To exercise any of these, reach out using the contact details below.</p>
          </section>

          <section id="children" className="legal-section">
            <h2>9. Children's Privacy</h2>
            <p>
              Our website and products are intended for adults making furniture purchasing decisions.
              We do not knowingly collect personal information from children.
            </p>
          </section>

          <section id="changes" className="legal-section">
            <h2>10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices.
              The "Last updated" date at the top of this page will always reflect the most recent
              revision. We encourage you to review it periodically.
            </p>
          </section>

          <section id="contact" className="legal-section">
            <h2>11. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy or how we handle your information, reach out to us:</p>
            <div className="legal-contact-box">
              {SITE_CONTENT.contact.emails.map((email) => (
                <p key={email}><strong>Email:</strong> {email}</p>
              ))}
              {SITE_CONTENT.contact.phones.map((phone) => (
                <p key={phone}><strong>Phone:</strong> {phone}</p>
              ))}
              {SITE_CONTENT.locations.map((loc) => (
                <p key={loc.id}><strong>{loc.branchName}:</strong> {loc.address1} {loc.address2} {loc.cityZip}</p>
              ))}
            </div>
          </section>
        </article>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
