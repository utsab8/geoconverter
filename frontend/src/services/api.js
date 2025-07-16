// Axios instance for API calls
// Automatically attaches JWT access token from localStorage to all requests
// Usage: import API from './api'; then use API.get/post/etc.
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default API; 