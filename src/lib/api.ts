// src/lib/api.ts
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// attach access token automatically if present in localStorage
api.interceptors.request.use((config) => {
  try {
    if (!config.headers) config.headers = {};
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
  } catch (e) {
    // ignore on server
  }
  return config;
});
