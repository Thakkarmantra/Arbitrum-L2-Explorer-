/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Theme state: default to dark, check localStorage
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved : 'dark';
  });

  // Toasts state: array of active notifications
  const [toasts, setToasts] = useState([]);

  // Toggle theme helper
  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      return next;
    });
  }, []);

  // Set theme class on root element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
  }, [theme]);

  // Show toast helper
  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto-remove toast after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return (
    <AppContext.Provider value={{ theme, toggleTheme, toasts, showToast }}>
      {children}
      
      {/* Toast Render overlay container */}
      <div className="fixed bottom-6 right-6 z-100 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl shadow-lg border backdrop-blur-md flex items-center justify-between text-xs font-semibold tracking-wide transition-all duration-300 animate-slide-up ${
              toast.type === 'success'
                ? 'bg-emerald-950/85 border-emerald-500/30 text-emerald-300'
                : toast.type === 'error'
                ? 'bg-rose-950/85 border-rose-500/30 text-rose-300'
                : 'bg-slate-900/85 border-slate-500/30 text-slate-300'
            }`}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="ml-4 text-slate-400 hover:text-white cursor-pointer"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useTheme must be used within an AppProvider');
  }
  return { theme: context.theme, toggleTheme: context.toggleTheme };
}

export function useToast() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useToast must be used within an AppProvider');
  }
  return context.showToast;
}
