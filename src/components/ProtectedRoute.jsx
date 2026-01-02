import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * Component ProtectedRoute - Bảo vệ các route yêu cầu xác thực
 * Kiểm tra người dùng đã đăng nhập chưa và có quyền truy cập hay không
 * @param {boolean} adminOnly - Chỉ cho phép admin truy cập
 */
const ProtectedRoute = ({ adminOnly = false }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Chuyển hướng về trang đăng nhập nếu chưa xác thực
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Chuyển hướng về trang chủ nếu không phải admin
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
