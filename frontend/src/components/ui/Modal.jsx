import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Effect to handle closing with the 'Escape' key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center pointer-events-none p-0 md:p-4">
          <motion.div
            // The modal overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-bg-color/80 backdrop-blur-2xl pointer-events-auto"
          />
          <motion.div
            // The modal content
            initial={isMobile ? { y: '100%' } : { y: -50, opacity: 0, scale: 0.95 }}
            animate={isMobile ? { y: 0 } : { y: 0, opacity: 1, scale: 1 }}
            exit={isMobile ? { y: '100%' } : { y: 50, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            className="w-full bg-surface border-t border-white/10 rounded-t-2xl shadow-2xl pointer-events-auto relative z-10 pb-safe md:max-w-md md:rounded-xl md:border md:shadow-lg"
          >
            {isMobile && (
              <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mt-3 mb-1" />
            )}
            <header className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-lg font-bold text-primary-text">{title}</h2>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-secondary-text hover:bg-white/10 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </header>
            <div className="p-4 md:p-6 max-h-[80vh] overflow-y-auto hide-scrollbar">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;

