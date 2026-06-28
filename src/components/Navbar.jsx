import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Compass, BookOpen, Activity, Database, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/AppContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { name: 'Home', path: '/', icon: Compass },
    { name: 'Concepts', path: '/concepts', icon: BookOpen },
    { name: 'Live Prices', path: '/live-prices', icon: Activity },
    { name: 'Block Simulator', path: '/block-simulator', icon: Database },
  ];

  return (
    <nav className="glass-nav fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-purple/20 group-hover:scale-105 transition-transform duration-200">
                W
              </div>
              <span className="text-white font-extrabold text-lg tracking-wide bg-gradient-to-r from-white via-white to-slate-400 bg-clip-text group-hover:text-transparent group-hover:from-white group-hover:to-brand-cyan transition-all duration-200">
                Web3 Explorer
              </span>
            </Link>
          </div>

          {/* Desktop Navigation & Theme Switcher */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                      isActive
                        ? 'text-white bg-white/5 border border-white/10 shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-white/3'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon className={`w-4 h-4 ${isActive ? 'text-brand-purple animate-pulse' : 'text-slate-500'}`} />
                      {item.name}
                      {isActive && (
                        <motion.div
                          layoutId="active-indicator"
                          className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-brand-purple to-brand-blue"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-slate-400 hover:text-white transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:outline-none"
              aria-label="Toggle light/dark theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>
          </div>

          {/* Mobile Actions Header */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-all duration-200 cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 focus:outline-none transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-white/5 bg-brand-bg/95 backdrop-blur-lg px-4 pt-2 pb-4 space-y-1 shadow-2xl"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-purple/20 to-brand-blue/20 border border-brand-purple/30 text-white shadow-inner shadow-brand-purple/10'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-brand-purple' : 'text-slate-400'}`} />
                    {item.name}
                  </>
                )}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
