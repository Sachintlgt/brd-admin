// src/lib/auth.ts
export const AUTH_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  USER: 'user',
  LOGOUT_SIGNAL: 'logout', // localStorage key to trigger storage events
};

// Clears tokens & notifies other contexts
export function clearAuthStorage() {
  try {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(AUTH_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(AUTH_KEYS.USER);
    // write a timestamp to trigger storage events in other tabs
    localStorage.setItem(AUTH_KEYS.LOGOUT_SIGNAL, String(Date.now()));
    // also dispatch an in-tab event so same-tab listeners can respond
    window.dispatchEvent(new Event('app:logout'));
  } catch (e) {
    // swallow errors
    // eslint-disable-next-line no-console
    console.error('clearAuthStorage error', e);
  }
}
