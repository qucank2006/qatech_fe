import axios from 'axios';

/**
 * API Service - Cấu hình axios instance cho việc gọi API
 * Bao gồm: Base URL, interceptors cho request và response
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Tự động gắn token vào header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Xử lý lỗi chung
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Xử lý lỗi 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      // Có thể thêm logic chuyển hướng về trang đăng nhập
    }
    
    const message = error.response?.data?.msg || 'Something went wrong';
    console.error('API Error:', message);

    return Promise.reject(error);
  }
);

export default api;
