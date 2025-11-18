// src/app/reset-password/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import FormInput from '@/components/ui/authFormInput';
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from '@/validations/reset-password.validation';
import { useResetPassword } from '@/hooks/mutations';

export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tokenFromUrl = searchParams?.get('token') || '';

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: tokenFromUrl,
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Use new reset password mutation hook
  const resetMutation = useResetPassword({
    onSuccess: (data) => {
      setSuccessMessage(data.message || 'Password reset successful.');
      reset({
        token: tokenFromUrl,
        newPassword: '',
        confirmPassword: '',
      });
    },
    onError: (error: any) => {
      const validationErrors = error?.response?.data?.errors;
      const serverMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to reset password. The token might be expired or invalid.';

      if (validationErrors && typeof validationErrors === 'object') {
        // Map field-specific errors
        Object.keys(validationErrors).forEach((field) => {
          setError(field as keyof ResetPasswordFormValues, {
            type: 'server',
            message: validationErrors[field],
          });
        });
      } else {
        // Generic error on token field (shown as banner)
        setError('token', {
          type: 'server',
          message: serverMessage,
        });
      }
    },
  });

  const isLoading = resetMutation.isPending || isSubmitting;

  // Check for token on mount
  useEffect(() => {
    if (!tokenFromUrl) {
      setError('token', {
        type: 'server',
        message: 'Invalid or missing reset token. Please request a new link.',
      });
    }
  }, [tokenFromUrl, setError]);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setSuccessMessage('');
    resetMutation.mutate({
      token: data.token,
      newPassword: data.newPassword,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-linear-to-br from-slate-900 via-blue-900 to-indigo-900 sm:px-6 lg:px-8">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bg-blue-500 rounded-full -top-40 -right-40 w-80 h-80 mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div
          className="absolute bg-indigo-500 rounded-full -bottom-40 -left-40 w-80 h-80 mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl">
        <div className="grid items-center grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left Section - Branding */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="flex flex-col items-start mb-4">
              <div className="flex items-center justify-center w-20 h-20 mb-6 shadow-2xl bg-linear-to-br from-blue-500 to-blue-700 rounded-2xl ring-2 ring-blue-400/20">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white">BRD ASSOCIATES</h1>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl font-bold leading-tight text-white">Reset your password</h2>
              <p className="text-lg text-blue-200">Enter a new password to secure your account.</p>
            </div>

            <div className="pt-8">
              <p className="text-sm leading-relaxed text-blue-100">
                Secure your account with a strong password. Must include uppercase, lowercase,
                number, and special character.
              </p>
            </div>
          </div>

          {/* Right Section - Form */}
          <div className="p-8 border shadow-2xl bg-white/10 backdrop-blur-lg rounded-3xl border-white/20">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Server Error Banner */}
              {errors.token && errors.token.type === 'server' && (
                <div className="flex items-start p-4 space-x-3 duration-300 border bg-red-500/20 border-red-500/50 rounded-xl animate-in fade-in">
                  <AlertCircle className="h-5 w-5 text-red-300 mt-0.5 shrink-0" />
                  <p className="text-sm text-red-100">{errors.token.message}</p>
                </div>
              )}

              {/* Success Banner */}
              {successMessage && (
                <div className="flex items-start p-4 space-x-3 duration-300 border bg-green-500/10 border-green-500/40 rounded-xl animate-in fade-in">
                  <CheckCircle className="h-5 w-5 text-green-300 mt-0.5 shrink-0" />
                  <p className="text-sm text-green-100">{successMessage}</p>
                </div>
              )}

              {/* Hidden token input */}
              <input type="hidden" {...register('token')} />

              {/* New Password Input */}
              <FormInput
                id="newPassword"
                label="New password"
                placeholder="Enter new password"
                icon={<Lock className="w-5 h-5 text-blue-300" />}
                inputProps={{
                  ...register('newPassword'),
                  type: showPassword ? 'text' : 'password',
                }}
                right={
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="transition-transform duration-200 hover:scale-110"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-blue-300" />
                    ) : (
                      <Eye className="w-5 h-5 text-blue-300" />
                    )}
                  </button>
                }
                error={errors.newPassword}
              />
              <p className="-mt-1 text-xs text-blue-200">
                Must be at least 8 characters and include uppercase, lowercase, number, and special
                character.
              </p>

              {/* Confirm Password Input */}
              <FormInput
                id="confirmPassword"
                label="Confirm password"
                placeholder="Confirm password"
                icon={<Lock className="w-5 h-5 text-blue-300" />}
                inputProps={{
                  ...register('confirmPassword'),
                  type: showConfirmPassword ? 'text' : 'password',
                }}
                right={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((s) => !s)}
                    className="transition-transform duration-200 hover:scale-110"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5 text-blue-300" />
                    ) : (
                      <Eye className="w-5 h-5 text-blue-300" />
                    )}
                  </button>
                }
                error={errors.confirmPassword}
              />

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-linear-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
                      <span>Resetting...</span>
                    </div>
                  ) : (
                    <span className="flex items-center space-x-2">
                      <Lock className="w-4 h-4" />
                      <span>Reset password</span>
                    </span>
                  )}
                </button>
              </div>

              {/* Back Button */}
              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="inline-flex items-center space-x-2 text-sm text-blue-100 transition-colors hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              </div>

              {/* Security Notice */}
              <p className="pt-4 text-xs text-center text-blue-200">
                Your password will be encrypted and kept secure.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
