import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export default function NotFound() {
  useSEO({
    title: '404 - Page Not Found',
    description: 'The requested route does not exist on the Web3 Explorer ledger.'
  });

  return (
    <div className="w-full flex-grow flex items-center justify-center py-24 px-4 bg-grid-pattern relative">
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-tr from-brand-purple/5 to-brand-blue/5 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-card max-w-lg w-full p-8 sm:p-12 rounded-3xl text-center glow-purple relative z-10"
      >
        {/* Visual 404 Hashing Illustration */}
        <div className="relative w-48 h-48 mx-auto mb-8 flex items-center justify-center">
          <div className="absolute inset-0 bg-brand-purple/10 rounded-full blur-[30px] animate-pulse" />
          <svg className="w-full h-full text-brand-purple" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" className="animate-spin" style={{ animationDuration: '40s' }} />
            <text x="100" y="115" fill="white" fontSize="48" fontWeight="900" textAnchor="middle" letterSpacing="-0.05em">404</text>
            <path d="M 50 100 A 50 50 0 0 1 150 100" stroke="url(#cyan-grad)" strokeWidth="3" strokeLinecap="round" />
            <defs>
              <linearGradient id="cyan-grad" x1="50" y1="100" x2="150" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#8b5cf6" />
                <stop offset="1" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <h1 className="text-3xl font-extrabold text-white mb-3">Path Out of Sync</h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          The cryptographic route you requested does not exist on this ledger.
        </p>

        <Link 
          to="/" 
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue font-bold text-white hover:brightness-110 active:scale-98 transition-all duration-200 text-sm w-full sm:w-auto"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
