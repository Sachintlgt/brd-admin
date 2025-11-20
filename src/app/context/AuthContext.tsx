// src/contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authService, User } from '@/services/authService';
import { getUserFromCookie, clearAuthStorage, AUTH_KEYS, clearAuthCookies } from '@/lib/auth';
import toast from 'react-hot-toast';

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

  /**
   * AUTO REFRESH TOKEN EVERY 30 MINUTES
   * Backend will update the cookie automatically
   */
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(
      async () => {
        try {
          const res = await authService.refreshToken();
          const newUser = res.data.user;
          // Update user state with fresh data
          setUser(newUser);
        } catch (err) {
          console.log('--------------------------------1');
          clearAuthCookies();
          toast.error('Unauthorized user');
          console.error('❌ Token refresh failed', err);
          await logout(); // logout if refresh failed
          // Redirect
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
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
