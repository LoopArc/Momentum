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

## Architectural Modifications (Version 1.2.0)

### 1. Zero Scroll Architecture (Mobile-first)
- Swapped viewport layouts on mobile to lock the root container size (`h-[100dvh] overflow-hidden`) and scroll content inner-containers independently.
- Introduced custom `.hide-scrollbar` styling layer globally inside `index.css`.

### 2. Segmented Mobile Sub-Navigation
- Inlined toggle views inside `Dashboard.jsx`'s stats tab to prevent vertical stacked overflows.

### 3. Responsive Color Picker Bottom Sheet
- Re-architected `ColorPicker.jsx` using `matchMedia` state tracking.
- Renders custom sliding overlay backdrops and spring-animated panel drawers from the bottom edge on mobile, while preserving absolute tooltip placement on desktop.
