// src/lib/auth.ts

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }

  return null;
}

/**
 * Get user data from cookie
 */
export function getUserFromCookie() {
  const userDataString = getCookie('userData');

  if (userDataString) {
    try {
      return JSON.parse(decodeURIComponent(userDataString));
    } catch (error) {
      console.error('Failed to parse user data from cookie:', error);
      return null;
    }
  }

  return null;
}

/**
 * Check if user is authenticated (has accessToken cookie)
 */
export function isAuthenticated(): boolean {
  return getCookie('accessToken') !== null;
}

/**
 * Clear auth cookies by setting them to expire
 * Fixed SameSite attribute to match backend
 */
export function clearAuthCookies() {
  if (typeof document === 'undefined') return;

  const isProduction = process.env.NODE_ENV === 'production';

  // Match backend: 'none' for production, 'lax' for development
  const sameSite = isProduction ? 'None' : 'Strict';
  const secure = isProduction ? 'Secure;' : '';

  // Clear accessToken cookie
  document.cookie = `accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=${sameSite}; ${secure}`;

  // Clear userData cookie
  document.cookie = `userData=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=${sameSite}; ${secure}`;

  // Trigger logout event for cross-tab sync
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('app:logout'));
    localStorage.setItem('LOGOUT_SIGNAL', String(Date.now()));
  }
}

/**
 * Legacy support - kept for backwards compatibility
 */
export const AUTH_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  USER: 'user',
  LOGOUT_SIGNAL: 'LOGOUT_SIGNAL',
};

/**
 * Clear auth storage (legacy localStorage + cookies)
 */
export function clearAuthStorage() {
  // Clear cookies
  clearAuthCookies();

  // Clear any legacy localStorage data
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(AUTH_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(AUTH_KEYS.USER);
      localStorage.setItem(AUTH_KEYS.LOGOUT_SIGNAL, String(Date.now()));
    } catch (e) {
      console.error('Error clearing localStorage:', e);
    }
  }
}
