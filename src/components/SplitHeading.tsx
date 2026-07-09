import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SplitHeadingProps {
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  text: string;
  delay?: number;
  once?: boolean;
}

const SplitHeading = ({ as: Tag = 'h2', className, text, delay = 0, once = true }: SplitHeadingProps) => {
  const rootRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const element = rootRef.current;

    if (!element || typeof window === 'undefined') {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const words = Array.from(element.querySelectorAll('.split-heading-word'));

    if (!words.length) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(words, { yPercent: 115, opacity: 0, rotateZ: 2, transformOrigin: '0% 100%' });

      gsap.to(words, {
        yPercent: 0,
        opacity: 1,
        rotateZ: 0,
        ease: 'power3.out',
        duration: 0.9,
        delay,
        stagger: 0.08,
        scrollTrigger: {
          trigger: element,
          start: 'top 82%',
          once,
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, [delay, once, text]);

  return (
    <Tag ref={rootRef} className={`split-heading ${className ?? ''}`.trim()} aria-label={text}>
      {text.split(' ').map((word, index) => (
        <span key={`${word}-${index}`} className="split-heading-line">
          <span className="split-heading-word">{word}</span>
          {index < text.split(' ').length - 1 ? <span className="split-heading-space">&nbsp;</span> : null}
        </span>
      ))}
    </Tag>
  );
};

export default SplitHeading;