// src/lib/api.ts
import axios from 'axios';
import type { InternalAxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { clearAuthCookies } from './auth';
import toast from 'react-hot-toast';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This sends cookies automatically
});

// Track if we're currently refreshing to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    try {
      const existing = (config.headers ?? {}) as Record<string, string>;

      const contentType =
        existing['Content-Type'] ?? existing['content-type'] ?? 'application/json';

      const merged: Record<string, string> = {
        ...existing,
        'Content-Type': contentType,
      };

      config.headers = merged as AxiosRequestHeaders;
    } catch (e) {
      console.error('Error setting request headers:', e);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (typeof window === 'undefined') {
      return Promise.reject(error);
    }

    const status = error?.response?.status;

    // Don't retry login/signup/refresh endpoints
    const isAuthEndpoint =
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/signup') ||
      originalRequest.url?.includes('/auth/refresh-token') ||
      originalRequest.url?.includes('/auth/forgot-password') ||
      originalRequest.url?.includes('/auth/reset-password');

    // ❌ 401 — Unauthorized
    if (status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh the token
        await api.post('/auth/refresh-token');

        // Process queued requests
        processQueue(null, 'refreshed');

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Process queued requests with error
        processQueue(refreshError, null);

        // Refresh failed, clear auth and redirect to login
        clearAuthCookies();
        toast.error('Session expired. Please login again.');

        // Delay to allow toast to show
        setTimeout(() => {
          window.location.href = '/login';
        }, 500);

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // For auth endpoints that fail with 401, don't trigger refresh
    if (status === 401 && isAuthEndpoint) {
      return Promise.reject(error);
    }

    // ❗ 403 — Forbidden → Do NOT logout, just throw readable message
    if (status === 403) {
      toast.error('You do not have sufficient permissions.');
      return Promise.reject({
        ...error,
        message: 'You do not have sufficient permissions.',
        isPermissionError: true,
      });
    }

    return Promise.reject(error);
  },
);

export default api;
