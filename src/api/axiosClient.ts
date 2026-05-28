import axios from 'axios';
import i18n from '../i18n';

// ── Base URL ─────────────────────────────────────────────────────────────────
export const BASE_URL =
  import.meta.env.MODE === 'development'
    ? '/api'
    : 'https://api.hurghadafuntime.com/api';

// ── Public customer client ────────────────────────────────────────────────────
export const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'text/plain',
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const lang = (i18n.language || localStorage.getItem('i18nextLng') || 'en').split('-')[0];
  if (config.headers) {
    const hasLang = (typeof config.headers.has === 'function')
      ? config.headers.has('Accept-Language')
      : (config.headers['Accept-Language'] || config.headers['accept-language']);

    const val = (typeof config.headers.get === 'function')
      ? config.headers.get('Accept-Language')
      : (config.headers['Accept-Language'] || config.headers['accept-language']);

    console.log(`[axiosClient] Request to ${config.url} | Custom language header present: ${!!hasLang} | Value: ${val}`);

    if (!hasLang) {
      if (typeof config.headers.set === 'function') {
        config.headers.set('Accept-Language', lang);
      } else {
        config.headers['Accept-Language'] = lang;
      }
    }
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

// ── Admin client (JWT + silent refresh) ──────────────────────────────────────
export const adminAxiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Attach admin access token and language to every request
adminAxiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const lang = (i18n.language || localStorage.getItem('i18nextLng') || 'en').split('-')[0];
  if (config.headers) {
    const hasLang = (typeof config.headers.has === 'function')
      ? config.headers.has('Accept-Language')
      : (config.headers['Accept-Language'] || config.headers['accept-language']);

    const val = (typeof config.headers.get === 'function')
      ? config.headers.get('Accept-Language')
      : (config.headers['Accept-Language'] || config.headers['accept-language']);

    console.log(`[adminAxiosClient] Request to ${config.url} | Custom language header present: ${!!hasLang} | Value: ${val}`);

    if (!hasLang) {
      if (typeof config.headers.set === 'function') {
        config.headers.set('Accept-Language', lang);
      } else {
        config.headers['Accept-Language'] = lang;
      }
    }
  }
  return config;
});

// On 401: silently attempt token refresh, then retry original request.
// If refresh also fails → redirect to /404 (hides admin panel existence).
adminAxiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // Do not trigger global 401 redirect logic for auth endpoints
    if (
      original.url?.includes('/Auth/login') ||
      original.url?.includes('/Auth/refresh') ||
      original.url?.includes('/Auth/logout')
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = localStorage.getItem('adminRefreshToken');

      if (refreshToken) {
        try {
          // POST /api/Auth/refresh — body: { refreshToken }
          // Response: { success, data: { accesstoken } }  ← spec uses lowercase 't'
          const { data } = await axios.post(
            `${BASE_URL}/Auth/refresh`,
            { refreshToken },
            { headers: { 'Content-Type': 'application/json' } }
          );

          const newAccessToken = data?.data?.accesstoken ?? data?.data?.accessToken;
          if (!newAccessToken) throw new Error('No access token in refresh response');

          localStorage.setItem('adminToken', newAccessToken);
          original.headers.Authorization = `Bearer ${newAccessToken}`;
          return adminAxiosClient(original);
        } catch {
          // Refresh failed — clear all admin session data
        }
      }

      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminRefreshToken');
      // Security: redirect to 404 — do not reveal /admin/login exists
      window.location.href = '/404';
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
