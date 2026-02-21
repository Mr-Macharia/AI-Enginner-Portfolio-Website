import './Certifications.css';
import ScrollReveal from './ScrollReveal';
import ElectricBorder from './ElectricBorder';

const skillCategories = [
  {
    name: "Artificial Intelligence (AI)",
    description: "Artificial Intelligence (AI) involves applying methods that simulate human-intelligence processes such as learning, reasoning, and pattern recognition to allow systems to generate predictions or responses. It is useful in automating processes, improving decision-making, and increasing efficiency across various applications.",
    tags: ["IN DEMAND", "FUTURE PROOF"],
    badges: [
      { name: "AI Skills badge 2025-26", issuer: "Microsoft Elevate", date: "Jan 31, 2026", color: "blue" },
      { name: "Prompt Design in Vertex AI Skill Badge", issuer: "Google Cloud", date: "Nov 16, 2025", color: "orange" },
      { name: "Building AI-Powered Search with MongoDB Vector Search", issuer: "MongoDB", date: "Oct 31, 2025", color: "green" }
    ]
  },
  {
    name: "Cloud Computing",
    description: "Cloud computing refers to the delivery of computing services, including storage, processing, and networking, over the internet. It is useful for enabling scalable and flexible resource management in various work contexts.",
    tags: ["IN DEMAND"],
    badges: [
      { name: "Implement Load Balancing on Compute Engine Skill Badge", issuer: "Google Cloud", date: "Nov 9, 2025", color: "orange" },
      { name: "Set Up an App Dev Environment on Google Cloud Skill Badge", issuer: "Google Cloud", date: "Nov 15, 2025", color: "orange" }
    ]
  },
  {
    name: "Generative AI",
    description: "Generative AI refers to the branch of artificial intelligence focused on creating new content, such as text, images, or music, by learning from existing data and patterns. It is useful in automating creative processes and enhancing content generation in various fields.",
    tags: [],
    badges: [
      { name: "AI Skills badge 2025-26", issuer: "Microsoft Elevate", date: "Jan 31, 2026", color: "blue" },
      { name: "Prompt Design in Vertex AI Skill Badge", issuer: "Google Cloud", date: "Nov 16, 2025", color: "orange" }
    ]
  },
  {
    name: "MongoDB",
    description: "MongoDB is a source-available cross-platform document-oriented database program. Understanding of MongoDB is useful for managing and storing data in a flexible, scalable manner across various platforms.",
    tags: ["FUTURE PROOF"],
    badges: [
      { name: "Building RAG Apps Using MongoDB", issuer: "MongoDB", date: "Oct 31, 2025", color: "green" },
      { name: "Building AI-Powered Search with MongoDB Vector Search", issuer: "MongoDB", date: "Oct 31, 2025", color: "green" }
    ]
  },
  {
    name: "Machine Learning (ML)",
    description: "Machine Learning (ML) involves developing algorithms that enable systems to learn from data and improve over time. It is useful for automating decision-making processes and enhancing data-driven insights in various applications.",
    tags: ["IN DEMAND", "FUTURE PROOF"],
    badges: [
      { name: "Prepare Data for ML APIs on Google Cloud Skill Badge", issuer: "Google Cloud", date: "Nov 16, 2025", color: "orange" }
    ]
  },
  {
    name: "Search Algorithms",
    description: "Search algorithms refer to methods used to locate specific data within a dataset, relevant in organizing and retrieving information in Knowledge Management, Library, Information, and Archival Studies.",
    tags: [],
    badges: [
      { name: "Building AI-Powered Search with MongoDB Vector Search", issuer: "MongoDB", date: "Oct 31, 2025", color: "green" }
    ]
  },
  {
    name: "TensorFlow",
    description: "TensorFlow is a free and open-source software library for machine learning and artificial intelligence. Understanding of TensorFlow is useful for developing and deploying machine learning models and neural networks.",
    tags: ["IN DEMAND", "FUTURE PROOF"],
    badges: [
      { name: "Prepare Data for ML APIs on Google Cloud Skill Badge", issuer: "Google Cloud", date: "Nov 16, 2025", color: "orange" }
    ]
  }
];

const Certifications = () => {
  return (
    <section className="certifications section" id="certifications">
      <div className="container">
        <ScrollReveal>
          <div className="section-header">
            <span className="section-tag">Verified Skills</span>
            <h2 className="section-title">Certifications & Badges</h2>
            <p className="section-subtitle">Evidenced by credentials from Credly</p>
          </div>
        </ScrollReveal>

        <div className="certifications-grid">
          {skillCategories.map((category, index) => (
            <ScrollReveal key={index} delay={index * 80}>
            <ElectricBorder className="eb-hover-only" color="#e85d04" speed={0.8} chaos={0.1} borderRadius={20}>
            <div className="cert-category-card glass-card">
              <div className="category-header">
                <h3>{category.name}</h3>
              </div>
              <p className="category-description">{category.description}</p>
              
              <div className="badges-container">
                <h4 className="badges-title">Credly Badges</h4>
                <div className="badges-list">
                  {category.badges.map((badge, bIndex) => (
                    <div className="badge-item" key={`${category.name}-badge-${bIndex}`}>
                      <div className={`badge-icon ${badge.color}`}>
                        {badge.color === 'blue' && (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                        )}
                        {badge.color === 'orange' && (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19v-2a4 4 0 0 0-4-4h-8a4 4 0 0 0-4 4v2"/><circle cx="7.5" cy="8" r="4"/><path d="M22 19v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        )}
                        {badge.color === 'green' && (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"/><path d="M6 8h.01"/><path d="M10 8h.01"/><path d="M14 8h.01"/></svg>
                        )}
                      </div>
                      <div className="badge-info">
                        <h5>{badge.name}</h5>
                        <span>{badge.issuer} • Issued {badge.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
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

export default Certifications;
