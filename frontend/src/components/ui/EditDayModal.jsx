import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserProvider';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EditDayModal = ({ isOpen, onClose, dayData, onSave }) => {
  const { userData } = useUser();
  const [log, setLog] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  const isAddMode = !dayData?.date;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (dayData) {
      setLog(dayData.log || {});
      setSelectedDate(dayData.date);
    } else {
      // Reset for "Add Day" mode
      const today = new Date().toISOString().split('T')[0];
      setSelectedDate(today);
      setLog({});
    }
  }, [dayData, isOpen]);

  const handleCountChange = (catId, delta) => {
    setLog((prevLog) => {
      const currentCount = prevLog[catId] || 0;
      const newCount = Math.max(0, currentCount + delta); // Cannot go below 0
      return { ...prevLog, [catId]: newCount };
    });
  };

  const handleSave = () => {
    onSave(selectedDate, log);
    onClose();
  };

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
            className="w-full bg-surface border-t border-white/10 rounded-t-2xl shadow-2xl pointer-events-auto relative z-10 p-6 md:p-8 md:max-w-lg md:rounded-xl md:border md:shadow-lg pb-safe"
          >
            {isMobile && (
              <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6 mt-[-10px]" />
            )}
            <h2 className="text-xl font-bold text-primary-text mb-1">
              {isAddMode ? 'Add a Past Entry' : 'Alter History'}
            </h2>
            <p className="text-sm text-secondary-text mb-6">
              {isAddMode
                ? 'Select a date and log the units you completed.'
                : `Editing log for ${new Date(
                    selectedDate + 'T00:00:00'
                  ).toLocaleDateString('en-US', { dateStyle: 'full' })}`}
            </p>

            {isAddMode && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-secondary-text mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-input-bg border border-input-border rounded-lg p-2 text-primary-text min-h-[44px]"
                />
              </div>
            )}

            <div className="max-h-64 overflow-y-auto hide-scrollbar pr-2 flex flex-col gap-3">
              {(userData?.settings?.categories || []).map((cat) => (
                <div key={cat.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    ></div>
                    <span className="text-primary-text">{cat.label}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleCountChange(cat.id, -1)}
                      className="p-2 rounded-full bg-input-bg text-secondary-text hover:text-primary-text min-w-[44px] min-h-[44px] flex justify-center items-center"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="font-mono text-lg w-8 text-center">
                      {log[cat.id] || 0}
                    </span>
                    <button
                      onClick={() => handleCountChange(cat.id, 1)}
                      className="p-2 rounded-full bg-input-bg text-secondary-text hover:text-primary-text min-w-[44px] min-h-[44px] flex justify-center items-center"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={onClose}
                className="py-2 px-6 rounded-lg text-sm font-medium text-secondary-text hover:text-primary-text transition-colors min-h-[44px]"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="py-2 px-6 rounded-lg text-sm font-medium bg-accent text-bg-color hover:bg-button-hover transition-colors min-h-[44px]"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EditDayModal;

