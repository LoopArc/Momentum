import React from 'react';
import { HelpCircle } from 'lucide-react';
import { useTour } from '../../context/TourContext';
import MomentumLogo from '../ui/MomentumLogo';

const Header = () => {
  const { startTour } = useTour();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="relative bg-surface rounded-xl p-4 sm:p-5 flex justify-between items-center mb-8 border border-white/5">
      <div className="flex items-center gap-4">
        <MomentumLogo className="text-accent" isAnimated={true} />
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 text-center">
        <p className="text-sm text-primary-text">{getGreeting()},</p>
        <p className="text-xs text-secondary-text">Momentum</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={startTour}
          title="Restart the guided tour"
          className="p-2 rounded-full text-secondary-text hover:bg-white/10 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <HelpCircle size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
