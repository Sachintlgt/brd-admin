import axios from 'axios';
import type { InternalAxiosRequestConfig, AxiosRequestHeaders } from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  try {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');

      // normalize existing headers to a plain object
      const existing = (config.headers ?? {}) as Record<string, unknown>;

      // prefer any existing content-type (case-insensitive)
      const contentType =
        (existing['Content-Type'] as string) ??
        (existing['content-type'] as string) ??
        'application/json';

      const merged: Record<string, unknown> = {
        ...existing,
        'Content-Type': contentType,
      };

      if (token) merged['Authorization'] = `Bearer ${token}`;

      config.headers = merged as typeof config.headers;
    }
  } catch (e) {
    console.error('Error setting request headers:', e);
  }
  return config;
}

);
