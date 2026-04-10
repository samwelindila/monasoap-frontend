// src/utils/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://monasoap-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

// ✅ Attach token to every request
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('📤 API Request:', config.method.toUpperCase(), config.baseURL + config.url);
  return config;
});

export default API;