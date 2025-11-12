// src/app/(auth)/reset-password/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import {
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
} from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useResetPassword } from '@/hooks/useResetPassword';

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams?.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(''); // for showing server/client errors
  const [success, setSuccess] = useState(''); // for showing server success message
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetMutation = useResetPassword();
  const isLoading = resetMutation.isPending || isSubmitting;

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token. Please request a new link.');
    }
  }, [token]);

const validatePassword = (pwd: string) => {
  if (pwd.length < 8)
    return 'Password must be at least 8 characters long.';
  if (!/[A-Z]/.test(pwd))
    return 'Password must contain at least one uppercase letter.';
  if (!/[a-z]/.test(pwd))
    return 'Password must contain at least one lowercase letter.';
  if (!/[0-9]/.test(pwd))
    return 'Password must contain at least one number.';
  if (!/[!@#$%^&*(),.?":{}|<>_\-\[\]\\;/+~`=]/.test(pwd))
    return 'Password must contain at least one special character.';
  return '';
};


  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault?.();
    setError('');
    setSuccess('');

    if (!token) {
      setError('Missing token. Please use the link you received in email.');
      return;
    }

    if (!password || !confirmPassword) {
      setError('Please fill in both password fields.');
      return;
    }

    const pwdErr = validatePassword(password);
    if (pwdErr) {
      setError(pwdErr);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }

    setIsSubmitting(true);
    resetMutation.mutate(
      { token, newPassword: password },
      {
        onSuccess: (data: any) => {
          // Backend expected success response:
          // { success: true, message: "Password has been reset successfully", data: null }
          setSuccess(data?.message || 'Password reset successful.');
          setPassword('');
          setConfirmPassword('');
          setIsSubmitting(false);

          // redirect to login after short pause so user can read message
          setTimeout(() => router.push('/login'), 1600);
        },
        onError: (err: any) => {
          // authService throws Error with server message (or generic). Show it.
          const msg = err?.message || 'Failed to reset password. The token might be expired or invalid.';
          setError(msg);
          setIsSubmitting(false);
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="flex flex-col items-start mb-4">
              <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-2xl mb-6 ring-2 ring-blue-400/20">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white tracking-tight">BRD ASSOCIATES</h1>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-white leading-tight">Reset your password</h2>
              <p className="text-blue-200 text-lg">Enter a new password to secure your account.</p>
            </div>

            <div className="pt-8">
              <p className="text-blue-100 text-sm leading-relaxed">
                Secure your account with a strong password. Must include uppercase, lowercase and numbers.
              </p>
            </div>
          </div>

          {/* Right - Form */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Server or client error */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 flex items-start space-x-3 animate-in fade-in duration-300">
                  <AlertCircle className="h-5 w-5 text-red-300 mt-0.5 shrink-0" />
                  <p className="text-red-100 text-sm">{error}</p>
                </div>
              )}

              {/* Server success */}
              {success && (
                <div className="bg-green-500/10 border border-green-500/40 rounded-xl p-4 flex items-start space-x-3 animate-in fade-in duration-300">
                  <CheckCircle className="h-5 w-5 text-green-300 mt-0.5 shrink-0" />
                  <p className="text-green-100 text-sm">{success}</p>
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-blue-100">
                  New password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-blue-300" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="block w-full pl-10 pr-12 py-3 bg-white/5 border border-white/20 text-white placeholder-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 sm:text-sm"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-300 hover:text-blue-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="text-xs text-blue-200 mt-2">
                  Must be at least 8 characters and include uppercase, lowercase, number, and special character.
                </p>

              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-blue-100">
                  Confirm password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-blue-300" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="block w-full pl-10 pr-12 py-3 bg-white/5 border border-white/20 text-white placeholder-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 sm:text-sm"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-300 hover:text-blue-200 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Resetting...</span>
                    </div>
                  ) : (
                    <span className="flex items-center space-x-2">
                      <Lock className="h-4 w-4" />
                      <span>Reset password</span>
                    </span>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="inline-flex items-center space-x-2 text-sm text-blue-100 hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
              </div>

              <p className="text-center text-blue-200 text-xs pt-4">Your password will be encrypted and kept secure.</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
