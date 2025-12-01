import { createSlice } from '@reduxjs/toolkit';
import api from '../../services/api';

/**
 * Cart Slice - Quản lý giỏ hàng với Redux
 * Chức năng: Thêm, xóa, cập nhật số lượng sản phẩm trong giỏ hàng
 * Đồng bộ với API ở background để lưu vào session
 */

const initialState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Set cart từ API response (khi fetch từ server)
    setCart: (state, action) => {
      const cart = action.payload.cart || action.payload;
      state.items = cart.items || [];
      state.totalQuantity = cart.itemCount || cart.totalQuantity || 0;
      state.totalAmount = cart.totalAmount || 0;
    },
    
    // Thêm sản phẩm vào giỏ hàng
    addToCart: (state, action) => {
      const newItem = action.payload;
      const itemId = newItem._id || newItem.id;
      const existingItem = state.items.find((item) => (item.id || item._id || item.productId) === itemId);
      
      if (!existingItem) {
        state.items.push({
          id: itemId,
          _id: itemId,
          productId: itemId,
          name: newItem.name,
          price: newItem.price,
          image: newItem.image,
          slug: newItem.slug,
          stock: newItem.stock,
          quantity: newItem.quantity || 1,
          totalPrice: newItem.price * (newItem.quantity || 1),
        });
        state.totalQuantity += newItem.quantity || 1;
      } else {
        const newQuantity = existingItem.quantity + (newItem.quantity || 1);
        existingItem.quantity = newQuantity;
        existingItem.totalPrice = existingItem.price * newQuantity;
        state.totalQuantity += newItem.quantity || 1;
      }
      
      state.totalAmount = state.items.reduce(
        (total, item) => total + (item.price || 0) * item.quantity,
        0
      );
    },
    
    // Xóa sản phẩm khỏi giỏ hàng
    removeFromCart: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find((item) => (item.id || item._id || item.productId) === id);
      
      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.items = state.items.filter((item) => (item.id || item._id || item.productId) !== id);
      }
      
      state.totalAmount = state.items.reduce(
        (total, item) => total + (item.price || 0) * item.quantity,
        0
      );
    },
    
    // Cập nhật số lượng sản phẩm
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find((item) => (item.id || item._id || item.productId) === id);
      
      if (existingItem && quantity > 0) {
        const quantityDifference = quantity - existingItem.quantity;
        existingItem.quantity = quantity;
        existingItem.totalPrice = existingItem.price * quantity;
        state.totalQuantity += quantityDifference;
      }
      
      state.totalAmount = state.items.reduce(
        (total, item) => total + (item.price || 0) * item.quantity,
        0
      );
    },
    
    // Xóa toàn bộ giỏ hàng
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setCart } = cartSlice.actions;

// Helper functions để đồng bộ với API (gọi ở background, không block UI)
export const syncCartToAPI = async (cartItems) => {
  try {
    // Lấy cart hiện tại từ API
    const currentCart = await api.get('/cart');
    const currentItems = currentCart.data.cart?.items || currentCart.data.items || [];
    
    // So sánh và đồng bộ
    const itemsToSync = cartItems.map(item => ({
      productId: item.productId || item.id || item._id,
      quantity: item.quantity
    }));
    
    // Nếu có thay đổi, gọi add-multiple để đồng bộ
    if (itemsToSync.length > 0) {
      await api.post('/cart/add-multiple', { items: itemsToSync });
    }
  } catch (error) {
    console.error('Error syncing cart to API:', error);
  }
};

export default cartSlice.reducer;
