import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { SITE_CONTENT } from '../../constants/content';
import { openWhatsAppAndLogOnReturn } from '../../utils/whatsappTracking';
import './WhatsAppEnquiryButton.css';

const MENU_WIDTH = 230;
const MENU_HEIGHT_ESTIMATE = 170;

// A handful of unique, natural-sounding openers so every enquiry doesn't
// send the exact same canned line — one is picked at random per click.
const MESSAGE_TEMPLATES = [
  (name) => `Hi, I'm interested in ${name}. Could you share more details?`,
  (name) => `Hello, I'd like to know more about ${name} — is it available?`,
  (name) => `Hi there! Could you share the price and availability for ${name}?`,
  (name) => `I saw ${name} on your website and I'm interested. Can we discuss further?`,
  (name) => `Hello, I'm looking to buy ${name}. Please share more information.`,
  (name) => `Hi, could you tell me more about ${name}? I'm considering buying it.`,
];

const randomMessage = (name) => {
  const template = MESSAGE_TEMPLATES[Math.floor(Math.random() * MESSAGE_TEMPLATES.length)];
  return template(name);
};

// Every branch has its own WhatsApp number (see SITE_CONTENT.locations), so
// a single hardcoded number can't route the auto-generated "I'm interested
// in <product>" message to the right branch. This lets the customer pick
// which branch to message, same interaction as FloatingContact's branch
// selector, then opens wa.me with that branch's number.
const WhatsAppEnquiryButton = ({ productName, className, children, onContact }) => {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, placement: 'above' });
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const handleClickOutside = (e) => {
      if (
        btnRef.current && !btnRef.current.contains(e.target) &&
        menuRef.current && !menuRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [open]);

  const toggleOpen = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const showAbove = rect.top > MENU_HEIGHT_ESTIMATE + 20;
      let left = rect.left + rect.width / 2 - MENU_WIDTH / 2;
      left = Math.max(8, Math.min(left, window.innerWidth - MENU_WIDTH - 8));
      setPos({
        top: showAbove ? rect.top - 10 : rect.bottom + 10,
        left,
        placement: showAbove ? 'above' : 'below',
      });
    }
    setOpen((o) => !o);
  };

  const handleBranchSelect = (loc) => {
    const text = encodeURIComponent(randomMessage(productName));
    openWhatsAppAndLogOnReturn(`https://wa.me/${loc.whatsapp}?text=${text}`, () => {
      if (onContact) onContact(productName, loc.name);
    });
    setOpen(false);
  };

  return (
    <>
      <button type="button" ref={btnRef} className={className} onClick={toggleOpen}>
        {children}
      </button>
      {open && createPortal(
        <div
          ref={menuRef}
          className="wa-enquiry-menu"
          style={{
            top: pos.top,
            left: pos.left,
            width: MENU_WIDTH,
            transform: pos.placement === 'above' ? 'translateY(-100%)' : 'none',
          }}
        >
          <p className="wa-enquiry-menu-title">Choose a branch to message</p>
          <div className="wa-enquiry-branch-options">
            {SITE_CONTENT.locations.map((loc) => (
              <button
                key={loc.id}
                type="button"
                className="wa-enquiry-branch-btn"
                onClick={() => handleBranchSelect(loc)}
              >
                {loc.name}
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default WhatsAppEnquiryButton;
