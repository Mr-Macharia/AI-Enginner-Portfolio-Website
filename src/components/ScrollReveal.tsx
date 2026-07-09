import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

const directionOffset = {
  up:    { y: 45 },
  down:  { y: -45 },
  left:  { x: 45 },
  right: { x: -45 },
};

export const ScrollReveal = ({ children, delay = 0, direction = 'up' }: ScrollRevealProps) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || typeof window === 'undefined') return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const offset = directionOffset[direction];

    const ctx = gsap.context(() => {
      // Initialize element styles to prevent flashes before execution
      gsap.set(element, {
        opacity: 0,
        scale: 0.97,
        filter: 'blur(6px)',
        ...offset,
      });

      // Animating to fully revealed state
      gsap.to(element, {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        x: 0,
        y: 0,
        duration: 0.85,
        delay: delay / 1000,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          once: true,
        },
      });
    }, elementRef);

    return () => ctx.revert();
  }, [delay, direction]);

  return (
    <div ref={elementRef} style={{ width: '100%' }}>
      {children}
    </div>
  );
};

export default ScrollReveal;
