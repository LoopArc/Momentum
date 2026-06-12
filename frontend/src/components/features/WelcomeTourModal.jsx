// src/features/WelcomeTourModal.jsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// A simple, zero-dependency modal component (now using framer-motion)
export const WelcomeTourModal = ({ onStart, onDecline }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center pointer-events-none p-0 md:p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-bg-color/80 backdrop-blur-2xl pointer-events-auto"
        />
        <motion.div
          initial={isMobile ? { y: '100%' } : { y: -50, opacity: 0, scale: 0.95 }}
          animate={isMobile ? { y: 0 } : { y: 0, opacity: 1, scale: 1 }}
          exit={isMobile ? { y: '100%' } : { y: 50, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-full bg-surface/80 backdrop-blur-xl border-t border-white/10 rounded-t-2xl shadow-2xl pointer-events-auto relative z-10 p-6 md:p-8 md:max-w-md md:rounded-2xl md:border md:shadow-xl text-center max-h-[85vh] overflow-y-auto hide-scrollbar pb-safe"
        >
          {isMobile && (
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6 mt-[-10px]" />
          )}
          <h2 className="text-2xl font-bold mb-4 text-primary-text">
            به Momentum خوش آمدید!
          </h2>
          <p className="text-sm text-secondary-text mb-6">
            آیا مایلید یک تور کوتاه برای آشنایی با ویژگی‌های اصلی داشته باشید؟
          </p>
          <div className="flex gap-4">
            <button
              onClick={onStart}
              className="flex-1 py-3 rounded-lg font-medium text-base cursor-pointer transition-colors bg-accent text-bg-color hover:bg-button-hover min-h-[44px]"
            >
              بله، تور را نشان بده
            </button>
            <button
              onClick={onDecline}
              className="flex-1 py-3 border border-border-default hover:border-gray-500 rounded-lg font-medium text-base cursor-pointer transition-colors text-primary-text min-h-[44px]"
            >
              شاید بعداً
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
