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
      const token = response.data.accessToken;
      const user = response.data.user;
      auth.setAuthFromToken(token, user);
      router.push('/dashboard');
    },
    onError: (err: any) => {
      // you can handle global side-effects here if needed
      console.error('Login error', err);
    },
  });

  return mutation;
};
