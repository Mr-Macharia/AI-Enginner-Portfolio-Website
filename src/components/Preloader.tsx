import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

const SESSION_KEY = 'gm-portfolio-preloader-seen';

const Preloader = ({ onComplete }: PreloaderProps) => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      onComplete();
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasSeenPreloader = window.sessionStorage.getItem(SESSION_KEY) === 'true';

    if (prefersReducedMotion || hasSeenPreloader) {
      onComplete();
      return;
    }

    const root = rootRef.current;

    if (!root) {
      onComplete();
      return;
    }

    const lines = Array.from(root.querySelectorAll('.preloader-line'));
    const panel = root.querySelector('.preloader-panel');

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
          window.sessionStorage.setItem(SESSION_KEY, 'true');
          onComplete();
        },
      });

      gsap.set(lines, { yPercent: 120, opacity: 0 });

      timeline
        .to(lines, {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.08,
        })
        .to(lines, {
          yPercent: -110,
          opacity: 0,
          duration: 0.4,
          stagger: 0.05,
        }, '+=0.3')
        .to(panel, {
          clipPath: 'inset(0 0 100% 0 round 0px)',
          duration: 0.6,
          ease: 'power4.inOut',
        }, '-=0.1')
        .to(root, {
          opacity: 0,
          duration: 0.2,
          pointerEvents: 'none',
        }, '-=0.2');
    }, rootRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div ref={rootRef} className="preloader-root" aria-hidden="true">
      <div className="preloader-panel">
        <div className="preloader-content">
          <span className="preloader-kicker">AI Engineer • ML Engineer • Data Scientist</span>
          <div className="preloader-lines">
            <span className="preloader-line">Gichogu</span>
            <span className="preloader-line">Macharia</span>
          </div>
          <span className="preloader-subtitle">Building intelligent systems with precision and style.</span>
        </div>
      </div>
    </div>
  );
};

export default Preloader;