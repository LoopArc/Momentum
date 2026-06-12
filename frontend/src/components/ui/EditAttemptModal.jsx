import React, { useState, useEffect } from 'react';
import { ShieldAlert, Hourglass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EditAttemptModal = ({ isOpen, onClose, attemptsLeft }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center pointer-events-none p-0 md:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-bg-color/80 backdrop-blur-2xl pointer-events-auto"
          />
          <motion.div
            initial={isMobile ? { y: '100%' } : { y: -50, opacity: 0, scale: 0.95 }}
            animate={isMobile ? { y: 0 } : { y: 0, opacity: 1, scale: 1 }}
            exit={isMobile ? { y: '100%' } : { y: 50, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-surface border-t border-white/10 rounded-t-2xl shadow-2xl pointer-events-auto relative z-10 p-6 md:p-8 md:max-w-md md:rounded-xl md:border md:shadow-lg text-center pb-safe"
          >
            {isMobile && (
              <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6 mt-[-10px]" />
            )}
            <div className="flex justify-center mb-4">
              <ShieldAlert size={48} className="text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold text-primary-text mb-3">
              A Note on Your Legacy
            </h2>
            <p className="text-secondary-text mb-6">
              Your past victories are milestones, not editable documents. True
              momentum comes from what you do{' '}
              <strong className="text-accent">today</strong>. Are you sure you want
              to alter history?
            </p>
            <div className="bg-input-bg p-3 rounded-lg flex items-center justify-center gap-3 mb-6">
              <Hourglass size={18} className="text-secondary-text" />
              <p className="font-mono text-sm text-primary-text">
                You have {attemptsLeft} attempt(s) left to unlock the time machine.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full bg-accent text-bg-color font-medium min-h-[44px] py-2.5 rounded-lg transition-colors hover:bg-button-hover"
            >
              I Understand
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EditAttemptModal;

