import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Counts from 0 to `to` the first time it scrolls into view. Renders the final value without JS / with reduced motion. */
export default function CountUp({ to, suffix = '', prefix = '' }: { to: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const o = { v: 0 };
    gsap.to(o, {
      v: to, duration: 2, ease: 'power3.out',
      scrollTrigger: { trigger: ref.current, start: 'top 90%', once: true },
      onUpdate: () => { if (ref.current) ref.current.textContent = prefix + Math.round(o.v) + suffix; },
    });
  });
  return <span ref={ref} className="tabular-nums">{prefix}{to}{suffix}</span>;
}
