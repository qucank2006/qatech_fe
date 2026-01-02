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
import ProtectedRoute from '../components/ProtectedRoute';
import ForgotPassword from '../pages/ForgotPassword';
import VerifyOTP from '../pages/VerifyOTP';
import ResetPassword from '../pages/ResetPassword';
import Profile from '../pages/Profile';

import Dashboard from '../pages/admin/Dashboard';
import AdminProducts from '../pages/admin/Products';
import Orders from '../pages/admin/Orders';
import Users from '../pages/admin/Users';

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
            element: <ProtectedRoute />,
            children: [
              {
                path: 'profile',
                element: <Profile />,
              }
            ]
          }
        ]
      },
      
      // Các route admin yêu cầu quyền admin (sử dụng AdminLayout)
      {
        path: 'admin',
        element: <ProtectedRoute adminOnly={true} />,
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
                element: <AdminProducts />,
              },
              {
                path: 'orders',
                element: <Orders />,
              },
              {
                path: 'users',
                element: <Users />,
              },
            ]
          }
        ],
      },
    ],
  },
]);

export default router;
