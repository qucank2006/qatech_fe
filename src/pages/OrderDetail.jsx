import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  LuPackage, LuMapPin, LuCreditCard, LuClock, LuTruck, 
  LuCircleCheck, LuCircleX, LuArrowLeft, LuPhone, LuMail, LuUser 
} from 'react-icons/lu';
import api from '../services/api';
import { getImageUrl } from '../utils/imageUrl';

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const statusLabels = {
    pending: 'Chờ thanh toán',
    paid: 'Đã thanh toán',
    processing: 'Đang xử lý',
    shipping: 'Đang giao hàng',
    delivered: 'Đã giao hàng',
    cancelled: 'Đã hủy'
  };

  const statusIcons = {
    pending: LuClock,
    paid: LuCreditCard,
    processing: LuPackage,
    shipping: LuTruck,
    delivered: LuCircleCheck,
    cancelled: LuCircleX
  };

  const statusColors = {
    pending: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    paid: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    processing: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
    shipping: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    delivered: 'text-green-500 bg-green-500/10 border-green-500/20',
    cancelled: 'text-red-500 bg-red-500/10 border-red-500/20'
  };

  useEffect(() => {
    fetchOrderDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data.order);
    } catch (error) {
      console.error('Error fetching order:', error);
      alert('Không thể tải chi tiết đơn hàng');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;

    try {
      await api.put(`/orders/${id}/cancel`, {
        reason: 'Khách hàng hủy'
      });
      alert('Hủy đơn hàng thành công');
      fetchOrderDetail();
    } catch (error) {
      alert(error.response?.data?.msg || 'Không thể hủy đơn hàng');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="animate-spin text-indigo-500 mb-4">
            <LuPackage size={48} />
          </div>
          <p className="text-neutral-400">Đang tải chi tiết đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <LuCircleX size={64} className="text-red-500 mx-auto mb-4" />
          <p className="text-xl text-neutral-400">Không tìm thấy đơn hàng</p>
        </div>
      </div>
    );
  }

  const StatusIcon = statusIcons[order.status];

  return (
    <div className="max-w-5xl mx-auto px-6 pt-24 pb-32">
      {/* Back Button */}
      <button
        onClick={() => navigate('/orders')}
        className="flex items-center gap-2 text-neutral-400 hover:text-white mb-6 transition-colors"
      >
        <LuArrowLeft size={20} />
        Quay lại danh sách đơn hàng
      </button>

      {/* Order Header */}
      <div className="bg-[#151515] border border-neutral-800 rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Đơn hàng #{order.orderCode}</h1>
            <p className="text-sm text-neutral-400">
              Đặt lúc: {new Date(order.createdAt).toLocaleString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${statusColors[order.status]}`}>
            <StatusIcon size={20} />
            <span className="font-semibold">{statusLabels[order.status]}</span>
          </div>
        </div>

        {(order.status === 'pending' || order.status === 'paid') && (
          <button
            onClick={handleCancelOrder}
            className="w-full md:w-auto px-6 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg font-medium transition-colors"
          >
            Hủy đơn hàng
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-[#151515] border border-neutral-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <LuPackage className="text-indigo-500" />
              Sản phẩm ({order.items?.length})
            </h2>
            
            <div className="space-y-4">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex gap-4 pb-4 border-b border-neutral-800 last:border-0 last:pb-0">
                  <div className="w-20 h-20 bg-neutral-900 rounded-lg overflow-hidden shrink-0">
                    <img 
                      src={getImageUrl(item.image)} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium mb-1">{item.name}</h3>
                    <div className="flex justify-between items-end">
                      <div className="text-sm text-neutral-400">
                        <p>Số lượng: {item.quantity}</p>
                        <p>Đơn giá: {item.price.toLocaleString('vi-VN')}đ</p>
                      </div>
                      <p className="text-lg font-bold text-indigo-400">
                        {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status History */}
          {order.statusHistory && order.statusHistory.length > 0 && (
            <div className="bg-[#151515] border border-neutral-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Lịch sử đơn hàng</h2>
              
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-neutral-800"></div>
                
                <div className="space-y-4">
                  {order.statusHistory.map((history, idx) => (
                    <div key={idx} className="relative pl-8">
                      {/* Timeline dot */}
                      <div className="absolute left-0 top-1 w-5 h-5 rounded-full bg-indigo-600 border-4 border-[#151515]"></div>
                      
                      <div>
                        <p className="text-white font-medium">{statusLabels[history.status]}</p>
                        <p className="text-sm text-neutral-400 mt-1">{history.note}</p>
                        <p className="text-xs text-neutral-500 mt-1">
                          {new Date(history.updatedAt).toLocaleString('vi-VN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <div className="bg-[#151515] border border-neutral-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <LuMapPin className="text-indigo-500" />
              Địa chỉ giao hàng
            </h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <LuUser className="text-neutral-500 mt-0.5 shrink-0" size={16} />
                <div>
                  <p className="text-neutral-400">Người nhận</p>
                  <p className="text-white font-medium">{order.shippingAddress?.fullName}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <LuPhone className="text-neutral-500 mt-0.5 shrink-0" size={16} />
                <div>
                  <p className="text-neutral-400">Số điện thoại</p>
                  <p className="text-white font-medium">{order.shippingAddress?.phone}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <LuMapPin className="text-neutral-500 mt-0.5 shrink-0" size={16} />
                <div>
                  <p className="text-neutral-400">Địa chỉ</p>
                  <p className="text-white">
                    {order.shippingAddress?.address}
                    {order.shippingAddress?.ward && `, ${order.shippingAddress.ward}`}
                    {order.shippingAddress?.district && `, ${order.shippingAddress.district}`}
                    {order.shippingAddress?.city && `, ${order.shippingAddress.city}`}
                  </p>
                </div>
              </div>
            </div>

            {order.note && (
              <div className="mt-4 pt-4 border-t border-neutral-800">
                <p className="text-neutral-400 text-sm mb-1">Ghi chú:</p>
                <p className="text-white text-sm">{order.note}</p>
              </div>
            )}
          </div>

          {/* Payment Info */}
          <div className="bg-[#151515] border border-neutral-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <LuCreditCard className="text-indigo-500" />
              Thanh toán
            </h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-400">Phương thức</span>
                <span className="text-white font-medium">
                  {order.paymentMethod === 'vnpay' ? 'VNPay' : 'COD'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-neutral-400">Trạng thái</span>
                <span className={`font-medium ${
                  order.paymentStatus === 'paid' 
                    ? 'text-green-500' 
                    : order.paymentStatus === 'refunded'
                    ? 'text-orange-500'
                    : 'text-yellow-500'
                }`}>
                  {order.paymentStatus === 'paid' 
                    ? 'Đã thanh toán' 
                    : order.paymentStatus === 'refunded'
                    ? 'Đã hoàn tiền'
                    : 'Chưa thanh toán'
                  }
                </span>
              </div>

              {order.transactionId && (
                <div className="flex justify-between">
                  <span className="text-neutral-400">Mã GD</span>
                  <span className="text-white font-mono text-xs">{order.transactionId}</span>
                </div>
              )}

              {order.paidAt && (
                <div className="flex justify-between">
                  <span className="text-neutral-400">Thời gian</span>
                  <span className="text-white">
                    {new Date(order.paidAt).toLocaleString('vi-VN')}
                  </span>
                </div>
              )}

              <div className="h-px bg-neutral-800 my-3"></div>

              <div className="flex justify-between text-base">
                <span className="text-white font-medium">Tổng cộng</span>
                <span className="text-2xl font-bold text-indigo-400">
                  {order.totalAmount.toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>
          </div>

          {/* User Info */}
          {order.user && (
            <div className="bg-[#151515] border border-neutral-800 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Thông tin khách hàng</h2>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <LuUser className="text-neutral-500" size={16} />
                  <span className="text-white">{order.user.name}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <LuMail className="text-neutral-500" size={16} />
                  <span className="text-neutral-400">{order.user.email}</span>
                </div>
                
                {order.user.phone && (
                  <div className="flex items-center gap-2">
                    <LuPhone className="text-neutral-500" size={16} />
                    <span className="text-neutral-400">{order.user.phone}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
