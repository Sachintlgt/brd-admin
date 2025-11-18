// src/app/forgot-password/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Mail, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import FormInput from '@/components/ui/authFormInput';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '@/validations/forgot-password.validation';
import { useForgotPassword } from '@/hooks/mutations';

export default function ForgotPassword() {
  const router = useRouter();
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  // Use new forgot password mutation hook
  const mutation = useForgotPassword({
    onSuccess: (data) => {
      setSuccessMessage(
        data.message ||
          "If that email exists in our system, we've sent password reset instructions. Please check your inbox.",
      );
      reset();
    },
    onError: (error: any) => {
      const validationErrors = error?.response?.data?.errors;
      const serverMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to send reset email. Please try again later.';

      if (validationErrors && typeof validationErrors === 'object') {
        // Map field-specific errors
        Object.keys(validationErrors).forEach((field) => {
          setError(field as keyof ForgotPasswordFormValues, {
            type: 'server',
            message: validationErrors[field],
          });
        });
      } else {
        // Generic error on email field
        setError('email', {
          type: 'server',
          message: serverMessage,
        });
      }
    },
  });

  const isLoading = mutation.isPending || isSubmitting;

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setSuccessMessage(''); // Clear previous success message
    mutation.mutate({ email: data.email });
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-linear-to-br from-slate-900 via-blue-900 to-indigo-900 sm:px-6 lg:px-8">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bg-blue-500 rounded-full -top-40 -right-40 w-80 h-80 mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute delay-1000 bg-indigo-500 rounded-full -bottom-40 -left-40 w-80 h-80 mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl">
        <div className="grid items-center grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left Section - Branding */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="flex flex-col items-start mb-4">
              <div className="flex items-center justify-center w-20 h-20 mb-6 shadow-2xl bg-linear-to-br from-blue-500 to-blue-700 rounded-2xl ring-2 ring-blue-400/20">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white">BRD ASSOCIATES</h1>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl font-bold leading-tight text-white">Forgot your password?</h2>
              <p className="text-lg text-blue-200">
                Enter your email and we&apos;ll send a reset link.
              </p>
            </div>

            <div className="pt-8">
              <p className="text-sm leading-relaxed text-blue-100">
                We&apos;ll help you regain access to your account. Enter your registered email
                address and we&apos;ll send you a secure link to reset your password.
              </p>
            </div>
          </div>

          {/* Right Section - Form */}
          <div className="p-8 border shadow-2xl bg-white/10 backdrop-blur-lg rounded-3xl border-white/20">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Server Error Banner */}
              {errors.email && errors.email.type === 'server' && (
                <div className="flex items-start p-4 space-x-3 duration-300 border bg-red-500/20 border-red-500/50 rounded-xl animate-in fade-in">
                  <AlertCircle className="h-5 w-5 text-red-300 mt-0.5 shrink-0" />
                  <p className="text-sm text-red-100">{errors.email.message}</p>
                </div>
              )}

              {/* Success Banner */}
              {successMessage && (
                <div className="flex items-start p-4 space-x-3 duration-300 border bg-green-500/10 border-green-500/40 rounded-xl animate-in fade-in">
                  <CheckCircle className="h-5 w-5 text-green-300 mt-0.5 shrink-0" />
                  <p className="text-sm text-green-100">{successMessage}</p>
                </div>
              )}

              {/* Email Input */}
              <FormInput
                id="email"
                label="Email address"
                placeholder="you@example.com"
                icon={<Mail className="w-5 h-5 text-blue-300" />}
                inputProps={{
                  type: 'email',
                  autoComplete: 'email',
                  ...register('email'),
                }}
                error={errors.email}
              />

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <span className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>Send reset link</span>
                    </span>
                  )}
                </button>
              </div>

              {/* Back Button */}
              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="inline-flex items-center space-x-2 text-sm text-blue-100 transition-colors hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              </div>

              {/* Privacy Notice */}
              <p className="pt-4 text-xs text-center text-blue-200">
                We will never share your email. The link expires for security.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
