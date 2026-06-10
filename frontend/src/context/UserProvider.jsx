import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { api } from '../lib/apiClient';
import { EMPTY_USER_DATA } from '../utils/constants';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) throw new Error('useUser must be within a UserProvider');
  return context;
};

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  // ─── Load profile on mount ────────────────────────────────────────────────
  useEffect(() => {
    api.getProfile()
      .then((profile) => {
        setIsFirstLogin(profile.isFirstLogin);
        const incoming = profile.userData || {};
        const settings = { ...EMPTY_USER_DATA.settings, ...(incoming.settings || {}) };
        const log = incoming.log || EMPTY_USER_DATA.log;
        setUserData({ settings, log });
      })
      .catch((err) => {
        console.error('Failed to load profile:', err);
        setUserData(JSON.parse(JSON.stringify(EMPTY_USER_DATA)));
      })
      .finally(() => setLoading(false));
  }, []);

  // ─── saveData — persists full userData to backend ─────────────────────────
  const saveData = useCallback(async (newUserData) => {
    if (!newUserData) return;
    setUserData(newUserData);
    try {
      const { settings, log } = newUserData;
      const settingsPatch = { focusDuration: settings.focusDuration };
      if (settings.focusSession !== undefined) {
        settingsPatch.focusSession = settings.focusSession;
      }
      await Promise.all([
        api.saveCategories(settings.categories || []),
        api.saveLog(log || {}),
        api.patchSettings(settingsPatch),
      ]);
    } catch (err) {
      console.error('Error saving data:', err);
    }
  }, []);

  // ─── completeOnboarding ───────────────────────────────────────────────────
  const completeOnboarding = useCallback(async () => {
    setIsFirstLogin(false);
    try {
      await api.completeOnboarding();
    } catch (err) {
      console.error('Error completing onboarding:', err);
    }
  }, []);

  const value = {
    session: { user: { id: 'local' } },
    userData,
    saveData,
    loading,
    isFirstLogin,
    completeOnboarding,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
