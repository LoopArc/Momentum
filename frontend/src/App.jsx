import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { UserProvider, useUser } from './context/UserProvider';
import { TourProvider } from './context/TourContext';
import Dashboard from './components/Dashboard';
import MainLoader from './components/ui/MainLoader';

const AppContent = () => {
  const { loading } = useUser();
  const [animationComplete, setAnimationComplete] = useState(false);

  if (loading || !animationComplete) {
    return <MainLoader onAnimationEnd={() => setAnimationComplete(true)} />;
  }

  return <Dashboard />;
};

export default function App() {
  return (
    <UserProvider>
      <TourProvider>
        <div className="min-h-screen bg-bg-color text-primary-text font-sans">
          <AppContent />
        </div>
        <Toaster position="top-center" />
      </TourProvider>
    </UserProvider>
  );
}
