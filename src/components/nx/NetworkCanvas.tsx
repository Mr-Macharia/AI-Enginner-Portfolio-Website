import { useEffect, useRef } from 'react';

type Node = { x: number; y: number; vx: number; vy: number; r: number; hot: boolean; ring: boolean };

/**
 * Animated node graph echoing the Gich AI Nexus mark: orange hubs, slate satellites,
 * links that reach for the cursor. Fine pointers only; pauses offscreen; static under reduced motion.
 */
export default function NetworkCanvas({ className = '', density = 1 }: { className?: string; density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w = 0, h = 0, raf = 0, visible = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -9999, y: -9999 };
    let nodes: Node[] = [];
    const isDark = () => document.documentElement.classList.contains('dark');

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(70, (w * h) / 18000) * density);
      nodes = Array.from({ length: count }, () => {
        const hot = Math.random() < 0.3;
        return {
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
          r: hot ? 2.4 + Math.random() * 2.2 : 1.4 + Math.random() * 1.4, hot, ring: Math.random() < 0.3,
        };
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const dark = isDark();
      const max = 140;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        if (!reduced) {
          const dx = mouse.x - a.x, dy = mouse.y - a.y, d = Math.hypot(dx, dy) || 1;
          if (d < 180) { a.vx += (dx / d) * 0.01; a.vy += (dy / d) * 0.01; }
          a.vx *= 0.99; a.vy *= 0.99;
          a.vx += (Math.random() - 0.5) * 0.01; a.vy += (Math.random() - 0.5) * 0.01;
          a.x += a.vx; a.y += a.vy;
          if (a.x < 0 || a.x > w) a.vx *= -1;
          if (a.y < 0 || a.y > h) a.vy *= -1;
        }
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < max) {
            const alpha = (1 - d / max) * 0.45;
            ctx.strokeStyle = a.hot && b.hot ? `rgba(232,93,4,${alpha})` : `rgba(100,116,139,${alpha * 0.55})`;
            ctx.lineWidth = a.hot && b.hot ? 1.2 : 0.7;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        const md = Math.hypot(mouse.x - a.x, mouse.y - a.y);
        if (md < 200) {
          ctx.strokeStyle = `rgba(232,93,4,${(1 - md / 200) * 0.55})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }
      for (const n of nodes) {
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        if (n.ring) {
          ctx.fillStyle = dark ? '#0a0f1e' : '#fff'; ctx.fill();
          ctx.lineWidth = 1.5; ctx.strokeStyle = n.hot ? '#e85d04' : '#94a3b8'; ctx.stroke();
        } else {
          ctx.fillStyle = n.hot ? '#f48c06' : '#94a3b8'; ctx.fill();
        }
      }
    };

    const loop = () => { if (visible) draw(); raf = requestAnimationFrame(loop); };
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    };
    const onLeave = () => { mouse.x = mouse.y = -9999; };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    const ro = new ResizeObserver(() => { build(); if (reduced) draw(); });

    build();
    io.observe(canvas); ro.observe(canvas);
    if (reduced) draw();
    else {
      loop();
      window.addEventListener('pointermove', onMove, { passive: true });
      document.addEventListener('pointerleave', onLeave);
    }
    return () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect();
      window.removeEventListener('pointermove', onMove); document.removeEventListener('pointerleave', onLeave);
    };
  }, [density]);

  return <canvas ref={ref} aria-hidden="true" className={`nx-network ${className}`} />;
}
