import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, clearCart } from "../redux/slices/cartSlice";
import { LuTrash2, LuMinus, LuPlus, LuArrowRight, LuShoppingCart } from "react-icons/lu";
import { getImageUrl } from "../utils/imageUrl";

export default function Cart() {
  const { items, totalAmount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div>
          <div className="w-24 h-24 bg-neutral-900 rounded-full flex items-center justify-center mb-6 mx-auto">
            <LuShoppingCart className="text-neutral-500" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Giỏ hàng trống</h2>
          <p className="text-neutral-400 mb-8">Bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>
          <Link 
            to="/products" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold transition"
          >
            Mua sắm ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 pt-24 pb-32">
      <h1 className="text-3xl font-bold text-white mb-8">Giỏ hàng ({items.length})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CART ITEMS */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id}>
              <div className="bg-[#151515] border border-neutral-800 rounded-xl p-4 flex gap-4 items-center">
                <div className="w-24 h-24 bg-neutral-900 rounded-lg overflow-hidden shrink-0">
                  <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.id}`} className="text-white font-medium hover:text-indigo-400 transition truncate block">
                    {item.name}
                  </Link>
                  <p className="text-indigo-400 font-bold mt-1">
                    {item.price?.toLocaleString('vi-VN')}đ
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-neutral-900 rounded-lg p-1">
                  <button className="p-1 hover:text-white text-neutral-400 transition">
                    <LuMinus size={16} />
                  </button>
                  <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                  <button className="p-1 hover:text-white text-neutral-400 transition">
                    <LuPlus size={16} />
                  </button>
                </div>

                <button 
                  onClick={() => dispatch(removeFromCart(item.id))}
                  className="p-2 text-neutral-500 hover:text-red-500 transition"
                >
                  <LuTrash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* SUMMARY */}
        <div className="lg:col-span-1">
          <div className="bg-[#151515] border border-neutral-800 rounded-xl p-6 sticky top-24">
            <h2 className="text-xl font-bold text-white mb-6">Tổng đơn hàng</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-neutral-300">
                <span>Tạm tính</span>
                <span>{totalAmount.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="flex justify-between text-neutral-300">
                <span>Phí vận chuyển</span>
                <span className="text-green-500">Miễn phí</span>
              </div>
              <div className="h-px bg-neutral-800 my-4"></div>
              <div className="flex justify-between items-end">
                <span className="text-white font-medium">Tổng cộng</span>
                <span className="text-2xl font-bold text-indigo-500">
                  {totalAmount.toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>

            <Link 
              to="/checkout"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold transition shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
            >
              Thanh toán <LuArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
