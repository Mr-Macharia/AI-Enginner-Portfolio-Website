import { useRef, useState, type FormEvent } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowUpRight, Check } from 'lucide-react';
import NairobiClock from './nx/NairobiClock';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;

const SERVICES = [
  'AI agent development',
  'ML pipelines & MLOps',
  'Data analytics & BI',
  'Full-stack web app',
  'Business automation',
  'Consulting & training',
  'Something else',
];

type Fields = { name: string; email: string; need: string; timeline: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;
const EMPTY: Fields = { name: '', email: '', need: '', timeline: '', message: '' };
const TIMELINES = ['As soon as possible', 'In 1–3 months', 'Just exploring'];

const channels = [
  { label: 'WhatsApp', value: '+254 101 656 882', href: 'https://wa.me/254101656882' },
  { label: 'LinkedIn', value: 'gichogu-macharia', href: 'https://linkedin.com/in/gichogu-macharia' },
  { label: 'GitHub', value: 'Mr-Macharia', href: 'https://github.com/Mr-Macharia' },
];

type Status = 'idle' | 'sending' | 'success' | 'error';
const CONFIGURED = Boolean(WEB3FORMS_KEY);

const validate = (f: Fields): Errors => {
  const e: Errors = {};
  if (!f.name.trim()) e.name = 'Please tell me your name.';
  if (!f.email.trim()) e.email = 'I need an email to reply to.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = "That email doesn't look quite right.";
  if (!f.need) e.need = 'Pick the option closest to what you need.';
  if (f.message.trim().length < 10) e.message = 'A sentence or two about the project helps me reply properly.';
  return e;
};

function ContactForm() {
  const [f, setF] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [reason, setReason] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const set = <K extends keyof Fields>(k: K, v: Fields[K]) => {
    const next = { ...f, [k]: v };
    setF(next);
    if (touched[k] || errors[k]) setErrors((e) => ({ ...e, [k]: validate(next)[k] }));
  };
  const blur = (k: keyof Fields) => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors((e) => ({ ...e, [k]: validate(f)[k] }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validate(f);
    setErrors(found);
    setTouched({ name: true, email: true, need: true, message: true });
    const firstBad = (Object.keys(found) as (keyof Fields)[])[0];
    if (firstBad) {
      formRef.current?.querySelector<HTMLElement>(`[data-field="${firstBad}"]`)?.focus();
      return;
    }
    if (!CONFIGURED) {
      console.error('VITE_WEB3FORMS_KEY is missing at build time.');
      setReason('The contact form is not configured on this deployment.');
      setStatus('error');
      return;
    }
    setStatus('sending');
    setReason('');
    const name = f.name.trim();
    const email = f.email.trim();
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Portfolio enquiry: ${f.need} from ${name}`,
          from_name: 'Gichogu Macharia portfolio',
          replyto: email,
          name,
          email,
          'What they need': f.need,
          Timeline: f.timeline || 'Not specified',
          message: f.message.trim(),
          botcheck: '',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.message || `Request failed (${res.status})`);
      setStatus('success');
      // Hand off to the thank-you page; the name travels in sessionStorage, not the URL.
      try { sessionStorage.setItem('contact:firstName', name.split(' ')[0]); } catch { /* private mode: page still works */ }
      window.location.assign('/thank-you/');
    } catch (err) {
      console.error('Web3Forms error:', err);
      const msg = err instanceof Error ? err.message : '';
      setReason(/fetch|network/i.test(msg) ? 'No connection to the email service.' : msg ? `(${msg})` : '');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="cf cf-done" role="status">
        <span className="cf-done-icon"><Check size={28} aria-hidden="true" /></span>
        <h3>Message sent. Thank you, {f.name.split(' ')[0]}!</h3>
        <p>I'll read it personally and reply to <strong>{f.email}</strong>.</p>
        <button type="button" className="cf-link" onClick={() => { setF(EMPTY); setErrors({}); setTouched({}); setStatus('idle'); }}>
          Send another message
        </button>
      </div>
    );
  }

  const err = (k: keyof Fields) => (errors[k] ? <p id={`cf-${k}-err`} className="cf-error">{errors[k]}</p> : null);
  const aria = (k: keyof Fields) => ({ 'aria-invalid': !!errors[k], 'aria-describedby': errors[k] ? `cf-${k}-err` : undefined });

  return (
    <form ref={formRef} className="cf" onSubmit={submit} noValidate>
      <div className="cf-head">
        <h3>Send a message</h3>
        <p>Fields marked <span aria-hidden="true">*</span><span className="sr-only">with an asterisk</span> are required.</p>
      </div>

      <div className="cf-row">
        <div className={`cf-field${errors.name ? ' has-error' : ''}`}>
          <label htmlFor="cf-name">Your name <span aria-hidden="true">*</span></label>
          <input id="cf-name" data-field="name" autoComplete="name" value={f.name} placeholder="Jane Wanjiku"
            onChange={(e) => set('name', e.target.value)} onBlur={() => blur('name')} {...aria('name')} />
          {err('name')}
        </div>
        <div className={`cf-field${errors.email ? ' has-error' : ''}`}>
          <label htmlFor="cf-email">Email address <span aria-hidden="true">*</span></label>
          <input id="cf-email" data-field="email" type="email" inputMode="email" autoComplete="email" value={f.email} placeholder="jane@company.com"
            onChange={(e) => set('email', e.target.value)} onBlur={() => blur('email')} {...aria('email')} />
          {err('email')}
        </div>
      </div>

      <fieldset className={`cf-field${errors.need ? ' has-error' : ''}`} {...aria('need')}>
        <legend>What do you need help with? <span aria-hidden="true">*</span></legend>
        <div className="cf-options" data-field="need" tabIndex={-1}>
          {SERVICES.map((s) => (
            <label key={s} className={`cf-option${f.need === s ? ' is-on' : ''}`}>
              <input type="radio" name="need" value={s} checked={f.need === s} onChange={() => set('need', s)} />
              {s}
            </label>
          ))}
        </div>
        {err('need')}
      </fieldset>

      <fieldset className="cf-field">
        <legend>When would you like to start? <span className="cf-optional">Optional</span></legend>
        <div className="cf-options cf-options-sm">
          {TIMELINES.map((t) => (
            <label key={t} className={`cf-option${f.timeline === t ? ' is-on' : ''}`}>
              <input type="radio" name="timeline" value={t} checked={f.timeline === t} onChange={() => set('timeline', t)} />
              {t}
            </label>
          ))}
        </div>
      </fieldset>

      <div className={`cf-field${errors.message ? ' has-error' : ''}`}>
        <label htmlFor="cf-message">Tell me about your project <span aria-hidden="true">*</span></label>
        <textarea id="cf-message" data-field="message" rows={3} value={f.message}
          placeholder="What are you trying to achieve, and what's getting in the way?"
          onChange={(e) => set('message', e.target.value)} onBlur={() => blur('message')} {...aria('message')} />
        {err('message')}
      </div>

      {status === 'error' && (
        <p className="cf-banner" role="alert">
          Your message didn't send. {reason} Please try again, or reach me on{' '}
          <a href="https://wa.me/254101656882" target="_blank" rel="noopener noreferrer">WhatsApp</a>.
        </p>
      )}

      <div className="cf-actions">
        <button type="submit" className="btn btn-primary cf-submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Send message'}
          {status !== 'sending' && <ArrowUpRight size={18} aria-hidden="true" />}
        </button>
        <p className="cf-note">I reply personally. Your details are only used to answer you.</p>
      </div>
    </form>
  );
}

const Contact = () => {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.fx-line', {
        yPercent: 115, duration: 1.2, ease: 'expo.out', stagger: 0.1,
        scrollTrigger: { trigger: '.fx-title', start: 'top 85%', once: true },
      });
      gsap.from('.fx-reveal', {
        y: 40, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.08,
        scrollTrigger: { trigger: '.fx-grid', start: 'top 85%', once: true },
      });
    });
    return () => mm.revert();
  }, { scope: root });

  return (
    <section ref={root} className="contact section fx" id="contact" data-bp="§06 — Contact">
      <div className="fx-glow" aria-hidden="true" />
      <div className="container">
        <div className="fx-grid">
          <div className="fx-side">
            <div className="fx-intro">
              <span className="section-tag">Let's work together</span>
              <h2 className="fx-title" aria-label="Let's build something real.">
                <span className="fx-mask"><span className="fx-line">Let's build</span></span>
                <span className="fx-mask"><span className="fx-line fx-line-2">something <em>real.</em></span></span>
              </h2>
            </div>
            <p className="fx-lede fx-reveal">
              Freelance consulting, contract builds and AI system architecture. Send a message below,
              or reach me directly on any of these.
            </p>
            <ul className="fx-channels fx-reveal">
              {channels.map((c, i) => (
                <li key={c.label}>
                  <a href={c.href} target="_blank" rel="noopener noreferrer">
                    <span className="fx-ch-n">0{i + 1}</span>
                    <span className="fx-ch-label">{c.label}</span>
                    <span className="fx-ch-value">{c.value}</span>
                    <ArrowUpRight size={20} aria-hidden="true" className="fx-ch-arrow" />
                  </a>
                </li>
              ))}
            </ul>
            <div className="fx-meta fx-reveal">
              <span><span className="ab-pulse" aria-hidden="true" />Available for new projects</span>
              <span>Nairobi · <NairobiClock /></span>
            </div>
          </div>
          <div className="fx-reveal fx-term"><ContactForm /></div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
