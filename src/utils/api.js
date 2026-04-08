// src/utils/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // Use environment variable here
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000,
});

export default API;