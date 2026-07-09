import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import './index.css';
import Background from './components/Background';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import CustomCursor from './components/CustomCursor';
import GrainOverlay from './components/GrainOverlay';
import Preloader from './components/Preloader';
import { destroySmoothScroll, initSmoothScroll } from './lib/smoothScroll';

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
  const [isReady, setIsReady] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const updateScrollState = (scrollY = window.scrollY) => {
      // Active section tracking
      const sections = document.querySelectorAll('section[id]');
      let current = 'home';
      sections.forEach((section) => {
        const top = section.getBoundingClientRect().top;
        if (top <= window.innerHeight / 3) {
          current = section.getAttribute('id') || 'home';
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

    const lenis = initSmoothScroll();

    if (lenis) {
      const onLenisScroll = ({ scroll }: { scroll: number }) => {
        updateScrollState(scroll);
      };

      lenis.on('scroll', onLenisScroll);
      updateScrollState(lenis.scroll);

      return () => {
        lenis.off('scroll', onLenisScroll);
        destroySmoothScroll();
      };
    }

    const handleScroll = () => updateScrollState(window.scrollY);

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScrollState(window.scrollY);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isReady]);

  return (
    <>
      {!isReady ? <Preloader onComplete={() => setIsReady(true)} /> : null}
      <div ref={progressRef} className={`scroll-progress ${isReady ? 'is-ready' : ''}`} />
      <Background />
      <GrainOverlay />
      <CustomCursor />
      <div className={`app-shell ${isReady ? 'is-ready' : ''}`}>
        <Navbar activeSection={activeSection} />
        <main>
          <Hero />
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
