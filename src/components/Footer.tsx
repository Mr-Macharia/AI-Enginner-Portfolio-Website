import { motion } from 'framer-motion';
import { scrollToTarget } from '../lib/smoothScroll';
import webLogo         from '../assets/weblogo.webp';
import pythonLogo      from '../assets/python_footer.svg';
import langchainLogo   from '../assets/langchain_footer.svg';
import crewaiLogo      from '../assets/crewai_footer.svg';
import llamaindexLogo  from '../assets/llama_index_footer.svg';
import agnoLogo        from '../assets/agno.png';
import composioLogo    from '../assets/composio.svg';
import dockerLogo      from '../assets/docker.svg';
import makeLogo        from '../assets/make.svg';
import mlopsLogo       from '../assets/mlops.svg';
import n8nLogo         from '../assets/n8n.svg';
import openaiLogo      from '../assets/openai.webp';
import pytorchLogo     from '../assets/pytorch.svg';
import ragLogo         from '../assets/rag.svg';
import sklearnLogo     from '../assets/scikitlearn.svg';
import tensorflowLogo  from '../assets/tensorflow.svg';

// All logo items with images
const LOGO_ITEMS = [
  { src: pythonLogo,     label: 'Python' },
  { src: langchainLogo,  label: 'LangChain' },
  { src: crewaiLogo,     label: 'CrewAI' },
  { src: llamaindexLogo, label: 'LlamaIndex' },
  { src: agnoLogo,       label: 'Agno' },
  { src: composioLogo,   label: 'Composio' },
  { src: dockerLogo,     label: 'Docker' },
  { src: makeLogo,       label: 'Make' },
  { src: mlopsLogo,      label: 'MLOps' },
  { src: n8nLogo,        label: 'n8n' },
  { src: openaiLogo,     label: 'OpenAI' },
  { src: pytorchLogo,    label: 'PyTorch' },
  { src: ragLogo,        label: 'RAG' },
  { src: sklearnLogo,    label: 'Scikit-learn' },
  { src: tensorflowLogo, label: 'TensorFlow' },
];

// No more text-only badges — all items have logos

const Footer = () => {
  const currentYear = new Date().getFullYear();
  // Duplicate for seamless infinite scroll
  const track = [...LOGO_ITEMS, ...LOGO_ITEMS];

  const handleFooterJump = (event: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    event.preventDefault();
    scrollToTarget(target, { offset: -24 });
  };

  return (
    <footer className="footer">
      {/* ── Tech Stack Logo Strip ── */}
      <div className="techstack-strip">
        <p className="strip-label">My Tech Stack</p>
        <div className="logo-track">
          {track.map((item, idx) => (
            <div className="logo-item" key={idx}>
              <img src={item.src} alt={item.label} />
              <span className="logo-badge">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="container">
        <motion.div
          className="footer-content"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] }}
        >
          <div className="footer-brand">
            <a href="#home" className="nav-logo" onClick={(event) => handleFooterJump(event, '#home')}>
              <img src={webLogo} alt="GM Logo" className="logo-img" />
            </a>
            <p>AI/ML Engineer &amp; Data Scientist building intelligent systems in Nairobi, Kenya 🇰🇪</p>
          </div>
          <div className="footer-links">
            <a href="#home" onClick={(event) => handleFooterJump(event, '#home')}>Home</a>
            <a href="#about" onClick={(event) => handleFooterJump(event, '#about')}>About</a>
            <a href="#skills" onClick={(event) => handleFooterJump(event, '#skills')}>Skills</a>
            <a href="#projects" onClick={(event) => handleFooterJump(event, '#projects')}>Projects</a>
            <a href="#contact" onClick={(event) => handleFooterJump(event, '#contact')}>Contact</a>
          </div>
          <div className="footer-socials">
            <a href="https://linkedin.com/in/gichogu-macharia" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a href="https://github.com/Mr-Macharia" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a href="mailto:gichogumacharia001@gmail.com" aria-label="Email">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </a>
            <a href="https://wa.me/254101656882" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
          </div>
        </motion.div>
        <div className="footer-bottom">
          <p>&copy; {currentYear} Gichogu Macharia. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

