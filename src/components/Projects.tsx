import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowUpRight, Github } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import SplitHeading from './SplitHeading';
import aiLogoAgent from '../assets/dark_mode/logo_design_agent.webp';
import aiAdminAssistant from '../assets/light_mode/ai_admin_assistant.webp';
import truthAi from '../assets/light_mode/truth_ai.webp';
import emminenceRealtors from '../assets/dark_mode/emminence_realtors.webp';
import gigiHygiene from '../assets/light_mode/gigi_hygiene.webp';
import graniteAiAgents from '../assets/dark_mode/granite_ai_agents.webp';
import whatsappAiAssistant from '../assets/dark_mode/whatsapp_agent.webp';
import resumeAssistantAi from '../assets/light_mode/resume_ai_assistant.webp';
import pharmacyChalrose from '../assets/dark_mode/chalrose_pharmacy.webp';
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

// 6-column bento. Rows alternate halves (2 tiles) and thirds (3 tiles); the tail is
// resolved so the final row is always full — no orphan tile.
function buildSpans(n: number): ('half' | 'third')[] {
  const out: ('half' | 'third')[] = [];
  let left = n;
  let useHalves = true;
  while (left > 0) {
    if (left === 1) { out.push('half'); break; }
    if (left === 4) { out.push('half', 'half', 'half', 'half'); break; }
    const size = left === 2 ? 2 : left === 3 ? 3 : useHalves ? 2 : 3;
    for (let i = 0; i < size; i++) out.push(size === 2 ? 'half' : 'third');
    left -= size;
    useHalves = !useHalves;
  }
  return out;
}

const SPANS = buildSpans(projects.length);

function ProjectTile({ project, index }: { project: Project; index: number }) {
  const span = SPANS[index] ?? 'third';
  const primary = project.live ?? project.github;
  return (
    <article className={`bento-tile glass-card bento-${span}${project.brand ? ` bento-brand brand-${project.brand}` : ''}`} data-cursor-label="View">
      <div className="bento-top">
        <span className="bento-tag">{project.brand ? <><i className="bento-live" />Client · live</> : <>{String(index + 1).padStart(2, '0')} · {project.category}</>}</span>
        <a href={primary} target="_blank" rel="noopener noreferrer" className="bento-arrow" aria-label={`Open ${project.title}`}>
          <ArrowUpRight size={20} aria-hidden="true" />
        </a>
      </div>
      <h3 className="bento-title">{project.title}</h3>
      <p className="bento-desc">{project.description}</p>
      <div className="bento-media">
        <img src={project.image} alt={`${project.title} screenshot`} loading="lazy" decoding="async" width="600" height="360" />
      </div>
      <div className="bento-foot">
        <div className="bento-tech">{project.tech.slice(0, span === 'third' ? 2 : 4).map((t) => <span key={t}>{t}</span>)}</div>
        <div className="bento-links">
          {project.live && <a href={project.live} target="_blank" rel="noopener noreferrer">Live <ArrowUpRight size={14} aria-hidden="true" /></a>}
          {project.github && <a href={project.github} target="_blank" rel="noopener noreferrer"><Github size={14} aria-hidden="true" /> Code</a>}
        </div>
      </div>
    </article>
  );
}

const Projects = () => {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.utils.toArray<HTMLElement>('.bento-tile').forEach((tile) => {
        gsap.from(tile, {
          y: 48, opacity: 0, duration: 0.9, ease: 'expo.out',
          scrollTrigger: { trigger: tile, start: 'top 88%', once: true },
        });
        const img = tile.querySelector('.bento-media img');
        if (img) {
          gsap.fromTo(img, { yPercent: -6, scale: 1.12 }, {
            yPercent: 6, ease: 'none',
            scrollTrigger: { trigger: tile, start: 'top bottom', end: 'bottom top', scrub: true },
          });
        }
      });
    });
    return () => mm.revert();
  }, { scope: root });

  return (
    <section ref={root} className="projects section nx-alt" id="projects">
      <div className="container">
        <ScrollReveal>
          <div className="nx-head">
            <div>
              <SplitHeading className="section-title" text="Selected work" />
            </div>
            <a href="https://github.com/Mr-Macharia" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
              All repositories <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
        </ScrollReveal>
        <div className="bento-grid">
          {ordered.map((p, i) => <ProjectTile key={p.title} project={p} index={i} />)}
        </div>
      </div>
    </section>
  );
};

export default Projects;
