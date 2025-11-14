// src/hooks/useLogin.ts
'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { useAuth } from '@/app/context/AuthContext';

type LoginVars = { username: string; password: string };

export const useLogin = () => {
  const router = useRouter();
  const auth = useAuth();

  const mutation = useMutation({
    mutationFn: async (vars: LoginVars) => {
      return await authService.login(vars);
    },
    onSuccess: (response) => {
      // Backend has already set the cookies (accessToken and userData)
      // Just update the user state in context
      const user = response.data.user;
      auth.setUser(user);

      // Optionally refresh user from cookie to ensure sync
      auth.refreshUser();

      router.push('/dashboard');
    },
    onError: (err: any) => {
      // Handle global side-effects here if needed
      console.error('Login error', err);
    },
  });

  return mutation;
};
