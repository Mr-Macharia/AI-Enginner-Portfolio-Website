import { useState, useEffect } from 'react';
import { getLenis, scrollToTarget } from '../lib/smoothScroll';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const lenis = getLenis();

    if (lenis) {
      const toggleVisibility = ({ scroll }: { scroll: number }) => {
        setIsVisible(scroll > 500);
      };

      lenis.on('scroll', toggleVisibility);
      requestAnimationFrame(() => {
        setIsVisible(lenis.scroll > 500);
      });

      return () => lenis.off('scroll', toggleVisibility);
    }

    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    scrollToTarget('body');
  };

  return (
    <button
      className={`back-to-top ${isVisible ? 'visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Back to top"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
};

export default BackToTop;
