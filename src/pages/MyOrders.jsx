import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuPackage, LuClock, LuTruck, LuCircleCheck, LuCircleX, LuCreditCard } from 'react-icons/lu';
import api from '../services/api';
import { getImageUrl } from '../utils/imageUrl';

export default function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const statusLabels = {
    pending: 'Chờ thanh toán',
    paid: 'Đã thanh toán',
    processing: 'Đang xử lý',
    shipping: 'Đang giao',
    delivered: 'Đã giao',
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
    pending: 'text-yellow-500 bg-yellow-500/10',
    paid: 'text-blue-500 bg-blue-500/10',
    processing: 'text-indigo-500 bg-indigo-500/10',
    shipping: 'text-purple-500 bg-purple-500/10',
    delivered: 'text-green-500 bg-green-500/10',
    cancelled: 'text-red-500 bg-red-500/10'
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? `?status=${filter}` : '';
      const response = await api.get(`/orders/my-orders${params}`);
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Không thể tải đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId, e) => {
    e.stopPropagation();
    
    if (!window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;

    try {
      await api.put(`/orders/${orderId}/cancel`, {
        reason: 'Khách hàng hủy'
      });
      alert('Hủy đơn hàng thành công');
      fetchOrders();
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
          <p className="text-neutral-400">Đang tải đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 pt-24 pb-32">
      <h1 className="text-3xl font-bold text-white mb-8">Đơn hàng của tôi</h1>

      {/* Filters */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
        {['all', 'pending', 'paid', 'processing', 'shipping', 'delivered', 'cancelled'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all
              ${filter === status 
                ? 'bg-indigo-600 text-white' 
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
          >
            {status === 'all' ? 'Tất cả' : statusLabels[status]}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 text-neutral-700">
              <LuPackage size={96} />
            </div>
            <p className="text-xl text-neutral-400 mb-2">Không có đơn hàng nào</p>
            <p className="text-sm text-neutral-500 mb-6">
              {filter === 'all' 
                ? 'Bạn chưa có đơn hàng nào' 
                : `Không có đơn hàng ${statusLabels[filter].toLowerCase()}`
              }
            </p>
            <button
              onClick={() => navigate('/products')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Mua sắm ngay
            </button>
          </div>
        ) : (
          orders.map(order => {
            const StatusIcon = statusIcons[order.status];
            
            return (
              <div 
                key={order.id} 
                onClick={() => navigate(`/orders/${order.id}`)}
                className="bg-[#151515] border border-neutral-800 rounded-xl p-6 hover:border-indigo-500/50 transition-all cursor-pointer"
              >
                {/* Order Header */}
                <div className="flex justify-between items-start mb-4 pb-4 border-b border-neutral-800">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-white">#{order.orderCode}</h3>
                      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
                        <StatusIcon size={16} />
                        {statusLabels[order.status]}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-400">
                      {new Date(order.createdAt).toLocaleString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-neutral-400 mb-1">Tổng tiền</p>
                    <p className="text-xl font-bold text-indigo-400">
                      {order.totalAmount.toLocaleString('vi-VN')}đ
                    </p>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-3 mb-4">
                  {order.items?.slice(0, 2).map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-16 h-16 bg-neutral-900 rounded-lg overflow-hidden shrink-0">
                        <img 
                          src={getImageUrl(item.image)} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm text-white font-medium truncate">{item.name}</h4>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-neutral-400">Số lượng: {item.quantity}</span>
                          <span className="text-sm text-indigo-400 font-medium">
                            {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {order.items?.length > 2 && (
                    <p className="text-sm text-neutral-500 text-center">
                      +{order.items.length - 2} sản phẩm khác
                    </p>
                  )}
                </div>

                {/* Order Footer */}
                <div className="flex justify-between items-center pt-4 border-t border-neutral-800">
                  <div className="flex items-center gap-2 text-sm text-neutral-400">
                    <LuCreditCard size={16} />
                    {order.paymentMethod === 'vnpay' ? 'VNPay' : 'COD'}
                  </div>
                  
                  <div className="flex gap-2">
                    {(order.status === 'pending' || order.status === 'paid') && (
                      <button
                        onClick={(e) => handleCancelOrder(order.id, e)}
                        className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-sm font-medium transition-colors"
                      >
                        Hủy đơn
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/orders/${order.id}`);
                      }}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
