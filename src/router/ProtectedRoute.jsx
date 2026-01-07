import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * Component ProtectedRoute - Bảo vệ các route yêu cầu xác thực
 * Kiểm tra người dùng đã đăng nhập chưa và có quyền truy cập hay không
 * @param {boolean} adminOnly - Chỉ cho phép admin truy cập
 * @param {Array} allowedRoles - Danh sách các role được phép truy cập
 * @param {React.ReactNode} children - Component con để render
 */
const ProtectedRoute = ({ adminOnly = false, allowedRoles = [], children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Chuyển hướng về trang đăng nhập nếu chưa xác thực
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Kiểm tra quyền truy cập theo role
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Kiểm tra allowedRoles nếu có
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
