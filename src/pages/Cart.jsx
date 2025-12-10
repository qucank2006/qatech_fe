import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LuTrash2, LuMinus, LuPlus, LuArrowRight, LuShoppingBag } from "react-icons/lu";

// Mock data
const initialCartItems = [
  {
    id: 1,
    name: "MacBook Pro 14 M3 8CPU 10GPU 8GB 512GB",
    price: 39990000,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop",
    quantity: 1,
    specs: "M3 / 8GB / 512GB"
  },
  {
    id: 2,
    name: "Asus ROG Zephyrus G14 Ryzen 9 7940HS",
    price: 45990000,
    image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=1000&auto=format&fit=crop",
    quantity: 2,
    specs: "R9 7940HS / 16GB / 1TB"
  }
];

const Cart = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);

  const updateQuantity = (id, change) => {
    setCartItems(items => items.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = 0; // Mock discount
  const total = subtotal - discount;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 pt-20">
        <div className="w-24 h-24 bg-neutral-800 rounded-full flex items-center justify-center mb-6 text-neutral-500">
          <LuShoppingBag size={40} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Giỏ hàng của bạn đang trống</h2>
        <p className="text-neutral-400 mb-8">Hãy chọn thêm sản phẩm để mua sắm nhé</p>
        <Link 
          to="/products" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-medium transition-colors"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 pt-24 pb-32">
      <h1 className="text-3xl font-bold text-white mb-8">Giỏ hàng ({cartItems.length})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div 
              key={item.id}
              className="bg-[#151515] border border-neutral-800 rounded-xl p-4 flex gap-4 items-center group hover:border-neutral-700 transition-colors"
            >
              {/* Image */}
              <div className="w-24 h-24 bg-neutral-900 rounded-lg overflow-hidden shrink-0">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium truncate mb-1">{item.name}</h3>
                <p className="text-sm text-neutral-400 mb-2">{item.specs}</p>
                <div className="text-indigo-400 font-bold">
                  {item.price.toLocaleString('vi-VN')}đ
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col items-end gap-4">
                <button 
                  onClick={() => removeItem(item.id)}
                  className="text-neutral-500 hover:text-red-500 transition-colors p-2"
                  title="Xóa sản phẩm"
                >
                  <LuTrash2 size={18} />
                </button>

                <div className="flex items-center bg-neutral-900 rounded-lg border border-neutral-800">
                  <button 
                    onClick={() => updateQuantity(item.id, -1)}
                    className="p-2 text-neutral-400 hover:text-white transition-colors"
                    disabled={item.quantity <= 1}
                  >
                    <LuMinus size={14} />
                  </button>
                  <span className="w-8 text-center text-white text-sm font-medium">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, 1)}
                    className="p-2 text-neutral-400 hover:text-white transition-colors"
                  >
                    <LuPlus size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-[#151515] border border-neutral-800 rounded-xl p-6 sticky top-24">
            <h2 className="text-xl font-bold text-white mb-6">Tổng đơn hàng</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-neutral-300">
                <span>Tạm tính</span>
                <span>{subtotal.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="flex justify-between text-neutral-300">
                <span>Giảm giá</span>
                <span className="text-green-500">-{discount.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="h-px bg-neutral-800 my-4"></div>
              <div className="flex justify-between items-end">
                <span className="text-white font-medium">Tổng cộng</span>
                <span className="text-2xl font-bold text-indigo-500">
                  {total.toLocaleString('vi-VN')}đ
                </span>
              </div>
              <p className="text-xs text-neutral-500 text-right">(Đã bao gồm VAT)</p>
            </div>

            <Link 
              to="/checkout"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 group"
            >
              Tiến hành thanh toán
              <LuArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>

            {/* Coupon Input */}
            <div className="mt-6 pt-6 border-t border-neutral-800">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Mã giảm giá" 
                  className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <button className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Áp dụng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
