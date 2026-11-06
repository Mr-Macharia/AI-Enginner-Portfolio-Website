import VelocityMarquee from './components/nx/VelocityMarquee';
import { Fragment, lazy, Suspense, useEffect, useRef, useState } from 'react';
import './index.css';
import Background from './components/Background';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import GrainOverlay from './components/GrainOverlay';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { destroySmoothScroll, initSmoothScroll } from './lib/smoothScroll';

// Below-the-fold sections, in page order. Each is fetched and mounted in its own
// idle slot once the hero has painted, top to bottom, so ScrollTrigger measures
// every section against a settled layout above it.
const deferredSections = [
  { id: 'projects', tag: 'Portfolio', title: 'Recent Projects', load: () => import('./components/Projects') },
  { id: 'experience', tag: 'Career', title: 'Experience', load: () => import('./components/Experience') },
  { id: 'certifications', tag: 'Verified Skills', title: 'Certifications & Badges', load: () => import('./components/Certifications') },
  { id: 'contact', tag: 'Get in Touch', title: "Let's Work Together", load: () => import('./components/Contact') },
].map((section) => ({ ...section, Component: lazy(section.load) }));

const whenIdle = (callback: () => void) => {
  if ('requestIdleCallback' in window) {
    const id = requestIdleCallback(callback, { timeout: 1200 });
    return () => cancelIdleCallback(id);
  }
  const id = setTimeout(callback, 200); // Safari
  return () => clearTimeout(id);
};

function SectionFallback({ id, tag, title }: { id: string; tag: string; title: string }) {
  return (
    <section className="section section-fallback" id={id} aria-busy="true" aria-live="polite">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">{tag}</span>
          <h2 className="section-title">{title}</h2>
        </div>
        <div className="section-fallback-card glass-card">
          <div className="section-fallback-line section-fallback-line-wide" />
          <div className="section-fallback-line" />
          <div className="section-fallback-line section-fallback-line-short" />
        </div>
      </div>
    </section>
  );
}

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [mountedSections, setMountedSections] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);
  const sectionOffsetsRef = useRef<{ id: string; top: number }[]>([]);

  useEffect(() => {
    if (mountedSections >= deferredSections.length) {
      ScrollTrigger.refresh();
      return;
    }
    return whenIdle(() => {
      deferredSections[mountedSections].load().finally(() => setMountedSections(mountedSections + 1));
    });
  }, [mountedSections]);

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

  return (
    <>
      <div ref={progressRef} className="scroll-progress is-ready" />
      <Background />
      <GrainOverlay />
      <div className="app-shell is-ready">
        <Navbar activeSection={activeSection} />
        <main>
          <Hero isReady={true} />
          <About />
          <Skills />
          <VelocityMarquee rows={[['AI Agents', 'RAG Systems', 'MLOps', 'Automation'], ['Data Science', 'Computer Vision', 'Full-Stack', 'GenAI']]} />
          {deferredSections.map(({ id, tag, title, Component }, index) => {
            const fallback = <SectionFallback id={id} tag={tag} title={title} />;
            return index < mountedSections
              ? <Suspense key={id} fallback={fallback}><Component /></Suspense>
              : <Fragment key={id}>{fallback}</Fragment>;
          })}
        </main>
        <Footer />
        <BackToTop />
      </div>
    </>
  );
}

export default App;
