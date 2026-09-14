import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type Lenis from 'lenis';

let lenisInstance: Lenis | null = null;
let cleanupTicker: (() => void) | null = null;
let isRegistered = false;

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Lenis runs with syncTouch disabled, so on touch devices it hands scrolling
// back to the browser anyway — all it adds there is a per-frame RAF loop that
// competes with native momentum scrolling. Skip it and use native scroll.
// `any-pointer: fine` keeps hybrid laptops (touchscreen + trackpad) on Lenis,
// and an unknown/absent pointer falls through to Lenis rather than being
// misread as touch.
function isTouchPrimary() {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(pointer: coarse)').matches &&
    !window.matchMedia('(any-pointer: fine)').matches
  );
}

function ensureGsapSetup() {
  if (!isRegistered) {
    gsap.registerPlugin(ScrollTrigger);
    isRegistered = true;
  }
}

/**
 * Loads Lenis only when this device will actually use it, so touch devices
 * never pay for the download. Resolves to null when native scrolling is used.
 */
export async function initSmoothScroll(): Promise<Lenis | null> {
  if (typeof window === 'undefined' || prefersReducedMotion() || isTouchPrimary()) {
    // ScrollTrigger still drives the reveal animations on native scroll.
    ensureGsapSetup();
    return null;
  }

  if (lenisInstance) {
    return lenisInstance;
  }

  const { default: LenisCtor } = await import('lenis');
  return createSmoothScroll(LenisCtor);
}

function createSmoothScroll(LenisCtor: typeof Lenis) {
  ensureGsapSetup();

  if (lenisInstance) {
    return lenisInstance;
  }

  const lenis = new LenisCtor({
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