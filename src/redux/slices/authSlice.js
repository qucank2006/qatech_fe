import { createSlice } from '@reduxjs/toolkit';

/**
 * Auth Slice - Quản lý state xác thực người dùng
 * Chức năng: Đăng nhập, đăng xuất, cập nhật thông tin người dùng
 */

// Khởi tạo state từ localStorage hoặc sessionStorage
const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || sessionStorage.getItem('token') || null,
  isAuthenticated: !!(localStorage.getItem('token') || sessionStorage.getItem('token')),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Bắt đầu quá trình đăng nhập
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    // Đăng nhập thành công
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      
      state.user = action.payload.user;
      state.token = action.payload.token;
    },

    // Đăng nhập thất bại
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Đăng xuất và xóa thông tin lưu trữ
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
    },

    // Cập nhật thông tin người dùng
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      
      if (localStorage.getItem('token')) {
        localStorage.setItem("user", JSON.stringify(state.user));
      } else if (sessionStorage.getItem('token')) {
        sessionStorage.setItem("user", JSON.stringify(state.user));
      }
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
