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
];

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import ScrollReveal from './ScrollReveal';
import SplitHeading from './SplitHeading';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const looks = ['xp-look-accent', 'xp-look-ink', 'xp-look-soft'];
const STICK_TOP = 96;
const STICK_STEP = 22;
const pad = (n: number) => String(n).padStart(2, '0');

const Experience = () => {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    // Stacked career cards: each card shrinks back as the next one slides over it.
    mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      const cards = gsap.utils.toArray<HTMLElement>('.xp-stack-card');
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return;
        // Sticky offsets match the inline `top` on each card.
        const stickTop = STICK_TOP + i * STICK_STEP;
        const nextStickTop = STICK_TOP + (i + 1) * STICK_STEP;
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

    return () => mm.revert();
  }, { scope: root });

  return (
    <section ref={root} className="experience section" id="experience" data-bp="§04 — Career">
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
          {experiences.map((exp, i) => {
            const current = exp.date.includes('Present');
            return (
              <div key={exp.company + exp.title} className="xp-stack-card" style={{ top: `calc(${STICK_TOP}px + ${i * STICK_STEP}px)` }}>
                <article className={`xp-card grain ${looks[i % looks.length]}`}>
                  <header className="xp-head">
                    <span className="xp-idx" aria-hidden="true">{pad(i + 1)}</span>
                    <div className="xp-role">
                      <span className="xp-company">
                        {exp.company}
                        {current && <span className="xp-now"><span className="ab-pulse" aria-hidden="true" />Current</span>}
                      </span>
                      <h3 className="xp-title">{exp.title}</h3>
                    </div>
                    <div className="xp-meta">
                      <span>{exp.date}</span>
                      <span>{exp.location}</span>
                    </div>
                  </header>
                  <div className="xp-body">
                    <div className="xp-summary">
                      <p className="xp-desc">{exp.description}</p>
                      <ul className="xp-tags" aria-label="Stack">{exp.tags.map((t) => <li key={t}>{t}</li>)}</ul>
                    </div>
                    <ul className="xp-list" aria-label="Highlights">
                      {exp.achievements.map((a, k) => (
                        <li key={a}><span aria-hidden="true">{pad(k + 1)}</span>{a}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
};

export default Experience;
