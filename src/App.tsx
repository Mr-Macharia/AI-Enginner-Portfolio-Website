import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import './index.css';
import Background from './components/Background';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import GrainOverlay from './components/GrainOverlay';
import { destroySmoothScroll, initSmoothScroll } from './lib/smoothScroll';

// Desktop-only pointer effect: keep it (and its GSAP dependency) off the
// critical path so touch devices never download it.
const CustomCursor = lazy(() => import('./components/CustomCursor'));

const Projects = lazy(() => import('./components/Projects'));
const Experience = lazy(() => import('./components/Experience'));
const Certifications = lazy(() => import('./components/Certifications'));
const Contact = lazy(() => import('./components/Contact'));

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
  const [canHover, setCanHover] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const sectionOffsetsRef = useRef<{ id: string; top: number }[]>([]);

  useEffect(() => {
    const pointerQuery = window.matchMedia('(pointer: fine)');
    const sync = () => setCanHover(pointerQuery.matches);
    sync();
    pointerQuery.addEventListener('change', sync);
    return () => pointerQuery.removeEventListener('change', sync);
  }, []);

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

    cacheSectionOffsets();
    window.addEventListener('resize', cacheSectionOffsets, { passive: true });

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
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
        progressRef.current.style.width = `${pct}%`;
      }
    };

    // Track scroll natively right away; Lenis (desktop only) is loaded async
    // and takes over once ready, so scrolling works during that gap.
    const handleScroll = () => updateScrollState(window.scrollY);
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
      window.removeEventListener('resize', cacheSectionOffsets);
      detachLenis?.();
    };
  }, []);

  return (
    <>
      <div ref={progressRef} className="scroll-progress is-ready" />
      <Background />
      <GrainOverlay />
      {canHover && (
        <Suspense fallback={null}>
          <CustomCursor />
        </Suspense>
      )}
      <div className="app-shell is-ready">
        <Navbar activeSection={activeSection} />
        <main>
          <Hero isReady={true} />
          <About />
          <Skills />
          <Suspense fallback={<SectionFallback id="projects" tag="Portfolio" title="Recent Projects" />}>
            <Projects />
          </Suspense>
          <Suspense fallback={<SectionFallback id="experience" tag="Career" title="Experience" />}>
            <Experience />
          </Suspense>
          <Suspense fallback={<SectionFallback id="certifications" tag="Verified Skills" title="Certifications & Badges" />}>
            <Certifications />
          </Suspense>
          <Suspense fallback={<SectionFallback id="contact" tag="Get in Touch" title="Let's Work Together" />}>
            <Contact />
          </Suspense>
        </main>
        <Footer />
        <BackToTop />
      </div>
    </>
  );
}

export default App;
