// src/utils/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://monasoap-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000, // 2 minutes for Render cold starts
});

// ✅ Attach token to every request
API.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('📤 API Request:', config.method.toUpperCase(), config.baseURL + config.url);
    return config;
  },
  error => Promise.reject(error)
);

// ✅ Handle auth errors globally
API.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expired or invalid — log user out
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ✅ Keep Render backend alive (prevents cold start delays)
const keepAlive = () => {
  fetch('https://monasoap-backend.onrender.com/api/health').catch(() => {});
};
setInterval(keepAlive, 10 * 60 * 1000); // every 10 minutes
keepAlive(); // ping immediately on load

export default API;