import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

/**
 * App Component - Component gốc của ứng dụng
 * Bao gồm Toaster để hiển thị thông báo và Outlet cho các route con
 */
export default function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Outlet />
    </>
  );
}
