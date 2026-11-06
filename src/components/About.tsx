import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Compass, Rocket, ShieldCheck } from 'lucide-react';
import CountUp from './nx/CountUp';
import NairobiClock from './nx/NairobiClock';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const MANIFESTO =
  'I sit where strategy meets engineering. A Strategic Management degree taught me to ask what a business actually needs; data science taught me how to build it. Today I ship multi-agent systems, ML pipelines and production web apps that pay for themselves.';

const stats = [
  { to: 60, suffix: '+', label: 'Public repositories' },
  { to: 15, suffix: '+', label: 'Projects delivered' },
  { to: 10, suffix: '+', label: 'Clients served' },
  { to: 2, suffix: '+', label: 'Years building AI' },
];

const principles = [
  {
    icon: Compass,
    title: 'Business first',
    body: 'Every build starts from a KPI, not a model. My strategy background keeps the work tied to measurable outcomes.',
  },
  {
    icon: Rocket,
    title: 'Ship to production',
    body: 'Demos are easy. I design for MLOps, monitoring and handover, so systems keep working after launch day.',
  },
  {
    icon: ShieldCheck,
    title: 'Responsible by default',
    body: 'Clean, maintainable code and ethical AI practice: privacy-aware data handling and humans in the loop.',
  },
];

const stack = ['CrewAI', 'LangChain', 'Agno', 'TensorFlow', 'PyTorch', 'GCP'];

const About = () => {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    // Manifesto: words light up as you read down the section. Desktop only:
    // scrubbing every word's opacity repaints the paragraph on each scroll tick.
    mm.add('(min-width: 769px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.ab-word', { opacity: 0.14 }, {
        opacity: 1, ease: 'none', stagger: 0.08,
        scrollTrigger: { trigger: '.ab-manifesto', start: 'top 80%', end: 'bottom 45%', scrub: true },
      });
    });
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.ab-principle', {
        y: 40, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.12,
        scrollTrigger: { trigger: '.ab-principles', start: 'top 85%', once: true },
      });
      gsap.from('.ab-chip', {
        scale: 0.6, opacity: 0, duration: 0.6, ease: 'back.out(2)', stagger: 0.06,
        scrollTrigger: { trigger: '.ab-portrait', start: 'top 75%', once: true },
      });
    });
    return () => mm.revert();
  }, { scope: root });

  return (
    <section ref={root} className="about section" id="about" data-bp="§01 — About">
      <div className="container">
        <div className="ab-grid">
          <div className="ab-copy">
            <span className="section-tag">About</span>
            <h2 className="section-title ab-title">
              Strategy brain.<br /><span className="outline-text">Engineer</span> hands.
            </h2>
            <p className="ab-manifesto">
              <span className="sr-only">{MANIFESTO}</span>
              {MANIFESTO.split(' ').map((w, i) => (
                <span key={i} className="ab-word" aria-hidden="true">{w} </span>
              ))}
            </p>
            <p className="ab-body">
              Over 2+ years I've designed multi-agent AI systems, MLOps pipelines and scalable cloud
              infrastructure with CrewAI, LangChain, TensorFlow and PyTorch, from analytics and BI to GenAI
              and RAG. I lead cross-functional teams from Nairobi and work with clients globally.
            </p>
          </div>

          <figure className="ab-portrait ab-portrait-nophoto">
            <figcaption className="ab-spec">
              <div className="ab-spec-bar" aria-hidden="true"><i /><i /><i /><span>whoami.yml</span></div>
              <dl>
                <div><dt>name</dt><dd>Gichogu Macharia</dd></div>
                <div><dt>role</dt><dd>AI / ML Engineer · Data Scientist</dd></div>
                <div><dt>base</dt><dd>Nairobi · <NairobiClock /></dd></div>
                <div><dt>status</dt><dd className="ab-status"><span className="ab-pulse" aria-hidden="true" />Available for projects</dd></div>
              </dl>
            </figcaption>
            <ul className="ab-chips" aria-label="Core stack">
              {stack.map((s, i) => <li key={s} className={`ab-chip ab-chip-${i}`}>{s}</li>)}
            </ul>
          </figure>
        </div>

        <dl className="ab-stats">
          {stats.map((s) => (
            <div key={s.label} className="ab-stat">
              <dt>{s.label}</dt>
              <dd><CountUp to={s.to} suffix={s.suffix} /></dd>
            </div>
          ))}
        </dl>

        <div className="ab-principles">
          {principles.map((p, i) => (
            <article key={p.title} className="ab-principle glass-card">
              <div className="ab-principle-top">
                <span className="ab-icon"><p.icon size={20} aria-hidden="true" /></span>
                <span className="ab-n">principle_{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
