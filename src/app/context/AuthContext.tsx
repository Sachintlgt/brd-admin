// src/contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authService, User } from '@/services/authService';
import { getUserFromCookie, clearAuthStorage, AUTH_KEYS } from '@/lib/auth';

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  refreshUser: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load user from cookie on mount
  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    try {
      const cookieUser = getUserFromCookie();
      if (cookieUser) {
        setUser(cookieUser);
      }
    } catch (err) {
      console.error('Failed to load user from cookie', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const isAuthenticated = Boolean(user);

  // Refresh user data from cookie
  const refreshUser = () => {
    if (typeof window === 'undefined') return;

    try {
      const cookieUser = getUserFromCookie();
      setUser(cookieUser);
    } catch (err) {
      console.error('Failed to refresh user from cookie', err);
    }
  };

  // Logout function
  const logout = async () => {
    if (typeof window === 'undefined') return;

    try {
      // Call backend logout endpoint to clear cookies
      await authService.logout();
    } catch (err) {
      console.error('Logout API call failed', err);
    } finally {
      // Clear auth storage (cookies + legacy localStorage)
      clearAuthStorage();
      setUser(null);
      router.replace('/login');
    }
  };

  // Listen for cross-tab logout events
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onStorage = (e: StorageEvent) => {
      const key = e.key;
      if (!key) return;

      try {
        // Handle cross-tab logout
        if (key === AUTH_KEYS.LOGOUT_SIGNAL) {
          setUser(null);
          router.replace('/login');
        }
      } catch (err) {
        console.error('onStorage handler error', err);
      }
    };

    const onInTabLogout = () => {
      setUser(null);
      router.replace('/login');
    };

    // Listen for cookie changes (when login happens in another tab)
    const checkCookieChanges = () => {
      const cookieUser = getUserFromCookie();

      // If cookie user exists but state user doesn't, update state
      if (cookieUser && !user) {
        setUser(cookieUser);
      }
      // If cookie user doesn't exist but state user does, clear state
      else if (!cookieUser && user) {
        setUser(null);
      }
      // If both exist but are different, update state
      else if (cookieUser && user && cookieUser.id !== user.id) {
        setUser(cookieUser);
      }
    };

    // Check for cookie changes periodically (for cross-tab sync)
    const cookieCheckInterval = setInterval(checkCookieChanges, 1000);

    window.addEventListener('storage', onStorage);
    window.addEventListener('app:logout', onInTabLogout);

    return () => {
      clearInterval(cookieCheckInterval);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('app:logout', onInTabLogout);
    };
  }, [router, user]);

  /**
   * AUTO REFRESH TOKEN EVERY 30 MINUTES
   * Backend will update the cookie automatically
   */
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(
      async () => {
        try {
          console.log('🔄 Refreshing token...');

          const res = await authService.refreshToken();
          const newUser = res.data.user;

          // Update user state with fresh data
          setUser(newUser);
          console.log('✅ Token refreshed successfully');
        } catch (err) {
          console.error('❌ Token refresh failed', err);
          await logout(); // logout if refresh failed
        }
      },
      30 * 60 * 1000,
    ); // 30 minutes

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        setUser,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
