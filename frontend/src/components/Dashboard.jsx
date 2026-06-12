// src/pages/Dashboard.jsx

import { useRef, useState, useEffect } from 'react';
import Header from './features/Header';
import DailyTracker from './features/DailyTracker';
import CategoryManager from './features/CategoryManager';
import FocusSession from './features/FocusSession';
import StatsOverview from './features/StatsOverview';
import History from './features/History';
import TodaysRoutinesCard from './features/TodaysRoutinesCard';
import ActivityChart from './features/ActivityChart';
import Skeleton from './ui/Skeleton';
import { useUser } from '../context/UserProvider';
import { useTour } from '../context/TourContext';
import FirstTimeSetupModal from './features/FirstTimeSetupModal';
import { getTodaysRoutines, updateStreak } from '../utils/routineManager';
import toast from 'react-hot-toast'; // --- 1. Import toast
import { motion, AnimatePresence } from 'framer-motion';
import BottomNav from './ui/BottomNav';

// A helper hook to get the previous value of a state or prop
const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const Dashboard = () => {
  const categoryManagerRef = useRef(null);
  const [celebrationTrigger, setCelebrationTrigger] = useState(null);
  const { userData, loading, isFirstLogin } = useUser(); // Assuming useUser provides userData
  const { setRunTour } = useTour();
  
  const [mobileTab, setMobileTab] = useState('home');
  const [homeSubTab, setHomeSubTab] = useState('mission');
  const [statsSubTab, setStatsSubTab] = useState('overview');
  const [isDesktop, setIsDesktop] = useState(true);

  const celebrationQuotes = [
    "Boom! Routine complete. You're unstoppable. 🚀",
    "That's a win! Keep building that momentum.",
    'Another one bites the dust. Fantastic work! 🔥',
    'Consistency unlocked! Great job staying on track.',
    'You just invested in your future self. ✨',
  ];
  // Track the previous value of isFirstLogin
  const prevIsFirstLogin = usePrevious(isFirstLogin);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)');
    const listener = () => setIsDesktop(media.matches);
    
    // Set initial state
    setIsDesktop(media.matches);
    
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    // Check if the user has just finished the setup modal
    // This happens when isFirstLogin transitions from true to false
    if (prevIsFirstLogin && !isFirstLogin) {
      const tourCompleted = localStorage.getItem('momentumTourCompleted');
      if (!tourCompleted) {
        // Wait for 2 seconds for the modal to close and UI to settle
        const timer = setTimeout(() => {
          setRunTour(true);
        }, 2000);

        // Cleanup the timer if the component unmounts
        return () => clearTimeout(timer);
      }
    }
  }, [isFirstLogin, prevIsFirstLogin, setRunTour]);

  // This effect detects when a routine is completed by comparing previous and current logs
  const prevUserData = useRef(userData);
  useEffect(() => {
    // Ensure we have both previous and current data to compare
    if (prevUserData.current && userData && !loading) {
      const currentRoutines = getTodaysRoutines(
        userData.settings?.categories,
        userData.log
      );
      const previousRoutines = getTodaysRoutines(
        prevUserData.current.settings?.categories,
        prevUserData.current.log
      );

      // Find a routine that was just completed
      const justCompleted = currentRoutines.find((routine) => {
        const prevStatus = previousRoutines.find(
          (pr) => pr.id === routine.id
        )?.status;
        return routine.status === 'completed' && prevStatus === 'pending';
      });

      if (justCompleted) {
        // --- A. Trigger the confetti animation ---
        setCelebrationTrigger({ id: justCompleted.id, timestamp: Date.now() });

        // --- B. Show a random motivational toast ---
        const randomQuote =
          celebrationQuotes[
            Math.floor(Math.random() * celebrationQuotes.length)
          ];
        toast.success(randomQuote, {
          duration: 4000,
          style: {
            borderRadius: '12px',
            background: '#333',
            color: '#fff',
            border: '1px solid #444',
            padding: '16px',
          },
        });
      }
    }
    // Update the ref for the next comparison
    prevUserData.current = userData;
  }, [userData, loading]);

  return (
    <div className="max-w-screen-xl mx-auto p-4 sm:p-8 md:pb-8 h-[100dvh] md:h-auto overflow-hidden md:overflow-visible flex flex-col md:block">
      {/* This now works as originally intended */}
      {isFirstLogin && <FirstTimeSetupModal />}

      {isDesktop ? (
        <>
          <Header />
          <main className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-8 items-start">
          <div className="flex flex-col gap-8">
            <div id="tour-step-1-logging-focus">
              {loading ? <Skeleton height={120} /> : <DailyTracker />}
            </div>
            <div id="tour-step-4-activity-chart">
              {loading ? <Skeleton height={200} /> : <ActivityChart />}
            </div>
            <div id="tour-step-2-managing-areas" ref={categoryManagerRef}>
              {loading ? <Skeleton height={180} /> : <CategoryManager />}
            </div>
          </div>
          <div className="flex flex-col gap-8">
            {loading ? (
              <Skeleton height={150} />
            ) : (
              <div id="tour-step-routines-card">
                <TodaysRoutinesCard
                  categoryManagerRef={categoryManagerRef}
                  celebrationTrigger={celebrationTrigger}
                />
              </div>
            )}
            <div id="tour-step-5-focus-timer">
              {loading ? <Skeleton height={180} /> : <FocusSession />}
            </div>
            <div id="tour-step-3-grand-tally">
              {loading ? <Skeleton height={180} /> : <StatsOverview />}
            </div>
            {loading ? <Skeleton height={150} /> : <History />}
          </div>
          </main>
        </>
      ) : (
        <main className="flex-1 overflow-y-auto min-h-0 hide-scrollbar relative">
          <div className="md:hidden pb-2">
            <Header />
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={mobileTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-5 min-h-full"
            >
              {mobileTab === 'home' && (
                <div className="flex flex-col gap-4">
                  <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 w-full flex-shrink-0">
                    <button
                      onClick={() => setHomeSubTab('mission')}
                      className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                        homeSubTab === 'mission'
                          ? 'bg-accent text-bg-color font-bold'
                          : 'text-secondary-text hover:text-primary-text'
                      }`}
                    >
                      Mission
                    </button>
                    <button
                      onClick={() => setHomeSubTab('routines')}
                      className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                        homeSubTab === 'routines'
                          ? 'bg-accent text-bg-color font-bold'
                          : 'text-secondary-text hover:text-primary-text'
                      }`}
                    >
                      Routines
                    </button>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={homeSubTab}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.15 }}
                      className="flex flex-col gap-4"
                    >
                      {homeSubTab === 'mission' ? (
                        <div className="flex flex-col">
                          <div id="tour-step-1-logging-focus">
                            {loading ? <Skeleton height={120} /> : <DailyTracker />}
                          </div>
                          <div className="h-24 flex-shrink-0 w-full" />
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          {loading ? (
                            <Skeleton height={150} />
                          ) : (
                            <div id="tour-step-routines-card">
                              <TodaysRoutinesCard
                                categoryManagerRef={categoryManagerRef}
                                celebrationTrigger={celebrationTrigger}
                              />
                            </div>
                          )}
                          <div className="h-24 flex-shrink-0 w-full" />
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}

              {mobileTab === 'timer' && (
                <div id="tour-step-5-focus-timer" className="flex flex-col">
                  {loading ? <Skeleton height={180} /> : <FocusSession />}
                  <div className="h-24 flex-shrink-0 w-full" />
                </div>
              )}

              {mobileTab === 'stats' && (
                <div className="flex flex-col gap-4">
                  {/* Segmented Control Sub-Nav */}
                  <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 w-full flex-shrink-0">
                    <button
                      onClick={() => setStatsSubTab('overview')}
                      className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                        statsSubTab === 'overview'
                          ? 'bg-accent text-bg-color font-bold'
                          : 'text-secondary-text hover:text-primary-text'
                      }`}
                    >
                      Overview & Chart
                    </button>
                    <button
                      onClick={() => setStatsSubTab('logbook')}
                      className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                        statsSubTab === 'logbook'
                          ? 'bg-accent text-bg-color font-bold'
                          : 'text-secondary-text hover:text-primary-text'
                      }`}
                    >
                      Logbook
                    </button>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={statsSubTab}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.15 }}
                      className="flex flex-col gap-4"
                    >
                      {statsSubTab === 'overview' ? (
                        <>
                          <div id="tour-step-4-activity-chart" className="flex-shrink-0">
                            {loading ? <Skeleton height={200} /> : <ActivityChart />}
                          </div>
                          <div id="tour-step-3-grand-tally">
                            {loading ? <Skeleton height={180} /> : <StatsOverview />}
                          </div>
                          <div className="h-24 flex-shrink-0 w-full" />
                        </>
                      ) : (
                        <div className="flex flex-col">
                          {loading ? <Skeleton height={150} /> : <History />}
                          <div className="h-24 flex-shrink-0 w-full" />
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}

              {mobileTab === 'settings' && (
                <div className="flex flex-col">
                  <div id="tour-step-2-managing-areas" ref={categoryManagerRef}>
                    {loading ? <Skeleton height={180} /> : <CategoryManager />}
                  </div>
                  <div className="h-24 flex-shrink-0 w-full mt-auto" />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      )}

      <BottomNav activeTab={mobileTab} onTabChange={setMobileTab} />
    </div>
  );
};

export default Dashboard;

