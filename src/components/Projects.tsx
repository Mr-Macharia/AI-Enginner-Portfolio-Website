import { useEffect, useRef, useState, type MouseEvent as RMouseEvent } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Github, X } from 'lucide-react';
import { getLenis } from '../lib/smoothScroll';
import aiLogoAgent from '../assets/dark_mode/logo_design_agent.webp';
import aiAdminAssistant from '../assets/light_mode/ai_admin_assistant.webp';
import truthAi from '../assets/light_mode/truth_ai.webp';
import emminenceRealtors from '../assets/dark_mode/emminence_realtors.webp';
import gigiHygiene from '../assets/live_gigi.webp';
import graniteAiAgents from '../assets/dark_mode/granite_ai_agents.webp';
import whatsappAiAssistant from '../assets/dark_mode/whatsapp_agent.webp';
import resumeAssistantAi from '../assets/light_mode/resume_ai_assistant.webp';
import pharmacyChalrose from '../assets/live_chalrose.webp';
import customerResearchApp from '../assets/dark_mode/customer_research_app.webp';
import applicationGenerator from '../assets/light_mode/job_application_generator.webp';
import tomatoDiseasePrediction from '../assets/dark_mode/tomato_leaf_disease.webp';
import agentKit from '../assets/dark_mode/agent_kit.webp';
import voiceAgent from '../assets/dark_mode/voice_agent.webp';
import microsoftMovieAnalysis from '../assets/light_mode/microsft_movie.webp';

type ProjectEntry = {
  image: string; category: string; title: string; description: string;
  tech: string[]; live?: string; github?: string; featured?: boolean;
  brand?: 'gigi' | 'chalrose';
};

const projects: ProjectEntry[] = [
  {
    image: agentKit,
    category: 'Agent Skills & MCP',
    title: 'M-Pesa Daraja Agent Kit',
    description: "Agent Skills and an MCP server for Safaricom's Daraja API, with docs, guides and tutorials so coding agents and developers can build M-Pesa integrations correctly.",
    tech: ['MCP', 'Agent Skills', 'TypeScript', 'Daraja API'],
    live: 'https://agent-kit.gichogumacharia.tech/',
    github: 'https://github.com/Mr-Macharia/mpesa-daraja-skills-and-mcp',
  },
  {
    image: voiceAgent,
    category: 'Voice & RAG Agent',
    title: 'Clyde: Voice Portfolio Agent',
    description: 'A portfolio you can talk to. Clyde answers questions about my work, projects and experience and books meetings, by text or live voice.',
    tech: ['Voice AI', 'RAG', 'Search', 'Booking'],
    live: 'https://voice-agent.gichogumacharia.tech/',
  },
  {
    image: whatsappAiAssistant,
    category: 'AI Chatbot & Automation',
    title: 'WhatsApp AI Assistant',
    description: 'Production-ready AI assistant integrated with WhatsApp for automating customer interactions, scheduling tasks, and business workflows using Agno (AgentOS) and FastAPI.',
    tech: ['Python', 'Agno', 'FastAPI', 'WhatsApp API'],
    featured: true,
    github: 'https://github.com/Mr-Macharia/whatsapp-ai-assistant',
  },
  {
    image: resumeAssistantAi,
    category: 'Intelligent Agent System',
    title: 'Resume Assistant AI',
    description: 'Multi-agent hiring assistant built using Agno (AgentOS) to screen, analyze, and optimize professional CVs, matching them against job descriptions.',
    tech: ['Python', 'Agno (AgentOS)', 'FastAPI', 'Vector Search'],
    github: 'https://github.com/Mr-Macharia/resume_assistant_ai',
  },
  {
    image: aiLogoAgent,
    category: 'Multi-Agent Design System',
    title: 'AI Logo Design Agent',
    description: 'Intelligent multi-agent system that automates the end-to-end logo design process from brand research to final design delivery. Reduces manual workflow by up to 70%.',
    tech: ['Python', 'CrewAI', 'LLM Integration'],
    github: 'https://github.com/Mr-Macharia/AI-Logo-Design-Agent',
  },
  {
    image: applicationGenerator,
    category: 'Multi-Agent Pipeline',
    title: 'AI Job Application Generator',
    description: 'Autonomous multi-agent system utilizing CrewAI and LiteLLM to compile tailored, ATS-optimized CVs and context-aware cover letters matching targeted job descriptions.',
    tech: ['Python', 'CrewAI', 'LiteLLM', 'PDF Processing'],
    github: 'https://github.com/Mr-Macharia/application_generator',
  },
  {
    image: pharmacyChalrose,
    category: 'Full-Stack E-Commerce',
    title: 'Chalrose Pharmacy',
    brand: 'chalrose',
    description: 'E-commerce platform for a pharmacy featuring a digital storefront, medication catalog, shopping cart, and a sleek, user-friendly responsive dashboard.',
    tech: ['TypeScript', 'Next.js', 'React', 'Tailwind CSS'],
    live: 'https://www.chalrose-pharmaceuticals.co.ke/',
    github: 'https://github.com/Mr-Macharia/pharmacy',
  },
  {
    image: aiAdminAssistant,
    category: 'Customer Service AI',
    title: 'AI Admin Assistant',
    description: 'E-commerce customer service automation system with multi-turn conversation handling, automated response generation, and business intelligence integration.',
    tech: ['CrewAI', 'LangChain', 'Gemini 2.5 Flash', 'GPT-4o'],
    github: 'https://github.com/Mr-Macharia/AI-Admin-Assistant',
  },
  {
    image: emminenceRealtors,
    category: 'Frontend Web App',
    title: 'Emminence Realtors',
    description: 'Professional real estate agency website with dynamic property listings, lead capture, and mobile-first responsive design. Built using React and Vite.',
    tech: ['React', 'TypeScript', 'Vite', 'Tailwind CSS'],
    live: 'https://emminence-realtors.vercel.app',
    github: 'https://github.com/Mr-Macharia/emminence_realtors',
  },
  {
    image: truthAi,
    category: 'Research & Fact-Checking',
    title: 'Truth AI',
    description: 'Advanced research agent that verifies facts and debunks myths using multiple AI sources with credibility scoring and comprehensive citation tracking.',
    tech: ['Python', 'CrewAI', 'Google Gemini', 'Streamlit'],
    github: 'https://github.com/Mr-Macharia/--Truth-AI',
  },
  {
    image: graniteAiAgents,
    category: 'Local AI Development',
    title: 'Granite AI Agents',
    description: 'Best practices for integrating lightweight local language models with LangChain agents. Ideal for edge computing and privacy-focused applications.',
    tech: ['Python', 'LangChain', 'Ollama', 'Granite 1B'],
    github: 'https://github.com/Mr-Macharia/simple-granite-ai-agents',
  },
  {
    image: gigiHygiene,
    category: 'Frontend E-Commerce',
    title: 'Gigi Hygiene',
    brand: 'gigi',
    description: 'Modern e-commerce storefront for personal care products with product catalog, shopping cart, and performance-optimized responsive UI built with React and Vite.',
    tech: ['React', 'TypeScript', 'Vite', 'Tailwind CSS'],
    live: 'https://gigihygiene.co.ke',
    github: 'https://github.com/Mr-Macharia/gigi_hygiene',
  },
  {
    image: tomatoDiseasePrediction,
    category: 'Deep Learning & CV',
    title: 'Tomato Leaf Disease Prediction',
    description: 'Convolutional Neural Network (CNN) trained on 60,000+ images using TensorFlow/Keras to classify 10 classes of tomato leaf diseases with 97.9% validation accuracy.',
    tech: ['TensorFlow', 'Keras', 'CNN', 'Computer Vision'],
    github: 'https://github.com/Mr-Macharia/Tomato-Disease-Prediction',
  },
  {
    image: microsoftMovieAnalysis,
    category: 'Data Analytics & BI',
    title: 'Microsoft Movie Data Analysis',
    description: 'Exploratory data analysis of IMDb datasets and financial performance data to provide strategic insights for Microsoft\'s potential entry into the movie production industry.',
    tech: ['Python', 'Pandas', 'Matplotlib', 'Data Analytics'],
    github: 'https://github.com/Mr-Macharia/Microsoft_project',
  },
  {
    image: customerResearchApp,
    category: 'Marketing & Analytics AI',
    title: 'AI Customer Research App',
    description: 'Advanced market research system built with Agno to perform deep customer sentiment analysis, profiling, and automated demographics analysis.',
    tech: ['Python', 'Agno', 'Data Analytics', 'Pydantic'],
    github: 'https://github.com/Mr-Macharia/Customer-Research-App',
  },
];

type Project = ProjectEntry;


// Keep the two lead tiles, then put the live client work (brand-coloured) first in the next row.
const ordered: Project[] = [
  ...projects.slice(0, 2),
  ...projects.slice(2).filter((p) => p.brand),
  ...projects.slice(2).filter((p) => !p.brand),
];

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Group = 'agents' | 'web' | 'data';
const FILTERS: { id: 'all' | Group; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'agents', label: 'Agents & Automation' },
  { id: 'web', label: 'Web & Product' },
  { id: 'data', label: 'Data & ML' },
];
const groupOf = (p: Project): Group =>
  /e-commerce|web app/i.test(p.category) ? 'web'
    : /deep learning|data analytics|analytics ai/i.test(p.category) ? 'data'
      : 'agents';
const GROUP_LABEL: Record<Group, string> = { agents: 'Agents & Automation', web: 'Web & Product', data: 'Data & ML' };
const pad = (n: number) => String(n).padStart(2, '0');

/* ------------------------------------------------------------------ */
/* Case study overlay (native <dialog>: focus trap + Esc for free)      */
/* ------------------------------------------------------------------ */
function CaseStudy({ list, index, onClose, onNavigate }: {
  list: Project[]; index: number | null; onClose: () => void; onNavigate: (i: number) => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const open = index !== null;
  const p = open ? list[index] : null;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      d.querySelector<HTMLButtonElement>('.cs-close')?.focus();
      getLenis()?.stop();
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.fromTo(panel.current, { clipPath: 'inset(100% 0% 0% 0% round 28px)' }, { clipPath: 'inset(0% 0% 0% 0% round 28px)', duration: 0.9, ease: 'expo.out' });
        gsap.fromTo('.cs-reveal', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out', stagger: 0.06, delay: 0.25 });
      }
    }
    if (!open && d.open) { d.close(); getLenis()?.start(); }
  }, [open]);

  // Re-run the content stagger when paging between projects.
  useEffect(() => {
    if (!open || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.fromTo('.cs-reveal', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'expo.out', stagger: 0.05 });
    gsap.fromTo('.cs-media img', { scale: 1.12 }, { scale: 1, duration: 1.2, ease: 'expo.out' });
  }, [index, open]);

  const go = (step: number) => onNavigate((index! + step + list.length) % list.length);

  return (
    <dialog
      ref={ref}
      className="cs"
      aria-labelledby="cs-title"
      onCancel={(e) => { e.preventDefault(); onClose(); }}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
      onKeyDown={(e) => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); }}
      data-lenis-prevent
    >
      {p && (
        <div ref={panel} className={`cs-panel${p.brand ? ` cs-brand brand-${p.brand}` : ''}`}>
          <header className="cs-bar">
            <span className="cs-crumb">case_study / {pad(index! + 1)} of {pad(list.length)}</span>
            <div className="cs-nav">
              <button type="button" className="cs-btn" onClick={() => go(-1)} aria-label="Previous project"><ArrowLeft size={18} /></button>
              <button type="button" className="cs-btn" onClick={() => go(1)} aria-label="Next project"><ArrowRight size={18} /></button>
              <button type="button" className="cs-btn cs-close" onClick={onClose} aria-label="Close case study"><X size={18} /></button>
            </div>
          </header>
          <div className="cs-body">
            <figure className="cs-media">
              <img src={p.image} alt={`${p.title} screenshot`} width="1200" height="720" decoding="async" />
            </figure>
            <div className="cs-copy">
              <p className="cs-kicker cs-reveal">{p.brand ? <><i className="bento-live" />Live client project</> : `${GROUP_LABEL[groupOf(p)]} · ${p.category}`}</p>
              <h3 id="cs-title" className="cs-title cs-reveal">{p.title}</h3>
              <p className="cs-desc cs-reveal">{p.description}</p>
              <dl className="cs-specs cs-reveal">
                <div><dt>Discipline</dt><dd>{p.category}</dd></div>
                <div><dt>Stack</dt><dd className="cs-stack">{p.tech.map((t) => <span key={t}>{t}</span>)}</dd></div>
              </dl>
              <div className="cs-actions cs-reveal">
                {p.live && <a className="btn btn-primary" href={p.live} target="_blank" rel="noopener noreferrer">Visit live site <ArrowUpRight size={18} aria-hidden="true" /></a>}
                {p.github && <a className={`btn ${p.live ? 'cs-ghost' : 'btn-primary'}`} href={p.github} target="_blank" rel="noopener noreferrer"><Github size={18} aria-hidden="true" /> View source</a>}
              </div>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}

/* ------------------------------------------------------------------ */
/* Work index                                                           */
/* ------------------------------------------------------------------ */
const Projects = () => {
  const root = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<'all' | Group>('all');
  const [hovered, setHovered] = useState<number | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const mover = useRef<{ x: gsap.QuickToFunc; y: gsap.QuickToFunc } | null>(null);

  const [showAll, setShowAll] = useState(false);
  const visible = ordered.filter((p) => filter === 'all' || groupOf(p) === filter);
  // Lead with the strongest work; the rest is one tap away.
  const PREVIEW = 8;
  const listed = showAll ? visible : visible.slice(0, PREVIEW);
  const count = (id: 'all' | Group) => (id === 'all' ? ordered.length : ordered.filter((p) => groupOf(p) === id).length);

  useGSAP(() => {
    mover.current = {
      x: gsap.quickTo(preview.current, 'x', { duration: 0.6, ease: 'power3' }),
      y: gsap.quickTo(preview.current, 'y', { duration: 0.6, ease: 'power3' }),
    };
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.wk-title-line', {
        yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.08,
        scrollTrigger: { trigger: '.wk-head', start: 'top 80%', once: true },
      });
      gsap.from('.wk-row', {
        y: 40, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.05,
        scrollTrigger: { trigger: '.wk-list', start: 'top 85%', once: true },
      });
      gsap.from('.wk-rule', {
        scaleX: 0, transformOrigin: 'left center', duration: 1.2, ease: 'expo.inOut', stagger: 0.05,
        scrollTrigger: { trigger: '.wk-list', start: 'top 85%', once: true },
      });
    });
    return () => mm.revert();
  }, { scope: root });

  // Re-stagger rows on filter change.
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.fromTo('.wk-row', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'expo.out', stagger: 0.04 });
    ScrollTrigger.refresh();
  }, [filter]);

  const onMove = (e: RMouseEvent) => {
    mover.current?.x(e.clientX);
    mover.current?.y(e.clientY);
  };

  const openCase = (i: number, btn: HTMLButtonElement) => { lastTrigger.current = btn; setHovered(null); setOpenIndex(i); };
  const closeCase = () => { setOpenIndex(null); requestAnimationFrame(() => lastTrigger.current?.focus({ preventScroll: true })); };

  return (
    <section ref={root} className="projects section wk" id="projects" data-bp="§03 — Work">
      <div className="container">
        <div className="wk-head">
          <div>
            <span className="section-tag">Selected work</span>
            <h2 className="wk-title" aria-label="Work that ships.">
              <span className="wk-title-mask"><span className="wk-title-line">Work that</span></span>
              <span className="wk-title-mask"><span className="wk-title-line"><em>ships.</em></span></span>
            </h2>
          </div>
          <div className="wk-head-side">
            <p>AI agents, data products and production web apps, from first prompt to paying client. Open any project for the case study.</p>
            <a href="https://github.com/Mr-Macharia" target="_blank" rel="noopener noreferrer" className="wk-link">
              All repositories <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="wk-bar">
          <div className="wk-filters" role="group" aria-label="Filter projects">
            {FILTERS.map((f) => (
              <button key={f.id} type="button" className={`wk-chip${filter === f.id ? ' is-active' : ''}`} aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
                {f.label}<sup>{pad(count(f.id))}</sup>
              </button>
            ))}
          </div>
          <p className="wk-status" aria-live="polite"><b>{pad(visible.length)}</b> / {pad(ordered.length)} projects</p>
        </div>

        <ol className="wk-list" onMouseMove={onMove} onMouseLeave={() => setHovered(null)}>
          {listed.map((p, i) => (
            <li key={p.title} className={`wk-row${p.brand ? ` wk-brand brand-${p.brand}` : ''}`}>
              <span className="wk-rule" aria-hidden="true" />
              <button
                type="button"
                className="wk-open"
                onMouseEnter={() => setHovered(i)}
                onFocus={() => setHovered(null)}
                onClick={(e) => openCase(i, e.currentTarget)}
                aria-haspopup="dialog"
              >
                <span className="wk-n">{pad(i + 1)}</span>
                <span className="wk-name">{p.title}</span>
                <span className="wk-meta">
                  {p.brand ? <span className="wk-live"><i className="bento-live" />Live client</span> : <span className="wk-cat">{p.category}</span>}
                  <span className="wk-tech">{p.tech.slice(0, 2).join(' · ')}</span>
                </span>
                <img className="wk-thumb" src={p.image} alt="" loading="lazy" decoding="async" width="160" height="100" />
                <span className="wk-go" aria-hidden="true"><ArrowUpRight size={22} /></span>
              </button>
            </li>
          ))}
          <li className="wk-row wk-end" aria-hidden="true"><span className="wk-rule" /></li>
        </ol>
        {visible.length > PREVIEW && (
          <button type="button" className="wk-more" aria-expanded={showAll} onClick={() => setShowAll((v) => !v)}>
            {showAll ? 'Show fewer' : `Show all ${visible.length} projects`}
          </button>
        )}
      </div>

      {/* Cursor-following preview (fine pointers only) */}
      <div ref={preview} className={`wk-preview${hovered !== null ? ' is-on' : ''}`} aria-hidden="true">
        <div className="wk-preview-inner">
          {visible.map((p, i) => (
            <img key={p.title} src={p.image} alt="" className={i === hovered ? 'is-active' : ''} loading="lazy" decoding="async" />
          ))}
        </div>
      </div>

      <CaseStudy list={visible} index={openIndex} onClose={closeCase} onNavigate={setOpenIndex} />
    </section>
  );
};

export default Projects;
