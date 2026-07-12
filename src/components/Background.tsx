import { useEffect, useRef } from 'react';

const Background = () => {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Direct DOM manipulation — zero re-renders on every mouse move
    const handleMouseMove = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate3d(-50%, -50%, 0)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="bg-animation">
      <div className="gradient-orb orb-1" />
      <div className="gradient-orb orb-2" />
      <div className="gradient-orb orb-3" />
      <div ref={glowRef} className="cursor-glow" />
    </div>
  );
};

export default Background;

