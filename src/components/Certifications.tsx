import { useEffect, useRef, useState, type PointerEvent as RPointerEvent } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowLeft, ArrowRight, BadgeCheck, Check, Copy } from 'lucide-react';
import { credentials, issuerColors, skills, type Credential, type SkillId } from '../data/credentials';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const skillLabel = Object.fromEntries(skills.map((s) => [s.id, s.label])) as Record<SkillId, string>;
const initials = (issuer: string) =>
  issuer.replace(/[^A-Za-z ]/g, ' ').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
const pad = (n: number) => String(n).padStart(2, '0');
const sorted = [...credentials].sort((a, b) => b.issued.localeCompare(a.issued));
const issuerCount = new Set(credentials.map((c) => c.issuer)).size;
const withIds = credentials.filter((c) => c.credentialId).length;

/** Desktop with motion allowed: cards run as a continuous loop instead of a swipe deck. */
const LOOP_QUERY = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)';
const useLoopMode = () => {
  const [on, setOn] = useState(() => typeof window !== 'undefined' && window.matchMedia(LOOP_QUERY).matches);
  useEffect(() => {
    const mq = window.matchMedia(LOOP_QUERY);
    const sync = () => setOn(mq.matches);
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return on;
};

function CopyId({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch { /* clipboard unavailable: ID stays visible and selectable */ }
  };
  return (
    <button type="button" className={`cc-id${copied ? ' is-copied' : ''}`} onClick={copy}>
      <span className="cc-id-text">{id}</span>
      {copied ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
      <span className="sr-only" aria-live="polite">{copied ? 'Copied' : 'Copy credential ID'}</span>
    </button>
  );
}

/** One credential, rendered as a physical card: security-paper pattern, holographic foil that follows the pointer. */
function CredCard({ c, n, ghost = false }: { c: Credential; n: number; ghost?: boolean }) {
  const color = issuerColors[c.issuer] ?? '#e85d04';
  const onMove = (e: RPointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty('--px', `${px * 100}%`);
    el.style.setProperty('--py', `${py * 100}%`);
    el.style.setProperty('--rx', `${(0.5 - py) * 10}deg`);
    el.style.setProperty('--ry', `${(px - 0.5) * 12}deg`);
  };
  const onLeave = (e: RPointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty('--rx', '0deg');
    e.currentTarget.style.setProperty('--ry', '0deg');
  };
  return (
    <li className="cc-slot" aria-hidden={ghost || undefined} inert={ghost || undefined}>
      <article className="cc" style={{ ['--issuer' as string]: color }} onPointerMove={onMove} onPointerLeave={onLeave}>
        <div className="cc-face">
          <span className="cc-guilloche" aria-hidden="true" />
          <span className="cc-foil" aria-hidden="true" />
          <header className="cc-top">
            <span className="cc-emblem" aria-hidden="true">{initials(c.issuer)}</span>
            <span className="cc-issuer">{c.issuer}</span>
            <span className="cc-verified"><BadgeCheck size={14} aria-hidden="true" />Verified</span>
          </header>
          <div className="cc-mid">
            <span className="cc-n">No. {pad(n)}</span>
            <h3 className="cc-name">{c.name}</h3>
          </div>
          <ul className="cc-skills" aria-label="Skills">
            {c.skills.map((s) => <li key={s}>{skillLabel[s]}</li>)}
          </ul>
          <footer className="cc-foot">
            <div>
              <span className="cc-label">Issued</span>
              <time dateTime={c.issued}>{c.display}</time>
            </div>
            <div className="cc-proof">
              <span className="cc-label">{c.credentialId ? 'Credential ID' : 'Format'}</span>
              {c.credentialId ? <CopyId id={c.credentialId} /> : <span className="cc-badge">{c.format ?? 'Digital badge'}</span>}
            </div>
          </footer>
        </div>
      </article>
    </li>
  );
}

const Certifications = () => {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const [skill, setSkill] = useState<SkillId | 'all'>('all');
  const [pos, setPos] = useState(1);
  const visible = skill === 'all' ? sorted : sorted.filter((c) => c.skills.includes(skill));
  const countFor = (id: SkillId) => credentials.filter((c) => c.skills.includes(id)).length;
  // A loop needs enough cards to fill the row; short filtered lists stay a static deck.
  const loop = useLoopMode() && visible.length >= 4;

  // Track which card is leading the deck for the counter + button states.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () => {
      const card = el.querySelector<HTMLElement>('.cc-slot');
      const step = card ? card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || '0') : 1;
      setPos(Math.min(visible.length, Math.round(el.scrollLeft / step) + 1));
    };
    update();
    el.addEventListener('scroll', update, { passive: true });
    return () => el.removeEventListener('scroll', update);
  }, [visible.length, loop]);

  const page = (dir: 1 | -1) => {
    const el = track.current;
    const card = el?.querySelector<HTMLElement>('.cc-slot');
    if (!el || !card) return;
    el.scrollBy({ left: dir * (card.offsetWidth + 20), behavior: 'smooth' });
  };

  const choose = (id: SkillId | 'all') => {
    setSkill(id);
    track.current?.scrollTo({ left: 0 });
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      requestAnimationFrame(() => gsap.fromTo('.cc-slot', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'expo.out', stagger: 0.03 }));
    }
  };

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(min-width: 769px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.from('.cc-deck', { y: 60, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.cc-deck', start: 'top 85%', once: true } });
      gsap.from('.cc-stat', { y: 30, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: '.cc-stats', start: 'top 85%', once: true } });
    });
    return () => mm.revert();
  }, { scope: root });

  return (
    <section ref={root} className="certifications section cc-section" id="certifications" data-bp="§05 — Credentials">
      <div className="container">
        <div className="cc-head">
          <div>
            <span className="section-tag">Verified skills</span>
            <h2 className="section-title">The <span className="outline-text">receipts.</span></h2>
            <p className="cc-lede">{credentials.length} credentials, from a JKUAT degree to Google Cloud, DeepLearning.AI and MongoDB. {withIds} carry an ID you can verify; {loop ? 'hover to pause, then click one to copy it.' : 'tap one to copy it.'}</p>
          </div>
          <dl className="cc-stats">
            <div className="cc-stat"><dt>Credentials</dt><dd>{credentials.length}</dd></div>
            <div className="cc-stat"><dt>Issuers</dt><dd>{issuerCount}</dd></div>
            <div className="cc-stat"><dt>Latest</dt><dd>{sorted[0].display}</dd></div>
          </dl>
        </div>

        <div className="cc-bar">
          <div className="cc-filters" role="group" aria-label="Filter credentials by skill">
            <button type="button" className={`wk-chip tl-chip${skill === 'all' ? ' is-active' : ''}`} aria-pressed={skill === 'all'} onClick={() => choose('all')}>
              All<sup>{credentials.length}</sup>
            </button>
            {skills.map((s) => (
              <button key={s.id} type="button" className={`wk-chip tl-chip${skill === s.id ? ' is-active' : ''}`} aria-pressed={skill === s.id} onClick={() => choose(s.id)}>
                {s.label}<sup>{countFor(s.id)}</sup>
              </button>
            ))}
          </div>
        </div>
      </div>

      {loop ? (
        <div className="cc-deck cc-loop">
          {/* Two identical runs; the track slides by exactly one run, so the loop is seamless. */}
          <ol className="cc-loop-track" aria-label="Credentials" style={{ ['--loop-dur' as string]: `${visible.length * 6}s` }}>
            {visible.map((c, i) => <CredCard key={c.issuer + c.name} c={c} n={i + 1} />)}
            {visible.map((c, i) => <CredCard key={`ghost-${c.issuer}${c.name}`} c={c} n={i + 1} ghost />)}
          </ol>
        </div>
      ) : (
        <>
          <div className="cc-deck">
            <ol ref={track} className="cc-track" data-lenis-prevent aria-label="Credentials">
              {visible.map((c, i) => <CredCard key={c.issuer + c.name} c={c} n={i + 1} />)}
              <li className="cc-tail" aria-hidden="true" />
            </ol>
          </div>

          <div className="container cc-controls">
            <p className="cc-count" aria-live="polite"><b>{pad(pos)}</b> / {pad(visible.length)}</p>
            <div className="cc-progress" aria-hidden="true"><span style={{ transform: `scaleX(${visible.length ? pos / visible.length : 0})` }} /></div>
            <div className="cc-nav">
              <button type="button" className="cc-btn" onClick={() => page(-1)} disabled={pos <= 1} aria-label="Previous credentials"><ArrowLeft size={18} /></button>
              <button type="button" className="cc-btn" onClick={() => page(1)} disabled={pos >= visible.length} aria-label="Next credentials"><ArrowRight size={18} /></button>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default Certifications;
