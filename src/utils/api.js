// src/utils/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://monasoap-backend.onrender.com/api', // Your Render URL
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

// Add auth token interceptor
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle FormData for file uploads
API.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

// Handle Render cold starts
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if ((error.response?.status === 503 || error.code === 'ECONNABORTED') 
        && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      await new Promise(resolve => setTimeout(resolve, 3000));
      return API(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default API;