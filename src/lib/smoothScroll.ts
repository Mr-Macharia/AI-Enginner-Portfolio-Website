import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

let lenisInstance: Lenis | null = null;
let cleanupTicker: (() => void) | null = null;
let isRegistered = false;

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function ensureGsapSetup() {
  if (!isRegistered) {
    gsap.registerPlugin(ScrollTrigger);
    isRegistered = true;
  }
}

export function initSmoothScroll() {
  if (typeof window === 'undefined' || prefersReducedMotion()) {
    return null;
  }

  ensureGsapSetup();

  if (lenisInstance) {
    return lenisInstance;
  }

  const lenis = new Lenis({
    duration: 1.15,
    smoothWheel: true,
    syncTouch: false,
    gestureOrientation: 'vertical',
  });

  const onScroll = () => ScrollTrigger.update();
  lenis.on('scroll', onScroll);

  const update = (time: number) => {
    lenis.raf(time * 1000);
  };

  gsap.ticker.add(update);
  gsap.ticker.lagSmoothing(0);

  cleanupTicker = () => {
    gsap.ticker.remove(update);
    lenis.off('scroll', onScroll);
  };

  lenisInstance = lenis;
  return lenisInstance;
}

export function getLenis() {
  return lenisInstance;
}

export function scrollToTarget(target: string | HTMLElement, options?: Parameters<Lenis['scrollTo']>[1]) {
  const lenis = getLenis();

  if (lenis) {
    lenis.scrollTo(target, options);
    return;
  }

  if (typeof target === 'string') {
    const element = document.querySelector(target);
    if (element instanceof HTMLElement) {
      element.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
      return;
    }
  }

  if (target instanceof HTMLElement) {
    target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
    return;
  }

  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}

export function destroySmoothScroll() {
  cleanupTicker?.();
  cleanupTicker = null;
  lenisInstance?.destroy();
  lenisInstance = null;
}