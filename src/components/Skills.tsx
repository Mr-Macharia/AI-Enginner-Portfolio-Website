import ScrollReveal from './ScrollReveal';
import ElectricBorder from './ElectricBorder';

const skillCategories = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    title: 'AI & Machine Learning',
    tags: ['CrewAI', 'LangChain', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'RAG Systems', 'Multi-Agent Systems', 'MLOps'],
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
    title: 'LLM Integration',
    tags: ['OpenAI GPT-4', 'Google Gemini', 'Ollama', 'Local Models', 'Vector Databases', 'Vertex AI', 'SageMaker'],
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
    title: 'Programming',
    tags: ['Python', 'TypeScript', 'JavaScript', 'SQL', 'R', 'Bash', 'Git'],
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
        <line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
    title: 'Web Development',
    tags: ['React', 'Next.js', 'FastAPI', 'Flask', 'REST APIs', 'Microservices'],
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <ellipse cx="12" cy="5" rx="9" ry="3"/>
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
      </svg>
    ),
    title: 'Data Science & Analytics',
    tags: ['Pandas', 'NumPy', 'Tableau', 'Power BI', 'ETL Pipelines', 'A/B Testing', 'Statistical Analysis'],
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
    title: 'DevOps & Cloud',
    tags: ['Docker', 'AWS', 'GCP', 'Azure', 'Kubernetes', 'CI/CD', 'MLFlow'],
  },
];

const Skills = () => {
  return (
    <section className="skills section" id="skills">
      <div className="container">
        <ScrollReveal>
          <div className="section-header">
            <span className="section-tag">Expertise</span>
            <h2 className="section-title">Skills & Technologies</h2>
          </div>
        </ScrollReveal>
        <div className="skills-grid">
          {skillCategories.map((category, index) => (
            <ScrollReveal key={index} delay={index * 100}>
              <ElectricBorder className="eb-hover-only" color="#e85d04" speed={0.8} chaos={0.1} borderRadius={20}>
              <div className="skill-category glass-card">
                <div className="category-icon">{category.icon}</div>
                <h3>{category.title}</h3>
                <div className="skill-tags">
                  {category.tags.map((tag, tagIndex) => (
                    <span className="tag" key={tagIndex}>{tag}</span>
                  ))}
                </div>
              </div>
              </ElectricBorder>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
