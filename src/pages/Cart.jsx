import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, clearCart, updateQuantity } from "../redux/slices/cartSlice";
import { LuTrash2, LuMinus, LuPlus, LuArrowRight, LuShoppingCart, LuX } from "react-icons/lu";
import { getImageUrl } from "../utils/imageUrl";
import toast from "react-hot-toast";

/**
 * Component Cart - Trang giỏ hàng
 * Chức năng: Xem, chỉnh sửa số lượng, xóa sản phẩm, tính tổng tiền
 */
export default function Cart() {
  const { items, totalAmount } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Xử lý tăng số lượng sản phẩm
  const handleIncrease = (item) => {
    if (item.stock && item.quantity >= item.stock) {
      toast.error(`Chỉ còn ${item.stock} sản phẩm trong kho`);
      return;
    }
    dispatch(updateQuantity({ id: item.id || item._id, quantity: item.quantity + 1 }));
  };

  // Xử lý giảm số lượng sản phẩm
  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      dispatch(updateQuantity({ id: item.id || item._id, quantity: item.quantity - 1 }));
    }
  };

  // Xử lý xóa sản phẩm
  const handleRemove = (item) => {
    dispatch(removeFromCart(item.id || item._id));
    toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
  };

  // Xử lý xóa toàn bộ giỏ hàng
  const handleClearCart = () => {
    dispatch(clearCart());
    setShowClearConfirm(false);
    toast.success('Đã xóa toàn bộ giỏ hàng');
  };

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
      {/* HEADER VỚI NÚT XÓA TẤT CẢ */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Giỏ hàng của bạn ({items.length} sản phẩm)</h1>
        <button
          onClick={() => setShowClearConfirm(true)}
          className="text-red-500 hover:text-red-400 font-medium flex items-center gap-2 transition-colors"
        >
          <LuTrash2 size={18} />
          Xóa tất cả
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CART ITEMS */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id || item._id} className="bg-[#151515] border border-neutral-800 rounded-xl p-4 hover:border-neutral-700 transition-colors">
              <div className="flex gap-4">
                {/* Hình ảnh sản phẩm */}
                <Link to={`/product/${item.slug || item.id || item._id}`} className="shrink-0">
                  <div className="w-28 h-28 bg-neutral-900 rounded-lg overflow-hidden">
                    <img 
                      src={getImageUrl(item.image)} 
                      alt={item.name} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
                    />
                  </div>
                </Link>
                
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  {/* Tên và giá */}
                  <div>
                    <Link 
                      to={`/product/${item.slug || item.id || item._id}`} 
                      className="text-white font-semibold hover:text-indigo-400 transition line-clamp-2 mb-2"
                    >
                      {item.name}
                    </Link>
                    <div className="flex items-center gap-3">
                      <p className="text-indigo-400 font-bold text-lg">
                        {item.price?.toLocaleString('vi-VN')}đ
                      </p>
                      {item.stock !== undefined && (
                        <span className={`text-xs px-2 py-1 rounded ${
                          item.stock > 10 
                            ? 'bg-green-500/10 text-green-500' 
                            : item.stock > 0 
                            ? 'bg-yellow-500/10 text-yellow-500'
                            : 'bg-red-500/10 text-red-500'
                        }`}>
                          {item.stock > 0 ? `Còn ${item.stock}` : 'Hết hàng'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Số lượng và actions */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      {/* Nút điều chỉnh số lượng */}
                      <div className="flex items-center border-2 border-neutral-700 rounded-lg overflow-hidden bg-neutral-900 hover:border-indigo-500/50 transition-colors">
                        <button 
                          onClick={() => handleDecrease(item)}
                          disabled={item.quantity <= 1}
                          className="px-3 py-2 text-white hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          aria-label="Giảm số lượng"
                        >
                          <LuMinus size={16} />
                        </button>
                        <span className="px-4 py-2 text-white font-bold text-sm min-w-[3rem] text-center border-x-2 border-neutral-700">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => handleIncrease(item)}
                          disabled={item.stock ? item.quantity >= item.stock : false}
                          className="px-3 py-2 text-white hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          aria-label="Tăng số lượng"
                        >
                          <LuPlus size={16} />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <span className="text-neutral-400 text-sm ml-2">
                        = <span className="text-white font-bold">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                      </span>
                    </div>

                    {/* Nút xóa */}
                    <button 
                      onClick={() => handleRemove(item)}
                      className="p-2 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                      aria-label="Xóa sản phẩm"
                    >
                      <LuTrash2 size={20} />
                    </button>
                  </div>
                </div>
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
                <span>Tạm tính ({items.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm)</span>
                <span className="font-medium">{totalAmount.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="flex justify-between text-neutral-300">
                <span>Phí vận chuyển</span>
                <span className="text-green-500 font-medium">Miễn phí</span>
              </div>
              <div className="flex justify-between text-neutral-300">
                <span>Giảm giá</span>
                <span className="text-neutral-500">0đ</span>
              </div>
              <div className="h-px bg-neutral-800 my-4"></div>
              <div className="flex justify-between items-end">
                <span className="text-white font-medium">Tổng cộng</span>
                <div className="text-right">
                  <span className="text-2xl font-bold text-indigo-500 block">
                    {totalAmount.toLocaleString('vi-VN')}đ
                  </span>
                  <span className="text-xs text-neutral-500">(Đã bao gồm VAT)</span>
                </div>
              </div>
            </div>

            {/* Thông báo yêu cầu đăng nhập */}
            {!isAuthenticated && (
              <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                <p className="text-yellow-500 text-sm text-center">
                  Vui lòng đăng nhập để tiến hành thanh toán
                </p>
              </div>
            )}

            {isAuthenticated ? (
              <Link 
                to="/checkout"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold transition shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 flex items-center justify-center gap-2 group"
              >
                Tiến hành thanh toán 
                <LuArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <Link 
                to="/login"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-bold transition shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 flex items-center justify-center gap-2"
              >
                Đăng nhập để thanh toán
              </Link>
            )}

            <Link 
              to="/products"
              className="w-full mt-3 border-2 border-neutral-700 hover:border-indigo-500 text-white py-3 rounded-xl font-medium transition flex items-center justify-center gap-2"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>

      {/* MODAL XÁC NHẬN XÓA TẤT CẢ */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-[#151515] border border-neutral-800 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Xác nhận xóa</h3>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="p-1 text-neutral-400 hover:text-white transition-colors"
              >
                <LuX size={24} />
              </button>
            </div>
            <p className="text-neutral-300 mb-6">
              Bạn có chắc chắn muốn xóa tất cả sản phẩm trong giỏ hàng? 
              Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleClearCart}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold transition"
              >
                Xóa tất cả
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white py-3 rounded-xl font-bold transition"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
