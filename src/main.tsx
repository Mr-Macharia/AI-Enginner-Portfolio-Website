import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/georama'
import '@fontsource-variable/host-grotesk'
import '@fontsource/fira-code/latin-400.css'
import '@fontsource/fira-code/latin-500.css'
import './index.css'
import App from './App.tsx'
import { initSpotlight } from './lib/spotlight'

initSpotlight()
import { ThemeProvider } from './context/ThemeContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
