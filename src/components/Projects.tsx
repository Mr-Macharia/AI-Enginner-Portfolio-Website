import ScrollReveal from './ScrollReveal';
import ElectricBorder from './ElectricBorder';
import aiLogoAgent from '../assets/ai_logo_agent.png';
import aiAdminAssistant from '../assets/ai_admin_assistant.png';
import truthAi from '../assets/truth_ai.png';
import emminenceRealtors from '../assets/emminence_realtors.png';
import gigiHygiene from '../assets/gigi_hygiene.png';
import graniteAiAgents from '../assets/granite_ai_agents.png';

const projects = [
  {
    image: aiLogoAgent,
    category: 'Multi-Agent AI System',
    title: 'AI Logo Design Agent',
    description: 'Intelligent multi-agent system that automates the end-to-end logo design process from brand research to final design delivery. Reduces manual workflow by up to 70%.',
    tech: ['Python', 'CrewAI', 'LLM Integration'],
    featured: true,
    github: 'https://github.com/Mr-Macharia/AI-Logo-Design-Agent',
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
    image: truthAi,
    category: 'Research & Fact-Checking',
    title: 'Truth AI',
    description: 'Advanced research agent that verifies facts and debunks myths using multiple AI sources with credibility scoring and comprehensive citation tracking.',
    tech: ['Python', 'CrewAI', 'Google Gemini', 'Perplexity AI'],
    github: 'https://github.com/Mr-Macharia/--Truth-AI',
  },
  {
    image: emminenceRealtors,
    category: 'Full-Stack Web App',
    title: 'Emminence Realtors',
    description: 'Professional real estate agency website with dynamic property listings, lead capture, and mobile-first responsive design. SEO optimized.',
    tech: ['TypeScript', 'Next.js', 'Responsive Design'],
    live: 'https://emminence-realtors.vercel.app',
    github: 'https://github.com/Mr-Macharia/emminence_realtors',
  },
  {
    image: gigiHygiene,
    category: 'E-Commerce Platform',
    title: 'Gigi Hygiene',
    description: 'Modern e-commerce platform for personal care products with product catalog, shopping cart, and performance-optimized responsive UI.',
    tech: ['TypeScript', 'Next.js', 'E-Commerce'],
    live: 'https://gigi-hygiene.vercel.app',
    github: 'https://github.com/Mr-Macharia/gigi_hygiene',
  },
  {
    image: graniteAiAgents,
    category: 'Local AI Development',
    title: 'Granite AI Agents',
    description: 'Best practices for integrating lightweight local language models with LangChain agents. Ideal for edge computing and privacy-focused applications.',
    tech: ['Python', 'LangChain', 'Ollama', 'Granite 1B'],
    github: 'https://github.com/Mr-Macharia/simple-granite-ai-agents',
  },
];

const Projects = () => {
  return (
    <section className="projects section" id="projects">
      <div className="container">
        <ScrollReveal>
          <div className="section-header">
            <span className="section-tag">Portfolio</span>
            <h2 className="section-title">Recent Projects</h2>
          </div>
        </ScrollReveal>
        <div className="projects-grid">
          {projects.map((project, index) => (
            <ScrollReveal key={index} delay={index * 100} direction={index % 2 === 0 ? 'left' : 'right'}>
              <ElectricBorder className="eb-hover-only" color="#e85d04" speed={0.8} chaos={0.1} borderRadius={20}>
              <article className={`project-card glass-card ${project.featured ? 'featured' : ''}` }>
                <div className="project-image">
                  <img src={project.image} alt={project.title} className="project-img" />
                  <div className="project-overlay">
                    {project.live && (
                      <a href={project.live} target="_blank" rel="noopener noreferrer" className="project-link" aria-label="View Live">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                          <polyline points="15 3 21 3 21 9"/>
                          <line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                      </a>
                    )}
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-link" aria-label="View Code">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                  </div>
                </div>
                <div className="project-content">
                  <span className="project-category">{project.category}</span>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  <div className="project-tech">
                    {project.tech.map((tech, techIndex) => (
                      <span key={techIndex}>{tech}</span>
                    ))}
                  </div>
                </div>
              </article>
              </ElectricBorder>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
