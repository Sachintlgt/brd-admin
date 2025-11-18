// src/app/login/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Building2, Lock, AlertCircle, User } from 'lucide-react';

import FormInput from '@/components/ui/authFormInput';
import { loginSchema, type LoginFormValues } from '@/validations/auth.validation';
import { useLogin } from '@/hooks/mutations';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthLoading, isAuthenticated, router]);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Use new login mutation hook
  const loginMutation = useLogin({
    onError: (error: any) => {
      // Handle validation errors from server
      const validationErrors = error?.response?.data?.errors;
      const serverMessage =
        error?.response?.data?.message ||
        error?.message ||
        'Invalid credentials. Please try again.';

      if (validationErrors && typeof validationErrors === 'object') {
        // Map field-specific errors
        Object.keys(validationErrors).forEach((field) => {
          setError(field as keyof LoginFormValues, {
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

  // Submit handler
  const onSubmit = async (data: LoginFormValues) => {
    const payload = {
      username: data.email,
      password: data.password,
      ...(data.role && { role: data.role }),
    };

    loginMutation.mutate(payload);
  };

  const isLoading = loginMutation.isPending || isSubmitting;

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-linear-to-br from-slate-900 via-blue-900 to-indigo-900 sm:px-6 lg:px-8">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bg-blue-500 rounded-full -top-40 -right-40 w-80 h-80 mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute delay-1000 bg-indigo-500 rounded-full -bottom-40 -left-40 w-80 h-80 mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 grid w-full max-w-6xl grid-cols-1 overflow-hidden shadow-2xl bg-white/5 backdrop-blur rounded-3xl md:grid-cols-2">
        {/* Left Side - Branding */}
        <div className="flex-col items-start justify-center hidden p-12 text-white md:flex bg-linear-to-br from-slate-800/30 via-blue-800/30 to-indigo-800/30">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-0 shadow-2xl bg-linear-to-br from-blue-500 to-blue-700 rounded-2xl ring-2 ring-blue-400/20">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">BRD ASSOCIATES</h1>
          </div>

          <h2 className="text-4xl font-extrabold leading-tight">Welcome Back</h2>
          <p className="mt-2 text-lg text-blue-200">Sign in to your account</p>

          <p className="max-w-xs mt-6 text-sm text-blue-100/80">
            Securely access your professional workspace to manage projects, clients, and internal
            resources.
          </p>
        </div>

        {/* Right Side - Form */}
        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile Header */}
            <div className="mb-6 text-center md:hidden">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 shadow-2xl bg-linear-to-br from-blue-500 to-blue-700 rounded-2xl ring-2 ring-blue-400/20">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-white">BRD ASSOCIATES</h1>
                <h2 className="mt-2 text-2xl font-bold text-white">Welcome Back</h2>
                <p className="text-lg text-blue-200">Sign in to your account</p>
              </div>
            </div>

            {/* Form Container */}
            <div className="p-8 border shadow-2xl bg-white/10 backdrop-blur-lg rounded-3xl border-white/20">
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                {/* Server Error Banner */}
                {errors.email && errors.email.type === 'server' && (
                  <div className="flex items-start p-4 space-x-3 duration-300 border bg-red-500/20 border-red-500/50 rounded-xl animate-in fade-in">
                    <AlertCircle className="h-5 w-5 text-red-300 mt-0.5 shrink-0" />
                    <p className="text-sm text-red-100">{errors.email.message}</p>
                  </div>
                )}

                {/* Email Input */}
                <FormInput
                  id="email"
                  label="Email"
                  placeholder="Enter your email"
                  icon={<User className="w-5 h-5 text-blue-300" />}
                  inputProps={{
                    ...register('email'),
                    autoComplete: 'username',
                  }}
                  error={errors.email}
                />

                {/* Password Input */}
                <FormInput
                  id="password"
                  label="Password"
                  placeholder="Enter your password"
                  icon={<Lock className="w-5 h-5 text-blue-300" />}
                  inputProps={{
                    ...register('password'),
                    type: showPassword ? 'text' : 'password',
                    autoComplete: 'current-password',
                  }}
                  right={
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="transition-transform duration-200 hover:scale-110"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-blue-300 hover:text-blue-200" />
                      ) : (
                        <Eye className="w-5 h-5 text-blue-300 hover:text-blue-200" />
                      )}
                    </button>
                  }
                  error={errors.password}
                />

                {/* Forgot Password Link */}
                <div className="flex justify-end text-sm">
                  <a
                    href="/forgot-password"
                    className="font-medium text-blue-300 transition-colors duration-200 hover:text-blue-200"
                  >
                    Forgot password?
                  </a>
                </div>

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
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      <span className="flex items-center space-x-2">
                        <Lock className="w-4 h-4" />
                        <span>Sign in to continue</span>
                      </span>
                    )}
                  </button>
                </div>

                {/* Security Notice */}
                <div className="pt-4 text-center">
                  <p className="text-xs text-blue-200">
                    Secure access to your professional workspace
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
