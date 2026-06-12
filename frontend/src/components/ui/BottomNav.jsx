import React from 'react';
import { motion } from 'framer-motion';
import { Home, Timer, BarChart2, Settings } from 'lucide-react';

const BottomNav = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'timer', label: 'Timer', icon: Timer },
    { id: 'stats', label: 'Stats', icon: BarChart2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-gray-900/60 backdrop-blur-xl border-t border-white/10 px-4 py-2">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center justify-center py-2 px-3 focus:outline-none transition-colors duration-200"
            >
              {/* Active Background Pill */}
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-active-pill"
                  className="absolute inset-0 bg-white/5 rounded-xl -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}

              {/* Icon Container with Micro-interaction */}
              <motion.div
                animate={{ scale: isActive ? 1.15 : 1 }}
                whileTap={{ scale: 0.95 }}
                className={`${
                  isActive ? 'text-accent' : 'text-secondary-text'
                } transition-colors duration-200`}
              >
                <Icon className="w-6 h-6" />
              </motion.div>

              {/* Tab Label */}
              <span
                className={`text-[10px] mt-1 font-medium transition-colors duration-200 ${
                  isActive ? 'text-primary-text' : 'text-secondary-text/80'
                }`}
              >
                {tab.label}
              </span>

              {/* Animated Indicator Dot */}
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-dot"
                  className="w-1.5 h-1.5 bg-accent rounded-full absolute -bottom-0.5"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
