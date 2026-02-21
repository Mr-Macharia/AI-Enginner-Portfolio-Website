import { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

const directionOffset: Record<string, object> = {
  up:    { y: 40 },
  down:  { y: -40 },
  left:  { x: 40 },
  right: { x: -40 },
};

export const ScrollReveal = ({ children, delay = 0, direction = 'up' }: ScrollRevealProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(8px)', ...directionOffset[direction] }}
      whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: 0.55,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
        delay: delay / 1000,
      }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
