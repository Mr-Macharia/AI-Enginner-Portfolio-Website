import { useState, useEffect, useRef } from 'react';
import './index.css';
import Background from './components/Background';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Certifications from './components/Certifications';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
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
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressRef.current.style.width = `${pct}%`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div ref={progressRef} className="scroll-progress" />
      <Background />
      <Navbar activeSection={activeSection} />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Certifications />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}

export default App;
