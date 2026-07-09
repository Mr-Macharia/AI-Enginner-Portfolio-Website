import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

type CursorVariant = 'default' | 'interactive';

const interactiveSelector = 'a, button, [role="button"], input, textarea, select, summary';

const springConfig = { stiffness: 320, damping: 28, mass: 0.35 };

const CustomCursor = () => {
  const [enabled, setEnabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>('default');
  const [label, setLabel] = useState('');

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const ringX = useSpring(cursorX, springConfig);
  const ringY = useSpring(cursorY, springConfig);
  const dotX = useSpring(cursorX, { ...springConfig, stiffness: 480, damping: 34 });
  const dotY = useSpring(cursorY, { ...springConfig, stiffness: 480, damping: 34 });

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

    const updateVariant = (target: EventTarget | null) => {
      const element = target instanceof Element ? target.closest(interactiveSelector) : null;
      const nextLabel = element instanceof HTMLElement ? element.dataset.cursorLabel ?? '' : '';

      setVariant(element ? 'interactive' : 'default');
      setLabel(nextLabel);
    };

    const handlePointerMove = (event: PointerEvent) => {
      cursorX.set(event.clientX);
      cursorY.set(event.clientY);
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
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
      document.removeEventListener('pointerenter', handlePointerEnter);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [cursorX, cursorY, enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <div className={`custom-cursor-layer ${isVisible ? 'visible' : ''}`} aria-hidden="true">
      <motion.div
        className={`custom-cursor-ring ${variant}`}
        style={{ x: ringX, y: ringY }}
      >
        {label ? <span className="custom-cursor-label">{label}</span> : null}
      </motion.div>
      <motion.div
        className={`custom-cursor-dot ${variant}`}
        style={{ x: dotX, y: dotY }}
      />
    </div>
  );
};

export default CustomCursor;