import React, { useState, useEffect } from 'react';
import './Loader.css';

const Loader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Disable scrolling when loading
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    let currentProgress = 0;
    let timer;

    const updateProgress = () => {
      // Dynamic increment speed:
      // Fast at first, slows down after 50%, and slowly reaches 99% until fully loaded
      let increment = 1;
      if (currentProgress < 50) {
        increment = Math.floor(Math.random() * 4) + 3; // +3 to +6
      } else if (currentProgress < 85) {
        increment = Math.floor(Math.random() * 3) + 2; // +2 to +4
      } else if (currentProgress < 98) {
        increment = Math.floor(Math.random() * 2) + 1; // +1 to +2
      } else {
        increment = 1;
      }

      currentProgress = Math.min(100, currentProgress + increment);
      setProgress(currentProgress);

      if (currentProgress < 100) {
        const nextDelay = currentProgress < 50 
          ? Math.random() * 25 + 25 
          : currentProgress < 85 
            ? Math.random() * 35 + 35 
            : Math.random() * 55 + 50;
        timer = setTimeout(updateProgress, nextDelay);
      } else {
        // Reached 100%. Start fade out after a brief pause to let user see full color
        setTimeout(() => {
          setIsFadingOut(true);
          // Wait for fadeout transition (500ms) to complete, then call onComplete
          setTimeout(() => {
            onComplete();
          }, 500);
        }, 250);
      }
    };

    // start loader loop after initial mount delay
    timer = setTimeout(updateProgress, 150);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [onComplete]);

  return (
    <div className={`preloader-overlay ${isFadingOut ? 'fade-out' : ''}`}>
      <div className="preloader-content">
        <div className="preloader-spinner-wrapper">
          {/* SVG Progress Spinner Ring */}
          <svg className="preloader-spinner" viewBox="0 0 200 200">
            <defs>
              <linearGradient id="spinner-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C4953A" stopOpacity="1" />
                <stop offset="50%" stopColor="#E2B96A" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#2C1A0E" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Background Track Circle */}
            <circle 
              cx="100" 
              cy="100" 
              r="85" 
              stroke="rgba(44, 26, 14, 0.04)" 
              strokeWidth="4" 
              fill="none" 
            />
            {/* Active Rotating Progress Ring */}
            <circle 
              cx="100" 
              cy="100" 
              r="85" 
              stroke="url(#spinner-grad)" 
              strokeWidth="4" 
              fill="none" 
              strokeLinecap="round"
              strokeDasharray="534"
              strokeDashoffset={534 - (534 * progress) / 100}
            />
          </svg>

          <div className="preloader-logo-container">
            {/* Dim, grayscale background logo */}
            <img 
              src="/Woodenhut_logo_transparent.png" 
              alt="Wooden Hut Logo" 
              className="preloader-logo logo-dim" 
            />
            {/* Colored logo overlay that reveals from bottom to top */}
            <img 
              src="/Woodenhut_logo_transparent.png" 
              alt="Wooden Hut Logo" 
              className="preloader-logo logo-color" 
              style={{ clipPath: `inset(${100 - progress}% 0px 0px 0px)` }}
            />
          </div>
          <div className="preloader-logo-glow"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
