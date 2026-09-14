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

    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    // Horizontal reveals translate a full-width wrapper sideways, which sticks
    // out past the viewport until the trigger fires and causes a horizontal
    // scrollbar on narrow screens. Reveal upward instead on mobile.
    const resolvedDirection =
      isMobile && (direction === 'left' || direction === 'right') ? 'up' : direction;
    const offset = directionOffset[resolvedDirection];

    const ctx = gsap.context(() => {
      // Initialize element styles to prevent flashes before execution
      gsap.set(element, {
        opacity: 0,
        scale: 0.97,
        ...(isMobile ? {} : { filter: 'blur(6px)' }),
        ...offset,
      });

      // Animating to fully revealed state
      gsap.to(element, {
        opacity: 1,
        scale: 1,
        ...(isMobile ? {} : { filter: 'blur(0px)' }),
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
