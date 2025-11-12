'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation'; // 👈 import router for redirection
import { User } from '@/services/authService';

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuthFromToken: (token: string, user?: User) => void;
  clearAuth: () => void;
  logout: () => void; // 👈 new function
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const rawUser = localStorage.getItem('user');
      if (rawUser) {
        const parsed = JSON.parse(rawUser) as User;
        setUser(parsed);
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
    localStorage.setItem('accessToken', token);
    if (userObj) {
      localStorage.setItem('user', JSON.stringify(userObj));
      setUser(userObj);
    }
  };

  const clearAuth = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  // ✅ logout: clear auth and redirect to /login
  const logout = () => {
    clearAuth();
    router.replace('/login'); // redirect user
  };

  // Sync across tabs
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'accessToken' || e.key === 'user') {
        const raw = localStorage.getItem('user');
        setUser(raw ? JSON.parse(raw) : null);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        setAuthFromToken,
        clearAuth,
        logout, // 👈 added here
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
