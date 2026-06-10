/**
 * Thin fetch wrapper for the local Momentum backend.
 * All requests go to /api/* which Vite proxies to http://localhost:3001.
 */

const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
    body: options.body != null ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  /** Fetch full profile + userData */
  getProfile: () => request('/profile'),

  /** Mark onboarding complete */
  completeOnboarding: () => request('/profile/onboarding', { method: 'PATCH' }),

  /** Replace all categories at once */
  saveCategories: (categories) =>
    request('/categories', { method: 'PUT', body: categories }),

  /** Replace full log */
  saveLog: (log) => request('/log', { method: 'PUT', body: log }),

  /** Upsert a single day's log entries */
  saveDayLog: (date, entries) =>
    request(`/log/${date}`, { method: 'PUT', body: entries }),

  /** Upsert arbitrary settings keys */
  patchSettings: (settings) =>
    request('/settings', { method: 'PATCH', body: settings }),
};
