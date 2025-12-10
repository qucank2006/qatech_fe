import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
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

// Admin Layout & Pages
import AdminLayout from '../layouts/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
import AdminProducts from '../pages/admin/Products';
import Categories from '../pages/admin/Categories';
import Orders from '../pages/admin/Orders';
import Users from '../pages/admin/Users';
import Employees from '../pages/admin/Employees';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'products', element: <Products /> },
      { path: 'product/:id', element: <ProductDetail /> },
      { path: 'cart', element: <Cart /> },
      { path: 'checkout', element: <Checkout /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'verify-otp', element: <VerifyOTP /> },
      { path: 'reset-password', element: <ResetPassword /> },
      { 
        path: 'profile', 
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ) 
      },
    ],
  },

  // Admin routes protected
  {
    path: '/admin',
    element: (
      // tùy implement của bạn: nếu ProtectedRoute nhận prop adminOnly
      // dùng <ProtectedRoute adminOnly={true}><AdminLayout /></ProtectedRoute>
      // hoặc nếu dùng prop boolean-less: <ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>
      <ProtectedRoute adminOnly={true}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },          // /admin
      { path: 'dashboard', element: <Dashboard /> },    // /admin/dashboard
      { path: 'products', element: <AdminProducts /> },
      { path: 'categories', element: <Categories /> },
      { path: 'orders', element: <Orders /> },
      { path: 'users', element: <Users /> },
      { path: 'employees', element: <Employees /> },
    ],
  },
]);

export default router;
