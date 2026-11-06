import { useEffect, useState, useRef, type MouseEvent as RMouseEvent, type ReactNode } from 'react';
import NetworkCanvas from './nx/NetworkCanvas';
import { ArrowRight, Mail } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import NairobiClock from './nx/NairobiClock';
import Marquee from './Marquee';
import { scrollToTarget } from '../lib/smoothScroll';

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

function Typewriter({ phrases, enabled }: { phrases: string[]; enabled: boolean }) {
  const typedText = useTypewriter(phrases, enabled);
  return <>{typedText}</>;
}

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* ── Magnetic wrapper (fine pointers only) ───────────────────────── */
function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const to = useRef<{ x: gsap.QuickToFunc; y: gsap.QuickToFunc } | null>(null);
  useGSAP(() => {
    to.current = {
      x: gsap.quickTo(ref.current, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' }),
      y: gsap.quickTo(ref.current, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' }),
    };
  });
  const move = (e: RMouseEvent) => {
    if (!ref.current || !window.matchMedia('(pointer: fine)').matches) return;
    const r = ref.current.getBoundingClientRect();
    to.current?.x((e.clientX - (r.left + r.width / 2)) * strength);
    to.current?.y((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const leave = () => { to.current?.x(0); to.current?.y(0); };
  return <span ref={ref} className="hx-mag" onMouseMove={move} onMouseLeave={leave}>{children}</span>;
}

/* ── The IDE (kept code, now a real editor with a run panel) ─────── */
type Tok = [cls: string, text: string];
const CODE: Tok[][] = [
  [['kw', 'from'], ['', ' '], ['mod', 'crewai'], ['', ' '], ['kw', 'import'], ['', ' Agent, Crew']],
  [['kw', 'from'], ['', ' '], ['mod', 'langchain'], ['', ' '], ['kw', 'import'], ['', ' LLM']],
  [],
  [['kw', 'class'], ['', ' '], ['cls', 'AIAssistant'], ['', ':']],
  [['', '    '], ['kw', 'def'], ['', ' '], ['fn', '__init__'], ['', '('], ['prm', 'self'], ['', '):']],
  [['', '        '], ['prm', 'self'], ['', '.agent = Agent(']],
  [['', '            role='], ['str', '"AI Engineer"'], ['', ',']],
  [['', '            goal='], ['str', '"Build intelligent systems"'], ['', ',']],
  [['', '            backstory='], ['str', '"Expert in AI agents"']],
  [['', '        )']],
  [],
  [['', '    '], ['kw', 'def'], ['', ' '], ['fn', 'execute'], ['', '('], ['prm', 'self'], ['', ', task):']],
  [['', '        '], ['kw', 'return'], ['', ' '], ['prm', 'self'], ['', '.agent.run(task)']],
];
const YAML: Tok[][] = [
  [['cls', 'crew'], ['', ':']],
  [['', '  '], ['prm', 'name'], ['', ': '], ['str', 'gichogu-macharia']],
  [['', '  '], ['prm', 'base'], ['', ': '], ['str', 'Nairobi, Kenya']],
  [['', '  '], ['prm', 'agents'], ['', ':']],
  [['', '    - '], ['prm', 'role'], ['', ': '], ['str', 'AI Engineer']],
  [['', '      '], ['prm', 'tools'], ['', ': ['], ['mod', 'CrewAI'], ['', ', '], ['mod', 'LangChain'], ['', ', '], ['mod', 'Agno'], ['', ']']],
  [['', '    - '], ['prm', 'role'], ['', ': '], ['str', 'ML Engineer']],
  [['', '      '], ['prm', 'tools'], ['', ': ['], ['mod', 'TensorFlow'], ['', ', '], ['mod', 'PyTorch'], ['', ', '], ['mod', 'MLOps'], ['', ']']],
  [['', '    - '], ['prm', 'role'], ['', ': '], ['str', 'Data Scientist']],
  [['', '      '], ['prm', 'tools'], ['', ': ['], ['mod', 'Pandas'], ['', ', '], ['mod', 'Power BI'], ['', ', '], ['mod', 'RAG'], ['', ']']],
  [['', '  '], ['prm', 'process'], ['', ': '], ['kw', 'sequential']],
  [['', '  '], ['prm', 'status'], ['', ': '], ['fn', 'available_for_projects']],
];
const README: Tok[][] = [
  [['h1', '# Gichogu Macharia']],
  [],
  [['quote', '> AI Engineer · ML Engineer · Data Scientist']],
  [],
  [['', 'I design multi-agent systems, ML pipelines and']],
  [['', 'production web apps that pay for themselves.']],
  [],
  [['h2', '## Currently']],
  [['', '- Lead Developer / AI Engineer @ '], ['fn', 'Visiondrill']],
  [['', '- Independent consultant @ '], ['fn', 'Gich AI Nexus']],
  [],
  [['h2', '## Say hi'], ['', '  →  run '], ['str', '`contact`']],
];
const FILES = [
  { name: 'ai_agent.py', lines: CODE, lang: 'Python 3.12' },
  { name: 'crew.yaml', lines: YAML, lang: 'YAML' },
  { name: 'README.md', lines: README, lang: 'Markdown' },
];

type Out = { cls?: string; text: string };
const BOOT: Out[] = [
  { cls: 'hx-cmd', text: '$ python ai_agent.py' },
  { text: '› Agent initialised · role: AI Engineer' },
  { text: '› Goal: Build intelligent systems' },
  { cls: 'hx-okline', text: '✔ ready in 0.42s · try a command below' },
];
const COMMANDS = ['whoami', 'skills', 'projects', 'contact', 'run'];

function respond(cmd: string): { lines: Out[]; jump?: string; clear?: boolean } {
  switch (cmd) {
    case 'help': return { lines: [{ text: `commands: ${[...COMMANDS, 'clear'].join(' · ')}` }] };
    case 'whoami': return { lines: [{ text: 'Gichogu Macharia: AI/ML Engineer & Data Scientist, Nairobi 🇰🇪' }, { text: '2+ years shipping agents, ML pipelines and web apps.' }] };
    case 'skills': return { lines: [{ text: 'agents   → CrewAI · LangChain · Agno · RAG' }, { text: 'ml       → TensorFlow · PyTorch · scikit-learn · MLOps' }, { text: 'data/web → Pandas · Power BI · React · FastAPI' }] };
    case 'projects': return { lines: [{ cls: 'hx-okline', text: '✔ 15 projects found · opening the work index…' }], jump: '#projects' };
    case 'contact': return { lines: [{ cls: 'hx-okline', text: '✔ opening contact · replies come from me personally' }], jump: '#contact' };
    case 'run': case 'python ai_agent.py': return { lines: BOOT };
    case 'clear': return { lines: [], clear: true };
    default: return { lines: [{ cls: 'hx-errline', text: `command not found: ${cmd} · try 'help'` }] };
  }
}

function IDE() {
  const [file, setFile] = useState(0);
  const [out, setOut] = useState<Out[]>(BOOT);
  const [draft, setDraft] = useState('');
  const screen = useRef<HTMLDivElement>(null);

  useEffect(() => { screen.current?.scrollTo({ top: screen.current.scrollHeight }); }, [out]);

  const exec = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    const r = respond(cmd);
    setOut((o) => (r.clear ? [] : [...o, { cls: 'hx-cmd', text: `$ ${cmd}` }, ...r.lines]));
    if (r.jump) setTimeout(() => scrollToTarget(r.jump!, { offset: -24 }), 650);
  };

  const f = FILES[file];
  return (
    <div className="hx-ide">
      <div className="hx-ide-bar">
        <span className="hx-dots" aria-hidden="true"><i /><i /><i /></span>
        <div className="hx-tabs" role="tablist" aria-label="Files">
          {FILES.map((x, i) => (
            <button key={x.name} type="button" role="tab" aria-selected={i === file} className={`hx-tab${i === file ? ' is-active' : ''}`} onClick={() => setFile(i)}>
              {x.name}
            </button>
          ))}
        </div>
        <button type="button" className="hx-runbtn" onClick={() => exec('run')} aria-label="Run ai_agent.py">▶ Run</button>
      </div>
      <pre className="hx-code" role="tabpanel" aria-label={f.name}><code key={f.name}>
        {f.lines.map((line, i) => (
          <span key={i} className="hx-line">
            {line.length ? line.map(([c, t], k) => <span key={k} className={c ? `t-${c}` : undefined}>{t}</span>) : ' '}
          </span>
        ))}
      </code></pre>
      <div className="hx-run">
        <div ref={screen} className="hx-run-screen" aria-live="polite" data-lenis-prevent>
          {out.map((r, i) => <p key={i} className={`hx-run-line ${r.cls ?? ''}`}>{r.text}</p>)}
        </div>
        <form className="hx-prompt-row" onSubmit={(e) => { e.preventDefault(); exec(draft); setDraft(''); }}>
          <label htmlFor="hx-term" className="hx-ps">$</label>
          <input id="hx-term" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="type a command…" autoComplete="off" spellCheck={false} aria-label="Terminal command" />
        </form>
        <div className="hx-cmds" role="group" aria-label="Quick commands">
          {COMMANDS.map((c) => <button key={c} type="button" className="hx-cmdbtn" onClick={() => exec(c)}>{c}</button>)}
        </div>
      </div>
    </div>
  );
}

const SOCIALS = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/gichogu-macharia' },
  { label: 'GitHub', href: 'https://github.com/Mr-Macharia' },
  { label: 'Email', href: 'mailto:gichogumacharia001@gmail.com' },
];

const Hero = ({ isReady }: { isReady: boolean }) => {
  const root = useRef<HTMLElement>(null);
  const [typing, setTyping] = useState(false);
  const [heroVisible, setHeroVisible] = useState(true);

  // The typewriter re-renders every few milliseconds, so stop it once it's off-screen.
  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting));
    if (root.current) io.observe(root.current);
    return () => io.disconnect();
  }, []);

  useGSAP(() => {
    if (!isReady) return;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, onComplete: () => setTyping(true) });
      tl.from('.hx-topline > *', { y: 16, opacity: 0, duration: 0.8, stagger: 0.06 })
        .from('.hx-char', { yPercent: 115, duration: 1.2, stagger: 0.028 }, 0.1)
        .from('.hx-greet', { y: 20, opacity: 0, duration: 0.8 }, 0.2)
        .from('.hx-ide', { y: 80, opacity: 0, rotateX: 8, duration: 1.3 }, 0.45)
        .from('.hx-line', { clipPath: 'inset(0 100% 0 0)', duration: 0.35, ease: 'steps(18)', stagger: 0.09 }, 0.9)
        .from('.hx-run-line', { opacity: 0, x: -8, duration: 0.4, stagger: 0.18 }, '>-0.1')
        .from('.hx-copy > *', { y: 24, opacity: 0, duration: 0.9, stagger: 0.07 }, 0.55)
        .from('.hx-ticker', { opacity: 0, duration: 1 }, 1);

    });
    // Scroll: the name lines drift apart; the editor floats up.
    mm.add('(min-width: 769px) and (prefers-reduced-motion: no-preference)', () => {
      const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true };
      gsap.to('.hx-name-1', { xPercent: -3, ease: 'none', scrollTrigger: st });
      gsap.to('.hx-name-2', { xPercent: 3, ease: 'none', scrollTrigger: st });
      gsap.to('.hx-ide-wrap', { yPercent: -12, ease: 'none', scrollTrigger: st });
    });
    mm.add('(prefers-reduced-motion: reduce)', () => setTyping(true));
    return () => mm.revert();
  }, { scope: root, dependencies: [isReady] });

  const jump = (e: RMouseEvent<HTMLAnchorElement>, target: string) => {
    e.preventDefault();
    scrollToTarget(target, { offset: -24 });
  };

  const chars = (word: string) => word.split('').map((c, i) => <span key={i} className="hx-char-mask"><span className="hx-char">{c}</span></span>);

  return (
    <section ref={root} className="hero hx" id="home">
      <NetworkCanvas className="hero-network" />
      <div className="container hx-inner">
        <div className="hx-topline">
          <span className="hx-avail"><span className="ab-pulse" aria-hidden="true" />Available for Freelance &amp; Consulting</span>
          <span className="hx-meta">AI · ML · Data — Nairobi <NairobiClock /></span>
        </div>


        <div className="hx-grid">
          <div className="hx-main">
          <h1 className="hx-name" aria-label="Gichogu Macharia">
            <span className="hx-greet" aria-hidden="true">Hello, I'm</span>
            <span className="hx-name-1" aria-hidden="true">{chars('Gichogu')}</span>
            <span className="hx-name-2" aria-hidden="true">{chars('Macharia')}</span>
          </h1>
            <div className="hx-copy">
              <p className="hx-build">
                I build <span className="hx-typed"><Typewriter phrases={PHRASES} enabled={typing && heroVisible} /></span><span className="hx-cursor" aria-hidden="true" />
              </p>
              <p className="hx-desc">
                AI Engineer, ML Engineer &amp; Data Scientist based in Nairobi, Kenya. I specialise in
                building robust AI/ML solutions, scalable data pipelines, and production-ready systems
                that drive measurable digital transformation.
              </p>
              <div className="hx-cta">
                <Magnetic>
                  <a href="#projects" className="btn btn-primary hx-btn" onClick={(e) => jump(e, '#projects')}>
                    View My Work <ArrowRight size={18} aria-hidden="true" />
                  </a>
                </Magnetic>
                <Magnetic strength={0.25}>
                  <a href="#contact" className="btn btn-secondary hx-btn" onClick={(e) => jump(e, '#contact')}>Let's Talk</a>
                </Magnetic>
              </div>
              <ul className="hx-socials">
                {SOCIALS.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target={s.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                      {s.label === 'Email' ? <Mail size={15} aria-hidden="true" /> : null}{s.label}<span aria-hidden="true">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="hx-ide-wrap">
            <IDE />
          </div>
        </div>
      </div>

      <div className="hx-ticker">
        <span className="hx-ticker-label">§00 — Index</span>
        <Marquee items={HERO_MARQUEE_ITEMS} className="hero-marquee" />
        <span className="hx-scroll">Scroll <i aria-hidden="true" /></span>
      </div>
    </section>
  );
};

export default Hero;
