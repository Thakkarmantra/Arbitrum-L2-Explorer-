import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Flame, Users, Clock, Zap, Wallet, 
  Shield, BarChart2, Code, Settings, CheckCircle2 
} from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export default function Home() {
  useSEO({
    title: 'Arbitrum L2 Explorer',
    description: 'Learn how Arbitrum Optimistic Rollups scale Ethereum Layer 1, providing ultra-low transaction fees and high performance speeds.'
  });

  // Animation configurations
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* 1. Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-4rem)]">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="flex flex-col gap-6"
        >
          {/* Small Badge */}
          <motion.div variants={fadeInUp} className="w-fit">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-brand-purple/10 border border-brand-purple/35 text-brand-purple glow-purple">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-ping" />
              Welcome to Web3 Explorer
            </span>
          </motion.div>

          {/* Large Heading */}
          <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Build Faster on <br />
            Ethereum with <span className="text-gradient-purple-cyan">Arbitrum</span>
          </motion.h1>

          {/* Short Description */}
          <motion.p variants={fadeInUp} className="text-lg text-slate-400 max-w-lg leading-relaxed">
            Arbitrum is a leading Layer 2 (L2) scaling solution that improves Ethereum by making transactions ultra-fast and significantly cheaper, all while fully inheriting Ethereum's robust security model.
          </motion.p>

          {/* Buttons */}
          <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 mt-2">
            <Link 
              to="/concepts" 
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue font-semibold text-white hover:brightness-110 active:scale-98 transition-all duration-200 shadow-lg shadow-brand-purple/20 gap-2"
            >
              Explore Concepts
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              to="/live-prices" 
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 active:scale-98 font-semibold text-white transition-all duration-200"
            >
              View Live Prices
            </Link>
          </motion.div>
        </motion.div>

        {/* Abstract SVG Illustration */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          className="relative flex justify-center lg:justify-end"
        >
          {/* Background Decorative Blur */}
          <div className="absolute w-72 h-72 rounded-full bg-brand-purple/20 blur-3xl -z-10 animate-pulse" />
          
          <svg className="w-full max-w-[460px] h-auto drop-shadow-2xl" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Hexagonal central node */}
            <path d="M250 80 L400 170 L400 330 L250 420 L100 330 L100 170 Z" fill="url(#hero-gradient)" fillOpacity="0.07" stroke="url(#stroke-gradient)" strokeWidth="2.5" />
            
            {/* Inner rotating connections */}
            <circle cx="250" cy="250" r="120" stroke="rgba(255, 255, 255, 0.08)" strokeDasharray="6 6" />
            <circle cx="250" cy="250" r="60" stroke="url(#stroke-gradient)" strokeWidth="1.5" strokeOpacity="0.5" />
            
            {/* Nodes */}
            <circle cx="250" cy="80" r="10" fill="#8b5cf6" className="animate-pulse" />
            <circle cx="400" cy="170" r="10" fill="#3b82f6" />
            <circle cx="400" cy="330" r="10" fill="#06b6d4" />
            <circle cx="250" cy="420" r="10" fill="#8b5cf6" />
            <circle cx="100" cy="330" r="10" fill="#3b82f6" />
            <circle cx="100" cy="170" r="10" fill="#06b6d4" />

            <circle cx="250" cy="250" r="24" fill="url(#core-gradient)" />
            <path d="M242 250 L250 240 L258 250 L250 260 Z" fill="white" />
            
            {/* Connecting lines */}
            <line x1="250" y1="80" x2="250" y2="226" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="1.5" />
            <line x1="100" y1="170" x2="226" y2="250" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1.5" />
            <line x1="400" y1="330" x2="274" y2="250" stroke="rgba(6, 182, 212, 0.3)" strokeWidth="1.5" />
            
            <defs>
              <linearGradient id="hero-gradient" x1="100" y1="80" x2="400" y2="420" gradientUnits="userSpaceOnUse">
                <stop stopColor="#8b5cf6" />
                <stop offset="1" stopColor="#3b82f6" />
              </linearGradient>
              <linearGradient id="stroke-gradient" x1="100" y1="80" x2="400" y2="420" gradientUnits="userSpaceOnUse">
                <stop stopColor="#8b5cf6" />
                <stop offset="0.5" stopColor="#3b82f6" />
                <stop offset="1" stopColor="#06b6d4" />
              </linearGradient>
              <linearGradient id="core-gradient" x1="226" y1="226" x2="274" y2="274" gradientUnits="userSpaceOnUse">
                <stop stopColor="#c084fc" />
                <stop offset="1" stopColor="#60a5fa" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      </section>

      {/* 2. Why Ethereum Needed Layer 2 */}
      <section className="w-full bg-slate-950/40 border-y border-white/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Why Ethereum Needed Layer 2
            </h2>
            <p className="text-slate-400 mt-4 leading-relaxed">
              Ethereum is the most secure and decentralized smart contract network in the world. However, its popularity has exposed critical scalability limits.
            </p>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Gas Fees Card */}
            <motion.div 
              variants={fadeInUp}
              className="glass-card p-8 rounded-2xl glow-purple hover:border-brand-purple/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple mb-6">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">High Gas Fees</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                When the network is busy, bidding wars for block space drive gas prices to astronomical levels, making minor transactions cost-prohibitive.
              </p>
            </motion.div>

            {/* Network Congestion Card */}
            <motion.div 
              variants={fadeInUp}
              className="glass-card p-8 rounded-2xl glow-blue hover:border-brand-blue/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Network Congestion</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Millions of users competing for the same limited computational resources creates massive backlogs, stalling execution times.
              </p>
            </motion.div>

            {/* Slow Speeds Card */}
            <motion.div 
              variants={fadeInUp}
              className="glass-card p-8 rounded-2xl glow-cyan hover:border-brand-cyan/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan mb-6">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Slow Speed</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Ethereum Layer 1 processes around 15 transactions per second. This speed is insufficient for global scaling of decentralized apps.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 3. What is Arbitrum? */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left column - Diagram */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative flex justify-center glass-card p-8 rounded-3xl overflow-hidden"
        >
          {/* Decorative Glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-purple/10 to-brand-blue/5 pointer-events-none" />
          
          <svg className="w-full max-w-[400px] h-auto" viewBox="0 0 400 350" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* L1 Block Container */}
            <rect x="50" y="240" width="300" height="70" rx="12" fill="rgba(30, 41, 59, 0.4)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="2" />
            <text x="200" y="280" fill="rgba(255,255,255,0.7)" fontSize="13" fontWeight="bold" textAnchor="middle">Ethereum Layer 1 (Security Settlement)</text>
            
            {/* L2 Block Container */}
            <rect x="50" y="40" width="300" height="70" rx="12" fill="url(#card-grad)" stroke="url(#stroke-grad)" strokeWidth="2" />
            <text x="200" y="80" fill="white" fontSize="13" fontWeight="bold" textAnchor="middle">Arbitrum Layer 2 (Off-Chain Engine)</text>
            
            {/* Arrow representation */}
            <g className="animate-bounce">
              <path d="M 120, 125 L 120, 220" stroke="url(#arrow-grad)" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 6" />
              <path d="M 115, 212 L 120, 220 L 125, 212" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </g>

            <g className="animate-bounce" style={{ animationDelay: '0.5s' }}>
              <path d="M 280, 220 L 280, 125" stroke="url(#arrow-grad-up)" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 6" />
              <path d="M 275, 133 L 280, 125 L 285, 133" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </g>

            {/* Labels on flows */}
            <rect x="65" y="145" width="110" height="30" rx="6" fill="#1e1b4b" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="1" />
            <text x="120" y="164" fill="#a78bfa" fontSize="9" fontWeight="semibold" textAnchor="middle">1. Bundles Proofs</text>

            <rect x="225" y="145" width="110" height="30" rx="6" fill="#172554" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1" />
            <text x="280" y="164" fill="#60a5fa" fontSize="9" fontWeight="semibold" textAnchor="middle">2. Fast UX Execution</text>

            <defs>
              <linearGradient id="card-grad" x1="50" y1="40" x2="350" y2="110" gradientUnits="userSpaceOnUse">
                <stop stopColor="rgba(139, 92, 246, 0.15)" />
                <stop offset="1" stopColor="rgba(59, 130, 246, 0.15)" />
              </linearGradient>
              <linearGradient id="stroke-grad" x1="50" y1="40" x2="350" y2="110" gradientUnits="userSpaceOnUse">
                <stop stopColor="#8b5cf6" />
                <stop offset="1" stopColor="#3b82f6" />
              </linearGradient>
              <linearGradient id="arrow-grad" x1="120" y1="125" x2="120" y2="220" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3b82f6" />
                <stop offset="1" stopColor="#8b5cf6" />
              </linearGradient>
              <linearGradient id="arrow-grad-up" x1="280" y1="220" x2="280" y2="125" gradientUnits="userSpaceOnUse">
                <stop stopColor="#8b5cf6" />
                <stop offset="1" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Right column - Content */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col gap-6"
        >
          <h2 className="text-3xl font-extrabold text-white leading-tight">
            How Arbitrum Solves Scaling
          </h2>
          <p className="text-slate-400 leading-relaxed">
            Arbitrum uses **Optimistic Rollup** technology to execute transactions outside of Ethereum's main layer. Instead of executing everything on Ethereum, transaction processing moves to a supercharged environment.
          </p>

          <div className="space-y-4 mt-2">
            {[
              'Processes transactions off-chain to achieve speeds up to 100x faster.',
              'Bundles (rolls up) multiple transactions into a single batch proof.',
              'Posts batch proofs back to Ethereum L1 to guarantee censorship resistance.',
              'Reduces transaction fees (gas costs) by up to 95%.',
              'Maintains complete decentralized trust with Ethereum L1 validation.'
            ].map((text, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-brand-cyan/15 border border-brand-cyan/35 flex items-center justify-center text-brand-cyan mt-1 flex-shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span className="text-slate-300 text-sm leading-relaxed">{text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 4. Benefits of Arbitrum */}
      <section className="w-full bg-slate-950/40 border-t border-white/5 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan mb-3">
              Core Technical Benefits
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Why Builders Prefer Arbitrum
            </h2>
            <p className="text-slate-400 mt-4 leading-relaxed text-sm">
              Discover the strategic features that make Arbitrum the premier platform for deploying Web3 dApps.
            </p>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {/* Card items */}
            {[
              { icon: Zap, title: 'Faster Transactions', desc: 'Experience instant confirmations. Arbitrum outputs response rates measured in milliseconds.', color: 'purple' },
              { icon: Wallet, title: 'Lower Gas Fees', desc: 'Execute complex contract interactions at a fraction of the native L1 transaction price.', color: 'blue' },
              { icon: Shield, title: 'Ethereum Security', desc: 'All records are final and settled on the Layer 1 chain. Your assets remain completely trustless.', color: 'cyan' },
              { icon: BarChart2, title: 'Better Scalability', desc: 'Ready for massive scaling. Handles large user demand without degradation or delays.', color: 'purple' },
              { icon: Code, title: 'Developer Friendly', desc: 'Deploy easily using normal solidity tooling like Hardhat, Foundry, Remix, and Truffle.', color: 'blue' },
              { icon: Settings, title: 'EVM Compatible', desc: 'Identical API structures and bytecode execution to Ethereum, requiring zero code adjustments.', color: 'cyan' }
            ].map((benefit, idx) => {
              const Icon = benefit.icon;
              const shadowClass = benefit.color === 'purple' ? 'hover:shadow-brand-purple/10 glow-purple' : benefit.color === 'blue' ? 'hover:shadow-brand-blue/10 glow-blue' : 'hover:shadow-brand-cyan/10 glow-cyan';
              const borderClass = benefit.color === 'purple' ? 'hover:border-brand-purple/40' : benefit.color === 'blue' ? 'hover:border-brand-blue/40' : 'hover:border-brand-cyan/40';
              const iconBgClass = benefit.color === 'purple' ? 'bg-brand-purple/10 text-brand-purple' : benefit.color === 'blue' ? 'bg-brand-blue/10 text-brand-blue' : 'bg-brand-cyan/10 text-brand-cyan';
              
              return (
                <motion.div 
                  key={idx}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.03, y: -4 }}
                  className={`glass-card p-8 rounded-2xl border border-white/5 transition-all duration-300 cursor-default ${shadowClass} ${borderClass}`}
                >
                  <div className={`w-11 h-11 rounded-lg flex items-center justify-center mb-5 ${iconBgClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{benefit.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* 5. How It Works (Timeline) */}
      <section className="w-full py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Transaction Lifecycle on Arbitrum
            </h2>
            <p className="text-slate-400 mt-4 leading-relaxed">
              Trace how your actions migrate from your Web3 wallet down to final verification on the Ethereum blockchain.
            </p>
          </div>

          {/* Horizontal / Vertical Timeline */}
          <div className="relative">
            {/* Horizontal timeline line (Hidden on mobile, block on lg) */}
            <div className="hidden lg:block absolute top-[44px] left-[5%] right-[5%] h-0.5 bg-gradient-to-r from-brand-purple via-brand-blue to-brand-cyan opacity-20" />
            
            {/* Vertical timeline line (Mobile/MD only) */}
            <div className="lg:hidden absolute left-[31px] top-1 bottom-1 w-0.5 bg-gradient-to-b from-brand-purple via-brand-blue to-brand-cyan opacity-20" />

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={staggerContainer}
              className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-6 relative"
            >
              {[
                { step: '1', title: 'User Initiates', desc: 'You trigger a transaction inside your Wallet (e.g. MetaMask) targeted to Arbitrum L2.' },
                { step: '2', title: 'Sequencer Processes', desc: 'The Arbitrum Sequencer instantly sorts and executes the instruction off-chain.' },
                { step: '3', title: 'L2 Finality Received', desc: 'The UI displays instant confirmation within milliseconds. The UX is complete.' },
                { step: '4', title: 'Proof Dispatched', desc: 'Transactions are rolled up and sent as an optimistic batch proof to Ethereum L1.' },
                { step: '5', title: 'Settled on Ethereum', desc: 'The proof settles on L1, securing the transaction under Ethereum’s security blanket.' }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  variants={fadeInUp}
                  className="flex lg:flex-col items-start lg:items-center text-left lg:text-center gap-4 lg:gap-6"
                >
                  {/* Number bubble */}
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 border-2 border-brand-purple flex items-center justify-center font-bold text-lg text-white glow-purple z-10 flex-shrink-0 select-none">
                    {item.step}
                  </div>
                  
                  {/* Content block */}
                  <div className="flex flex-col lg:items-center">
                    <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-slate-400 text-xs leading-relaxed max-w-[200px] lg:mx-auto">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. Call To Action */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full glass-card p-12 sm:p-16 rounded-3xl text-center relative overflow-hidden glow-purple"
        >
          {/* Accent decoration */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand-purple/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-brand-blue/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative max-w-2xl mx-auto flex flex-col items-center gap-6 z-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
              Ready to Explore Web3?
            </h2>
            <p className="text-slate-300 leading-relaxed max-w-lg">
              Unlock the secrets of decentralized architecture, learn cryptographic keys, and keep track of live blockchain tokens.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mt-4">
              <Link 
                to="/concepts" 
                className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue font-semibold text-white hover:brightness-110 active:scale-98 transition-all duration-200"
              >
                Learn Concepts
              </Link>
              <Link 
                to="/live-prices" 
                className="inline-flex items-center px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 active:scale-98 font-semibold text-slate-200 hover:text-white transition-all duration-200"
              >
                Track Live Prices
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
