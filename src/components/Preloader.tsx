import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

export const SESSION_KEY = 'gm-portfolio-preloader-seen';

const Preloader = ({ onComplete }: PreloaderProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      onComplete();
      return;
    }

    const finish = () => {
      if (completedRef.current) return;
      completedRef.current = true;
      try {
        window.sessionStorage.setItem(SESSION_KEY, 'true');
      } catch {
        // Ignore storage errors in private browsing
      }
      onComplete();
    };

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasSeenPreloader = window.sessionStorage.getItem(SESSION_KEY) === 'true';

    if (prefersReducedMotion || hasSeenPreloader) {
      finish();
      return;
    }

    const root = rootRef.current;
    if (!root) {
      finish();
      return;
    }

    // Safety fallback timeout to ensure the portfolio never stays stuck
    const safetyTimer = setTimeout(finish, 1500);

    const lines = Array.from(root.querySelectorAll('.preloader-line'));
    const panel = root.querySelector('.preloader-panel');

    const isMobile = window.innerWidth <= 768;
    const lineDuration = isMobile ? 0.35 : 0.45;
    const stagger = isMobile ? 0.04 : 0.05;
    const holdTime = isMobile ? '+=0.1' : '+=0.18';
    const outDuration = isMobile ? 0.25 : 0.35;
    const panelDuration = isMobile ? 0.35 : 0.45;

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
          clearTimeout(safetyTimer);
          finish();
        },
      });

      gsap.set(lines, { yPercent: 120, opacity: 0 });

      timeline
        .to(lines, {
          yPercent: 0,
          opacity: 1,
          duration: lineDuration,
          stagger,
        })
        .to(lines, {
          yPercent: -110,
          opacity: 0,
          duration: outDuration,
          stagger: 0.03,
        }, holdTime)
        .to(panel, {
          yPercent: -100,
          duration: panelDuration,
          ease: 'power3.inOut',
        }, '-=0.08')
        .to(root, {
          opacity: 0,
          duration: 0.15,
          pointerEvents: 'none',
        }, '-=0.15');
    }, rootRef);

    return () => {
      clearTimeout(safetyTimer);
      ctx.revert();
    };
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