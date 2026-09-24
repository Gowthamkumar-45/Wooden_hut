import React, { useEffect } from 'react';
import { SITE_CONTENT } from '../../constants/content';
import './LegalPage.css';

const SECTIONS = [
  { id: 'about-us', title: 'About Us' },
  { id: 'use-of-site', title: 'Use of This Website' },
  { id: 'products', title: 'Product Information & Pricing' },
  { id: 'enquiries', title: 'Enquiries & Orders' },
  { id: 'payments', title: 'Payments' },
  { id: 'delivery', title: 'Delivery' },
  { id: 'warranty', title: 'Warranty' },
  { id: 'reviews', title: 'Reviews & User Content' },
  { id: 'ip', title: 'Intellectual Property' },
  { id: 'third-party', title: 'Third-Party Links & Services' },
  { id: 'liability', title: 'Limitation of Liability' },
  { id: 'law', title: 'Governing Law' },
  { id: 'changes', title: 'Changes to These Terms' },
  { id: 'contact', title: 'Contact Us' },
];

const TermsConditions = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="legal-page">
      <section className="legal-hero">
        <span className="legal-eyebrow">Legal</span>
        <h1>Terms &amp; Conditions</h1>
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
            These Terms &amp; Conditions govern your use of the {SITE_CONTENT.brand.fullName} website.
            By browsing this website or submitting an enquiry through it, you agree to these terms.
            Please read them carefully.
          </p>

          <section id="about-us" className="legal-section">
            <h2>1. About Us</h2>
            <p>
              Wooden Hut is a manufacturer and retailer of solid teak wood furniture — sofas, dining
              sets, beds, doors &amp; windows, and more — handcrafted at our facilities in Tamil Nadu,
              India. We operate two branches:
            </p>
            <ul>
              {SITE_CONTENT.locations.map((loc) => (
                <li key={loc.id}><strong>{loc.branchName}</strong> — {loc.type}, {loc.address1} {loc.address2} {loc.cityZip}</li>
              ))}
            </ul>
          </section>

          <section id="use-of-site" className="legal-section">
            <h2>2. Use of This Website</h2>
            <p>
              This website is an informational catalogue of our products and craftsmanship. It is
              provided for you to browse our collections, read customer reviews, and get in touch with
              the branch nearest to you. You agree to use this website only for lawful purposes and not
              to misuse it — for example, by attempting to interfere with its normal operation or
              accessing data you're not authorized to see.
            </p>
          </section>

          <section id="products" className="legal-section">
            <h2>3. Product Information &amp; Pricing</h2>
            <p>
              Product photos and descriptions on this website are for illustration and are as accurate
              as we can make them, but since every piece is handcrafted from natural wood, slight
              variations in grain, colour, and finish between the piece shown and the piece delivered
              are normal and not a defect.
            </p>
            <p>
              We do not display fixed prices on this website. Pricing, available finishes, customization
              options, and stock availability are confirmed directly with our team once you enquire —
              over WhatsApp, phone, or in person at either showroom.
            </p>
          </section>

          <section id="enquiries" className="legal-section">
            <h2>4. Enquiries &amp; Orders</h2>
            <p>
              Submitting the enquiry form, a product review contact button, or messaging us on WhatsApp
              through this website does <strong>not</strong> place a binding order. It simply starts a
              conversation with our team. An order is only confirmed once you and our branch staff have
              agreed on the product, price, and terms directly — typically over WhatsApp, phone, or
              in-person at the showroom.
            </p>
          </section>

          <section id="payments" className="legal-section">
            <h2>5. Payments</h2>
            <p>
              This website does not process any payments or store payment information. Any payment for
              products or services is arranged directly between you and the branch you are dealing with,
              outside of this website.
            </p>
          </section>

          <section id="delivery" className="legal-section">
            <h2>6. Delivery</h2>
            <p>
              We offer doorstep delivery across Tamil Nadu. Delivery timelines, charges, and logistics
              for your specific order are confirmed with our branch team at the time your order is
              placed, and can vary based on the product, customization, and your location.
            </p>
          </section>

          <section id="warranty" className="legal-section">
            <h2>7. Warranty</h2>
            <p>
              Many of our furniture pieces come with our craftsmanship guarantee against structural
              defects in the solid wood frame. Exact warranty coverage, duration, and terms for your
              purchase will be communicated to you by our branch team at the time of sale and may vary
              by product.
            </p>
          </section>

          <section id="reviews" className="legal-section">
            <h2>8. Reviews &amp; User Content</h2>
            <p>
              When you submit a product review, you confirm that it reflects your genuine experience and
              you grant us permission to publish it on this website, including your name, as submitted.
              We review submissions before they go live and may decline to publish, or remove, reviews
              that are false, offensive, unrelated to the product, or otherwise inappropriate.
            </p>
          </section>

          <section id="ip" className="legal-section">
            <h2>9. Intellectual Property</h2>
            <p>
              All content on this website — including our logo, product photography, text, and design —
              is the property of Wooden Hut or used with permission, and is protected by applicable
              intellectual property laws. You may not reproduce, distribute, or use our content
              commercially without our written permission.
            </p>
          </section>

          <section id="third-party" className="legal-section">
            <h2>10. Third-Party Links &amp; Services</h2>
            <p>
              Our website links out to third-party services such as WhatsApp, Google Maps, and our
              social media pages. We are not responsible for the content, policies, or practices of
              these third-party services once you leave our website.
            </p>
          </section>

          <section id="liability" className="legal-section">
            <h2>11. Limitation of Liability</h2>
            <p>
              We make reasonable efforts to keep this website accurate and available, but it is provided
              "as is" without warranties of any kind. To the extent permitted by law, Wooden Hut is not
              liable for any indirect or consequential loss arising from your use of this website. This
              does not limit any rights you have under applicable consumer protection law.
            </p>
          </section>

          <section id="law" className="legal-section">
            <h2>12. Governing Law</h2>
            <p>
              These Terms are governed by the laws of India. Any disputes arising from your use of this
              website or your dealings with us shall be subject to the jurisdiction of the courts in
              Tamil Nadu, India.
            </p>
          </section>

          <section id="changes" className="legal-section">
            <h2>13. Changes to These Terms</h2>
            <p>
              We may update these Terms &amp; Conditions from time to time. The "Last updated" date at
              the top of this page reflects the most recent revision. Continued use of this website
              after changes are posted means you accept the updated terms.
            </p>
          </section>

          <section id="contact" className="legal-section">
            <h2>14. Contact Us</h2>
            <p>For any questions about these Terms &amp; Conditions, reach out to us:</p>
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

export default TermsConditions;
