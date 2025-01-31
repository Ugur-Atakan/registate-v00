import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
// Remove duplicate CSS import since it's already in App.tsx

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);