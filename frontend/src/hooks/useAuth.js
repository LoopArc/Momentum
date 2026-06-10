/**
 * Local auth hook — no external auth provider.
 * Returns a stable synthetic session so App.jsx routing logic is unchanged.
 */
export function useAuth() {
  return {
    session: { user: { id: 'local' } },
    loadingAuth: false,
  };
}
