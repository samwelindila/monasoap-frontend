// src/utils/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://monasoap-backend.onrender.com/api',
  timeout: 120000,
});

// ✅ Attach token + smart Content-Type to every request
API.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ✅ Don't override Content-Type for FormData (multipart/form-data)
    // Let the browser set it automatically with the correct boundary
    if (!(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    console.log('📤 API Request:', config.method.toUpperCase(), config.baseURL + config.url);
    return config;
  },
  error => Promise.reject(error)
);

// ✅ Handle errors globally with auto-retry
API.interceptors.response.use(
  response => response,
  async error => {
    const config = error.config;

    // Auto-retry up to 3 times on network errors or 503 (server waking up)
    if (!config._retryCount) config._retryCount = 0;

    if (
      config._retryCount < 3 &&
      (!error.response || error.response.status === 503)
    ) {
      config._retryCount++;
      console.log(`🔄 Retrying request... attempt ${config._retryCount}`);
      await new Promise(res => setTimeout(res, 3000));
      return API(config);
    }

    // Auto logout on 401
    if (error.response?.status === 401) {
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
setInterval(keepAlive, 10 * 60 * 1000);
keepAlive();

export default API;