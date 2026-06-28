import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import Layout from './components/Layout';
import { useToast } from './context/AppContext';

// Code split lazy-loaded page modules
const Home = lazy(() => import('./pages/Home'));
const Concepts = lazy(() => import('./pages/Concepts'));
const LivePrices = lazy(() => import('./pages/LivePrices'));
const BlockSimulator = lazy(() => import('./pages/BlockSimulator'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Premium Web3 theme loader widget used during route splits loading transitions
function LoadingFallback() {
  return (
    <div className="w-full flex-grow flex flex-col items-center justify-center py-32 bg-grid-pattern relative min-h-[50vh]">
      <div className="absolute inset-0 bg-gradient-to-tr from-brand-purple/5 to-brand-blue/5 pointer-events-none" />
      <div className="relative w-14 h-14 flex items-center justify-center">
        <div className="absolute inset-0 bg-brand-purple/20 rounded-full blur-[15px] animate-pulse" />
        <svg className="w-full h-full text-brand-purple animate-spin" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.03)" strokeWidth="6" />
          <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="6" strokeDasharray="50 150" strokeLinecap="round" />
        </svg>
      </div>
      <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-6 animate-pulse">
        Decrypting Ledger View...
      </span>
    </div>
  );
}

// Keyboard shortcut handler linking navigation and event dispatches
function KeyboardShortcutsHandler() {
  const navigate = useNavigate();
  const showToast = useToast();

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isCtrl = e.ctrlKey || e.metaKey;
      if (!isCtrl) return;

      const key = e.key.toLowerCase();

      if (key === 'h') {
        e.preventDefault();
        showToast('Navigating to Home', 'info');
        navigate('/');
      } else if (key === 'c') {
        e.preventDefault();
        showToast('Navigating to Concepts', 'info');
        navigate('/concepts');
      } else if (key === 'r') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('trigger-refresh-prices'));
      } else if (key === 'm') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('trigger-mine-block'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, showToast]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <KeyboardShortcutsHandler />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="concepts" element={<Concepts />} />
            <Route path="live-prices" element={<LivePrices />} />
            <Route path="block-simulator" element={<BlockSimulator />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
