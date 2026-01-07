import { createSlice } from '@reduxjs/toolkit';

/**
 * Cart Slice - Quản lý giỏ hàng
 * Chức năng: Thêm, xóa, cập nhật số lượng sản phẩm trong giỏ hàng
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
    // Thêm sản phẩm vào giỏ hàng
    addToCart: (state, action) => {
      const newItem = action.payload;
      const itemId = newItem._id || newItem.id;
      const existingItem = state.items.find((item) => (item.id || item._id) === itemId);
      
      if (!existingItem) {
        state.items.push({
          id: itemId,
          _id: itemId,
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
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
    
    // Xóa sản phẩm khỏi giỏ hàng
    removeFromCart: (state, action) => {
      const id = action.payload;
      const existingItem = state.items.find((item) => (item.id || item._id) === id);
      
      if (existingItem) {
        state.totalQuantity -= existingItem.quantity;
        state.items = state.items.filter((item) => (item.id || item._id) !== id);
      }
      
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
    
    // Cập nhật số lượng sản phẩm
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find((item) => (item.id || item._id) === id);
      
      if (existingItem && quantity > 0) {
        const quantityDifference = quantity - existingItem.quantity;
        existingItem.quantity = quantity;
        existingItem.totalPrice = existingItem.price * quantity;
        state.totalQuantity += quantityDifference;
      }
      
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
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

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
