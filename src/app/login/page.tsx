"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Building2, Lock, AlertCircle, User } from "lucide-react";

import FormInput from "@/components/ui/FormInput";
import { loginSchema, type LoginFormValues } from "@/validations/auth.validation";
import { useLogin } from "@/hooks/useLogin";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthLoading, isAuthenticated, router]);

  // react-hook-form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useLogin();

  // submit handler
  const onSubmit = async (data: LoginFormValues) => {
    try {
      const payload = {
      username: data.email,
      password: data.password,
      ...(data.role && { role: data.role }), // only include role if it exists
    };
    await loginMutation.mutateAsync(payload);
    } catch (err: any) {
      const serverMessage =
        err?.response?.data?.message || err?.message || "Invalid credentials. Please try again.";

      const validationErrors = err?.response?.data?.errors;
      if (validationErrors && typeof validationErrors === "object") {
        Object.keys(validationErrors).forEach((field) => {
          setError(field as keyof LoginFormValues, {
            type: "server",
            message: validationErrors[field],
          });
        });
      } else {
        setError("email", { type: "server", message: serverMessage });
      }
    }
  };

  const isLoading = loginMutation.isPending || isSubmitting;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-6xl w-full relative z-10 bg-white/5 backdrop-blur rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="hidden md:flex flex-col justify-center items-start p-12 bg-linear-to-br from-slate-800/30 via-blue-800/30 to-indigo-800/30 text-white">
          <div className="flex items-center gap-4 mb-6">
            <div className="mx-auto h-20 w-20 bg-linear-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-2xl mb-0 ring-2 ring-blue-400/20">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">BRD ASSOCIATES</h1>
          </div>

          <h2 className="text-4xl font-extrabold leading-tight">Welcome Back</h2>
          <p className="mt-2 text-lg text-blue-200">Sign in to your account</p>

          <p className="mt-6 text-sm text-blue-100/80 max-w-xs">
            Securely access your professional workspace to manage projects, clients,
            and internal resources.
          </p>
        </div>

        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="md:hidden text-center mb-6">
              <div className="flex flex-col items-center">
                <div className="mx-auto h-20 w-20 bg-linear-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-2xl mb-4 ring-2 ring-blue-400/20">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white tracking-tight">BRD ASSOCIATES</h1>
                <h2 className="text-2xl font-bold text-white mt-2">Welcome Back</h2>
                <p className="text-blue-200 text-lg">Sign in to your account</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                {/* top-level server error: if you prefer a top-level banner, show it here.
                    Currently server errors map to email field, but you can show one here too. */}
                {errors.email && errors.email.type === "server" && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 flex items-start space-x-3 animate-in fade-in duration-300">
                    <AlertCircle className="h-5 w-5 text-red-300 mt-0.5 shrink-0" />
                    <p className="text-red-100 text-sm">{errors.email.message}</p>
                  </div>
                )}

                <FormInput
                  id="email"
                  label="Email"
                  placeholder="Enter your email"
                  icon={<User className="h-5 w-5 text-blue-300" />}
                  inputProps={{
                    ...register("email"),
                    autoComplete: "username",
                  }}
                  error={errors.email}
                />

                <FormInput
                  id="password"
                  label="Password"
                  placeholder="Enter your password"
                  icon={<Lock className="h-5 w-5 text-blue-300" />}
                  inputProps={{
                    ...register("password"),
                    type: showPassword ? "text" : "password",
                    autoComplete: "current-password",
                  }}
                  right={
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="hover:scale-110 transition-transform duration-200"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-blue-300 hover:text-blue-200" />
                      ) : (
                        <Eye className="h-5 w-5 text-blue-300 hover:text-blue-200" />
                      )}
                    </button>
                  }
                  error={errors.password}
                />

                <div className="flex justify-end text-sm">
                  <a href="/forgot-password" className="text-blue-300 hover:text-blue-200 font-medium transition-colors duration-200">
                    Forgot password?
                  </a>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-linear-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      <span className="flex items-center space-x-2">
                        <Lock className="h-4 w-4" />
                        <span>Sign in to continue</span>
                      </span>
                    )}
                  </button>
                </div>

                <div className="text-center pt-4">
                  <p className="text-blue-200 text-xs">Secure access to your professional workspace</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
