import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export interface TiltOptions {
  maxRotation?: number; // Max tilt rotation in degrees (default 10)
  scale?: number;       // Scale on hover (default 1.015)
  perspective?: number; // CSS perspective value (default 1000)
  glare?: boolean;      // Update custom properties for glare reflection (default true)
}

export function useTilt<T extends HTMLElement>(options: TiltOptions = {}) {
  const {
    maxRotation = 10,
    scale = 1.015,
    perspective = 1000,
    glare = true
  } = options;

  const elementRef = useRef<T>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el || typeof window === 'undefined') return;

    // Skip on touch screens and prefers-reduced-motion to protect user preference
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReduced) return;

    // Configure 3D properties on the element
    gsap.set(el, { transformPerspective: perspective, transformStyle: 'preserve-3d' });

    let rectLeft = 0;
    let rectTop = 0;
    let rectWidth = 0;
    let rectHeight = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (rectWidth === 0) {
        const rect = el.getBoundingClientRect();
        rectLeft = rect.left + window.scrollX;
        rectTop = rect.top + window.scrollY;
        rectWidth = rect.width;
        rectHeight = rect.height;
      }
      
      const x = e.pageX - rectLeft;
      const y = e.pageY - rectTop;
      
      const percentX = Math.max(0, Math.min(1, x / rectWidth));
      const percentY = Math.max(0, Math.min(1, y / rectHeight));
      
      // Calculate rotation relative to card center
      const rotateX = (0.5 - percentY) * maxRotation;
      const rotateY = (percentX - 0.5) * maxRotation;

      gsap.to(el, {
        rotateX,
        rotateY,
        scale,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto'
      });

      if (glare) {
        el.style.setProperty('--glare-x', `${percentX * 100}%`);
        el.style.setProperty('--glare-y', `${percentY * 100}%`);
      }
    };

    const handleMouseEnter = () => {
      const rect = el.getBoundingClientRect();
      rectLeft = rect.left + window.scrollX;
      rectTop = rect.top + window.scrollY;
      rectWidth = rect.width;
      rectHeight = rect.height;

      gsap.to(el, {
        scale,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    };

    const handleMouseLeave = () => {
      rectWidth = 0;
      gsap.to(el, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.5,
        ease: 'power3.out',
        overwrite: 'auto'
      });
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
      gsap.killTweensOf(el);
      gsap.set(el, { clearProps: 'rotateX,rotateY,scale,transformStyle,transformPerspective' });
    };
  }, [maxRotation, scale, perspective, glare]);

  return elementRef;
}

export default useTilt;
