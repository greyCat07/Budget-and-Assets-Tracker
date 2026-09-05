import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

// Guard against third-party extension unhandled rejections
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event?.reason;
    const msg = (reason && (reason.message || reason.stack || String(reason))) || '';
    if (
      msg.toLowerCase().includes('metamask') ||
      msg.toLowerCase().includes('failed to connect to metamask') ||
      msg.toLowerCase().includes('ethereum')
    ) {
      console.warn('[main] Suppressed external Web3 wallet extension rejection:', msg);
      event.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
