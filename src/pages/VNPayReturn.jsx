import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LuCheck, LuX, LuLoader } from 'react-icons/lu';
import api from '../services/api';

export default function VNPayReturn() {
  const location = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const handleReturn = async () => {
      const params = new URLSearchParams(location.search);
      const vnp_ResponseCode = params.get('vnp_ResponseCode');
      const vnp_TxnRef = params.get('vnp_TxnRef');
      const vnp_TransactionNo = params.get('vnp_TransactionNo');
      
      // Lấy orderId từ TxnRef
      const orderIdFromRef = vnp_TxnRef?.split('_')[0];
      setOrderId(orderIdFromRef);

      // Xử lý response code
      if (vnp_ResponseCode === '00') {
        setStatus('success');
        setMessage('Thanh toán thành công!');
        
        // Xác nhận thanh toán với backend
        try {
          // Gọi API để cập nhật trạng thái đơn hàng
          await api.post(`/payments/vnpay-return`, {
            vnp_ResponseCode,
            vnp_TxnRef,
            vnp_TransactionNo,
            orderId: orderIdFromRef
          });
          
          // Verify đơn hàng đã được cập nhật
          const response = await api.get(`/orders/${orderIdFromRef}`);
          console.log('Order status after payment:', response.data.order.status);
          
          // Redirect sau 3 giây
          setTimeout(() => {
            navigate(`/orders/${orderIdFromRef}`);
          }, 3000);
        } catch (error) {
          console.error('Error updating payment:', error);
          // Vẫn hiển thị success và redirect
          setTimeout(() => {
            navigate(`/orders/${orderIdFromRef}`);
          }, 3000);
        }
      } else {
        setStatus('error');
        
        // Map error messages
        const errorMessages = {
          '07': 'Giao dịch bị nghi ngờ gian lận',
          '09': 'Thẻ/Tài khoản chưa đăng ký InternetBanking',
          '10': 'Xác thực thông tin không đúng quá 3 lần',
          '11': 'Đã hết hạn chờ thanh toán',
          '12': 'Thẻ/Tài khoản bị khóa',
          '13': 'Sai mật khẩu xác thực giao dịch (OTP)',
          '24': 'Khách hàng hủy giao dịch',
          '51': 'Tài khoản không đủ số dư',
          '65': 'Tài khoản đã vượt quá hạn mức giao dịch trong ngày',
          '75': 'Ngân hàng thanh toán đang bảo trì',
          '79': 'Nhập sai mật khẩu thanh toán quá số lần quy định',
          '99': 'Lỗi không xác định'
        };
        
        setMessage(errorMessages[vnp_ResponseCode] || 'Thanh toán thất bại');
      }
    };

    handleReturn();
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="max-w-md w-full text-center">
        {status === 'loading' && (
          <div>
            <div className="w-24 h-24 mx-auto mb-6 text-indigo-500 animate-spin">
              <LuLoader size={96} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Đang xử lý...</h2>
            <p className="text-neutral-400">Vui lòng đợi trong giây lát</p>
          </div>
        )}
        
        {status === 'success' && (
          <div>
            <div className="w-24 h-24 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-6 text-green-500">
              <LuCheck size={48} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Thanh toán thành công!</h2>
            <p className="text-neutral-400 mb-2">{message}</p>
            <p className="text-sm text-neutral-500 mb-8">
              Mã đơn hàng: <span className="text-white font-semibold">#{orderId}</span>
            </p>
            <p className="text-sm text-indigo-400 animate-pulse mb-6">
              Đang chuyển hướng đến chi tiết đơn hàng...
            </p>
            <button
              onClick={() => navigate(`/orders/${orderId}`)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-medium transition-colors"
            >
              Xem đơn hàng ngay
            </button>
          </div>
        )}
        
        {status === 'error' && (
          <div>
            <div className="w-24 h-24 mx-auto bg-red-500/20 rounded-full flex items-center justify-center mb-6 text-red-500">
              <LuX size={48} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Thanh toán thất bại</h2>
            <p className="text-neutral-400 mb-8">{message}</p>
            {orderId && (
              <p className="text-sm text-neutral-500 mb-6">
                Mã đơn hàng: <span className="text-white font-semibold">#{orderId}</span>
              </p>
            )}
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => navigate('/cart')}
                className="bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
              >
                Quay lại giỏ hàng
              </button>
              {orderId && (
                <button
                  onClick={() => navigate(`/orders/${orderId}`)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                >
                  Xem đơn hàng
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
