import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="min-h-screen bg-brand-bg text-slate-100 flex flex-col relative overflow-hidden bg-grid-pattern">
      {/* Background radial glow accents with slow float animations for premium Web3 feel */}
      <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] rounded-full bg-brand-purple/12 blur-[130px] pointer-events-none animate-float-1" />
      <div className="absolute bottom-[-15%] right-[-15%] w-[55%] h-[55%] rounded-full bg-brand-blue/12 blur-[130px] pointer-events-none animate-float-2" />
      <div className="absolute top-[35%] right-[5%] w-[35%] h-[35%] rounded-full bg-brand-cyan/7 blur-[110px] pointer-events-none animate-float-1" style={{ animationDirection: 'reverse' }} />

      {/* Navigation Header */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow pt-16 flex flex-col">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
