// src/utils/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://monasoap-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

// Add a request interceptor to debug
API.interceptors.request.use(config => {
  console.log('📤 API Request:', config.method.toUpperCase(), config.baseURL + config.url);
  return config;
});

export default API;                                 