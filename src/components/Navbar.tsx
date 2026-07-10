import { useState, useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { getLenis, scrollToTarget } from '../lib/smoothScroll';
import webLogo from '../assets/weblogo.webp';

interface NavbarProps {
  activeSection: string;
}

const navLinks = [
  { href: '#home',           label: 'Home' },
  { href: '#about',          label: 'About' },
  { href: '#skills',         label: 'Skills' },
  { href: '#projects',       label: 'Projects' },
  { href: '#experience',     label: 'Experience' },
  { href: '#certifications', label: 'Certs' },
  { href: '#contact',        label: 'Contact' },
];

const Navbar = ({ activeSection }: NavbarProps) => {
  const [isScrolled, setIsScrolled]   = useState(false);
  const [isMenuOpen, setIsMenuOpen]   = useState(false);
  const { theme, toggleTheme }        = useTheme();
  const pillId                        = useId();

  useEffect(() => {
    const lenis = getLenis();

    if (lenis) {
      const onLenisScroll = ({ scroll }: { scroll: number }) => setIsScrolled(scroll > 50);
      lenis.on('scroll', onLenisScroll);
      requestAnimationFrame(() => {
        setIsScrolled(lenis.scroll > 50);
      });
      return () => lenis.off('scroll', onLenisScroll);
    }

    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    scrollToTarget(href, { offset: -24 });
    setIsMenuOpen(false);
  };

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          {/* Logo */}
          <a href="#home" className="nav-logo" onClick={(event) => handleNavClick(event, '#home')}>
            <img src={webLogo} alt="GM Logo" className="logo-img" />
          </a>

          {/* Desktop nav links with animated active pill */}
          <ul className="nav-menu">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <li key={link.href} style={{ position: 'relative' }}>
                  {isActive && (
                    <motion.span
                      layoutId={pillId}
                      className="nav-active-pill"
                      style={{ position: 'absolute', inset: 0 }}
                      transition={{ type: 'spring', stiffness: 380, damping: 36 }}
                    />
                  )}
                  <a
                    href={link.href}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                    onClick={(event) => handleNavClick(event, link.href)}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Dark mode toggle */}
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <AnimatePresence mode="wait">
              {theme === 'dark' ? (
                <motion.span
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0,   opacity: 1 }}
                  exit={{    rotate: 90,  opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun size={16} />
                </motion.span>
              ) : (
                <motion.span
                  key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0,  opacity: 1 }}
                  exit={{    rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon size={16} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Hamburger toggle */}
          <button
            className={`nav-toggle ${isMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(prev => !prev)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              className="mobile-menu-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{   opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              className="mobile-menu-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{   x: '100%' }}
              transition={{ type: 'spring', stiffness: 340, damping: 38 }}
            >
              <button
                className="mobile-close"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={18} />
              </button>

              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  className={`nav-link ${activeSection === link.href.slice(1) ? 'active' : ''}`}
                  onClick={(event) => handleNavClick(event, link.href)}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.1 }}
                >
                  {link.label}
                </motion.a>
              ))}

              {/* Dark mode toggle in drawer */}
              <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
                <button
                  className="theme-toggle"
                  style={{ width: '100%', borderRadius: 'var(--radius-md)', height: '44px', gap: '0.5rem', fontSize: '0.9rem' }}
                  onClick={toggleTheme}
                >
                  {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                  {theme === 'dark' ? 'Light mode' : 'Dark mode'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

