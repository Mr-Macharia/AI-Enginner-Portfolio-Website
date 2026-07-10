import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Mail } from 'lucide-react';
import gsap from 'gsap';
import Marquee from './Marquee';
import { scrollToTarget } from '../lib/smoothScroll';
import SplitHeading from './SplitHeading';
import pythonLogo    from '../assets/python_logo.png';
import langchainLogo from '../assets/langchain_logo.png';
import crewaiLogo    from '../assets/crewai_logo.png';
import llamaindexLogo from '../assets/llamaindex_logo.png';

/* ── Typewriter hook ──────────────────────────────────────────────── */
const PHRASES = ['AI agents', 'ML pipelines', 'GenAI solutions', 'RAG systems', 'data-driven solutions'];
const HERO_MARQUEE_ITEMS = ['AI ENGINEER', 'ML ENGINEER', 'GENAI SYSTEMS', 'RAG PIPELINES', 'AUTOMATION', 'DATA PRODUCTS'];

function useTypewriter(phrases: string[], enabled: boolean) {
  const [text, setText] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const target = phrases[phraseIdx];
    const atEnd = !isDeleting && charIdx === target.length;
    const delay = isDeleting ? 40 : atEnd ? 2200 : 80;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (charIdx < target.length) {
          setText(target.slice(0, charIdx + 1));
          setCharIdx(c => c + 1);
        } else {
          setIsDeleting(true);
        }
      } else {
        if (charIdx > 0) {
          setText(target.slice(0, charIdx - 1));
          setCharIdx(c => c - 1);
        } else {
          setIsDeleting(false);
          setPhraseIdx(p => (p + 1) % phrases.length);
        }
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [charIdx, isDeleting, phraseIdx, phrases, enabled]);

  return text;
}

/* ── Magnetic button hook ─────────────────────────────────────────── */
function useMagnetic(strength = 0.35) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  }, [x, y, strength]);

  const onLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);

  return { ref, sx, sy, onMove, onLeave };
}

/* ── Floating icon with mouse-parallax ──────────────────────────────*/
function FloatIcon({
  src, alt, className, depth,
  mouseX, mouseY,
}: {
  src: string; alt: string; className: string; depth: number;
  mouseX: ReturnType<typeof useSpring>; mouseY: ReturnType<typeof useSpring>;
}) {
  const tx = useTransform(mouseX, v => v * depth);
  const ty = useTransform(mouseY, v => v * depth);
  return (
    <motion.img
      src={src}
      alt={alt}
      className={`float-icon ${className}`}
      style={{ x: tx, y: ty }}
      animate={{ y: [0, -14, 0] }}
      transition={{ duration: 4 + depth * 2, repeat: Infinity, ease: 'easeInOut', delay: depth }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────── */

const Hero = ({ isReady }: { isReady: boolean }) => {
  const typedText = useTypewriter(PHRASES, isReady);
  const {
    ref: mag1Ref,
    sx: mag1Sx,
    sy: mag1Sy,
    onMove: mag1OnMove,
    onLeave: mag1OnLeave
  } = useMagnetic(0.4);
  const {
    ref: mag2Ref,
    sx: mag2Sx,
    sy: mag2Sy,
    onMove: mag2OnMove,
    onLeave: mag2OnLeave
  } = useMagnetic(0.3);

  // Mouse position for parallax (raw values, normalised -1 to 1)
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mouseX = useSpring(rawX, { stiffness: 80, damping: 20 });
  const mouseY = useSpring(rawY, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawX.set((e.clientX / window.innerWidth  - 0.5) * 40);
      rawY.set((e.clientY / window.innerHeight - 0.5) * 40);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [rawX, rawY]);

  useEffect(() => {
    if (!isReady) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power4.out', duration: 1 },
      });

      // Start state set synchronously before render frame paint
      gsap.set('.hero-badge, .hero-title, .hero-description, .hero-marquee-shell, .hero-cta, .hero-socials', {
        opacity: 0,
        y: 35
      });
      gsap.set('.hero-visual', {
        opacity: 0,
        x: 45
      });
      gsap.set('.scroll-indicator', {
        opacity: 0
      });

      // Animated entry timeline sequence
      tl.to('.hero-badge, .hero-title, .hero-description, .hero-marquee-shell, .hero-cta, .hero-socials', {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.8,
        clearProps: 'transform'
      })
      .to('.hero-visual', {
        opacity: 1,
        x: 0,
        duration: 1.1
      }, '-=0.6')
      .to('.scroll-indicator', {
        opacity: 1,
        duration: 0.8
      }, '-=0.4');
    });

    return () => ctx.revert();
  }, [isReady]);

  const handleJump = (event: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    event.preventDefault();
    scrollToTarget(target, { offset: -24 });
  };

  return (
    <section className="hero" id="home" style={{ opacity: isReady ? 1 : 0, transition: 'opacity 0.3s ease' }}>
      <div className="hero-wrapper">
        {/* ── Left column ── */}
        <div className="hero-content">
          <div className="hero-badge glass-card">
            <span className="status-dot" />
            <span>Available for Freelance &amp; Consulting</span>
          </div>

          <div className="hero-title">
            <span className="greeting">Hello, I'm</span>
            <SplitHeading as="h1" className="name" text="Gichogu Macharia" />
            <span className="title-line">
              <SplitHeading as="h3" className="title-prefix" text="I build" delay={0.12} />
              <span className="title-typed">{typedText}</span>
              <span className="cursor">|</span>
            </span>
          </div>

          <p className="hero-description">
            AI Engineer, ML Engineer &amp; Data Scientist based in Nairobi, Kenya. I specialise in
            building robust AI/ML solutions, scalable data pipelines, and production-ready systems
            that drive measurable digital transformation.
          </p>

          <div className="hero-marquee-shell">
            <Marquee items={HERO_MARQUEE_ITEMS} className="hero-marquee" />
          </div>

          <div className="hero-cta">
            {/* Magnetic primary button */}
            <motion.div
              ref={mag1Ref}
              style={{ x: mag1Sx, y: mag1Sy, display: 'inline-block' }}
              onMouseMove={mag1OnMove}
              onMouseLeave={mag1OnLeave}
            >
              <a href="#projects" className="btn btn-primary" onClick={(event) => handleJump(event, '#projects')}>
                View My Work <ArrowRight size={18} />
              </a>
            </motion.div>

            {/* Magnetic secondary button */}
            <motion.div
              ref={mag2Ref}
              style={{ x: mag2Sx, y: mag2Sy, display: 'inline-block' }}
              onMouseMove={mag2OnMove}
              onMouseLeave={mag2OnLeave}
            >
              <a href="#contact" className="btn btn-secondary" onClick={(event) => handleJump(event, '#contact')}>Let's Talk</a>
            </motion.div>
          </div>

          <div className="hero-socials">
            <a href="https://linkedin.com/in/gichogu-macharia" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a href="https://github.com/Mr-Macharia" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a href="mailto:gichogumacharia001@gmail.com" className="social-link" aria-label="Email">
              <Mail size={20} />
            </a>
          </div>
        </div>

        {/* ── Right column (code window + floating icons) ── */}
        <div className="hero-visual">
          <div className="hero-card glass-card">
            <div className="code-window">
              <div className="window-header">
                <div className="window-dots">
                  <span className="dot red" />
                  <span className="dot yellow" />
                  <span className="dot green" />
                </div>
                <span className="window-title">ai_agent.py</span>
              </div>
              <pre className="code-content"><code>
<span className="keyword">from</span> <span className="module">crewai</span> <span className="keyword">import</span> Agent, Crew{'\n'}
<span className="keyword">from</span> <span className="module">langchain</span> <span className="keyword">import</span> LLM{'\n'}{'\n'}
<span className="keyword">class</span> <span className="class-name">AIAssistant</span>:{'\n'}
{'    '}<span className="keyword">def</span> <span className="function">__init__</span>(<span className="param">self</span>):{'\n'}
{'        '}<span className="param">self</span>.agent = Agent({'\n'}
{'            '}role=<span className="string">"AI Engineer"</span>,{'\n'}
{'            '}goal=<span className="string">"Build intelligent systems"</span>,{'\n'}
{'            '}backstory=<span className="string">"Expert in AI agents"</span>{'\n'}
{'        '}){'\n'}
{'    '}{'\n'}
{'    '}<span className="keyword">def</span> <span className="function">execute</span>(<span className="param">self</span>, task):{'\n'}
{'        '}<span className="keyword">return</span> <span className="param">self</span>.agent.run(task)
              </code></pre>
            </div>
          </div>

          <div className="floating-icons">
            <FloatIcon src={pythonLogo}     alt="Python"     className="icon-1" depth={0.6} mouseX={mouseX} mouseY={mouseY} />
            <FloatIcon src={langchainLogo}  alt="LangChain"  className="icon-2" depth={0.9} mouseX={mouseX} mouseY={mouseY} />
            <FloatIcon src={crewaiLogo}     alt="CrewAI"     className="icon-3" depth={0.5} mouseX={mouseX} mouseY={mouseY} />
            <FloatIcon src={llamaindexLogo} alt="LlamaIndex" className="icon-4" depth={0.7} mouseX={mouseX} mouseY={mouseY} />
          </div>
        </div>
      </div>

      <div className="scroll-indicator">
        <span>Scroll to explore</span>
        <div className="scroll-arrow" />
      </div>
    </section>
    );
  };
  
  export default Hero;
