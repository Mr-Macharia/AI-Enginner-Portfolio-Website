import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';

type CursorVariant = 'default' | 'interactive';

const interactiveSelector = 'a, button, [role="button"], input, textarea, select, summary';

const CustomCursor = () => {
  const [enabled, setEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>('default');
  const [label, setLabel] = useState('');

  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  const mouse = useRef({ x: -100, y: -100 });
  const hoveredEl = useRef<Element | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const pointerQuery = window.matchMedia('(pointer: fine)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const syncEnabled = () => {
      const nextEnabled = pointerQuery.matches && !motionQuery.matches;
      setEnabled(nextEnabled);
      document.body.classList.toggle('cursor-none', nextEnabled);
    };

    syncEnabled();
    pointerQuery.addEventListener('change', syncEnabled);
    motionQuery.addEventListener('change', syncEnabled);

    return () => {
      document.body.classList.remove('cursor-none');
      pointerQuery.removeEventListener('change', syncEnabled);
      motionQuery.removeEventListener('change', syncEnabled);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      setIsVisible(false);
      return;
    }

    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    // Reset cursor offscreen
    gsap.set([ring, dot], { x: -100, y: -100 });

    const pos = { ringX: -100, ringY: -100, dotX: -100, dotY: -100 };

    const onTick = () => {
      let targetX = mouse.current.x;
      let targetY = mouse.current.y;

      if (hoveredEl.current) {
        const rect = hoveredEl.current.getBoundingClientRect();
        targetX = rect.left + rect.width / 2;
        targetY = rect.top + rect.height / 2;
      }

      // Smooth lag interpolation
      pos.dotX += (mouse.current.x - pos.dotX) * 0.38;
      pos.dotY += (mouse.current.y - pos.dotY) * 0.38;

      const ringLerp = hoveredEl.current ? 0.24 : 0.15;
      pos.ringX += (targetX - pos.ringX) * ringLerp;
      pos.ringY += (targetY - pos.ringY) * ringLerp;

      gsap.set(ring, { x: pos.ringX, y: pos.ringY });
      gsap.set(dot, { x: pos.dotX, y: pos.dotY });
    };

    gsap.ticker.add(onTick);

    const updateVariant = (target: EventTarget | null) => {
      const element = target instanceof Element ? target.closest(interactiveSelector) : null;
      const nextLabel = element instanceof HTMLElement ? element.dataset.cursorLabel ?? '' : '';

      setVariant(element ? 'interactive' : 'default');
      setLabel(nextLabel);
      hoveredEl.current = element;
    };

    const handlePointerMove = (event: PointerEvent) => {
      mouse.current.x = event.clientX;
      mouse.current.y = event.clientY;
      setIsVisible(true);
      updateVariant(event.target);
    };

    const handlePointerLeave = () => setIsVisible(false);
    const handlePointerEnter = () => setIsVisible(true);
    const handlePointerDown = () => setVariant((current) => current);

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerleave', handlePointerLeave);
    document.addEventListener('pointerenter', handlePointerEnter);
    window.addEventListener('pointerdown', handlePointerDown);

    return () => {
      gsap.ticker.remove(onTick);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
      document.removeEventListener('pointerenter', handlePointerEnter);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <div className={`custom-cursor-layer ${isVisible ? 'visible' : ''}`} aria-hidden="true">
      <div
        ref={ringRef}
        className={`custom-cursor-ring ${variant}`}
      >
        {label ? <span className="custom-cursor-label">{label}</span> : null}
      </div>
      <div
        ref={dotRef}
        className={`custom-cursor-dot ${variant}`}
      />
    </div>
  );
};

export default CustomCursor;