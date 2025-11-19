'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { useAuth } from '@/app/context/AuthContext';

type LoginVars = { username: string; password: string };

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
      auth.setUser(user);
      auth.refreshUser();

      router.push('/dashboard');
      return response;
    } catch (err: any) {
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
