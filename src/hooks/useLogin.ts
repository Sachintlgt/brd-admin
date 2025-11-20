'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { useAuth } from '@/app/context/AuthContext';
import toast from 'react-hot-toast';

type LoginVars = { username: string; password: string; role?: string };

export const useLogin = () => {
  const router = useRouter();
  const auth = useAuth();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<any>(null);

  const mutateAsync = async (vars: LoginVars) => {
    setIsPending(true);
    setError(null);

    try {
      const response = await authService.login(vars);

      // Backend has already set the cookies
      const user = response.data.user;

      // Update auth context
      auth.setUser(user);

      // Show success message
      toast.success('Login successful!');

      // Small delay to ensure cookies are set before navigation
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Force refresh to ensure cookie is read
      // auth.refreshUser();

      // Navigate to dashboard
      router.push('/dashboard');
      router.refresh(); // Force a refresh of the current route

      return response;
    } catch (err: any) {
      console.error('Login error:', err);

      // Show user-friendly error message
      const errorMessage =
        err?.response?.data?.message || err?.message || 'Invalid credentials. Please try again.';

      toast.error(errorMessage);

      setError(err);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return {
    mutateAsync,
    isPending,
    error,
  };
};
