// src/contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authService, User } from '@/services/authService';
import { AUTH_KEYS, clearAuthStorage } from '@/lib/auth';

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuthFromToken: (token: string, user?: User) => void;
  clearAuth: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }
    try {
      const rawUser = localStorage.getItem(AUTH_KEYS.USER);
      if (rawUser) {
        setUser(JSON.parse(rawUser) as User);
      }
    } catch (err) {
      console.error('Failed to parse user from localStorage', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const isAuthenticated = Boolean(user);

  const setAuthFromToken = (token: string, userObj?: User) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(AUTH_KEYS.ACCESS_TOKEN, token);
      if (userObj) {
        localStorage.setItem(AUTH_KEYS.USER, JSON.stringify(userObj));
        setUser(userObj);
      }
      localStorage.setItem(AUTH_KEYS.LOGOUT_SIGNAL, String(Date.now()));
    } catch (e) {
      console.error('setAuthFromToken error', e);
    }
  };

  const clearAuth = () => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(AUTH_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(AUTH_KEYS.USER);
      setUser(null);
    } catch (e) {
      console.error('clearAuth error', e);
    }
  };

  const logout = () => {
    if (typeof window === 'undefined') return;
    try {
      clearAuthStorage();
      router.replace('/login');
    } catch (e) {
      console.error('logout error', e);
      clearAuth();
      router.replace('/login');
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onStorage = (e: StorageEvent) => {
      const key = e.key;
      if (!key) return;

      try {
        if (key === AUTH_KEYS.LOGOUT_SIGNAL) {
          setUser(null);
          router.replace('/login');
          return;
        }

        if (key === AUTH_KEYS.USER || key === AUTH_KEYS.ACCESS_TOKEN) {
          const raw = localStorage.getItem(AUTH_KEYS.USER);
          setUser(raw ? JSON.parse(raw) : null);
        }
      } catch (err) {
        console.error('onStorage handler error', err);
      }
    };

    const onInTabLogout = () => {
      setUser(null);
      router.replace('/login');
    };

    window.addEventListener('storage', onStorage);
    window.addEventListener('app:logout', onInTabLogout);

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('app:logout', onInTabLogout);
    };
  }, [router]);

  /**
   *  AUTO REFRESH TOKEN EVERY 30 MINUTES
   */
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(
      async () => {
        try {
          console.log('🔄 Refreshing token...');

          const res = await authService.refreshToken();
          const newToken = res.data.accessToken;
          const newUser = res.data.user;

          setAuthFromToken(newToken, newUser);
          console.log(' Token refreshed successfully');
        } catch (err) {
          console.error(' Token refresh failed', err);
          logout(); // logout if refresh failed
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
        setAuthFromToken,
        clearAuth,
        logout,
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
