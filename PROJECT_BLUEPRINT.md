# Project Blueprint: Momentum

## Architecture & Layout

Momentum is a productivity web application built with React, Tailwind CSS, and Framer Motion.

### Component Tree & State Flow

- **App.jsx**
  - **UserProvider** (Provides user settings, profile metadata, logs, and Supabase client bindings)
  - **TourContext / TourProvider** (Orchestrates the interactive user onboarding welcome tour)
  - **Dashboard.jsx** (Central state driver for routines, logs, and layout routing)
    - **Header.jsx** (Main top bar)
    - **BottomNav.jsx** (Sticky bottom navigation bar - *mobile-only*)
    - Desktop Layout (>=768px):
      - **DailyTracker.jsx** (Mission metrics)
      - **ActivityChart.jsx** (Productivity bar chart)
      - **CategoryManager.jsx** (Area focus configurations)
      - **TodaysRoutinesCard.jsx** (Routines checklist)
      - **FocusSession.jsx** (Focus timer)
      - **StatsOverview.jsx** (Overall statistics summaries)
      - **History.jsx** (Historical routines log)
    - Mobile Layout (<768px):
      - *Home Tab*: DailyTracker, TodaysRoutinesCard
      - *Timer Tab*: FocusSession
      - *Stats Tab*: ActivityChart, StatsOverview, History
      - *Settings Tab*: CategoryManager

---

## Architectural Modifications (Version 1.1.0)

### Mobile Optimization Integration
1. **Dynamic Viewport Routing:** Dashboard conditionally swaps between full grid presentation and single-tab animated viewports based on a CSS matchMedia check.
2. **Liquid Glass styling:** Integrated responsive glassmorphism styles on overlay, navs, and setup panels utilizing backdrop filters (`backdrop-blur-xl bg-gray-900/60 border border-white/10`).
3. **Viewport Bounds Preservation:** Implemented scrolling overflow panels on setups and interactive modals to guarantee usability on narrow viewports.
