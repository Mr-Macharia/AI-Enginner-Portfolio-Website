import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import SplitHeading from './SplitHeading';
import profileImage from '../assets/profile.png';
import BorderGlow from './BorderGlow';

const About = () => {
  const [counters, setCounters] = useState({ repos: 0, projects: 0, clients: 0, years: 0 });
  const sectionRef = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animateCounters();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const animateCounters = () => {
    const targets = { repos: 60, projects: 15, clients: 10, years: 2 };
    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;

    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      setCounters({
        repos: Math.round(targets.repos * progress),
        projects: Math.round(targets.projects * progress),
        clients: Math.round(targets.clients * progress),
        years: Math.round(targets.years * progress),
      });

      if (step >= steps) clearInterval(interval);
    }, stepTime);
  };

  return (
    <section className="about section" id="about" ref={sectionRef}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number] }}
        >
          <span className="section-tag">About Me</span>
          <SplitHeading className="section-title" text="Building Intelligent Solutions" />
        </motion.div>
        <motion.div
          className="about-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
        >
          <motion.div
            className="about-content glass-card"
            variants={{ hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number] } } }}
          >
            <div className="about-text">
              <p className="lead">
                Strategic, versatile AI Engineer, ML Engineer & Data Scientist with a dual background 
                in Strategic Management and Data Science, delivering production-ready systems that drive 
                measurable digital transformation.
              </p>
              <p>
                With 2+ years of experience building robust AI/ML solutions, I specialize in designing 
                multi-agent AI systems, MLOps pipelines, and scalable cloud infrastructure using frameworks 
                like CrewAI, LangChain, TensorFlow, and PyTorch. I help businesses harness the power of 
                artificial intelligence — from data analytics and business intelligence to GenAI and RAG systems.
              </p>
              <p>
                I believe in writing clean, maintainable code and advancing ethical AI in business. 
                Based in Nairobi, Kenya, I lead cross-functional teams and work with clients globally, 
                consistently exceeding KPIs and delivering stakeholder value.
              </p>
            </div>
            <div className="about-stats">
              <div className="stat-item">
                <span className="stat-number">{counters.repos}+</span>
                <span className="stat-label">Public Repos</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{counters.projects}+</span>
                <span className="stat-label">Projects Delivered</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{counters.clients}+</span>
                <span className="stat-label">Happy Clients</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{counters.years}+</span>
                <span className="stat-label">Years Experience</span>
              </div>
            </div>
          </motion.div>
          <motion.div
            className="about-image"
            variants={{ hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number] } } }}
          >
            <BorderGlow
              className="image-frame"
              edgeSensitivity={30}
              glowColor="20 100% 60%"
              backgroundColor="var(--bg-secondary)"
              borderRadius={28}
              glowRadius={40}
              glowIntensity={1.0}
              coneSpread={25}
              animated={true}
              colors={['#e85d04', '#f48c06', '#dc2f02']}
            >
              <div className="image-placeholder">
                <img src={profileImage} alt="Gichogu Macharia" className="profile-img" />
              </div>
            </BorderGlow>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
