import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Two rows running in opposite directions; scroll speed boosts them and skews the type. */
export default function VelocityMarquee({ rows }: { rows: [string[], string[]] }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const tracks = gsap.utils.toArray<HTMLElement>('.vm-track');
    const loops = tracks.map((t, i) =>
      gsap.fromTo(t, { xPercent: i ? -50 : 0 }, { xPercent: i ? 0 : -50, duration: 40, ease: 'none', repeat: -1 }));
    const skew = gsap.quickTo(tracks, 'skewX', { duration: 0.5, ease: 'power3' });
    ScrollTrigger.create({
      trigger: root.current, start: 'top bottom', end: 'bottom top',
      onToggle: (self) => loops.forEach((l) => (self.isActive ? l.resume() : l.pause())),
      onUpdate: (self) => {
        const v = self.getVelocity();
        const boost = 1 + Math.min(Math.abs(v) / 250, 6);
        loops.forEach((l) => gsap.to(l, { timeScale: boost * (v < 0 ? -1 : 1), duration: 0.2, overwrite: true }));
        skew(gsap.utils.clamp(-12, 12, v / -120));
        gsap.delayedCall(0.25, () => { loops.forEach((l) => gsap.to(l, { timeScale: v < 0 ? -1 : 1, duration: 1 })); skew(0); });
      },
    });
  }, { scope: root });

  return (
    <div ref={root} className="vm" aria-hidden="true">
      {rows.map((items, i) => (
        <div className="vm-row" key={i}>
          <div className={`vm-track${i ? '' : ' vm-outline'}`}>
            {[0, 1].map((k) => (
              <ul key={k} className="vm-list">
                {items.map((t) => (
                  <li key={t}>
                    {t}
                    <svg viewBox="0 0 24 24" className="vm-star" aria-hidden="true"><path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" fill="currentColor" /></svg>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
