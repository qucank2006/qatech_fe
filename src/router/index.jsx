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


// Admin Pages
import Dashboard from '../pages/admin/Dashboard';
import AdminProducts from '../pages/admin/Products';
import Orders from '../pages/admin/Orders';
import Users from '../pages/admin/Users';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // Public Routes wrapped in MainLayout
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
            path: 'product/:id',
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
      
      // Admin Routes wrapped in AdminLayout
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
