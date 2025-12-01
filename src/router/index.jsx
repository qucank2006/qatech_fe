import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import MainLayout from '../layouts/MainLayout';
import AdminLayout from '../layouts/AdminLayout';

import Home from '../pages/Home';
import Products from '../pages/Products';
import ProductDetail from '../pages/ProductDetail';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ProtectedRoute from './ProtectedRoute';
import ForgotPassword from '../pages/ForgotPassword';
import VerifyOTP from '../pages/VerifyOTP';
import ResetPassword from '../pages/ResetPassword';
import Profile from '../pages/Profile';
import VNPayReturn from '../pages/VNPayReturn';
import MyOrders from '../pages/MyOrders';
import OrderDetail from '../pages/OrderDetail';

import Dashboard from '../pages/admin/Dashboard';
import AdminProducts from '../pages/admin/Products';
import Orders from '../pages/admin/Orders';
import Users from '../pages/admin/Users';
import Staff from '../pages/admin/Staff';

/**
 * Router Configuration - Cấu hình các route của ứng dụng
 * Bao gồm: Public routes (MainLayout), Protected routes, Admin routes (AdminLayout)
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // Các route công khai sử dụng MainLayout
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: 'products',
            element: <Products />,
          },
          {
            path: 'product/:slug',
            element: <ProductDetail />,
          },
          {
            path: 'cart',
            element: <Cart />,
          },
          {
            path: 'checkout',
            element: <Checkout />,
          },
          {
            path: 'login',
            element: <Login />,
          },
          {
            path: 'register',
            element: <Register />,
          },
          {
            path: 'forgot-password',
            element: <ForgotPassword />,
          },
          {
            path: 'verify-otp',
            element: <VerifyOTP />,
          },
          {
            path: 'reset-password',
            element: <ResetPassword />,
          },
          {
            path: 'payment/vnpay-return',
            element: <VNPayReturn />,
          },
          {
            element: <ProtectedRoute />,
            children: [
              {
                path: 'profile',
                element: <Profile />,
              },
              {
                path: 'orders',
                element: <MyOrders />,
              },
              {
                path: 'orders/:id',
                element: <OrderDetail />,
              }
            ]
          }
        ]
      },
      
      // Các route admin yêu cầu quyền admin hoặc employee (sử dụng AdminLayout)
      {
        path: 'admin',
        element: <ProtectedRoute allowedRoles={['admin', 'employee']} />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              {
                path: 'dashboard',
                element: <Dashboard />,
              },
              {
                path: 'products',
                element: (
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminProducts />
                  </ProtectedRoute>
                ),
              },
              {
                path: 'orders',
                element: <Orders />,
              },
              {
                path: 'users',
                element: (
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Users />
                  </ProtectedRoute>
                ),
              },
              {
                path: 'staff',
                element: (
                  <ProtectedRoute allowedRoles={['admin']}>
                    <Staff />
                  </ProtectedRoute>
                ),
              },
            ]
          }
        ],
      },
    ],
  },
]);

export default router;
