import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Common error handling (e.g., logout on 401)
    if (error.response && error.response.status === 401) {
      // Optional: Clear token and redirect to login
      // localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    
    const message = error.response?.data?.msg || 'Something went wrong';
    console.error('API Error:', message);
    
    // You can trigger a toast here if you have a toast library setup
    // toast.error(message);

    return Promise.reject(error);
  }
);

export default api;
