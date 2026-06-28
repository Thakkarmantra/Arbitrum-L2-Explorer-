import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, RefreshCw, AlertTriangle, 
  Coins, Award, Percent, CalendarClock, ArrowUpRight, ArrowDownRight,
  Play, Pause, LineChart
} from 'lucide-react';
import { getLivePrices } from '../services/api';
import { useToast } from '../context/AppContext';
import { useSEO } from '../hooks/useSEO';

// Chart.js imports and registration
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  Tooltip,
  Legend
);

const TOKEN_METADATA = {
  bitcoin: {
    name: 'Bitcoin',
    symbol: 'BTC',
    color: '#F7931A',
    bgLight: 'rgba(247, 147, 26, 0.1)',
    borderLight: 'rgba(247, 147, 26, 0.25)',
    logoText: '₿'
  },
  ethereum: {
    name: 'Ethereum',
    symbol: 'ETH',
    color: '#627EEA',
    bgLight: 'rgba(98, 126, 234, 0.1)',
    borderLight: 'rgba(98, 126, 234, 0.25)',
    logoText: 'Ξ'
  },
  solana: {
    name: 'Solana',
    symbol: 'SOL',
    color: '#14F195',
    bgLight: 'rgba(20, 241, 149, 0.1)',
    borderLight: 'rgba(20, 241, 149, 0.25)',
    logoText: 'S'
  },
  arbitrum: {
    name: 'Arbitrum',
    symbol: 'ARB',
    color: '#28A0F0',
    bgLight: 'rgba(40, 160, 240, 0.1)',
    borderLight: 'rgba(40, 160, 240, 0.25)',
    logoText: 'A'
  },
  'matic-network': {
    name: 'Polygon',
    symbol: 'MATIC',
    color: '#8247E5',
    bgLight: 'rgba(130, 71, 229, 0.1)',
    borderLight: 'rgba(130, 71, 229, 0.25)',
    logoText: 'M'
  }
};

const COIN_IDS = Object.keys(TOKEN_METADATA).join(',');

export default function LivePrices() {
  useSEO({
    title: 'Live Cryptocurrency Prices',
    description: 'Track real-time coin market prices for BTC, ETH, SOL, ARB, and MATIC, view dynamic price history trend lines, and set auto-refresh intervals.'
  });

  const [prices, setPrices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // Auto-refresh countdown & state
  const [countdown, setCountdown] = useState(60);
  const [isAutoRefreshActive, setIsAutoRefreshActive] = useState(true);
  
  // Price history states (stores last 10 entries)
  const [btcHistory, setBtcHistory] = useState([]);
  const [ethHistory, setEthHistory] = useState([]);
  const [historyLabels, setHistoryLabels] = useState([]);

  const showToast = useToast();
  const prevPricesRef = useRef({});

  // Core API Fetch function
  const fetchPrices = useCallback(async (isManual = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLivePrices(COIN_IDS);
      
      if (!data || Object.keys(data).length === 0) {
        throw new Error('Empty response received from CoinGecko API.');
      }
      
      // Ensure bitcoin and ethereum objects are present with numeric prices
      if (!data.bitcoin || typeof data.bitcoin.usd !== 'number' || !data.ethereum || typeof data.ethereum.usd !== 'number') {
        throw new Error('Malformed coin data structure received.');
      }
      
      setPrices(currentPrices => {
        if (currentPrices) {
          prevPricesRef.current = currentPrices;
        }
        return data;
      });

      // Update in-memory history lists for BTC and ETH charts
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setBtcHistory(prev => [...prev.slice(-9), data.bitcoin.usd]);
      setEthHistory(prev => [...prev.slice(-9), data.ethereum.usd]);
      setHistoryLabels(prev => [...prev.slice(-9), timeStr]);

      setLastUpdated(new Date());
      setCountdown(60); // reset countdown

      if (isManual) {
        showToast('Prices updated successfully', 'success');
      }
    } catch (err) {
      console.error(err);
      setError('Unable to fetch live prices.');
      showToast('Error fetching live prices', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // Initial fetch
  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  // Auto-refresh interval handler
  useEffect(() => {
    if (!isAutoRefreshActive || loading) return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchPrices();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isAutoRefreshActive, loading, fetchPrices]);

  // Custom global shortcut dispatcher event listener
  useEffect(() => {
    const handleShortcutRefresh = () => {
      fetchPrices(true);
    };
    window.addEventListener('trigger-refresh-prices', handleShortcutRefresh);
    return () => window.removeEventListener('trigger-refresh-prices', handleShortcutRefresh);
  }, [fetchPrices]);

  // Compute market summary stats
  const getSummary = () => {
    if (!prices) return null;

    let highestGainer = { id: '', change: -Infinity };
    let lowestPerformer = { id: '', change: Infinity };
    let validCoinCount = 0;

    Object.entries(prices).forEach(([id, val]) => {
      if (!TOKEN_METADATA[id] || !val) return;
      validCoinCount++;
      const change = val.usd_24h_change || 0;
      if (change > highestGainer.change) {
        highestGainer = { id, change };
      }
      if (change < lowestPerformer.change) {
        lowestPerformer = { id, change };
      }
    });

    return {
      highestGainer: TOKEN_METADATA[highestGainer.id] || { name: 'N/A', symbol: 'N/A' },
      highestGainerChange: highestGainer.change === -Infinity ? 0 : highestGainer.change,
      lowestPerformer: TOKEN_METADATA[lowestPerformer.id] || { name: 'N/A', symbol: 'N/A' },
      lowestPerformerChange: lowestPerformer.change === Infinity ? 0 : lowestPerformer.change,
      totalCoins: validCoinCount
    };
  };

  const summary = getSummary();

  const getPriceDirection = (id, currentPrice) => {
    const prev = prevPricesRef.current[id]?.usd;
    if (!prev || prev === currentPrice) return null;
    return currentPrice > prev ? 'up' : 'down';
  };

  // Chart configuration settings
  const chartData = {
    labels: historyLabels.length > 0 ? historyLabels : ['Starting'],
    datasets: [
      {
        label: 'BTC (USD)',
        data: btcHistory.length > 0 ? btcHistory : [0],
        borderColor: '#F7931A',
        backgroundColor: 'rgba(247, 147, 26, 0.1)',
        tension: 0.25,
        borderWidth: 2,
        pointRadius: 3,
        yAxisID: 'y-btc',
      },
      {
        label: 'ETH (USD)',
        data: ethHistory.length > 0 ? ethHistory : [0],
        borderColor: '#627EEA',
        backgroundColor: 'rgba(98, 126, 234, 0.1)',
        tension: 0.25,
        borderWidth: 2,
        pointRadius: 3,
        yAxisID: 'y-eth',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#e2e8f0',
          font: { family: 'Inter', size: 10, weight: 'bold' }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.03)' },
        ticks: { color: '#94a3b8', font: { size: 9 } }
      },
      'y-btc': {
        type: 'linear',
        display: true,
        position: 'left',
        grid: { color: 'rgba(255, 255, 255, 0.03)' },
        ticks: { color: '#F7931A', font: { size: 9 } }
      },
      'y-eth': {
        type: 'linear',
        display: true,
        position: 'right',
        grid: { drawOnChartArea: false },
        ticks: { color: '#627EEA', font: { size: 9 } }
      }
    }
  };

  return (
    <div className="w-full flex-grow flex flex-col py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* 1. Hero Section */}
      <section className="text-center md:text-left md:flex md:items-center md:justify-between gap-8 mb-12">
        <div className="flex flex-col gap-3 max-w-xl">
          <div className="w-fit mx-auto md:mx-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-blue/10 border border-brand-blue/30 text-brand-blue glow-blue">
              <TrendingUp className="w-3.5 h-3.5" />
              Live Crypto Market
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            Real-Time Cryptocurrency Prices
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Monitor real-time coin values, market stats, and 24h percentage swings compiled from CoinGecko API data feeds.
          </p>
        </div>

        {/* Action Panel: Auto-Refresh countdown & triggers */}
        <div className="flex flex-col items-center md:items-end gap-3 mt-6 md:mt-0 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Auto refresh pause/resume button */}
            <button
              onClick={() => setIsAutoRefreshActive(!isAutoRefreshActive)}
              className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer ${
                isAutoRefreshActive 
                  ? 'bg-brand-purple/10 border-brand-purple/35 text-brand-purple hover:bg-brand-purple/20' 
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
              title={isAutoRefreshActive ? 'Pause Auto Refresh' : 'Resume Auto Refresh'}
            >
              {isAutoRefreshActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            {/* Countdown circular display */}
            {isAutoRefreshActive && !loading && (
              <span className="text-xs text-brand-purple font-semibold bg-brand-purple/10 border border-brand-purple/20 px-3 py-1 rounded-lg">
                Refresh in {countdown}s
              </span>
            )}

            {/* Manual refresh action */}
            <button
              onClick={() => fetchPrices(true)}
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue hover:brightness-115 disabled:opacity-50 text-white font-bold text-sm transition-all duration-200 cursor-pointer shadow-lg shadow-brand-purple/10 active:scale-97 select-none"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Refreshing...' : 'Refresh Market'}
            </button>
          </div>
          
          {lastUpdated && (
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
              <CalendarClock className="w-3.5 h-3.5" />
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
      </section>

      {/* 2. Primary Layout Render */}
      <div className="flex-grow flex flex-col gap-10">
        
        {/* Loading Skeletons State */}
        {loading && !prices && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((idx) => (
              <div key={idx} className="glass-card p-6 rounded-2xl border border-white/5 animate-pulse flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-full bg-white/5" />
                  <div className="w-16 h-4 bg-white/5 rounded" />
                </div>
                <div className="w-24 h-6 bg-white/5 rounded mt-4" />
                <div className="w-12 h-4 bg-white/5 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Error Handling State */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl mx-auto glass-card p-8 rounded-2xl border border-rose-500/20 text-center glow-purple"
          >
            <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-4 animate-bounce" />
            <h3 className="text-xl font-bold text-white mb-2">Unable to fetch prices</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              CoinGecko's public endpoint limits requests per minute. Wait a few moments and click retry below.
            </p>
            <button
              onClick={() => fetchPrices(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold text-sm transition-all duration-200 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Now
            </button>
          </motion.div>
        )}

        {/* Price Cards Grid */}
        {prices && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
          >
            <AnimatePresence>
              {Object.entries(prices).map(([id, val]) => {
                const meta = TOKEN_METADATA[id] || { name: id, symbol: id, color: '#94a3b8', bgLight: 'rgba(255,255,255,0.05)', borderLight: 'rgba(255,255,255,0.1)', logoText: '?' };
                const price = val.usd;
                const change = val.usd_24h_change || 0;
                const isPositive = change >= 0;
                
                const direction = getPriceDirection(id, price);
                let flashBorder = 'border-white/5';
                if (direction === 'up') flashBorder = 'border-emerald-500 shadow-lg shadow-emerald-500/10 scale-102';
                if (direction === 'down') flashBorder = 'border-rose-500 shadow-lg shadow-rose-500/10 scale-102';

                return (
                  <motion.div
                    key={id}
                    layout
                    whileHover={{ y: -5, scale: 1.02 }}
                    className={`glass-card p-6 rounded-2xl flex flex-col gap-4 border transition-all duration-300 relative overflow-hidden cursor-default ${flashBorder}`}
                    style={{
                      boxShadow: `0 4px 30px rgba(0, 0, 0, 0.4), 0 0 25px -10px ${meta.color}25`
                    }}
                  >
                    <div 
                      className="absolute top-[-30px] right-[-30px] w-20 h-20 rounded-full blur-[25px] opacity-20 pointer-events-none" 
                      style={{ backgroundColor: meta.color }}
                    />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg select-none border"
                          style={{ 
                            color: meta.color, 
                            backgroundColor: meta.bgLight, 
                            borderColor: meta.borderLight 
                          }}
                        >
                          {meta.logoText}
                        </div>
                        <div>
                          <h3 className="font-bold text-white leading-tight text-sm sm:text-base">{meta.name}</h3>
                          <span className="text-xs text-slate-500 font-semibold">{meta.symbol}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 flex flex-col gap-0.5">
                      <motion.span 
                        key={price}
                        initial={{ opacity: 0.8, y: -2 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl font-black text-white tracking-tight"
                      >
                        ${price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                      </motion.span>
                      <span className="text-slate-500 text-xs font-semibold">USD Price</span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-1">
                      <div 
                        className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-xs font-bold border ${
                          isPositive 
                            ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' 
                            : 'bg-rose-500/10 border-rose-500/25 text-rose-400'
                        }`}
                      >
                        {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        {Math.abs(change).toFixed(2)}%
                      </div>
                      <span className="text-slate-500 text-2xs uppercase tracking-wider font-semibold">24h</span>
                    </div>

                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {/* 3. In-memory History Price Chart */}
        {prices && btcHistory.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full glass-card p-6 sm:p-8 rounded-3xl border border-white/5 relative overflow-hidden"
          >
            <div className="relative z-10 flex flex-col gap-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <LineChart className="w-5 h-5 text-brand-purple" />
                Live Price Trends (Last 10 updates)
              </h2>
              
              <div className="h-64 sm:h-80 w-full bg-slate-950/20 rounded-2xl p-4 border border-white/5">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>
          </motion.section>
        )}

        {/* 4. Market Summary Stats */}
        {prices && summary && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full glass-card p-6 sm:p-8 rounded-3xl border border-white/5 relative overflow-hidden"
          >
            <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[150%] bg-brand-blue/5 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10 flex flex-col gap-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Coins className="w-5 h-5 text-brand-purple" />
                Crypto Market Overview
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <div className="p-4 rounded-xl bg-white/3 border border-white/5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-2xs text-slate-500 font-bold uppercase tracking-wider">Top Gainer</span>
                    <h3 className="font-bold text-white text-sm mt-0.5">
                      {summary.highestGainer.name} ({summary.highestGainer.symbol})
                    </h3>
                    <p className="text-xs text-emerald-400 font-semibold mt-1">
                      +{summary.highestGainerChange.toFixed(2)}%
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/3 border border-white/5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <TrendingDown className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-2xs text-slate-500 font-bold uppercase tracking-wider">Lowest performer</span>
                    <h3 className="font-bold text-white text-sm mt-0.5">
                      {summary.lowestPerformer.name} ({summary.lowestPerformer.symbol})
                    </h3>
                    <p className="text-xs text-rose-400 font-semibold mt-1">
                      {summary.lowestPerformerChange.toFixed(2)}%
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/3 border border-white/5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-purple/10 border border-brand-purple/25 text-brand-purple flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-2xs text-slate-500 font-bold uppercase tracking-wider">Indexed Assets</span>
                    <h3 className="font-bold text-white text-sm mt-0.5">
                      {summary.totalCoins} Active Coins
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Tracking major L1 + L2
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/3 border border-white/5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-blue/10 border border-brand-blue/25 text-brand-blue flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Percent className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-2xs text-slate-500 font-bold uppercase tracking-wider">Data Source</span>
                    <h3 className="font-bold text-white text-sm mt-0.5">
                      CoinGecko Public
                    </h3>
                    <p className="text-xs text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                      Live Feed
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </motion.section>
        )}

      </div>
    </div>
  );
}
