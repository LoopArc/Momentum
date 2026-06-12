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
    <header className="relative flex justify-between items-center px-1 py-2 mb-2 md:bg-surface md:rounded-xl md:p-5 md:mb-8 md:border md:border-white/5">
      <div className="flex items-center gap-2 md:gap-4">
        <MomentumLogo className="text-accent w-7 h-7 md:w-10 md:h-10" isAnimated={true} />
        {/* Mobile greeting moved next to logo */}
        <div className="md:hidden flex flex-col">
          <p className="text-[13px] text-primary-text font-medium">{getGreeting()}</p>
        </div>
      </div>

      {/* Desktop centered text */}
      <div className="hidden md:block absolute left-1/2 -translate-x-1/2 text-center">
        <p className="text-sm text-primary-text">{getGreeting()},</p>
        <p className="text-xs text-secondary-text">Momentum</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={startTour}
          title="Restart the guided tour"
          className="p-1.5 md:p-2 rounded-full text-secondary-text hover:bg-white/10 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <HelpCircle size={18} className="md:w-5 md:h-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;
