import sys

css_to_add = """
/* SIMPLE DROPDOWN SYSTEM */
.simple-dropdown {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  background: var(--white);
  list-style: none !important;
  padding: 15px 0 !important;
  min-width: 200px;
  box-shadow: 0 10px 30px rgba(44, 26, 14, 0.08);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  border-top: 2px solid var(--gold);
  z-index: 1000;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
}

.link-dropdown:hover .simple-dropdown {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

.simple-dropdown li {
  width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
}

.simple-dropdown a {
  padding: 12px 25px !important;
  font-size: 11px !important;
  font-weight: 500 !important;
  color: var(--text-muted) !important;
  text-transform: capitalize !important;
  letter-spacing: 0.05em !important;
  width: 100% !important;
  box-sizing: border-box;
  text-align: center;
  border: none !important;
}

.simple-dropdown a:hover {
  background: rgba(196, 149, 58, 0.05) !important;
  color: var(--gold) !important;
}

.simple-dropdown a::after {
  display: none !important;
}

/* Adjust header spacing */
.nav-links {
  margin-left: 200px !important;
  gap: 1.2vw !important;
}

.nav-links a, 
.nav-links .nav-dropdown-trigger {
  font-size: 10px !important;
}
"""

with open('/Users/shanmugam/Desktop/Gowtham/Woodenhut/frontend/src/Components/Header/Header.css', 'a') as f:
    f.write(css_to_add)
