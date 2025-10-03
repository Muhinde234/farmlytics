// src/services/api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // To store JWT token

// IMPORTANT: Replace with your actual backend deployed URL or local IP
const BASE_URL = 'http://192.168.1.XX:5000/api/v1'; // Example: Your local backend IP (find with `ipconfig` or `ifconfig`)
// Or your deployed backend: 'https://your-deployed-farmlytics-backend.com/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token to outgoing requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('jwtToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration/logout
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Example: If 401 Unauthorized (e.g., token expired), you might want to clear token and redirect to login
    if (error.response && error.response.status === 401) {
      await AsyncStorage.removeItem('jwtToken');
      // You might want to dispatch a global logout action here
      console.warn('Unauthorized request. JWT token might be expired. Cleared local token.');
    }
    return Promise.reject(error);
  }
);

export default api;