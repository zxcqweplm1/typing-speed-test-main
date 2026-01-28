import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import AppRouter from './router.tsx'

// Use Vite's base URL so the router works when the app is served from
// a subpath (e.g. GitHub Pages at /<repo-name>/)
const base = import.meta.env.BASE_URL || '/'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename={base}>
    <StrictMode>
      <AppRouter />
    </StrictMode>
  </BrowserRouter>,
)
