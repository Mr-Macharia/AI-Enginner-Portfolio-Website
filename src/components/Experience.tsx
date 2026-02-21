const experiences = [
  {
    date: 'May 2025 – Present',
    title: 'Lead Developer / AI Engineer',
    company: 'Visiondrill',
    location: 'Nairobi, Kenya',
    description: 'Lead the design, development, deployment, and optimization of AI/ML solutions for an AI-powered e-learning platform. Architected ML pipelines, MLOps, and integrated backend AI systems with web and mobile frontends.',
    tags: ['CrewAI', 'LangChain', 'MLOps', 'Power BI', 'Tableau', 'GCP'],
    achievements: [
      'Automated process flows, reducing bottlenecks and reporting lag by over 30%',
      'Deployed ETL pipelines and scalable cloud infrastructure',
      'Led technical teams in code reviews, prototyping, and knowledge transfer',
    ],
  },
  {
    date: 'Jan 2025 – Present',
    title: 'AI Developer / Independent Consultant',
    company: 'Gich AI Nexus',
    location: 'Nairobi, Kenya',
    description: 'Design, code, and deploy tailored multi-agent AI solutions for WhatsApp/website/email automation, virtual assistants, and client-facing bots. Manage full project lifecycle from requirements to post-release support.',
    tags: ['Multi-Agent AI', 'RAG', 'Python', 'Docker', 'API Development'],
    achievements: [
      'Built Python libraries automating repetitive tasks, saving hundreds of manual hours',
      'Engineered scalable, privacy-compliant systems for automated data capture and lead generation',
      'Led client onboarding and AI adoption strategies for SMEs',
    ],
  },
  {
    date: 'Aug 2024 – Jan 2025',
    title: 'Team Lead',
    company: 'Apeli Solutions',
    location: 'Nairobi, Kenya',
    description: 'Coordinated daily operations for a team of analysts and support staff. Monitored performance trends, prepared operational dashboards, and drove process automation adoption.',
    tags: ['Team Leadership', 'Data Analysis', 'Process Automation', 'QA'],
    achievements: [
      'Delivered actionable coaching resulting in CSAT uplift of over 15%',
      'Performed root-cause analysis and led process redesign initiatives',
      'Collaborated on resource forecasting and capacity planning',
    ],
  },
  {
    date: 'Jun 2022 – Sep 2022',
    title: 'Monitoring & Evaluation Intern',
    company: 'Women Enterprise Fund',
    location: 'Nairobi, Kenya',
    description: 'Collected, cleaned, and validated data from national and community field projects. Performed statistical analysis of beneficiary impact and program performance.',
    tags: ['Data Analysis', 'Statistical Modeling', 'Power BI', 'M&E'],
  },
];

const education = [
  {
    title: 'BSc Strategic Management',
    institution: 'Jomo Kenyatta University of Agriculture and Technology (JKUAT)',
    date: '2019 – 2023',
    description: 'Second Upper-Class Honors. Coursework in Financial Management, Business Analytics, Organizational Analysis, and Business Strategy.',
  },
  {
    title: 'Data Science',
    institution: 'Moringa School',
    date: '2023 – 2024',
    description: 'Intensive data science program covering Python, ML algorithms, statistical analysis, and end-to-end project delivery.',
  },
  {
    title: 'AI & Automation Engineering',
    institution: 'One Dev Academy',
    date: 'Nov 2025',
    description: 'Advanced AI engineering and automation systems design.',
  },
  {
    title: 'Generative AI',
    institution: 'Udacity',
    date: '2024 – 2025',
    description: 'Specialized program in generative AI, LLMs, and prompt engineering.',
  },
  {
    title: 'Data and AI',
    institution: 'ALX Africa / Cyber Shujaa',
    date: '2025',
    description: 'Data engineering, AI fundamentals, and cybersecurity-aware AI development.',
  },
];

import ScrollReveal from './ScrollReveal';
import ElectricBorder from './ElectricBorder';

const Experience = () => {
  return (
    <section className="experience section" id="experience">
      <div className="container">
        <ScrollReveal>
          <div className="section-header">
            <span className="section-tag">Career</span>
            <h2 className="section-title">Experience</h2>
          </div>
        </ScrollReveal>
        <div className="timeline">
          {experiences.map((exp, index) => (
            <ScrollReveal key={index} delay={index * 80} direction={index % 2 === 0 ? 'left' : 'right'}>
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <ElectricBorder className="eb-hover-only" color="#e85d04" speed={0.8} chaos={0.1} borderRadius={20}>
                <div className="timeline-content glass-card">
                  <span className="timeline-date">{exp.date}</span>
                  <h3 className="timeline-title">{exp.title}</h3>
                  <span className="timeline-company">{exp.company}</span>
                  {exp.location && <span className="timeline-location">{exp.location}</span>}
                  <p className="timeline-description">{exp.description}</p>
                  {exp.achievements && (
                    <ul className="timeline-achievements">
                      {exp.achievements.map((achievement, i) => (
                        <li key={i}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                  <div className="timeline-tags">
                    {exp.tags.map((tag, tagIndex) => (
                      <span key={tagIndex}>{tag}</span>
                    ))}
                  </div>
                </div>
                </ElectricBorder>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <div className="education-section">
          <ScrollReveal>
            <h3 className="education-title">Education & Learning</h3>
          </ScrollReveal>
          <div className="education-grid">
            {education.map((edu, index) => (
              <ScrollReveal key={index} delay={index * 80}>
                <ElectricBorder className="eb-hover-only" color="#e85d04" speed={0.8} chaos={0.1} borderRadius={20}>
                <div className="education-card glass-card">
                  <span className="edu-date">{edu.date}</span>
                  <h4>{edu.title}</h4>
                  <span className="edu-institution">{edu.institution}</span>
                  <p>{edu.description}</p>
                </div>
                </ElectricBorder>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
