import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { LuMapPin, LuPhone, LuMail, LuUser, LuCreditCard, LuBanknote, LuCheck } from "react-icons/lu";
import { getImageUrl } from "../utils/imageUrl";
import api from '../services/api';
import { clearCart } from '../redux/slices/cartSlice';

const Checkout = () => {
  const dispatch = useDispatch();
  
  const [paymentMethod, setPaymentMethod] = useState('vnpay');
  // eslint-disable-next-line no-unused-vars
  const [selectedBank, setSelectedBank] = useState(''); // Bank code cho VNPay - sẽ dùng khi thêm UI chọn ngân hàng
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderCode, setOrderCode] = useState('');

  // Form fields state - tự động điền từ thông tin người dùng
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    note: ''
  });

  const { items: cartItems, totalAmount } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);


  // Auto-fill form từ thông tin user khi component mount
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        address: user.address || '',
        note: ''
      });
    }
  }, [user]);

  const subtotal = totalAmount;
  const shippingFee = 0; // Free shipping
  const total = subtotal + shippingFee;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      alert('Giỏ hàng trống!');
      return;
    }

    setLoading(true);

    try {
      console.log('🛒 Bắt đầu đặt hàng...', {
        cartItems: cartItems.length,
        paymentMethod,
        selectedBank,
        formData
      });

      // 1. Tạo đơn hàng
      const orderPayload = {
        items: cartItems.map(item => {
          // Xử lý cả trường hợp item có product nested object hoặc flat structure
          const productId = item.productId || item.id || item._id;
          const name = item.name || item.product?.name;
          const price = item.price || item.product?.price;
          const quantity = item.quantity;
          const image = item.image || item.product?.image;
          
          return {
            productId,
            name,
            price,
            quantity,
            image
          };
        }),
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address
        },
        paymentMethod,
        note: formData.note
      };
      
      console.log('📦 Gửi API tạo đơn hàng:', orderPayload);
      const orderResponse = await api.post('/orders', orderPayload);
      console.log('✅ Đơn hàng được tạo:', orderResponse.data);

      const { id: orderId, orderCode } = orderResponse.data.order;
      setOrderCode(orderCode);

      if (paymentMethod === 'vnpay') {
        // 2. Tạo thanh toán VNPay
        console.log('💳 Gửi API tạo thanh toán VNPay:', { orderId, bankCode: selectedBank });
        const paymentResponse = await api.post('/payments/create', {
          orderId,
          bankCode: selectedBank
        });
        console.log('✅ Payment URL nhận được:', paymentResponse.data);

        // 3. Lưu orderId vào localStorage (để check sau)
        localStorage.setItem('pendingOrderId', orderId);

        // 4. Xóa giỏ hàng
        dispatch(clearCart());

        // 5. Redirect đến VNPay
        console.log('🔄 Redirect đến VNPay...');
        window.location.href = paymentResponse.data.paymentUrl;
      } else {
        // COD: Chuyển đến trang thành công
        dispatch(clearCart());
        setIsSuccess(true);
      }
    } catch (error) {
      console.error('❌ Checkout error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      const errorMsg = error.response?.data?.msg || error.message || 'Đặt hàng thất bại. Vui lòng thử lại!';
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Handler để cập nhật form data
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isSuccess) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 pt-20">
        <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 text-green-500">
          <LuCheck size={48} />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Đặt hàng thành công!</h2>
        <p className="text-neutral-400 mb-8 max-w-md">
          Cảm ơn bạn đã mua sắm tại QATech. Mã đơn hàng của bạn là <span className="text-white font-bold">#{orderCode}</span>. 
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
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
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
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
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
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="email@example.com"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm text-neutral-400">Địa chỉ giao hàng</label>
                <div className="relative">
                  <LuMapPin className="absolute left-4 top-3 text-neutral-500" />
                  <textarea 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                  ></textarea>
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm text-neutral-400">Ghi chú (Tùy chọn)</label>
                <textarea 
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="Ghi chú đặc biệt cho đơn hàng..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                ></textarea>
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
                  ${paymentMethod === 'vnpay' 
                    ? 'bg-indigo-600/10 border-indigo-500' 
                    : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                  }`}
              >
                <input 
                  type="radio" 
                  name="payment" 
                  value="vnpay"
                  checked={paymentMethod === 'vnpay'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 bg-neutral-800 border-neutral-600"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-medium text-white">
                    <LuCreditCard size={20} />
                    Thanh toán qua VNPay
                  </div>
                  <p className="text-sm text-neutral-400 mt-1">Thanh toán qua thẻ ATM, Internet Banking, QR Code</p>
                </div>
              </label>

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
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-[#151515] border border-neutral-800 rounded-xl p-6 sticky top-24">
            <h2 className="text-xl font-bold text-white mb-6">Đơn hàng của bạn</h2>
            
            {/* Items List */}
            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
              {cartItems.map((item) => {
                const itemId = item.productId || item.id || item._id;
                const itemImage = item.image || item.product?.image;
                const itemName = item.name || item.product?.name;
                const itemPrice = item.price || item.product?.price;
                
                return (
                  <div key={itemId} className="flex gap-3">
                    <div className="w-16 h-16 bg-neutral-900 rounded-lg overflow-hidden shrink-0">
                      <img src={getImageUrl(itemImage)} alt={itemName} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm text-white font-medium truncate">{itemName}</h4>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-neutral-400">x{item.quantity}</span>
                        <span className="text-sm text-indigo-400 font-medium">
                          {((itemPrice || 0) * item.quantity).toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
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
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-700 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20"
            >
              {loading ? 'Đang xử lý...' : 'Đặt hàng ngay'}
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
