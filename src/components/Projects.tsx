import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollReveal from './ScrollReveal';
import ElectricBorder from './ElectricBorder';
import SplitHeading from './SplitHeading';
import aiLogoAgent from '../assets/dark_mode/logo_design_agent.jpeg';
import aiAdminAssistant from '../assets/light_mode/ai_admin_assistant.jpeg';
import truthAi from '../assets/light_mode/truth_ai.jpeg';
import emminenceRealtors from '../assets/dark_mode/emminence_realtors.jpeg';
import gigiHygiene from '../assets/light_mode/gigi_hygiene.jpeg';
import graniteAiAgents from '../assets/dark_mode/granite_ai_agents.jpeg';
import whatsappAiAssistant from '../assets/dark_mode/whatsapp_agent.jpeg';
import resumeAssistantAi from '../assets/light_mode/resume_ai_assistant.jpeg';
import pharmacyChalrose from '../assets/dark_mode/chalrose_pharmacy.jpeg';
import customerResearchApp from '../assets/dark_mode/customer_research_app.jpeg';
import applicationGenerator from '../assets/light_mode/job_application_generator.jpeg';
import tomatoDiseasePrediction from '../assets/dark_mode/tomato_leaf_disease.jpeg';
import microsoftMovieAnalysis from '../assets/light_mode/microsft_movie.jpeg';

const projects = [
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
    description: 'E-commerce platform for a pharmacy featuring a digital storefront, medication catalog, shopping cart, and a sleek, user-friendly responsive dashboard.',
    tech: ['TypeScript', 'Next.js', 'React', 'Tailwind CSS'],
    live: 'https://pharmacy-chalrose.vercel.app',
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
    description: 'Modern e-commerce storefront for personal care products with product catalog, shopping cart, and performance-optimized responsive UI built with React and Vite.',
    tech: ['React', 'TypeScript', 'Vite', 'Tailwind CSS'],
    live: 'https://gigi-hygiene.vercel.app',
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

type Project = (typeof projects)[number];
type ProjectLayout = 'grid' | 'showcase';

const tiltSpring = { stiffness: 180, damping: 18, mass: 0.6 };

gsap.registerPlugin(ScrollTrigger);

function ProjectCard({ project, index, layout = 'grid' }: { project: Project; index: number; layout?: ProjectLayout }) {
  const [isInteractive, setIsInteractive] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const softX = useSpring(rotateX, tiltSpring);
  const softY = useSpring(rotateY, tiltSpring);
  const glareX = useTransform(softY, [-7, 7], ['35%', '65%']);
  const glareY = useTransform(softX, [-7, 7], ['35%', '65%']);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const pointerQuery = window.matchMedia('(pointer: fine)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const syncInteractive = () => {
      setIsInteractive(pointerQuery.matches && !motionQuery.matches);
    };

    syncInteractive();
    pointerQuery.addEventListener('change', syncInteractive);
    motionQuery.addEventListener('change', syncInteractive);

    return () => {
      pointerQuery.removeEventListener('change', syncInteractive);
      motionQuery.removeEventListener('change', syncInteractive);
    };
  }, []);

  const handleMove = (event: React.MouseEvent<HTMLElement>) => {
    if (!isInteractive) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const relativeX = event.clientX - bounds.left;
    const relativeY = event.clientY - bounds.top;
    const rotateAroundY = ((relativeX / bounds.width) - 0.5) * 14;
    const rotateAroundX = (0.5 - (relativeY / bounds.height)) * 14;

    rotateX.set(rotateAroundX);
    rotateY.set(rotateAroundY);
    setCursor({ x: relativeX, y: relativeY });
  };

  const resetTilt = () => {
    rotateX.set(0);
    rotateY.set(0);
    setIsHovering(false);
  };

  const card = (
    <ElectricBorder className="eb-hover-only" color="#e85d04" speed={0.8} chaos={0.1} borderRadius={20}>
      <motion.article
        className={`project-card glass-card ${project.featured ? 'featured' : ''} ${layout === 'showcase' ? 'project-card-showcase' : ''}`}
        style={isInteractive ? { rotateX: softX, rotateY: softY, transformStyle: 'preserve-3d' } : undefined}
        onMouseMove={handleMove}
        onMouseEnter={() => setIsHovering(isInteractive)}
        onMouseLeave={resetTilt}
      >
        <motion.div
          className="project-image"
          initial={layout === 'grid' ? { clipPath: 'inset(0 0 100% 0 round 20px)', opacity: 0.35 } : false}
          whileInView={layout === 'grid' ? { clipPath: 'inset(0 0 0% 0 round 20px)', opacity: 1 } : undefined}
          viewport={layout === 'grid' ? { once: true, margin: '-10% 0px' } : undefined}
          transition={layout === 'grid' ? { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.08 } : undefined}
        >
          <motion.img src={project.image} alt={project.title} className="project-img" />
          <motion.div
            className="project-glare"
            style={isInteractive ? { '--glare-x': glareX, '--glare-y': glareY } as React.CSSProperties : undefined}
          />
          <div className="project-overlay">
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener noreferrer" className="project-link" aria-label="View Live" data-cursor-label="Live">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                  <polyline points="15 3 21 3 21 9"/>
                  <line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </a>
            )}
            <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-link" aria-label="View Code" data-cursor-label="Code">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </motion.div>

        {isInteractive && isHovering ? (
          <motion.div
            className="project-hover-pill"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1, x: cursor.x + 18, y: cursor.y - 18 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          >
            View Project
          </motion.div>
        ) : null}

        <div className="project-content">
          <span className="project-category">{project.category}</span>
          <h3 className="project-title">{project.title}</h3>
          <p className={`project-description ${layout === 'showcase' ? 'project-description-showcase' : ''}`}>{project.description}</p>
          <div className="project-tech">
            {project.tech.map((tech, techIndex) => (
              <span key={techIndex}>{tech}</span>
            ))}
          </div>
        </div>
      </motion.article>
    </ElectricBorder>
  );

  if (layout === 'showcase') {
    return <div className="project-showcase-panel">{card}</div>;
  }

  return (
    <ScrollReveal delay={index * 100} direction="up">
      {card}
    </ScrollReveal>
  );
}

const Projects = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [showPinnedShowcase, setShowPinnedShowcase] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    const pointerQuery = window.matchMedia('(pointer: fine)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const syncMode = () => {
      setShowPinnedShowcase(desktopQuery.matches && pointerQuery.matches && !motionQuery.matches);
    };

    syncMode();
    desktopQuery.addEventListener('change', syncMode);
    pointerQuery.addEventListener('change', syncMode);
    motionQuery.addEventListener('change', syncMode);

    return () => {
      desktopQuery.removeEventListener('change', syncMode);
      pointerQuery.removeEventListener('change', syncMode);
      motionQuery.removeEventListener('change', syncMode);
    };
  }, []);

  useEffect(() => {
    if (!showPinnedShowcase || !sectionRef.current || !showcaseRef.current || !trackRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      const showcase = showcaseRef.current;
      const track = trackRef.current;

      if (!showcase || !track) {
        return;
      }

      const tween = gsap.to(track, {
        x: () => {
          const overflow = Math.max(0, track.scrollWidth - showcase.clientWidth);
          return -overflow;
        },
        ease: 'none',
        scrollTrigger: {
          trigger: '.projects-showcase-wrapper',
          start: 'top 5.5rem',
          end: () => {
            const overflow = Math.max(0, track.scrollWidth - showcase.clientWidth);
            return `+=${overflow}`;
          },
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    }, sectionRef);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [showPinnedShowcase]);

  useEffect(() => {
    if (!showPinnedShowcase) return;

    // Refresh ScrollTrigger when images load to recalculate the track layout dimensions
    const track = trackRef.current;
    if (!track) return;

    const images = track.querySelectorAll('img');
    if (!images.length) return;

    let loadedCount = 0;
    const handleImageLoad = () => {
      loadedCount++;
      if (loadedCount === images.length) {
        ScrollTrigger.refresh();
      }
    };

    images.forEach((img) => {
      if (img.complete) {
        handleImageLoad();
      } else {
        img.addEventListener('load', handleImageLoad);
        img.addEventListener('error', handleImageLoad);
      }
    });

    return () => {
      images.forEach((img) => {
        img.removeEventListener('load', handleImageLoad);
        img.removeEventListener('error', handleImageLoad);
      });
    };
  }, [showPinnedShowcase]);

  return (
    <section ref={sectionRef} className="projects section" id="projects">
      <div className="container">
        <ScrollReveal>
          <div className="section-header">
            <span className="section-tag">Portfolio</span>
            <SplitHeading className="section-title" text="Recent Projects" />
          </div>
        </ScrollReveal>

        {showPinnedShowcase ? (
          <div className="projects-showcase-wrapper">
            <div className="projects-showcase-intro glass-card">
              <span className="projects-showcase-kicker">Curated Work</span>
              <p className="projects-showcase-copy">
                Scroll through selected builds spanning AI agents, computer vision, automation, analytics, and modern web delivery.
              </p>
              <span className="projects-showcase-hint">Scroll sideways through the work</span>
            </div>
            <div ref={showcaseRef} className="projects-showcase">
              <div ref={trackRef} className="projects-showcase-track">
                {projects.map((project, index) => <ProjectCard key={`${project.title}-showcase`} project={project} index={index} layout="showcase" />)}
              </div>
            </div>
          </div>
        ) : null}

        <div className={`projects-grid ${showPinnedShowcase ? 'projects-grid-fallback' : ''}`}>
          {projects.map((project, index) => <ProjectCard key={project.title} project={project} index={index} />)}
        </div>
      </div>
    </section>
  );
};

export default Projects;
