import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, RotateCcw, ShieldAlert, ShieldCheck, 
  Layers, ArrowDown, CheckCircle, RefreshCw,
  Copy, Download, BarChart2
} from 'lucide-react';
import { useToast } from '../context/AppContext';
import { useSEO } from '../hooks/useSEO';

const sha256 = async (message) => {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const DEFAULT_PREV_HASH = '00000000000000000000000000000000';

export default function BlockSimulator() {
  useSEO({
    title: 'Blockchain Block Simulator',
    description: 'Simulate blockchain Proof of Work mining, nonce search, SHA-256 hash validation, and watch how block data modification breaks chain immutability.'
  });

  const showToast = useToast();

  // Block 1 State
  const [b1Data, setB1Data] = useState('Arbitrum Layer 2 Genesis Data');
  const [b1Nonce, setB1Nonce] = useState(0);
  const [b1Hash, setB1Hash] = useState('');
  const [b1Mining, setB1Mining] = useState(false);
  const [b1Mined, setB1Mined] = useState(false);
  const [b1MineTime, setB1MineTime] = useState(null);

  // Block 2 State
  const [b2Data, setB2Data] = useState('Transaction batch #1 rolled up');
  const [b2Nonce, setB2Nonce] = useState(0);
  const [b2Hash, setB2Hash] = useState('');
  const [b2Mining, setB2Mining] = useState(false);
  const [b2Mined, setB2Mined] = useState(false);
  const [b2MineTime, setB2MineTime] = useState(null);
  const [b2MinedPreviousHash, setB2MinedPreviousHash] = useState('');

  // Persistent Statistics State (Saved in LocalStorage)
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('block_mining_stats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      totalMined: 0,
      successfulMines: 0,
      mineTimes: [],
      lastMinedTimestamp: null
    };
  });

  // Save stats to localStorage when changed
  useEffect(() => {
    localStorage.setItem('block_mining_stats', JSON.stringify(stats));
  }, [stats]);

  // Update hashes on inputs changed
  useEffect(() => {
    let active = true;
    const updateHash = async () => {
      const inputStr = `1${b1Nonce}${b1Data}${DEFAULT_PREV_HASH}`;
      const hash = await sha256(inputStr);
      if (active) {
        setB1Hash(hash);
        if (!hash.startsWith('00')) {
          setB1Mined(false);
        }
      }
    };
    updateHash();
    return () => { active = false; };
  }, [b1Data, b1Nonce]);

  useEffect(() => {
    let active = true;
    const updateHash = async () => {
      const inputStr = `2${b2Nonce}${b2Data}${b1Hash}`;
      const hash = await sha256(inputStr);
      if (active) {
        setB2Hash(hash);
        if (!hash.startsWith('00')) {
          setB2Mined(false);
        }
      }
    };
    updateHash();
    return () => { active = false; };
  }, [b2Data, b2Nonce, b1Hash]);

  // Record mining stats helper
  const recordMiningSuccess = (timeSeconds) => {
    const numTime = parseFloat(timeSeconds);
    setStats(prev => ({
      totalMined: prev.totalMined + 1,
      successfulMines: prev.successfulMines + 1,
      mineTimes: [...prev.mineTimes, numTime],
      lastMinedTimestamp: new Date().toLocaleTimeString()
    }));
  };

  // Mine Block 1
  const mineBlock1 = async () => {
    if (!b1Data.trim()) return;
    setB1Mining(true);
    setB1MineTime(null);
    const startTime = performance.now();
    let currentNonce = 0;
    
    const runMining = async () => {
      for (let i = 0; i < 50; i++) {
        const inputStr = `1${currentNonce}${b1Data}${DEFAULT_PREV_HASH}`;
        const hash = await sha256(inputStr);
        if (hash.startsWith('00')) {
          const endTime = performance.now();
          const duration = ((endTime - startTime) / 1000).toFixed(3);
          setB1Nonce(currentNonce);
          setB1Hash(hash);
          setB1Mined(true);
          setB1Mining(false);
          setB1MineTime(duration);
          recordMiningSuccess(duration);
          showToast('Block #1 mined successfully', 'success');
          return;
        }
        currentNonce++;
      }
      setB1Nonce(currentNonce);
      setTimeout(runMining, 5);
    };

    runMining();
  };

  // Mine Block 2
  const mineBlock2 = async () => {
    if (!b2Data.trim()) return;
    setB2Mining(true);
    setB2MineTime(null);
    const startTime = performance.now();
    let currentNonce = 0;
    const b1CurrentHash = b1Hash;

    const runMining = async () => {
      for (let i = 0; i < 50; i++) {
        const inputStr = `2${currentNonce}${b2Data}${b1CurrentHash}`;
        const hash = await sha256(inputStr);
        if (hash.startsWith('00')) {
          const endTime = performance.now();
          const duration = ((endTime - startTime) / 1000).toFixed(3);
          setB2Nonce(currentNonce);
          setB2Hash(hash);
          setB2MinedPreviousHash(b1CurrentHash);
          setB2Mined(true);
          setB2Mining(false);
          setB2MineTime(duration);
          recordMiningSuccess(duration);
          showToast('Block #2 mined successfully', 'success');
          return;
        }
        currentNonce++;
      }
      setB2Nonce(currentNonce);
      setTimeout(runMining, 5);
    };

    runMining();
  };

  // Keyboard shortcut listener to trigger mining
  useEffect(() => {
    const handleShortcutMine = () => {
      if (b1Mining || b2Mining) return;
      // If Block 1 is unmined, mine Block 1. Otherwise mine Block 2.
      if (!b1Mined) {
        showToast('Shortcut: Mining Block 1', 'info');
        mineBlock1();
      } else if (!b2Mined) {
        showToast('Shortcut: Mining Block 2', 'info');
        mineBlock2();
      } else {
        showToast('Both blocks are already mined', 'info');
      }
    };

    window.addEventListener('trigger-mine-block', handleShortcutMine);
    return () => window.removeEventListener('trigger-mine-block', handleShortcutMine);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [b1Mined, b2Mined, b1Mining, b2Mining]);

  // Copy Hash triggers
  const copyToClipboard = (hashText, label) => {
    if (!hashText) return;
    navigator.clipboard.writeText(hashText);
    showToast(`${label} copied to clipboard`, 'success');
  };

  // Export Mined Block schema in JSON
  const exportBlockJSON = (blockNum, blockData, prevHash, nonce, genHash) => {
    const blockObject = {
      blockNumber: blockNum,
      blockData,
      previousHash: prevHash,
      nonce,
      hash: genHash,
      timestamp: new Date().toISOString()
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(blockObject, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `block_${blockNum}_export.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(`Block #${blockNum} exported as JSON`, 'success');
  };

  const resetB1 = () => {
    setB1Data('Arbitrum Layer 2 Genesis Data');
    setB1Nonce(0);
    setB1Mined(false);
    setB1MineTime(null);
    showToast('Block #1 Reset', 'info');
  };

  const resetB2 = () => {
    setB2Data('Transaction batch #1 rolled up');
    setB2Nonce(0);
    setB2Mined(false);
    setB2MinedPreviousHash('');
    setB2MineTime(null);
    showToast('Block #2 Reset', 'info');
  };

  // Validation Flags
  const isBlock1Valid = b1Hash.startsWith('00');
  const isChainBroken = b2Mined && b2MinedPreviousHash !== b1Hash;
  const isBlock2Valid = b2Hash.startsWith('00') && !isChainBroken;
  const isCompleteChainValid = isBlock1Valid && isBlock2Valid && !isChainBroken;

  // Calculate Average Mining Duration
  const getAverageMineTime = () => {
    if (stats.mineTimes.length === 0) return '0.000';
    const sum = stats.mineTimes.reduce((acc, t) => acc + t, 0);
    return (sum / stats.mineTimes.length).toFixed(3);
  };

  return (
    <div className="w-full flex-grow flex flex-col py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* 1. Hero Section */}
      <section className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center gap-4">
        <div className="w-fit">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-purple/10 border border-brand-purple/30 text-brand-purple glow-purple">
            <Cpu className="w-3.5 h-3.5" />
            ⛏ Blockchain Mining Simulator
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
          Understand How Blockchain Mining Works
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Experiment with block parameters, trigger cryptographic hashes, mine nonces, and witness how altering block data breaks validation immediately.
        </p>
      </section>

      {/* 2. Interactive Blocks Cards */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        
        {/* BLOCK 1 CARD */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`glass-card p-6 sm:p-8 rounded-3xl border transition-all duration-300 relative ${
            isBlock1Valid 
              ? 'border-emerald-500/20 shadow-lg shadow-emerald-500/3' 
              : 'border-white/5 shadow-inner'
          }`}
        >
          <div className="absolute top-6 right-6">
            {isBlock1Valid ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" /> Valid
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-slate-500/10 border border-white/5 text-slate-400">
                <ShieldAlert className="w-3.5 h-3.5" /> Unmined
              </span>
            )}
          </div>

          <h2 className="text-xl font-bold text-white mb-6">Block #1</h2>

          <div className="space-y-5">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Block Data</label>
              <textarea
                value={b1Data}
                onChange={(e) => setB1Data(e.target.value)}
                disabled={b1Mining}
                className="w-full bg-slate-950/60 border border-white/5 hover:border-white/10 focus:border-brand-purple/50 rounded-xl px-4 py-3 text-slate-200 text-sm focus:outline-none transition-all duration-200 h-20 resize-none"
                placeholder="Enter block data transactions..."
              />
              {!b1Data.trim() && (
                <span className="text-rose-400 text-2xs font-semibold">⚠ Block data cannot be empty.</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Previous Hash</label>
              <input
                type="text"
                value={DEFAULT_PREV_HASH}
                readOnly
                className="w-full bg-slate-950/20 border border-white/5 text-slate-600 rounded-xl px-4 py-2.5 text-xs focus:outline-none select-none font-mono"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Nonce</label>
              <input
                type="number"
                value={b1Nonce}
                onChange={(e) => setB1Nonce(parseInt(e.target.value) || 0)}
                disabled={b1Mining}
                className="w-full bg-slate-950/60 border border-white/5 hover:border-white/10 focus:border-brand-purple/50 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none transition-all duration-200 font-mono"
              />
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <div className="flex justify-between items-center">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Generated SHA-256 Hash</label>
                <button
                  onClick={() => copyToClipboard(b1Hash, 'Block 1 Hash')}
                  className="inline-flex items-center gap-1 text-2xs font-bold text-slate-500 hover:text-brand-purple transition-colors duration-200 cursor-pointer"
                  title="Copy Hash"
                >
                  <Copy className="w-3 h-3" /> Copy
                </button>
              </div>
              <div 
                className={`w-full bg-slate-950/60 border border-white/5 px-4 py-3 rounded-xl font-mono text-xs select-all break-all transition-all duration-300 ${
                  isBlock1Valid ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {b1Hash || 'Calculating...'}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/5">
              <button
                onClick={mineBlock1}
                disabled={b1Mining || !b1Data.trim()}
                className="flex-grow inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue hover:brightness-110 disabled:opacity-40 text-white font-bold text-sm transition-all duration-200 cursor-pointer active:scale-98"
              >
                {b1Mining ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Mining (Nonce: {b1Nonce})
                  </>
                ) : (
                  'Mine Block'
                )}
              </button>
              <button
                onClick={resetB1}
                disabled={b1Mining}
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 hover:text-white transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 text-sm"
              >
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
              {isBlock1Valid && (
                <button
                  onClick={() => exportBlockJSON(1, b1Data, DEFAULT_PREV_HASH, b1Nonce, b1Hash)}
                  className="px-4 py-3 rounded-xl bg-brand-purple/10 border border-brand-purple/20 hover:bg-brand-purple/20 text-brand-purple transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 text-sm"
                  title="Export block data to JSON file"
                >
                  <Download className="w-4 h-4" /> Export
                </button>
              )}
            </div>

            {b1Mined && b1MineTime && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Mining successful! Found in {b1MineTime}s at Nonce {b1Nonce}.
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* BLOCK 2 CARD */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`glass-card p-6 sm:p-8 rounded-3xl border transition-all duration-300 relative ${
            isChainBroken 
              ? 'border-rose-500/40 shadow-lg shadow-rose-500/5' 
              : isBlock2Valid 
              ? 'border-emerald-500/20 shadow-lg shadow-emerald-500/3' 
              : 'border-white/5 shadow-inner'
          }`}
        >
          <div className="absolute top-6 right-6 flex items-center gap-2">
            {isChainBroken ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-rose-500/10 border border-rose-500/25 text-rose-400 animate-pulse">
                <ShieldAlert className="w-3.5 h-3.5" /> Chain Broken
              </span>
            ) : isBlock2Valid ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" /> Valid
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-slate-500/10 border border-white/5 text-slate-400">
                <ShieldAlert className="w-3.5 h-3.5" /> Unmined
              </span>
            )}
          </div>

          <h2 className="text-xl font-bold text-white mb-6">Block #2</h2>

          <div className="space-y-5">
            <div className="flex flex-col gap-2">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Block Data</label>
              <textarea
                value={b2Data}
                onChange={(e) => setB2Data(e.target.value)}
                disabled={b2Mining}
                className="w-full bg-slate-950/60 border border-white/5 hover:border-white/10 focus:border-brand-blue/50 rounded-xl px-4 py-3 text-slate-200 text-sm focus:outline-none transition-all duration-200 h-20 resize-none"
                placeholder="Enter block data transactions..."
              />
              {!b2Data.trim() && (
                <span className="text-rose-400 text-2xs font-semibold">⚠ Block data cannot be empty.</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Previous Hash (Block 1 Hash)</label>
              <input
                type="text"
                value={b1Hash || ''}
                readOnly
                className="w-full bg-slate-950/20 border border-white/5 text-slate-400 rounded-xl px-4 py-2.5 text-xs focus:outline-none select-all font-mono"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Nonce</label>
              <input
                type="number"
                value={b2Nonce}
                onChange={(e) => setB2Nonce(parseInt(e.target.value) || 0)}
                disabled={b2Mining}
                className="w-full bg-slate-950/60 border border-white/5 hover:border-white/10 focus:border-brand-blue/50 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none transition-all duration-200 font-mono"
              />
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <div className="flex justify-between items-center">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Generated SHA-256 Hash</label>
                <button
                  onClick={() => copyToClipboard(b2Hash, 'Block 2 Hash')}
                  className="inline-flex items-center gap-1 text-2xs font-bold text-slate-500 hover:text-brand-purple transition-colors duration-200 cursor-pointer"
                  title="Copy Hash"
                >
                  <Copy className="w-3 h-3" /> Copy
                </button>
              </div>
              <div 
                className={`w-full bg-slate-950/60 border border-white/5 px-4 py-3 rounded-xl font-mono text-xs select-all break-all transition-all duration-300 ${
                  isBlock2Valid ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {b2Hash || 'Calculating...'}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/5">
              <button
                onClick={mineBlock2}
                disabled={b2Mining || !b2Data.trim()}
                className="flex-grow inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue hover:brightness-110 disabled:opacity-40 text-white font-bold text-sm transition-all duration-200 cursor-pointer active:scale-98"
              >
                {b2Mining ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Mining (Nonce: {b2Nonce})
                  </>
                ) : (
                  'Mine Block'
                )}
              </button>
              <button
                onClick={resetB2}
                disabled={b2Mining}
                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 hover:text-white transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 text-sm"
              >
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
              {isBlock2Valid && (
                <button
                  onClick={() => exportBlockJSON(2, b2Data, b1Hash, b2Nonce, b2Hash)}
                  className="px-4 py-3 rounded-xl bg-brand-purple/10 border border-brand-purple/20 hover:bg-brand-purple/20 text-brand-purple transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer active:scale-98 text-sm"
                  title="Export block data to JSON file"
                >
                  <Download className="w-4 h-4" /> Export
                </button>
              )}
            </div>

            {isChainBroken && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs flex flex-col gap-1"
              >
                <div className="flex items-center gap-2 font-bold">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  Block Invalid / Chain Broken
                </div>
                <p className="text-slate-400 text-2xs leading-relaxed">
                  The previous hash no longer matches Block 1's current hash. Block 1 data was modified after Block 2 was mined.
                </p>
              </motion.div>
            )}

            {b2Mined && !isChainBroken && b2MineTime && (
              <motion.div 
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Mining successful! Found in {b2MineTime}s at Nonce {b2Nonce}.
              </motion.div>
            )}
          </div>
        </motion.div>

      </section>

      {/* 3. Mining Statistics Section */}
      <section className="w-full glass-card p-6 sm:p-8 rounded-3xl border border-white/5 mb-8 relative overflow-hidden">
        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-brand-purple" />
          Mining Statistics Dashboard
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/35 border border-white/5 p-4 rounded-xl">
            <span className="text-2xs text-slate-500 uppercase tracking-wider font-bold">Total Attempts</span>
            <div className="text-xl font-bold text-white mt-1">{stats.totalMined}</div>
          </div>
          <div className="bg-slate-900/35 border border-white/5 p-4 rounded-xl">
            <span className="text-2xs text-slate-500 uppercase tracking-wider font-bold">Successful Mines</span>
            <div className="text-xl font-bold text-emerald-400 mt-1">{stats.successfulMines}</div>
          </div>
          <div className="bg-slate-900/35 border border-white/5 p-4 rounded-xl">
            <span className="text-2xs text-slate-500 uppercase tracking-wider font-bold">Avg Mine Time</span>
            <div className="text-xl font-bold text-brand-blue mt-1">{getAverageMineTime()}s</div>
          </div>
          <div className="bg-slate-900/35 border border-white/5 p-4 rounded-xl">
            <span className="text-2xs text-slate-500 uppercase tracking-wider font-bold">Last Mine Time</span>
            <div className="text-xl font-bold text-brand-purple mt-1">{stats.lastMinedTimestamp ? stats.lastMinedTimestamp : 'N/A'}</div>
          </div>
        </div>
      </section>

      {/* 4. Blockchain Flow Diagram */}
      <section className="w-full glass-card p-8 rounded-3xl border border-white/5 mb-16 text-center relative overflow-hidden glow-purple">
        <div className="absolute top-[-50%] left-[30%] w-[40%] h-[200%] bg-brand-purple/5 rounded-full blur-[80px] pointer-events-none" />

        <h2 className="text-lg font-bold text-white mb-6 flex items-center justify-center gap-2">
          <Layers className="w-5 h-5 text-brand-purple" />
          Blockchain Connection Status
        </h2>

        <div className="mb-8">
          {isCompleteChainValid ? (
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="w-4 h-4" /> Chain Valid & Secure
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold bg-rose-500/10 border border-rose-500/30 text-rose-400 animate-pulse">
              <ShieldAlert className="w-4 h-4" /> Chain Broken / Invalidation Detected
            </span>
          )}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 max-w-lg mx-auto">
          <div 
            className={`px-6 py-4 rounded-xl border font-bold text-sm transition-all duration-300 ${
              isBlock1Valid 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200' 
                : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
            }`}
          >
            Block #1
            <div className="text-2xs font-mono font-normal text-slate-400 mt-1 select-none">
              Hash: {b1Hash ? b1Hash.substring(0, 8) : '...'}...
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center gap-1.5">
              <ArrowDown 
                className={`w-6 h-6 transform md:-rotate-90 transition-colors duration-300 ${
                  isCompleteChainValid ? 'text-emerald-400 animate-pulse' : 'text-rose-500 animate-bounce'
                }`}
              />
            </div>
            <span className={`text-2xs font-semibold ${isCompleteChainValid ? 'text-emerald-500' : 'text-rose-500'}`}>
              {isCompleteChainValid ? 'prev_hash link' : 'mismatch'}
            </span>
          </div>

          <div 
            className={`px-6 py-4 rounded-xl border font-bold text-sm transition-all duration-300 ${
              isBlock2Valid 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200' 
                : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
            }`}
          >
            Block #2
            <div className="text-2xs font-mono font-normal text-slate-400 mt-1 select-none">
              Hash: {b2Hash ? b2Hash.substring(0, 8) : '...'}...
            </div>
          </div>
        </div>
      </section>

      {/* 5. Educational Info Section */}
      <section className="w-full animate-fadeIn">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">How Cryptography Anchors Trust</h2>
          <p className="text-slate-400 mt-3 text-sm leading-relaxed">
            Gain insight into the computational rules keeping decentralized databases secure from tampered history.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="glass-card p-6 rounded-2xl border border-white/5">
            <h3 className="text-base font-bold text-white mb-2.5 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-brand-purple/10 flex items-center justify-center text-brand-purple font-mono text-xs">#</span>
              What is Hashing?
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              A cryptographic hash function (like SHA-256) takes any size of input text data and runs mathematical algorithms on it to produce a fixed-length hexadecimal digest. Even a tiny single-letter edit in inputs completely alters the generated hash, making manipulation easily detectable.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/5">
            <h3 className="text-base font-bold text-white mb-2.5 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-brand-blue/10 flex items-center justify-center text-brand-blue font-mono text-xs">#</span>
              What is a Nonce?
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              "Nonce" stands for **number used once**. In our blocks, it is a simple counter value. Since users cannot modify block transactions directly to alter a hash, they increment the nonce until the resulting hash satisfies specific blockchain rules.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/5">
            <h3 className="text-base font-bold text-white mb-2.5 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-brand-cyan/10 flex items-center justify-center text-brand-cyan font-mono text-xs">#</span>
              What is Proof of Work?
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Proof of Work is a consensus model requiring nodes to spend CPU electricity solving computational puzzles. Finding a hash that begins with a certain number of leading zeros (e.g. `00` in our simulator) is difficult to solve but instantly verifiable by anyone.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/5">
            <h3 className="text-base font-bold text-white mb-2.5 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-brand-purple/10 flex items-center justify-center text-brand-purple font-mono text-xs">#</span>
              Why Blockchain is Immutable?
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Each block contains the hash of the block before it. If someone edits Block 1, its hash changes. This breaks the link in Block 2 immediately. To successfully tamper with history, a bad actor would have to recalculate nonces and re-mine every single subsequent block on the chain, which is computationally impossible.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
