import { Globe } from 'lucide-react';

const GithubIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const TwitterIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-brand-dark/40 py-8 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center text-white font-bold text-lg">
              W
            </div>
            <div>
              <span className="text-white font-semibold tracking-wide">Web3 Explorer</span>
              <p className="text-xs text-slate-500 mt-0.5">L2 Scaling & Fundamentals</p>
            </div>
          </div>

          {/* Social Links / Github placeholder */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200"
              title="GitHub Repository"
            >
              <GithubIcon className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200"
              title="Twitter"
            >
              <TwitterIcon className="w-5 h-5" />
            </a>
            <a
              href="https://arbitrum.io"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-slate-400 hover:text-brand-cyan hover:bg-white/5 transition-all duration-200"
              title="Arbitrum"
            >
              <Globe className="w-5 h-5" />
            </a>
          </div>

          {/* Batch & Copyright */}
          <div className="text-center md:text-right">
            <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple mb-2">
              Arbitrum Builder Labs - Batch 1
            </span>
            <p className="text-xs text-slate-500">
              &copy; {new Date().getFullYear()} Web3 Explorer. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
