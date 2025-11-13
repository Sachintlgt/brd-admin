// src/lib/api.ts
import axios from 'axios';
import type { InternalAxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { clearAuthStorage } from './auth';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  try {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');

      const existing = (config.headers ?? {}) as Record<string, string>;

      const contentType =
        existing['Content-Type'] ??
        existing['content-type'] ??
        'application/json';

      const merged: Record<string, string> = {
        ...existing,
        'Content-Type': contentType,
      };

      if (token) merged['Authorization'] = `Bearer ${token}`;

      config.headers = merged as AxiosRequestHeaders;
    }
  } catch (e) {
    console.error('Error setting request headers:', e);
  }
  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
  (res) => res,
  (error) => {
    try {
      const status = error?.response?.status;
      if (typeof window !== 'undefined' && status === 401) {
        clearAuthStorage();
      }
    } catch (e) {
      console.error('Error in response interceptor:', e);
    }
    return Promise.reject(error);
  },
);

export default api;
