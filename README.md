<<<<<<< HEAD
# Web3 Explorer

Web3 Explorer is a modern, responsive, and interactive educational frontend dashboard built as an assignment submission for Arbitrum Builder Labs. It provides a visual, hands-on learning environment to understand Ethereum Layer 2 scalability, blockchain cryptography, live token markets, and consensus mechanisms.

---

## 🚀 Features

The application consists of four main sections:

1. **Home Page (`/`)**:
   - Deep dive into Layer 2 scaling solutions, highlighting why Ethereum requires Layer 2 engines (Gas, Congestion, Speed bottlenecks).
   - Explains Arbitrum's Optimistic Rollup mechanics visually.
   - Core technical benefits grid and scroll-staggered transaction lifecycle timeline.

2. **Concepts Dashboard (`/concepts`)**:
   - Comparative layout modules mapping out core paradigms: Web2 vs Web3, Bitcoin vs Ethereum, Public Key vs Private Key, and Blockchain Ledger vs Traditional Database.
   - High-fidelity key takeaways.
   - Interactive, state-controlled multiple-choice quiz validating user blockchain knowledge with instant explanation feedbacks.

3. **Live Prices Tracker (`/live-prices`)**:
   - Real-time token market price feeds (BTC, ETH, SOL, ARB, MATIC) powered by the CoinGecko public API.
   - Interactive tick indicator that flashes colors (green/red border glows) on upward or downward price shifts.
   - Detailed Market Summary stats calculating Top Gainer, Lowest Performer, Indexed Assets count, and data feed metadata.
   - Styled loader state and rate-limiting error retry panels.

4. **Block Simulator (`/block-simulator`)**:
   - Dynamic sandbox representing blockchain consensus rules using the browser's native **Web Crypto API (SHA-256)**.
   - Real-time hash calculation of Block 1 and Block 2 based on editable text inputs and nonce fields.
   - Asynchronous mining loop resolving target difficulty (`00`) without blocking the browser thread.
   - Immutability detection highlighting child block link mismatch if the parent Genesis block data is modified post-mining.

---

## 🛠 Tech Stack

- **Core & Routing**: React, Vite (ESM), React Router DOM (v7)
- **Styling**: Tailwind CSS (v4) with native `@tailwindcss/vite` configuration
- **Icons**: Lucide React
- **Client & Async Networking**: Axios
- **Animations**: Framer Motion
- **APIs**: CoinGecko API (Prices Feed), Web Crypto API (SHA-256)

---

## 📦 Project Structure

```
src/
├── assets/
│   └── react.svg
├── components/
│   ├── Footer.jsx          # Reusable copyright and social links
│   ├── Layout.jsx          # Central layout skeleton and glowing backgrounds
│   └── Navbar.jsx          # Mobile-responsive header with route indicators
├── pages/
│   ├── BlockSimulator.jsx  # Cryptographic mining sandbox
│   ├── Concepts.jsx        # Comparison cards and quiz module
│   ├── Home.jsx            # L2 overview and timelines
│   └── LivePrices.jsx      # API price boards and indicators
├── services/
│   └── api.js              # CoinGecko Axios client configuration
├── styles/
│   └── index.css           # Tailwind configuration and custom utility styles
├── App.jsx                 # Router routes and wrappers
└── main.jsx                # DOM mounting entry
```
---

## 💎 Advanced Bonus Features Implemented

We have integrated several professional-grade advanced features across the application:

1. **Light / Dark Mode**: Integrated persistent theme states using `localStorage` and custom root CSS variables, allowing smooth transitions between the premium dark Web3 theme and a clean light interface.
2. **Search & Filter (Concepts)**: Added a real-time search input that filters Web3 concepts dynamically and highlights matching query text.
3. **Auto-Refresh Countdown (Live Prices)**: Added play/pause controls and a 60-second countdown timer that automatically triggers price updates.
4. **Price History Charting (Live Prices)**: Tracks the last 10 price updates in-memory and renders a dual-Y-axis trend line chart for BTC and ETH using `Chart.js` & `react-chartjs-2`.
5. **Global Toast Notifications**: Created a custom, lightweight React Context toast system displaying animated notifications for refreshes, successes, and API rate limit exceptions.
6. **Clipboard Copy (Block Simulator)**: Added instant copy buttons next to generated SHA-256 hashes.
7. **JSON Block Export (Block Simulator)**: Users can download mined block information (Data, previous hash, nonce, generated hash, timestamp) as a formatted `.json` file.
8. **Persistent Mining Statistics (Block Simulator)**: Tracks total mining actions, successful mines, average mine duration, and last mined times, persisting data in `localStorage`.
9. **Keyboard Shortcuts**:
   * `Ctrl + H` → Navigate to Home
   * `Ctrl + C` → Navigate to Concepts
   * `Ctrl + R` → Refresh Live Prices
   * `Ctrl + M` → Mine Block (triggers mining on the active block)
10. **404 Route Catch-all**: Wildcard route mapping to a premium 404 Not Found page with custom SVG graphics and a redirection homepage button.
11. **Skeleton Loaders**: Integrated animated pulse skeleton states to avoid screen jerks while live data feeds populate.


