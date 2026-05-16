import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.MODE === 'development' ? '/api' : 'https://travelapi.runasp.net/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'text/plain',
  },
});

// Request interceptor to attach token
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    if (config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor
axiosClient.interceptors.response.use((response) => {
  return response;
}, (error) => {
  // Handle global API errors here (e.g., redirect to login on 401)
  if (error.response && error.response.status === 401) {
    localStorage.removeItem('token');
    // Optionally redirect to login, but handling this via Redux state is cleaner.
  }
  return Promise.reject(error);
});

export default axiosClient;
