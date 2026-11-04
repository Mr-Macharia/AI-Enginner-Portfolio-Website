import { useEffect, useId, useRef, useState, type MouseEvent as RMouseEvent } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { getLenis, scrollToTarget } from '../lib/smoothScroll';
import NairobiClock from './nx/NairobiClock';
import webLogo from '../assets/nexus-logo.webp';
import webLogoLight from '../assets/nexus-logo-light.webp';

interface NavbarProps {
  activeSection: string;
}

const links = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Stack' },
  { id: 'projects', label: 'Work' },
  { id: 'experience', label: 'Career' },
  { id: 'certifications', label: 'Credentials' },
  { id: 'contact', label: 'Contact' },
];
const pad = (n: number) => String(n).padStart(2, '0');
const DARK_SECTIONS = '.wk, .fx, .nx-footer-root';

const Navbar = ({ activeSection }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const indicatorId = useId();
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const lastY = useRef(0);
  const reduce = useReducedMotion();

  // Hide on scroll down, reveal on scroll up; compact once past the hero top.
  useEffect(() => {
    const onY = (y: number) => {
      setScrolled(y > 40);
      const delta = y - lastY.current;
      if (Math.abs(delta) > 6) setHidden(delta > 0 && y > 160);
      lastY.current = y;
    };
    const lenis = getLenis();
    if (lenis) {
      const handler = ({ scroll }: { scroll: number }) => onY(scroll);
      lenis.on('scroll', handler);
      return () => lenis.off('scroll', handler);
    }
    const handler = () => onY(window.scrollY);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Chameleon: switch to dark glass while a dark chapter sits under the bar.
  useEffect(() => {
    const seen = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)));
      setOnDark(seen.size > 0);
    }, { rootMargin: '0px 0px -92% 0px' });
    const observe = () => document.querySelectorAll(DARK_SECTIONS).forEach((el) => io.observe(el));
    observe();
    const mo = new MutationObserver(observe); // lazy sections mount later
    mo.observe(document.querySelector('main') ?? document.body, { childList: true, subtree: false });
    return () => { io.disconnect(); mo.disconnect(); };
  }, []);

  // Mobile menu: lock scroll, Esc to close, return focus to the toggle.
  useEffect(() => {
    const lenis = getLenis();
    if (open) { lenis?.stop(); document.body.style.overflow = 'hidden'; }
    else { lenis?.start(); document.body.style.overflow = ''; }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); toggleRef.current?.focus(); } };
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (e: RMouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setOpen(false);
    scrollToTarget(`#${id}`, { offset: -24 });
  };

  const cls = ['nv', scrolled && 'is-scrolled', hidden && !open && 'is-hidden', (onDark || open) && 'is-dark'].filter(Boolean).join(' ');

  return (
    <>
      <header className={cls}>
        <nav className="nv-bar" aria-label="Primary">
          <a href="#home" className="nv-logo" onClick={(e) => go(e, 'home')} aria-label="Gich AI Nexus, back to top">
            <img src={webLogo} alt="" className="nv-logo-img nv-logo-ink" width="100" height="36" decoding="async" fetchPriority="high" />
            <img src={webLogoLight} alt="" className="nv-logo-img nv-logo-light" width="100" height="36" decoding="async" />
          </a>

          <ul className="nv-links">
            {links.map((l, i) => {
              const active = activeSection === l.id;
              return (
                <li key={l.id}>
                  <a href={`#${l.id}`} className={`nv-link${active ? ' is-active' : ''}`} aria-current={active ? 'location' : undefined} onClick={(e) => go(e, l.id)}>
                    <span className="nv-n">{pad(i + 1)}</span>{l.label}
                    {active && <motion.span layoutId={indicatorId} className="nv-indicator" transition={{ type: 'spring', stiffness: 420, damping: 38 }} />}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="nv-actions">
            <span className="nv-status"><span className="ab-pulse" aria-hidden="true" />Available</span>
            <button type="button" className="nv-icon" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
              {theme === 'dark' ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
            </button>
            <a href="#contact" className="nv-cta" onClick={(e) => go(e, 'contact')}>Let's talk <ArrowUpRight size={16} aria-hidden="true" /></a>
            <button
              ref={toggleRef}
              type="button"
              className={`nv-burger${open ? ' is-open' : ''}`}
              aria-expanded={open}
              aria-controls={menuId}
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((o) => !o)}
            >
              <span /><span />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            className="nv-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial={reduce ? false : { clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <ul className="nv-sheet-links">
              {links.map((l, i) => (
                <motion.li
                  key={l.id}
                  initial={reduce ? false : { y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <a href={`#${l.id}`} className={activeSection === l.id ? 'is-active' : undefined} onClick={(e) => go(e, l.id)}>
                    <span className="nv-n">{pad(i + 1)}</span>{l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="nv-sheet-foot">
              <a href="https://wa.me/254101656882" target="_blank" rel="noopener noreferrer">WhatsApp ↗</a>
              <a href="https://linkedin.com/in/gichogu-macharia" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
              <a href="https://github.com/Mr-Macharia" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
              <span className="nv-sheet-meta"><span className="ab-pulse" aria-hidden="true" />Nairobi · <NairobiClock /></span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
