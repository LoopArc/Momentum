import React, { useRef, useMemo } from 'react';
import { Download, Upload, Flame } from 'lucide-react';
import { useUser } from '../../context/UserProvider';
import { calculateOverallStreak } from '../../utils/helpers';
import Card from '../ui/Card';
import AnimatedNumber from '../ui/AnimatedNumber';
import { motion } from 'framer-motion';

const StatsOverview = () => {
  const { userData } = useUser();
  const importInputRef = useRef(null);

  const { totalsMap, grandTotal, streak } = useMemo(() => {
    const totals = {};
    let total = 0;
    if (userData?.log) {
      for (const dailyData of Object.values(userData.log)) {
        for (const [catId, count] of Object.entries(dailyData)) {
          totals[catId] = (totals[catId] || 0) + count;
          total += count;
        }
      }
    }
    const currentStreak = calculateOverallStreak(userData?.log);
    return { totalsMap: totals, grandTotal: total, streak: currentStreak };
  }, [userData?.log]);

  const handleExport = () => {
    /* ... */
  };
  const handleImport = (event) => {
    /* ... */
  };

  return (
    <Card
      title="Your Grand Tally"
      description="The monument to your momentum. See the sum of all your effort and the streak that proves your consistency."
      className="text-center"
    >
      <div className="pb-6 mb-6 border-b border-border-default">
        <div className="text-7xl md:text-6xl font-extrabold md:font-bold leading-none text-accent">
          <AnimatedNumber value={grandTotal} />
        </div>
        <p className="text-sm text-secondary-text mt-1">
          Total units of awesomeness
        </p>

        {streak > 0 && (
          <div className="mt-4 inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 font-bold px-3 py-1 rounded-full text-sm">
            <Flame size={14} />
            <span>
              <AnimatedNumber value={streak} /> Day Streak
            </span>
          </div>
        )}
      </div>

      {/* --- Category stats stack or 2-column grid on mobile --- */}
      <div className="grid grid-cols-2 gap-3 md:flex md:flex-col md:space-y-3 text-left mb-8">
        {(userData?.settings?.categories || []).map((cat) => (
          <div
            key={cat.id}
            className="flex flex-col md:flex-row md:justify-between md:items-center p-3 md:p-0 bg-white/5 border border-white/10 rounded-xl md:bg-transparent md:border-0 text-sm gap-1 md:gap-3"
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: cat.color }}
              ></div>
              <span className="text-secondary-text md:text-primary-text font-medium truncate max-w-[120px] md:max-w-none">
                {cat.label}
              </span>
            </div>
            <span className="font-bold text-xl md:text-lg text-primary-text md:ml-auto">
              <AnimatedNumber value={totalsMap[cat.id] || 0} />
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4 mt-8 border-t border-input-bg pt-6">
        <motion.button
          onClick={handleExport}
          className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-3 md:py-2.5 text-base md:text-sm border border-input-border text-secondary-text rounded-md hover:bg-input-bg hover:text-white transition-colors min-h-[44px] cursor-pointer"
          whileTap={{ scale: 0.95 }}
        >
          <Download size={16} className="md:w-3.5 md:h-3.5" /> Export
        </motion.button>
        <motion.button
          onClick={() => importInputRef.current.click()}
          className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-3 md:py-2.5 text-base md:text-sm border border-input-border text-secondary-text rounded-md hover:bg-input-bg hover:text-white transition-colors min-h-[44px] cursor-pointer"
          whileTap={{ scale: 0.95 }}
        >
          <Upload size={16} className="md:w-3.5 md:h-3.5" /> Import
        </motion.button>
        <input
          type="file"
          ref={importInputRef}
          onChange={handleImport}
          accept=".json"
          className="hidden"
        />
      </div>
    </Card>
  );
};

export default StatsOverview;
