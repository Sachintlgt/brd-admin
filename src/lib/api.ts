// src/lib/api.ts
import axios from 'axios';
import type { InternalAxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { clearAuthCookies } from './auth';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This sends cookies automatically
});

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

      // No need to manually set Authorization header - cookies are sent automatically
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
    try {
      const status = error?.response?.status;
      const originalRequest = error.config;

      if (typeof window !== 'undefined') {
        // ❌ 401 — Unauthorized → Try to refresh token, then logout
        if (status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Try to refresh the token
            await api.post('/auth/refresh-token');
            // Retry the original request
            return api(originalRequest);
          } catch (refreshError) {
            // Refresh failed, clear auth and redirect to login
            clearAuthCookies();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        // ❗ 403 — Forbidden → Do NOT logout, just throw readable message
        if (status === 403) {
          return Promise.reject({
            ...error,
            message: 'You do not have sufficient permissions.',
            isPermissionError: true,
          });
        }
      }
    } catch (e) {
      console.error('Error in response interceptor:', e);
    }

    return Promise.reject(error);
  },
);

export default api;
