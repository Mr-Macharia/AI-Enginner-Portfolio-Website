import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import ScrollReveal from './ScrollReveal';
import SplitHeading from './SplitHeading';

const SERVICE_ID   = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID  = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const AUTOREPLY_ID = import.meta.env.VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID;
const PUBLIC_KEY   = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const templateParams = {
      from_name:  formData.name,
      from_email: formData.email,
      subject:    formData.subject,
      message:    formData.message,
    };

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID,  templateParams, PUBLIC_KEY);
      await emailjs.send(SERVICE_ID, AUTOREPLY_ID, templateParams, PUBLIC_KEY);
      setSubmitStatus('success');
      setErrorMsg('');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message
        : (err as { text?: string })?.text ?? JSON.stringify(err);
      console.error('EmailJS error:', err);
      setErrorMsg(message);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 4000);
    }
  };

  const services = [
    'AI Agent Development',
    'ML Pipeline Design & MLOps',
    'Data Analytics & Business Intelligence',
    'Full-Stack Web Applications',
    'Business Automation Systems',
    'Technical Consulting & Training',
  ];

  return (
    <section className="contact section" id="contact">
      <div className="container">
        <ScrollReveal>
          <div className="section-header">
            <span className="section-tag">Get in Touch</span>
            <SplitHeading className="section-title" text="Let's Work Together" />
            <motion.p
              className="section-subtitle"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.55, delay: 0.18, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
            >
              I'm available for freelance consulting, contract development, and AI system architecture.
            </motion.p>
          </div>
        </ScrollReveal>
        <div className="contact-grid">
          <ScrollReveal direction="left">
          <div className="contact-info">
            <motion.div className="contact-card glass-card" whileHover={{ x: 6 }} transition={{ duration: 0.2 }}>
              <div className="contact-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div className="contact-details">
                <h4>Email</h4>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Use the contact form →
                </span>
              </div>
            </motion.div>
            <motion.div className="contact-card glass-card" whileHover={{ x: 6 }} transition={{ duration: 0.2 }}>
              <div className="contact-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div className="contact-details">
                <h4>WhatsApp</h4>
                <a href="https://wa.me/254101656882" target="_blank" rel="noopener noreferrer">+254 101 656 882</a>
              </div>
            </motion.div>
            <motion.div className="contact-card glass-card" whileHover={{ x: 6 }} transition={{ duration: 0.2 }}>
              <div className="contact-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
              <div className="contact-details">
                <h4>LinkedIn</h4>
                <a href="https://linkedin.com/in/gichogu-macharia" target="_blank" rel="noopener noreferrer">gichogu-macharia</a>
              </div>
            </motion.div>
            <motion.div className="contact-card glass-card" whileHover={{ x: 6 }} transition={{ duration: 0.2 }}>
              <div className="contact-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
              <div className="contact-details">
                <h4>GitHub</h4>
                <a href="https://github.com/Mr-Macharia" target="_blank" rel="noopener noreferrer">Mr-Macharia</a>
              </div>
            </motion.div>
            <motion.div className="contact-card glass-card" whileHover={{ x: 6 }} transition={{ duration: 0.2 }}>
              <div className="contact-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div className="contact-details">
                <h4>Location</h4>
                <span>Nairobi, Kenya 🇰🇪</span>
              </div>
            </motion.div>
            <div className="services-list glass-card">
              <h4>Services I Offer</h4>
              <ul>
                {services.map((service, index) => (
                  <li key={index}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {service}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          </ScrollReveal>
          <ScrollReveal direction="right">
          <form className="contact-form glass-card" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="your@email.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                placeholder="Project inquiry, consultation, etc."
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder="Tell me about your project requirements..."
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={isSubmitting}>
              <span>
                {isSubmitting ? 'Sending...'
                  : submitStatus === 'success' ? '✓ Message Sent!'
                  : submitStatus === 'error'   ? '✗ Failed — try again'
                  : 'Send Message'}
              </span>
              {!isSubmitting && submitStatus === 'idle' && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              )}
            </button>
            {submitStatus === 'error' && errorMsg && (
              <p style={{ color: '#ff6b6b', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                Error: {errorMsg}
              </p>
            )}
          </form>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default Contact;
