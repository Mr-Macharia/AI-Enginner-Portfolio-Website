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
    title: 'Artificial Intelligence Training',
    institution: 'ICT Authority',
    date: 'Jul 2026',
    description: 'Comprehensive training covering Artificial Intelligence methodologies, implementation frameworks, and digital workspace alignment. (Credential ID: CTA-1783118955-7426-44239)',
  },
  {
    title: 'Agentic AI',
    institution: 'DeepLearning.AI',
    date: 'Jul 2026',
    description: 'Planning and designing Agentic AI systems, workflow orchestration, and evaluation of multi-agent workflows. (Credential ID: e2elacc8-7bbd-4a85-8549-dda3b7352a64)',
  },
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

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import ScrollReveal from './ScrollReveal';
import SplitHeading from './SplitHeading';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const looks = ['xp-look-accent', 'xp-look-ink', 'xp-look-soft'];
const pad = (n: number) => String(n).padStart(2, '0');
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

const Experience = () => {
  const root = useRef<HTMLElement>(null);
  const eduRoot = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLOListElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    // Stacked career cards: each card shrinks back as the next one slides over it.
    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      const cards = gsap.utils.toArray<HTMLElement>('.xp-stack-card');
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return;
        // Sticky offsets match the inline `top: calc(100px + i * 28px)` on each card.
        const stickTop = 100 + i * 28;
        const nextStickTop = 100 + (i + 1) * 28;
        const inner = card.firstElementChild as HTMLElement;
        // Only recede once the next card actually starts covering this one
        // (its top crosses this card's pinned bottom edge), so the card is
        // fully lit while you read it.
        // Dim via an overlay opacity (--xp-dim) rather than `filter`: GSAP can't
        // interpolate cleanly from `filter: none`, which made cards go near-black.
        gsap.fromTo(inner, { scale: 1, '--xp-dim': 0 }, {
          scale: 0.9 + i * 0.025,
          '--xp-dim': 0.18,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: {
            trigger: cards[i + 1],
            start: () => `top ${stickTop + inner.offsetHeight}px`,
            end: `top ${nextStickTop}px`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      });
    });

    // Education: pin and scroll horizontally on desktop.
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const el = track.current!;
      const dist = () => el.scrollWidth - window.innerWidth + 64;
      const st = { trigger: eduRoot.current, start: 'top top', end: () => `+=${dist()}`, invalidateOnRefresh: true };
      gsap.to(el, { x: () => -dist(), ease: 'none', scrollTrigger: { ...st, pin: true, scrub: 1 } });
      gsap.to('.edu-progress', { scaleX: 1, ease: 'none', scrollTrigger: { ...st, scrub: true } });
    });

    return () => mm.revert();
  }, { scope: root });

  return (
    <section ref={root} className="experience section" id="experience">
      <div className="container">
        <ScrollReveal>
          <div className="nx-head">
            <div>
              <span className="section-tag">Career</span>
              <SplitHeading className="section-title" text="Where I've shipped real work." />
            </div>
          </div>
        </ScrollReveal>

        <div className="xp-stack">
          {experiences.map((exp, i) => (
            <div key={exp.company + exp.title} className="xp-stack-card" style={{ top: `calc(100px + ${i * 28}px)` }}>
              <article className={`xp-card grain ${looks[i % looks.length]}`}>
                <span className="xp-ghost" aria-hidden="true">{pad(i + 1)}</span>
                <div className="xp-left">
                  <span className="xp-kicker">Role {pad(i + 1)} · {exp.company}</span>
                  <div>
                    <h3 className="xp-title">{exp.title}</h3>
                    <div className="xp-chips">
                      <span>{exp.date}</span>
                      {exp.location && <span>{exp.location}</span>}
                    </div>
                  </div>
                </div>
                <div className="xp-right">
                  <p className="xp-desc">{exp.description}</p>
                  <ul className="xp-list">
                    {(exp.achievements ?? exp.tags.map((t) => t)).map((a, k) => (
                      <li key={a}><span>{pad(k + 1)}</span>{a}</li>
                    ))}
                  </ul>
                  {exp.achievements && (
                    <div className="xp-tags">{exp.tags.map((t) => <span key={t}>{t}</span>)}</div>
                  )}
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>

      <div ref={eduRoot} className="edu-pin">
        <div className="container edu-head">
          <div>
            <span className="section-tag">Education</span>
            <h3 className="section-title edu-title">Always learning. <span className="outline-text">Never</span> done.</h3>
          </div>
          <div className="edu-progress-wrap" aria-hidden="true">
            <div className="edu-progress-bar"><div className="edu-progress" /></div>
            <p>Scroll to explore</p>
          </div>
        </div>
        <ol ref={track} className="edu-track">
          {education.map((edu, i) => (
            <li key={edu.title} className="edu-step glass-card">
              <span className="edu-ghost" aria-hidden="true">{pad(i + 1)}</span>
              <span className="edu-n">step_{pad(i + 1)}</span>
              <div className="edu-body">
                <span className="edu-date">{edu.date}</span>
                <h4>{edu.title}</h4>
                <p>{edu.description.replace(/\s*\(Credential ID:.*\)$/, '')}</p>
                <span className="edu-file"><b>↳</b>{slug(edu.institution).slice(0, 24)}.cert</span>
              </div>
            </li>
          ))}
          <li className="edu-end">
            <p>Next module: whatever your project needs.</p>
          </li>
        </ol>
      </div>
    </section>
  );
};

export default Experience;
