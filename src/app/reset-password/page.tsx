'use client';
import React, { useEffect } from 'react';
import {Lock,Eye,EyeOff,AlertCircle,CheckCircle,ArrowLeft,} from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import FormInput from '@/components/ui/FormInput';
import { resetPasswordSchema, type ResetPasswordFormValues } from '@/validations/reset-password.validation';
import { useResetPassword } from '@/hooks/useResetPassword';

export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tokenFromUrl = searchParams?.get('token') || '';

  const resetMutation = useResetPassword();

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

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const [successMessage, setSuccessMessage] = React.useState('');
  const isLoading = resetMutation.isPending || isSubmitting;

  useEffect(() => {
    if (!tokenFromUrl) {
      setError('token' as any, {
        type: 'server',
        message: 'Invalid or missing reset token. Please request a new link.',
      });
    }
  }, [tokenFromUrl]);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setSuccessMessage('');
    try {
      await resetMutation.mutateAsync(
        { token: data.token, newPassword: data.newPassword },
        {
          onSuccess: (res: any) => {
            setSuccessMessage(res?.message || 'Password reset successful.');
            reset({ token: data.token, newPassword: '', confirmPassword: '' });
            setTimeout(() => router.push('/login'), 1600);
          },
        }
      );
    } catch (err: any) {
      const validationErrors = err?.response?.data?.errors;
      const serverMessage = err?.response?.data?.message || err?.message || 'Failed to reset password. The token might be expired or invalid.';

      if (validationErrors && typeof validationErrors === 'object') {
        Object.keys(validationErrors).forEach((field) => {
          setError(field as keyof ResetPasswordFormValues, {
            type: 'server',
            message: validationErrors[field],
          } as any);
        });
      } else {
        setError('token' as any, { type: 'server', message: serverMessage } as any);
      }
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
              <div className="h-20 w-20 bg-linear-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-2xl mb-6 ring-2 ring-blue-400/20">
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
                Secure your account with a strong password. Must include uppercase, lowercase, number, and special character.
              </p>
            </div>
          </div>

          {/* Right - Form */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* server-level banner: shown when token has server error (keeps parity with login mapping) */}
              {errors.token && errors.token.type === 'server' && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 flex items-start space-x-3 animate-in fade-in duration-300">
                  <AlertCircle className="h-5 w-5 text-red-300 mt-0.5 shrink-0" />
                  <p className="text-red-100 text-sm">{errors.token.message}</p>
                </div>
              )}

              {successMessage && (
                <div className="bg-green-500/10 border border-green-500/40 rounded-xl p-4 flex items-start space-x-3 animate-in fade-in duration-300">
                  <CheckCircle className="h-5 w-5 text-green-300 mt-0.5 shrink-0" />
                  <p className="text-green-100 text-sm">{successMessage}</p>
                </div>
              )}

              {/* hidden token input so token validation participates in formState */}
              <input type="hidden" {...register('token')} />

              <FormInput
                id="newPassword"
                label="New password"
                placeholder="Enter new password"
                icon={<Lock className="h-5 w-5 text-blue-300" />}
                inputProps={{
                  ...register('newPassword'),
                  type: showPassword ? 'text' : 'password',
                }}
                right={
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="hover:scale-110 transition-transform duration-200"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5 text-blue-300" /> : <Eye className="h-5 w-5 text-blue-300" />}
                  </button>
                }
                error={errors.newPassword as any}
              />
              <p className="text-xs text-blue-200 -mt-1">
                Must be at least 8 characters and include uppercase, lowercase, number, and special character.
              </p>

              <FormInput
                id="confirmPassword"
                label="Confirm password"
                placeholder="Confirm password"
                icon={<Lock className="h-5 w-5 text-blue-300" />}
                inputProps={{
                  ...register('confirmPassword'),
                  type: showConfirmPassword ? 'text' : 'password',
                }}
                right={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((s) => !s)}
                    className="hover:scale-110 transition-transform duration-200"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5 text-blue-300" /> : <Eye className="h-5 w-5 text-blue-300" />}
                  </button>
                }
                error={errors.confirmPassword as any}
              />

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-linear-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
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
