import React, { useState, useEffect, useRef } from 'react';
import { COLOR_PALETTE } from '../../utils/constants';
import { motion, AnimatePresence } from 'framer-motion';

const ColorPicker = ({ selectedColor, onColorChange, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pickerRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTriggerClick = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={pickerRef}>
      <div
        className={`w-6 h-6 rounded-full border-2 border-[#555] transition-colors ${
          disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:border-primary-text'
        }`}
        style={{ backgroundColor: selectedColor }}
        onClick={handleTriggerClick}
      ></div>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile-only overlay backdrop */}
            {isMobile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-50"
                onClick={() => setIsOpen(false)}
              />
            )}

            {/* Color Picker Panel */}
            <motion.div
              initial={isMobile ? { y: '100%' } : { y: 10, opacity: 0 }}
              animate={isMobile ? { y: 0 } : { y: 0, opacity: 1 }}
              exit={isMobile ? { y: '100%' } : { y: 10, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-t border-white/10 rounded-t-2xl p-6 shadow-2xl z-50 md:absolute md:bottom-auto md:top-[120%] md:left-1/2 md:-translate-x-1/2 md:bg-input-bg md:border md:border-border-default md:rounded-xl md:p-2.5 md:w-max md:shadow-[0_5px_15px_rgba(0,0,0,0.4)]"
            >
              {isMobile && (
                <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-4" />
              )}
              {Object.entries(COLOR_PALETTE).map(([name, colors]) => (
                <div key={name} className="p-1">
                  <p className="text-xs text-secondary-text mb-3 text-left">
                    {name}
                  </p>
                  <div className="grid grid-cols-7 gap-3 md:gap-2">
                    {colors.map((color) => (
                      <div
                        key={color}
                        className="w-9 h-9 md:w-[22px] md:h-[22px] rounded-full cursor-pointer transition-transform hover:scale-110 hover:ring-2 hover:ring-white"
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          onColorChange(color);
                          setIsOpen(false);
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ColorPicker;
