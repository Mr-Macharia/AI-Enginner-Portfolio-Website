import { useEffect, useRef, useState, type ComponentType } from 'react';
import './index.css';
import Background from './components/Background';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BackToTop from './components/BackToTop';
import GrainOverlay from './components/GrainOverlay';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { destroySmoothScroll, initSmoothScroll } from './lib/smoothScroll';

const MARQUEE_ROWS: [string[], string[]] = [
  ['AI Agents', 'RAG Systems', 'MLOps', 'Automation'],
  ['Data Science', 'Computer Vision', 'Full-Stack', 'GenAI'],
];

// Everything below the hero stays out of the first render, so the hero paints as
// soon as possible. It loads behind the startup loader and mounts together, so
// the page is revealed once, complete, with its final fonts and layout.
const sectionLoaders: (() => Promise<{ default: ComponentType }>)[] = [
  () => import('./components/About'),
  () => import('./components/Skills'),
  () => import('./components/nx/VelocityMarquee').then(({ default: Marquee }) => ({
    default: () => <Marquee rows={MARQUEE_ROWS} />,
  })),
  () => import('./components/Projects'),
  () => import('./components/Experience'),
  () => import('./components/Certifications'),
  () => import('./components/Contact'),
];

const FONT_TIMEOUT_MS = 2500;

function loadFonts() {
  const fonts = Promise.all([
    document.fonts.load('400 1em "Georama Variable"'),
    document.fonts.load('700 1em "Host Grotesk Variable"'),
    document.fonts.load('400 1em "Fira Code"'),
  ]);
  // A slow font never holds the page hostage; it swaps in when it arrives.
  return Promise.race([fonts, new Promise((resolve) => setTimeout(resolve, FONT_TIMEOUT_MS))]);
}

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [sections, setSections] = useState<ComponentType[] | null>(null);
  const [footer, setFooter] = useState<ComponentType | null>(null);
  const [isReady, setIsReady] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const sectionOffsetsRef = useRef<{ id: string; top: number }[]>([]);

  useEffect(() => {
    const modules = Promise.allSettled(sectionLoaders.map((load) => load()));
    const footerModule = import('./components/Footer');
    Promise.all([modules, footerModule.catch(() => null), loadFonts()]).then(([results, footerResult]) => {
      // Already-loaded modules, not lazy(): they commit in this render, so the
      // loader can never lift before they exist. A failed chunk doesn't block the rest.
      if (footerResult) setFooter(() => footerResult.default);
      setSections(results.flatMap((result) => (result.status === 'fulfilled' ? [result.value.default] : [])));
    });
  }, []);

  useEffect(() => {
    if (!sections) return;
    // Two frames: let the sections paint once before ScrollTrigger measures final layout.
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        setIsReady(true);
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [sections]);

  // Runs after Hero's effects, so its intro is armed before the loader lifts.
  useEffect(() => {
    if (isReady) document.getElementById('boot')?.classList.add('is-done');
  }, [isReady]);

  useEffect(() => {
    const cacheSectionOffsets = () => {
      const sections = document.querySelectorAll('section[id]');
      const offsets: { id: string; top: number }[] = [];
      sections.forEach((section) => {
        let top = 0;
        let curr = section as HTMLElement | null;
        while (curr) {
          top += curr.offsetTop;
          curr = curr.offsetParent as HTMLElement | null;
        }
        offsets.push({
          id: section.getAttribute('id') || '',
          top,
        });
      });
      sectionOffsetsRef.current = offsets;
    };

    // Layout reads are cached here, never taken on scroll. Observing the page
    // height also catches lazy sections mounting and images settling.
    const docHeightRef = { current: 0 };
    const measure = () => {
      cacheSectionOffsets();
      docHeightRef.current = document.documentElement.scrollHeight - window.innerHeight;
    };
    measure();
    const pageObserver = new ResizeObserver(measure);
    pageObserver.observe(document.documentElement);
    window.addEventListener('resize', measure, { passive: true });

    const updateScrollState = (scrollY = window.scrollY) => {
      // Active section tracking using cached static top offsets
      const threshold = window.innerHeight / 3;
      let current = 'home';
      sectionOffsetsRef.current.forEach(({ id, top }) => {
        const relativeTop = top - scrollY;
        if (relativeTop <= threshold) {
          current = id;
        }
      });
      setActiveSection(current);

      // Scroll progress bar
      if (progressRef.current) {
        const docHeight = docHeightRef.current;
        const progress = docHeight > 0 ? Math.min(scrollY / docHeight, 1) : 0;
        progressRef.current.style.transform = `scaleX(${progress})`;
      }
    };

    // Track scroll natively right away; Lenis (desktop only) is loaded async
    // and takes over once ready, so scrolling works during that gap.
    let scrollFrame = 0;
    const handleScroll = () => {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0;
        updateScrollState(window.scrollY);
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScrollState(window.scrollY);

    let cancelled = false;
    let detachLenis: (() => void) | null = null;

    initSmoothScroll().then((lenis) => {
      if (!lenis) return;
      if (cancelled) {
        destroySmoothScroll();
        return;
      }

      const onLenisScroll = ({ scroll }: { scroll: number }) => updateScrollState(scroll);

      window.removeEventListener('scroll', handleScroll);
      lenis.on('scroll', onLenisScroll);
      updateScrollState(lenis.scroll);

      detachLenis = () => {
        lenis.off('scroll', onLenisScroll);
        destroySmoothScroll();
      };
    });

    return () => {
      cancelled = true;
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(scrollFrame);
      pageObserver.disconnect();
      window.removeEventListener('resize', measure);
      detachLenis?.();
    };
  }, []);

  const FooterSection = footer;

  return (
    <>
      <div ref={progressRef} className="scroll-progress is-ready" />
      <Background />
      <GrainOverlay />
      <div className="app-shell is-ready">
        <Navbar activeSection={activeSection} />
        <main>
          <Hero isReady={isReady} />
          {sections?.map((Section, index) => <Section key={index} />)}
        </main>
        {FooterSection && <FooterSection />}
        <BackToTop />
      </div>
    </>
  );
}

export default App;
