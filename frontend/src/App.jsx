// src/App.jsx

import { Toaster } from 'react-hot-toast';
import { UserProvider, useUser } from './context/UserProvider';
import { TourProvider } from './context/TourContext';
import LoginScreen from './components/LoginScreen';
import Dashboard from './components/Dashboard';
import MainLoader from './components/ui/MainLoader';
import { useAuth } from './hooks/useAuth';
import { useState } from 'react';

const AppContent = () => {
  // به جای useAppContext از useAuth و useUser استفاده می‌کنیم
  const { session, loadingAuth } = useAuth();
  const { loading: loadingUser } = useUser();
  const [animationComplete, setAnimationComplete] = useState(false);

  const handleAnimationEnd = () => {
    setAnimationComplete(true); // زمانی که انیمیشن تمام شد، این حالت تغییر می‌کند
  };
  // اگر در حال بررسی اولیه session هستیم، لودر را نشان بده
  if (loadingAuth) {
    return <MainLoader />;
  }

  // اگر session وجود ندارد، صفحه لاگین را نشان بده
  if (!session) {
    return <LoginScreen />;
  }

  // اگر session وجود دارد ولی هنوز در حال لود پروفایل کاربر هستیم، لودر را نشان بده
  if ((session && loadingUser) || !animationComplete) {
    return <MainLoader onAnimationEnd={handleAnimationEnd} />;
  }

  // در نهایت، داشبورد را نشان بده
  return <Dashboard />;
};

export default function App() {
  return (
    // TourProvider باید داخل UserProvider باشد تا به اطلاعات کاربر دسترسی داشته باشد
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
