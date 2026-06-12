# Project Blueprint: Momentum

## Architecture & Layout

Momentum is a productivity web application built with React, Tailwind CSS, and Framer Motion.

### Component Tree & State Flow

- **App.jsx**
  - **UserProvider** (Provides user settings, profile metadata, logs, and Supabase client bindings)
  - **TourContext / TourProvider** (Orchestrates the interactive welcome tour)
  - **Dashboard.jsx** (Central layout engine and state router)
    - **Header.jsx** (Main header layout)
    - **BottomNav.jsx** (Sticky bottom navigation bar - *mobile-only*)
    - Desktop Layout (>=768px):
      - **DailyTracker.jsx** (Logging tracker)
      - **ActivityChart.jsx** (Productivity bar chart)
      - **CategoryManager.jsx** (Focus area setup configurations)
      - **TodaysRoutinesCard.jsx** (Checklist tracker)
      - **FocusSession.jsx** (Timer controls)
      - **StatsOverview.jsx** (Tally metrics)
      - **History.jsx** (Logbook list)
    - Mobile Layout (<768px):
      - *Home Tab*: DailyTracker (horizontal swipe), TodaysRoutinesCard (compact, scroll-contained)
      - *Timer Tab*: FocusSession (zero scroll flex-centered)
      - *Stats Tab* (Segmented Toggle Controls):
        - Option `"Overview & Chart"`: ActivityChart, StatsOverview
        - Option `"Logbook"`: History
      - *Settings Tab*: CategoryManager (compact categories table)

---

## Architectural Modifications (Version 1.3.0)

### 1. Zero Scroll Architecture (Mobile-first)
- Swapped viewport layouts on mobile to lock the root container size (`h-[100dvh] overflow-hidden`) and scroll content inner-containers independently.
- Introduced custom `.hide-scrollbar` styling layer globally inside `index.css`.

### 2. Segmented Mobile Sub-Navigation
- Inlined toggle views inside `Dashboard.jsx`'s stats tab to prevent vertical stacked overflows.

### 3. Native Bottom Sheet Modals & Liquid Glass
- Refactored `Modal.jsx`, `FirstTimeSetupModal.jsx`, `EditAttemptModal.jsx`, `EditDayModal.jsx`, and `WelcomeTourModal.jsx` to function as animated Framer Motion Bottom Sheets on mobile (`y: 100% -> 0`), while preserving desktop centering using `md:` prefixes.
- Applied consistent "Liquid Glass" overlays (`bg-gray-900/80 backdrop-blur-2xl border-white/10`) across all popovers and modals.
- Enhanced form touch targets (inputs, days toggles, swatches) to a minimum of `44x44px` for improved mobile accessibility.
