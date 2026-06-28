import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, HelpCircle, Key, Cpu, ShieldCheck, 
  Award, RefreshCw, Layers, Zap, Info 
} from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

const COMPARISONS = [
  {
    id: 'web2-web3',
    title: 'Web2 vs Web3',
    subtitle: 'Control, Ownership & Identity Paradigms',
    icon: Layers,
    color: 'purple',
    left: {
      title: 'Web2 (The Platform Era)',
      colorClass: 'text-brand-purple',
      items: [
        { label: 'Ownership', text: 'Large corporations own customer data.' },
        { label: 'Control', text: 'Centralized platforms control applications & policy.' },
        { label: 'Data Storage', text: 'Central databases (e.g. AWS, GCP).' },
        { label: 'Authentication', text: 'Username, password, SSO (Google/Facebook).' },
        { label: 'Payments', text: 'Credit cards, PayPal (clearing houses).' },
        { label: 'Transparency', text: 'Closed proprietary source, private transactions.' },
        { label: 'Examples', text: 'Facebook, YouTube, Spotify, Google.' },
      ]
    },
    right: {
      title: 'Web3 (The Ownership Era)',
      colorClass: 'text-brand-cyan',
      items: [
        { label: 'Ownership', text: 'Users own data and assets using crypto tokens.' },
        { label: 'Control', text: 'Decentralized communities manage networks (DAOs).' },
        { label: 'Data Storage', text: 'Distributed ledgers (Blockchain, IPFS).' },
        { label: 'Authentication', text: 'Cryptographic wallet keys (Self-Custody).' },
        { label: 'Payments', text: 'Peer-to-peer crypto transfers (Zero intermediaries).' },
        { label: 'Transparency', text: 'Open source protocols, verifiable on-chain history.' },
        { label: 'Examples', text: 'Uniswap, Aave, Decentraland, Gnosis.' },
      ]
    }
  },
  {
    id: 'eth-btc',
    title: 'Ethereum vs Bitcoin',
    subtitle: 'Asset Store vs Global Computing Machine',
    icon: Zap,
    color: 'blue',
    left: {
      title: 'Bitcoin (Digital Gold)',
      colorClass: 'text-amber-500',
      items: [
        { label: 'Purpose', text: 'Store of value, digital sound money.' },
        { label: 'Launch Year', text: '2009 by Satoshi Nakamoto.' },
        { label: 'Consensus', text: 'Proof of Work (PoW - mining).' },
        { label: 'Smart Contracts', text: 'Very limited (basic script execution).' },
        { label: 'Tx Speed', text: '~10 minutes per block.' },
        { label: 'Main Use Case', text: 'Inflation hedge, asset settlement.' },
        { label: 'Native Token', text: 'BTC.' },
      ]
    },
    right: {
      title: 'Ethereum (Global Supercomputer)',
      colorClass: 'text-indigo-400',
      items: [
        { label: 'Purpose', text: 'Smart contract network for building decentralized apps.' },
        { label: 'Launch Year', text: '2015 by Vitalik Buterin & co-founders.' },
        { label: 'Consensus', text: 'Proof of Stake (PoS - staking).' },
        { label: 'Smart Contracts', text: 'Turing-complete programmable code.' },
        { label: 'Tx Speed', text: '~12 seconds per block (much faster on L2).' },
        { label: 'Main Use Case', text: 'DeFi, NFTs, DAOs, scalable L2 ecosystems.' },
        { label: 'Native Token', text: 'ETH.' },
      ]
    }
  },
  {
    id: 'keys',
    title: 'Public Key vs Private Key',
    subtitle: 'Asymmetric Cryptography Simplified',
    icon: Key,
    color: 'cyan',
    left: {
      title: 'Public Key (Your Mailbox)',
      colorClass: 'text-brand-cyan',
      items: [
        { label: 'Definition', text: 'The alphanumeric wallet address derived from private key.' },
        { label: 'Visibility', text: 'Publicly visible on search block explorers.' },
        { label: 'Purpose', text: 'Share it to receive funds and query wallet balances.' },
        { label: 'Security', text: 'Safe to share; cannot steal assets.' },
        { label: 'Example', text: '0x71C...B29' },
        { label: 'Best Practice', text: 'Double-check characters before sharing.' },
      ]
    },
    right: {
      title: 'Private Key (Your Mailbox Key)',
      colorClass: 'text-rose-400',
      items: [
        { label: 'Definition', text: 'Cryptographic password that controls the public address.' },
        { label: 'Visibility', text: 'Hidden. Keep offline and written down.' },
        { label: 'Purpose', text: 'Authorizes and digitally signs transactions to transfer assets.' },
        { label: 'Security', text: 'Sharing it gives instant access to empty your wallet.' },
        { label: 'Example', text: '64-character hex string or 12-word seed phrase' },
        { label: 'Best Practice', text: 'Store offline on paper. NEVER enter on unsecured sites.' },
      ]
    }
  },
  {
    id: 'db-blockchain',
    title: 'Blockchain vs Traditional Database',
    subtitle: 'Distributed Ledgers vs Centrally Managed Storage',
    icon: Cpu,
    color: 'purple',
    left: {
      title: 'Traditional Database (e.g. SQL, NoSQL)',
      colorClass: 'text-slate-400',
      items: [
        { label: 'Ownership', text: 'Owned and operated by a single admin entity.' },
        { label: 'Data Modification', text: 'CRUD (Create, Read, Update, Delete) permissions.' },
        { label: 'Transparency', text: 'Private logs; users cannot audit history directly.' },
        { label: 'Security', text: 'Secured by firewalls; a compromised admin token risks all data.' },
        { label: 'Performance', text: 'High performance (millions of ops/sec).' },
        { label: 'Use Cases', text: 'Banking software, user profiles, asset catalogs.' },
        { label: 'Examples', text: 'PostgreSQL, MongoDB, DynamoDB.' },
      ]
    },
    right: {
      title: 'Blockchain Ledger (Decentralized Network)',
      colorClass: 'text-brand-purple',
      items: [
        { label: 'Ownership', text: 'Shared collaboratively among global validator nodes.' },
        { label: 'Data Modification', text: 'Append-only (Add transactions; updates require consensus).' },
        { label: 'Transparency', text: '100% public transparency and direct user verification.' },
        { label: 'Security', text: 'Cryptographic consensus. Immutability guaranteed.' },
        { label: 'Performance', text: 'Slower processing throughput (scales using L2).' },
        { label: 'Use Cases', text: 'Financial tokens, tokenized assets, verifiable voting.' },
        { label: 'Examples', text: 'Ethereum, Arbitrum, Solana.' },
      ]
    }
  }
];

// Highlight component wrapping matching text segments
function HighlightText({ text, search }) {
  if (!search) return <>{text}</>;
  const parts = text.split(new RegExp(`(${search.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi'));
  return (
    <>
      {parts.map((part, index) => 
        part.toLowerCase() === search.toLowerCase() ? (
          <mark key={index} className="bg-brand-purple/35 text-white rounded-sm px-0.5 font-bold">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

export default function Concepts() {
  const [searchQuery, setSearchQuery] = useState('');
  useSEO({
    title: 'Web3 & Blockchain Concepts',
    description: 'Learn foundational Web3 topics including Web2 vs Web3, Bitcoin vs Ethereum smart contracts, public keys vs private keys, and traditional databases vs blockchain ledgers.'
  });
  
  // Animation configs
  const fadeInUp = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { children: 0.1 }
    }
  };

  // Quiz State
  const quizQuestions = [
    {
      id: 1,
      question: "Which blockchain natively supports smart contracts?",
      options: ["Bitcoin", "Ethereum", "Both", "None"],
      answer: "Ethereum",
      explanation: "Ethereum was specifically designed to support smart contracts—self-executing code stored on the blockchain. Bitcoin is optimized as a store of value and peer-to-peer cash transfer system."
    },
    {
      id: 2,
      question: "What is the primary characteristic of Web3 compared to Web2?",
      options: ["Centralized ownership", "Ad-supported revenue model", "User ownership of data & digital assets", "Faster search engines"],
      answer: "User ownership of data & digital assets",
      explanation: "While Web2 is characterized by central platforms controlling user data, Web3 returns ownership and sovereignty to the users via cryptographic tokens and decentralized ledgers."
    },
    {
      id: 3,
      question: "Which key is used to sign transactions and must NEVER be shared?",
      options: ["Public Key", "Private Key", "Both Keys", "Neither Key"],
      answer: "Private Key",
      explanation: "Your private key acts as your cryptographic signature and password. Anyone who holds your private key has complete, irreversible control over your assets. The public key is safe to share (like an IBAN/account number)."
    },
    {
      id: 4,
      question: "Which system allows writing and modifying data historically without consensus?",
      options: ["Decentralized Blockchain", "Traditional Database", "Both", "None"],
      answer: "Traditional Database",
      explanation: "In a traditional database, administrators have write/delete permissions and can alter history at will. Blockchains are append-only; historical blocks cannot be changed without consensus among validators."
    }
  ];

  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelectOption = (questionId, option) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const handleSubmitQuiz = (e) => {
    e.preventDefault();
    if (Object.keys(selectedAnswers).length < quizQuestions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }
    let computedScore = 0;
    quizQuestions.forEach(q => {
      if (selectedAnswers[q.id] === q.answer) {
        computedScore += 1;
      }
    });
    setScore(computedScore);
    setSubmitted(true);
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  // Filter comparisons based on search query
  const filteredComparisons = COMPARISONS.filter(comp => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return comp.title.toLowerCase().includes(q) ||
           comp.subtitle.toLowerCase().includes(q) ||
           comp.left.title.toLowerCase().includes(q) ||
           comp.right.title.toLowerCase().includes(q) ||
           comp.left.items.some(item => item.label.toLowerCase().includes(q) || item.text.toLowerCase().includes(q)) ||
           comp.right.items.some(item => item.label.toLowerCase().includes(q) || item.text.toLowerCase().includes(q));
  });

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* 1. Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="flex flex-col gap-5"
        >
          <motion.div variants={fadeInUp} className="w-fit">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-purple/10 border border-brand-purple/30 text-brand-purple glow-purple">
              <BookOpen className="w-3.5 h-3.5" />
              Learn Web3 Concepts
            </span>
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Understand the <br />
            Fundamentals of <span className="text-gradient">Web3</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-lg text-slate-400 max-w-lg leading-relaxed">
            Gain a clear, conceptual understanding of the revolutionary design paradigms behind decentralized applications, blockchain ledgers, and token networks.
          </motion.p>
        </motion.div>

        {/* Right side - Abstract Illustration */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative flex justify-center lg:justify-end"
        >
          <div className="absolute w-60 h-60 rounded-full bg-brand-blue/15 blur-3xl -z-10 animate-pulse" />
          
          <svg className="w-full max-w-[400px] h-auto" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="200" cy="200" r="150" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="2" />
            <circle cx="200" cy="200" r="100" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="2" />
            
            <g className="animate-bounce" style={{ animationDuration: '4s' }}>
              <rect x="150" y="150" width="100" height="100" rx="16" fill="url(#ledger-grad)" stroke="#8b5cf6" strokeWidth="2" />
              <Layers className="w-10 h-10 text-white absolute" style={{ transform: 'translate(180px, 180px)' }} />
            </g>

            <g className="animate-pulse">
              <circle cx="70" cy="110" r="28" fill="rgba(59, 130, 246, 0.15)" stroke="#3b82f6" strokeWidth="2" />
              <text x="70" y="114" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">Web3</text>

              <circle cx="330" cy="110" r="28" fill="rgba(6, 182, 212, 0.15)" stroke="#06b6d4" strokeWidth="2" />
              <text x="330" y="114" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">Keys</text>

              <circle cx="200" cy="330" r="28" fill="rgba(168, 85, 247, 0.15)" stroke="#a855f7" strokeWidth="2" />
              <text x="200" y="334" fill="white" fontSize="10" fontWeight="bold" textAnchor="middle">L2</text>
            </g>

            <path d="M 98,125 L 160,170" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 4" />
            <path d="M 302,125 L 240,170" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 4" />
            <path d="M 200,302 L 200,250" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 4" />

            <defs>
              <linearGradient id="ledger-grad" x1="150" y1="150" x2="250" y2="250" gradientUnits="userSpaceOnUse">
                <stop stopColor="#8b5cf6" stopOpacity="0.2" />
                <stop offset="1" stopColor="#3b82f6" stopOpacity="0.2" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      </section>

      {/* 2. Comparison Cards */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-8">
        
        {/* Header containing real-time search bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5 pb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-white">Visual Breakdown of Key Techs</h2>
            <p className="text-slate-400 mt-2 text-sm leading-relaxed">
              Side-by-side core structural differences mapping out Web3 paradigm shifts.
            </p>
          </div>
          <div className="w-full md:w-80 flex-shrink-0">
            <input
              type="text"
              placeholder="Search concepts (e.g. private key, DAO)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/60 border border-white/10 hover:border-white/20 focus:border-brand-purple/50 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none transition-all duration-200"
              aria-label="Search concept comparisons"
            />
          </div>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="grid grid-cols-1 gap-10"
        >
          {filteredComparisons.map((comp) => {
            const Icon = comp.icon;
            const glowClass = comp.color === 'purple' ? 'glow-purple' : comp.color === 'blue' ? 'glow-blue' : 'glow-cyan';
            return (
              <motion.div 
                key={comp.id}
                variants={fadeInUp} 
                layout
                className={`glass-card rounded-3xl p-8 sm:p-10 border border-white/5 transition-all duration-300 ${glowClass}`}
              >
                {/* Header */}
                <div className="flex items-center gap-3 border-b border-white/5 pb-6 mb-6">
                  <div className={`w-10 h-10 rounded-lg bg-brand-${comp.color}/10 flex items-center justify-center text-brand-${comp.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      <HighlightText text={comp.title} search={searchQuery} />
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      <HighlightText text={comp.subtitle} search={searchQuery} />
                    </p>
                  </div>
                </div>

                {/* Split Columns comparison content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                  {/* Left Column */}
                  <div className="bg-slate-900/35 border border-white/5 p-6 rounded-2xl">
                    <h4 className={`${comp.left.colorClass} font-semibold mb-4 text-base`}>
                      <HighlightText text={comp.left.title} search={searchQuery} />
                    </h4>
                    <ul className="space-y-4">
                      {comp.left.items.map((item, idx) => (
                        <li key={idx}>
                          <strong className="text-slate-300">
                            <HighlightText text={item.label} search={searchQuery} />:
                          </strong>{' '}
                          <span className="text-slate-400">
                            <HighlightText text={item.text} search={searchQuery} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right Column */}
                  <div className="bg-slate-900/35 border border-white/5 p-6 rounded-2xl">
                    <h4 className={`${comp.right.colorClass} font-semibold mb-4 text-base`}>
                      <HighlightText text={comp.right.title} search={searchQuery} />
                    </h4>
                    <ul className="space-y-4">
                      {comp.right.items.map((item, idx) => (
                        <li key={idx}>
                          <strong className="text-slate-300">
                            <HighlightText text={item.label} search={searchQuery} />:
                          </strong>{' '}
                          <span className="text-slate-400">
                            <HighlightText text={item.text} search={searchQuery} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {filteredComparisons.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card rounded-2xl p-12 text-center text-slate-400 border border-white/5"
            >
              No concepts found matching "{searchQuery}"
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* 3. Key Takeaways Section */}
      <section className="w-full bg-slate-950/40 border-y border-white/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white">Web3 Key Takeaways</h2>
            <p className="text-slate-400 mt-4 leading-relaxed text-sm">
              Keep these foundational truths in mind as you explore the blockchain environment.
            </p>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { title: 'Blockchain is Decentralized', desc: 'No single centralized server governs or owns the records. Power is spread across global computers.', icon: ShieldCheck, color: 'purple' },
              { title: 'Ethereum Supports Smart Contracts', desc: 'Allows developers to write self-executing agreements that run automatically without trust issues.', icon: Cpu, color: 'blue' },
              { title: 'Keep Private Keys Secret', desc: 'Your private key is your absolute wallet lock. Never share it with anyone, websites, or extensions.', icon: Key, color: 'cyan' },
              { title: 'Web3 Gives Users Ownership', desc: 'Your profile, tokens, and data belong to your wallet address, not centralized SaaS corporations.', icon: Award, color: 'purple' }
            ].map((takeaway, idx) => {
              const Icon = takeaway.icon;
              const accentColor = takeaway.color === 'purple' ? 'text-brand-purple bg-brand-purple/10 border-brand-purple/20' : takeaway.color === 'blue' ? 'text-brand-blue bg-brand-blue/10 border-brand-blue/20' : 'text-brand-cyan bg-brand-cyan/10 border-brand-cyan/20';
              return (
                <motion.div 
                  key={idx}
                  variants={fadeInUp}
                  className="glass-card p-6 rounded-2xl flex flex-col gap-4 border border-white/5 hover:border-white/10 transition-colors duration-300"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${accentColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-white text-base leading-snug">{takeaway.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{takeaway.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* 4. Interactive Quick Quiz */}
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card rounded-3xl p-8 sm:p-12 border border-white/5 glow-purple"
        >
          <div className="text-center max-w-xl mx-auto mb-10">
            <div className="w-12 h-12 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple mx-auto mb-4">
              <HelpCircle className="w-6 h-6 animate-pulse" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Web3 Interactive Quiz</h2>
            <p className="text-slate-400 mt-2 text-sm leading-relaxed">
              Validate your blockchain knowledge instantly by answering these 4 fundamental questions.
            </p>
          </div>

          <form onSubmit={handleSubmitQuiz} className="space-y-8">
            {quizQuestions.map((q, idx) => (
              <div key={q.id} className="border-b border-white/5 pb-6 last:border-0 last:pb-0">
                <h3 className="text-white font-semibold text-base mb-4 flex items-start gap-2.5">
                  <span className="text-brand-purple text-sm font-bold bg-brand-purple/10 border border-brand-purple/25 rounded-md px-1.5 py-0.5 mt-0.5">
                    Q{idx+1}
                  </span>
                  {q.question}
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {q.options.map((option) => {
                    const isSelected = selectedAnswers[q.id] === option;
                    const isCorrect = q.answer === option;
                    const showSuccess = submitted && isCorrect;
                    const showFailure = submitted && isSelected && !isCorrect;
                    
                    let cardStyle = "bg-white/3 border-white/5 text-slate-300 hover:bg-white/5 hover:border-white/10";
                    if (isSelected) {
                      cardStyle = "bg-brand-purple/15 border-brand-purple/50 text-white";
                    }
                    if (submitted) {
                      if (showSuccess) {
                        cardStyle = "bg-emerald-500/20 border-emerald-500/40 text-emerald-200";
                      } else if (showFailure) {
                        cardStyle = "bg-rose-500/20 border-rose-500/40 text-rose-200";
                      } else {
                        cardStyle = "bg-white/2 border-white/3 text-slate-500 pointer-events-none";
                      }
                    }

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleSelectOption(q.id, option)}
                        className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all duration-200 flex items-center justify-between cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:outline-none ${cardStyle}`}
                        disabled={submitted}
                      >
                        {option}
                        {isSelected && !submitted && (
                          <div className="w-2.5 h-2.5 rounded-full bg-brand-purple shadow-sm shadow-brand-purple" />
                        )}
                        {submitted && isCorrect && (
                          <span className="text-emerald-400 font-bold text-xs">✓ Correct</span>
                        )}
                        {submitted && isSelected && !isCorrect && (
                          <span className="text-rose-400 font-bold text-xs">✗ Incorrect</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {submitted && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 p-4 rounded-xl bg-slate-900/40 border border-white/5 text-slate-400 text-xs leading-relaxed flex gap-2"
                  >
                    <Info className="w-4 h-4 text-brand-purple flex-shrink-0 mt-0.5" />
                    <p>
                      <strong>Explanation: </strong>
                      {q.explanation}
                    </p>
                  </motion.div>
                )}
              </div>
            ))}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-white/5">
              {!submitted ? (
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue font-bold text-white hover:brightness-110 active:scale-98 transition-all duration-200 text-sm cursor-pointer"
                >
                  Submit Answers
                </button>
              ) : (
                <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center font-bold text-white">
                      {score}/4
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {score === 4 ? "Perfect Score! 🌟" : score >= 2 ? "Good job! 👍" : "Keep learning! 📚"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {score === 4 ? "You are ready for the block simulator!" : "Review the comparisons above and try again."}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetQuiz}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 active:scale-98 text-white text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset Quiz
                  </button>
                </div>
              )}
            </div>
          </form>
        </motion.div>
      </section>

    </div>
  );
}
