'use client';

import React, { useEffect } from 'react';
import { Mail, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import FormInput from '@/components/ui/authFormInput';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/validations/forgot-password.validation';
import { useForgotPassword } from '@/hooks/useForgotPassword';

export default function ForgotPassword() {
  const router = useRouter();
  const mutation = useForgotPassword();

  const [successMessage, setSuccessMessage] = React.useState('');


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

  const isLoading = mutation.isPending || isSubmitting;

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      await mutation.mutateAsync(
        { email: data.email },
        {
          onSuccess: () => {
            reset();
          },
        }
      );
    } catch (err: any) {
      const validationErrors = err?.response?.data?.errors;
      const serverMessage = err?.response?.data?.message || err?.message || 'Failed to send reset email. Please try again later.';

      if (validationErrors && typeof validationErrors === 'object') {
        Object.keys(validationErrors).forEach((field) => {
          setError(field as keyof ForgotPasswordFormValues, {
            type: 'server',
            message: validationErrors[field],
          } as any);
        });
      } else {
        setError('email', { type: 'server', message: serverMessage });
      }
    }
  };

  useEffect(() => {
    if (mutation.isSuccess) {
      setSuccessMessage(
        "If that email exists in our system, we've sent password reset instructions. Please check your inbox."
      );
      reset();
    }
  }, [mutation.isSuccess]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Section */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="flex flex-col items-start mb-4">
              <div className="h-20 w-20 bg-linear-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-2xl mb-6 ring-2 ring-blue-400/20">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white tracking-tight">BRD ASSOCIATES</h1>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-white leading-tight">Forgot your password?</h2>
              <p className="text-blue-200 text-lg">Enter your email and we&apos;ll send a reset link.</p>
            </div>

            <div className="pt-8">
              <p className="text-blue-100 text-sm leading-relaxed">
                We&apos;ll help you regain access to your account. Enter your registered email address and we&apos;ll send you a secure link to reset your password.
              </p>
            </div>
          </div>

          {/* Right Section - Form */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Server-level banner: same logic as login — shown when email has server error */}
              {errors.email && errors.email.type === 'server' && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 flex items-start space-x-3 animate-in fade-in duration-300">
                  <AlertCircle className="h-5 w-5 text-red-300 mt-0.5 shrink-0" />
                  <p className="text-red-100 text-sm">{errors.email.message}</p>
                </div>
              )}

              {successMessage && (
                <div className="bg-green-500/10 border border-green-500/40 rounded-xl p-4 flex items-start space-x-3 animate-in fade-in duration-300">
                  <CheckCircle className="h-5 w-5 text-green-300 mt-0.5 shrink-0" />
                  <p className="text-green-100 text-sm">{successMessage}</p>
                </div>
              )}

              <FormInput
                id="email"
                label="Email address"
                placeholder="you@example.com"
                icon={<Mail className="h-5 w-5 text-blue-300" />}
                inputProps={{
                  type: 'email',
                  autoComplete: 'email',
                  ...register('email'),
                }}
                error={errors.email}
              />

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <span className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>Send reset link</span>
                    </span>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="inline-flex items-center space-x-2 text-sm text-blue-100 hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
              </div>

              <p className="text-center text-blue-200 text-xs pt-4">We will never share your email. The link expires for security.</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
