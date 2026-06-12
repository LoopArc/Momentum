import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserProvider';
import MomentumLogo from '../ui/MomentumLogo';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2,
  BookOpen,
  Palette,
  Briefcase,
  Feather,
  Laptop,
  CheckCircle2,
} from 'lucide-react';

const TEMPLATES = {
  Developer: {
    icon: <Code2 className="w-6 h-6 text-secondary-text" />,
    description: 'Coding, Code Review, Docs',
    categories: [
      { id: 'coding', label: 'Coding', color: '#ef4444' },
      { id: 'code-review', label: 'Code Review', color: '#f97316' },
      { id: 'docs', label: 'Documentation', color: '#ec4899' },
    ],
  },
  Student: {
    icon: <BookOpen className="w-6 h-6 text-secondary-text" />,
    description: 'Study, Research, Assignments',
    categories: [
      { id: 'study', label: 'Study', color: '#3b82f6' },
      { id: 'research', label: 'Research', color: '#8b5cf6' },
      { id: 'assignment', label: 'Assignment', color: '#10b981' },
    ],
  },
  Designer: {
    icon: <Palette className="w-6 h-6 text-secondary-text" />,
    description: 'UI Design, UX Research, Prototyping',
    categories: [
      { id: 'ui-design', label: 'UI Design', color: '#14b8a6' },
      { id: 'ux-research', label: 'UX Research', color: '#84cc16' },
      { id: 'prototyping', label: 'Prototyping', color: '#f59e0b' },
    ],
  },
  Manager: {
    icon: <Briefcase className="w-6 h-6 text-secondary-text" />,
    description: 'Meetings, Planning, 1-on-1s',
    categories: [
      { id: 'meetings', label: 'Meetings', color: '#6366f1' },
      { id: 'planning', label: 'Planning', color: '#a855f7' },
      { id: 'one-on-ones', label: '1-on-1s', color: '#d946ef' },
    ],
  },
  Writer: {
    icon: <Feather className="w-6 h-6 text-secondary-text" />,
    description: 'Writing, Editing, Brainstorming',
    categories: [
      { id: 'writing', label: 'Writing', color: '#0ea5e9' },
      { id: 'editing', label: 'Editing', color: '#64748b' },
      { id: 'brainstorming', label: 'Brainstorming', color: '#78716c' },
    ],
  },
  Freelancer: {
    icon: <Laptop className="w-6 h-6 text-secondary-text" />,
    description: 'Client Work, Admin, Marketing',
    categories: [
      { id: 'client-work', label: 'Client Work', color: '#22c55e' },
      { id: 'admin', label: 'Admin', color: '#f43f5e' },
      { id: 'marketing', label: 'Marketing', color: '#eab308' },
    ],
  },
};

const FirstTimeSetupModal = () => {
  const { userData, saveData, completeOnboarding } = useUser();
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleTemplate = (templateName) => {
    setSelectedTemplates((prev) =>
      prev.includes(templateName)
        ? prev.filter((t) => t !== templateName)
        : [...prev, templateName]
    );
  };

  const handleFinishSetup = () => {
    if (!userData) return;

    const templateCategories = selectedTemplates.flatMap(
      (template) => TEMPLATES[template].categories
    );

    const newUserData = {
      ...userData,
      settings: {
        ...userData.settings,
        // We start with a clean slate, so no need to merge with existing.
        categories: [...templateCategories],
      },
    };

    saveData(newUserData);
    completeOnboarding();
  };

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
          className="w-full bg-surface/80 backdrop-blur-xl border-t border-white/10 rounded-t-2xl shadow-2xl pointer-events-auto relative z-10 p-6 md:p-8 md:max-w-2xl md:rounded-2xl md:border md:shadow-xl text-left max-h-[85vh] overflow-y-auto hide-scrollbar pb-safe"
        >
          {isMobile && (
            <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6 mt-[-10px]" />
          )}
          <div className="flex items-center gap-3 mb-4">
            <MomentumLogo className="text-accent h-6 w-6" />
            <h1 className="text-primary-text text-xl font-semibold">
              Choose your role
            </h1>
          </div>
          <p className="text-secondary-text text-sm mb-6">
            Pick one or more roles to pre-fill your focus areas.
          </p>

          {/* Mosaic-style selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {Object.entries(TEMPLATES).map(([name, { icon, description }]) => {
              const isSelected = selectedTemplates.includes(name);
              return (
                <button
                  key={name}
                  onClick={() => toggleTemplate(name)}
                  className={`flex flex-col items-start gap-2 p-4 rounded-xl border transition-all duration-200 group hover:scale-[1.015] min-h-[80px]
                ${
                  isSelected
                    ? 'bg-accent/10 border-accent'
                    : 'bg-input-bg border-border-default hover:border-gray-500'
                }`}
                >
                  <div className="flex items-center gap-2 w-full">
                    {icon}
                    <span className="text-primary-text font-medium">{name}</span>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-accent ml-auto" />
                    )}
                  </div>
                  <p className="text-sm text-secondary-text text-left">{description}</p>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col items-center gap-3">
            <button
              onClick={handleFinishSetup}
              className="w-full py-3 rounded-lg font-medium text-base cursor-pointer transition-colors bg-accent text-bg-color hover:bg-button-hover min-h-[44px]"
            >
              {selectedTemplates.length > 0
                ? `Continue with ${selectedTemplates.length} role(s)`
                : 'Continue'}
            </button>
            <button
              onClick={handleFinishSetup}
              className="text-secondary-text hover:text-primary-text text-sm font-medium transition-colors min-h-[44px] flex items-center"
            >
              I'll start from scratch
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default FirstTimeSetupModal;

