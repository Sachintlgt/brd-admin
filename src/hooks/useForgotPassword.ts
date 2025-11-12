// src/hooks/useForgotPassword.ts
'use client';

import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { forgotPasswordService, ForgotPasswordResponse } from '@/services/forgotPasswordService';

export type ForgotPasswordVars = { email: string };
export type ForgotPasswordError = AxiosError<{ message?: string }>;

export const useForgotPassword = () => {
  return useMutation<
    ForgotPasswordResponse,  
    ForgotPasswordError,    
    ForgotPasswordVars       
  >({
    mutationFn: async ({ email }) => {
      // call the actual service method
      return forgotPasswordService.forgotPassword(email);
    },
  });
};
