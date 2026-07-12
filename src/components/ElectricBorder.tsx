// Credit: component inspired by @BalintFerenczy on X
// https://codepen.io/BalintFerenczy/pen/KwdoyEN
import { useEffect, useRef, useCallback, useState, type CSSProperties, type ReactNode } from 'react';
import './ElectricBorder.css';

interface ElectricBorderProps {
  children: ReactNode;
  color?: string;
  speed?: number;
  chaos?: number;
  borderRadius?: number;
  className?: string;
  style?: CSSProperties;
}

// Pre-generated 512-element random number lookup table
const RANDOM_TABLE = Array.from({ length: 512 }, (_, i) => {
  const x = i + 0.5;
  return Math.abs((Math.sin(x * 12.9898) * 43758.5453) % 1);
});

const ElectricBorder = ({
  children,
  color = '#e85d04',
  speed = 1,
  chaos = 0.12,
  borderRadius = 20,
  className,
  style,
}: ElectricBorderProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const timeRef = useRef(0);
  const lastFrameTimeRef = useRef(0);
  const isHoveredRef = useRef(false);
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);

  const noise2D = useCallback(
    (x: number, y: number) => {
      const i = Math.floor(x), j = Math.floor(y);
      const fx = x - i, fy = y - j;
      const a = RANDOM_TABLE[(i + j * 57) & 511];
      const b = RANDOM_TABLE[(i + 1 + j * 57) & 511];
      const c = RANDOM_TABLE[(i + (j + 1) * 57) & 511];
      const d = RANDOM_TABLE[(i + 1 + (j + 1) * 57) & 511];
      const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
      return a*(1-ux)*(1-uy) + b*ux*(1-uy) + c*(1-ux)*uy + d*ux*uy;
    },
    []
  );

  const octavedNoise = useCallback(
    (x: number, octaves: number, lacunarity: number, gain: number,
     baseAmplitude: number, baseFrequency: number, time: number,
     seed: number, baseFlatness: number) => {
      let y = 0, amplitude = baseAmplitude, frequency = baseFrequency;
      for (let i = 0; i < octaves; i++) {
        const oct = i === 0 ? amplitude * baseFlatness : amplitude;
        y += oct * noise2D(frequency * x + seed * 100, time * frequency * 0.3);
        frequency *= lacunarity;
        amplitude *= gain;
      }
      return y;
    },
    [noise2D]
  );

  const getCornerPoint = useCallback(
    (cx: number, cy: number, r: number, startAngle: number, arcLen: number, progress: number) => ({
      x: cx + r * Math.cos(startAngle + progress * arcLen),
      y: cy + r * Math.sin(startAngle + progress * arcLen),
    }),
    []
  );

  const getRoundedRectPoint = useCallback(
    (t: number, left: number, top: number, width: number, height: number, radius: number) => {
      const sw = width - 2 * radius, sh = height - 2 * radius;
      const ca = (Math.PI * radius) / 2;
      const total = 2 * sw + 2 * sh + 4 * ca;
      const dist = t * total;
      let acc = 0;

      if (dist <= acc + sw) return { x: left + radius + (dist - acc) / sw * sw, y: top };
      acc += sw;
      if (dist <= acc + ca) return getCornerPoint(left+width-radius, top+radius, radius, -Math.PI/2, Math.PI/2, (dist-acc)/ca);
      acc += ca;
      if (dist <= acc + sh) return { x: left + width, y: top + radius + (dist - acc) / sh * sh };
      acc += sh;
      if (dist <= acc + ca) return getCornerPoint(left+width-radius, top+height-radius, radius, 0, Math.PI/2, (dist-acc)/ca);
      acc += ca;
      if (dist <= acc + sw) return { x: left + width - radius - (dist - acc) / sw * sw, y: top + height };
      acc += sw;
      if (dist <= acc + ca) return getCornerPoint(left+radius, top+height-radius, radius, Math.PI/2, Math.PI/2, (dist-acc)/ca);
      acc += ca;
      if (dist <= acc + sh) return { x: left, y: top + height - radius - (dist - acc) / sh * sh };
      acc += sh;
      return getCornerPoint(left+radius, top+radius, radius, Math.PI, Math.PI/2, (dist-acc)/ca);
    },
    [getCornerPoint]
  );

  // Viewport Intersection Observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === 'undefined') return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]) {
          setInView(entries[0].isIntersecting);
        }
      },
      { rootMargin: '200px' }
    );

    io.observe(container);
    return () => io.disconnect();
  }, []);

  // Main canvas rendering effect
  useEffect(() => {
    if (!inView) return;

    const canvas = canvasRef.current, container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const octaves = 5, lacunarity = 1.6, gain = 0.7;
    const displacement = 60, borderOffset = 60;
    
    let width = 0;
    let height = 0;

    const draw = (now: number) => {
      if (!isHoveredRef.current) {
        animationRef.current = 0;
        return;
      }
      if (!canvas || !ctx) return;
      const dt = (now - lastFrameTimeRef.current) / 1000;
      timeRef.current += dt * speed;
      lastFrameTimeRef.current = now;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const left = borderOffset, top = borderOffset;
      const bw = width - 2 * borderOffset, bh = height - 2 * borderOffset;
      if (bw <= 0 || bh <= 0) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }

      const maxR = Math.min(bw, bh) / 2;
      const r = Math.min(borderRadius, maxR);
      const approxPerim = 2 * (bw + bh) + 2 * Math.PI * r;
      const samples = Math.floor(approxPerim / 3);

      ctx.beginPath();
      for (let i = 0; i <= samples; i++) {
        const p = i / samples;
        const pt = getRoundedRectPoint(p, left, top, bw, bh, r);
        const xn = octavedNoise(p*8, octaves, lacunarity, gain, chaos, 10, timeRef.current, 0, 0);
        const yn = octavedNoise(p*8, octaves, lacunarity, gain, chaos, 10, timeRef.current, 1, 0);
        const dx = pt.x + xn * displacement;
        const dy = pt.y + yn * displacement;
        if (i === 0) {
          ctx.moveTo(dx, dy);
        } else {
          ctx.lineTo(dx, dy);
        }
      }
      ctx.closePath();
      ctx.stroke();
      animationRef.current = requestAnimationFrame(draw);
    };

    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;

      const canvasW = w + borderOffset * 2;
      const canvasH = h + borderOffset * 2;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvasW * dpr;
      canvas.height = canvasH * dpr;
      canvas.style.width = `${canvasW}px`;
      canvas.style.height = `${canvasH}px`;
      ctx.scale(dpr, dpr);

      width = canvasW;
      height = canvasH;
    };

    // Initialize size immediately
    handleResize();

    const startAnimation = () => {
      isHoveredRef.current = true;
      setHovered(true);
      // Re-measure size on hover start to ensure it is accurate
      handleResize();
      const isDarkMode = document.documentElement.classList.contains('dark');
      if (isDarkMode && !animationRef.current) {
        lastFrameTimeRef.current = performance.now();
        animationRef.current = requestAnimationFrame(draw);
      }
    };

    const stopAnimation = () => {
      isHoveredRef.current = false;
      setHovered(false);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    container.addEventListener('mouseenter', startAnimation);
    container.addEventListener('mouseleave', stopAnimation);

    return () => {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = 0;
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mouseenter', startAnimation);
      container.removeEventListener('mouseleave', stopAnimation);
    };
  }, [inView, color, speed, chaos, borderRadius, octavedNoise, getRoundedRectPoint]);

  return (
    <div
      ref={containerRef}
      className={`electric-border${className ? ` ${className}` : ''}`}
      style={{ '--electric-border-color': color, borderRadius, ...style } as CSSProperties}
    >
      <div className="eb-canvas-container">
        {inView && <canvas ref={canvasRef} className="eb-canvas" />}
      </div>
      <div className="eb-layers" style={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.35s ease' }}>
        <div className="eb-glow-1" />
        <div className="eb-glow-2" />
        <div className="eb-background-glow" />
      </div>
      <div className="eb-content">{children}</div>
    </div>
  );
};

export default ElectricBorder;
