import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LuMapPin, LuPhone, LuMail, LuUser, LuCreditCard, LuBanknote, LuCheck } from "react-icons/lu";

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPaymentQR, setShowPaymentQR] = useState(false);

  const { items: cartItems, totalAmount } = useSelector((state) => state.cart);

  const subtotal = totalAmount;
  const shippingFee = 0; // Free shipping
  const total = subtotal + shippingFee;

  // VietQR Config
  const BANK_ID = "970407";
  const ACCOUNT_NO = "7090050906";
  const TEMPLATE = "compact2";
  const ACCOUNT_NAME = "QATECH";
  const ORDER_ID = "QA" + Math.floor(Math.random() * 1000000); 
  const DESCRIPTION = `Thanh toan don hang ${ORDER_ID}`;
  
  const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-${TEMPLATE}.png?amount=${total}&addInfo=${encodeURIComponent(DESCRIPTION)}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    
    if (paymentMethod === 'banking') {
      setShowPaymentQR(true);
    } else {
      // Simulate API call for COD
      setTimeout(() => {
        setIsSuccess(true);
      }, 1000);
    }
  };

  const handleConfirmPayment = () => {
    setShowPaymentQR(false);
    setIsSuccess(true);
  };

  if (showPaymentQR) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 pt-20">
        <h2 className="text-3xl font-bold text-white mb-4">Thanh toán đơn hàng</h2>
        <p className="text-neutral-400 mb-8 max-w-md">
          Vui lòng quét mã QR bên dưới để hoàn tất thanh toán cho đơn hàng <span className="text-white font-bold">#{ORDER_ID}</span>.
        </p>

        <div className="mb-8 bg-white p-4 rounded-xl inline-block shadow-lg shadow-indigo-500/20">
          <img src={qrUrl} alt="VietQR Payment" className="w-[300px] h-auto rounded-lg" />
          <p className="text-black font-bold mt-3 text-lg">Quét mã để thanh toán</p>
          <p className="text-neutral-600 text-sm">Techcombank: {ACCOUNT_NO}</p>
          <p className="text-neutral-600 text-sm">Chủ TK: {ACCOUNT_NAME}</p>
          <p className="text-indigo-600 font-bold text-lg mt-1">{total.toLocaleString('vi-VN')}đ</p>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => setShowPaymentQR(false)}
            className="bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Quay lại
          </button>
          <button 
            onClick={handleConfirmPayment}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Đã thanh toán
          </button>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 pt-20">
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 text-green-500">
          <LuCheck size={48} />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Đặt hàng thành công!</h2>
        <p className="text-neutral-400 mb-8 max-w-md">
          Cảm ơn bạn đã mua sắm tại QATech. Mã đơn hàng của bạn là <span className="text-white font-bold">#{ORDER_ID}</span>. 
          Chúng tôi sẽ liên hệ với bạn sớm nhất để xác nhận đơn hàng.
        </p>

        <div className="flex gap-4">
          <Link 
            to="/" 
            className="bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Về trang chủ
          </Link>
          <Link 
            to="/products" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 pt-24 pb-32">
      <h1 className="text-3xl font-bold text-white mb-8">Thanh toán</h1>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Customer Info */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Shipping Info */}
          <div className="bg-[#151515] border border-neutral-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <LuMapPin className="text-indigo-500" />
              Thông tin giao hàng
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-neutral-400">Họ và tên</label>
                <div className="relative">
                  <LuUser className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input 
                    type="text" 
                    required
                    placeholder="Nguyễn Văn A"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-neutral-400">Số điện thoại</label>
                <div className="relative">
                  <LuPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input 
                    type="tel" 
                    required
                    placeholder="0912 345 678"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm text-neutral-400">Email</label>
                <div className="relative">
                  <LuMail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input 
                    type="email" 
                    required
                    placeholder="email@example.com"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm text-neutral-400">Địa chỉ nhận hàng</label>
                <div className="relative">
                  <LuMapPin className="absolute left-4 top-3 text-neutral-500" />
                  <textarea 
                    required
                    rows="3"
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-[#151515] border border-neutral-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <LuCreditCard className="text-indigo-500" />
              Phương thức thanh toán
            </h2>

            <div className="space-y-4">
              <label 
                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all
                  ${paymentMethod === 'cod' 
                    ? 'bg-indigo-600/10 border-indigo-500' 
                    : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                  }`}
              >
                <input 
                  type="radio" 
                  name="payment" 
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 bg-neutral-800 border-neutral-600"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-medium text-white">
                    <LuBanknote size={20} />
                    Thanh toán khi nhận hàng (COD)
                  </div>
                  <p className="text-sm text-neutral-400 mt-1">Thanh toán bằng tiền mặt khi shipper giao hàng đến.</p>
                </div>
              </label>

              <label 
                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all
                  ${paymentMethod === 'banking' 
                    ? 'bg-indigo-600/10 border-indigo-500' 
                    : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                  }`}
              >
                <input 
                  type="radio" 
                  name="payment" 
                  value="banking"
                  checked={paymentMethod === 'banking'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 bg-neutral-800 border-neutral-600"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-medium text-white">
                    <LuCreditCard size={20} />
                    Chuyển khoản ngân hàng
                  </div>
                  <p className="text-sm text-neutral-400 mt-1">Quét mã QR để thanh toán nhanh chóng qua ứng dụng ngân hàng.</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-[#151515] border border-neutral-800 rounded-xl p-6 sticky top-24">
            <h2 className="text-xl font-bold text-white mb-6">Đơn hàng của bạn</h2>
            
            {/* Items List */}
            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-16 h-16 bg-neutral-900 rounded-lg overflow-hidden shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm text-white font-medium truncate">{item.name}</h4>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-neutral-400">x{item.quantity}</span>
                      <span className="text-sm text-indigo-400 font-medium">
                        {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-px bg-neutral-800 my-4"></div>

            {/* Totals */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-neutral-300 text-sm">
                <span>Tạm tính</span>
                <span>{subtotal.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="flex justify-between text-neutral-300 text-sm">
                <span>Phí vận chuyển</span>
                <span className="text-green-500">Miễn phí</span>
              </div>
              <div className="h-px bg-neutral-800 my-4"></div>
              <div className="flex justify-between items-end">
                <span className="text-white font-medium">Tổng thanh toán</span>
                <span className="text-2xl font-bold text-indigo-500">
                  {total.toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20"
            >
              Đặt hàng ngay
            </button>

            <p className="text-xs text-neutral-500 text-center mt-4">
              Bằng việc đặt hàng, bạn đồng ý với <a href="#" className="text-indigo-400 hover:underline">Điều khoản dịch vụ</a> của chúng tôi.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
