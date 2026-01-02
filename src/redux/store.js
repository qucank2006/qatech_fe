import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';

/**
 * Redux Store - Quản lý state toàn cục của ứng dụng
 * Bao gồm: auth (xác thực), cart (giỏ hàng), products (sản phẩm)
 */
const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productReducer,
  },
});

export default store;
