import React, { useState, useEffect } from 'react';
import { LuSearch, LuEye, LuFilter, LuCalendar, LuX, LuChevronDown } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const hasFetched = React.useRef(false);

  // Các trạng thái Admin/Nhân viên có thể cập nhật
  const allowedStatuses = [
    { value: 'pending', label: 'Chờ thanh toán', color: 'yellow' },
    { value: 'paid', label: 'Đã thanh toán', color: 'indigo' },
    { value: 'processing', label: 'Đang xử lý', color: 'blue' },
    { value: 'shipping', label: 'Đang giao', color: 'purple' },
    { value: 'delivered', label: 'Đã giao', color: 'green' }
  ];

  useEffect(() => {
    if (!hasFetched.current) {
      fetchOrders();
      hasFetched.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status = statusFilter;
      if (paymentFilter) params.paymentMethod = paymentFilter;
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;

      const res = await api.get('/orders', { params });
      setOrders(res.data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Không thể tải danh sách đơn hàng");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    hasFetched.current = false;
    fetchOrders();
  };

  const handleReset = () => {
    setSearchTerm('');
    setStatusFilter('');
    setPaymentFilter('');
    setDateFrom('');
    setDateTo('');
    hasFetched.current = false;
    fetchOrders();
  };

  const hasActiveFilters = searchTerm || statusFilter || paymentFilter || dateFrom || dateTo;

  // Cập nhật trạng thái đơn hàng
  const handleUpdateStatus = async (orderId, newStatus) => {
    // Validation: Không cho phép cập nhật thành cancelled
    if (newStatus === 'cancelled') {
      toast.error('Admin/Nhân viên không được hủy đơn hàng');
      return;
    }

    const statusLabel = allowedStatuses.find(s => s.value === newStatus)?.label;
    const confirmMsg = `Bạn có chắc muốn chuyển đơn hàng sang trạng thái "${statusLabel}"?`;
    
    if (!window.confirm(confirmMsg)) return;

    setUpdatingOrderId(orderId);
    try {
      // Gửi status và note để backend cập nhật statusHistory
      await api.put(`/orders/${orderId}/status`, { 
        status: newStatus,
        note: `${statusLabel} - Cập nhật bởi nhân viên`
      });
      
      // Cập nhật local state
      setOrders(orders.map(order => 
        (order._id || order.id) === orderId 
          ? { ...order, status: newStatus }
          : order
      ));
      
      toast.success('Đã cập nhật trạng thái đơn hàng');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error(error.response?.data?.msg || 'Không thể cập nhật trạng thái');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-500/10 text-green-500';
      case 'processing': return 'bg-blue-500/10 text-blue-500';
      case 'shipping': return 'bg-purple-500/10 text-purple-500';
      case 'paid': return 'bg-indigo-500/10 text-indigo-500';
      case 'pending': return 'bg-yellow-500/10 text-yellow-500';
      case 'cancelled': return 'bg-red-500/10 text-red-500';
      default: return 'bg-neutral-500/10 text-neutral-500';
    }
  };

  const statusLabels = {
    pending: 'Chờ thanh toán',
    paid: 'Đã thanh toán',
    processing: 'Đang xử lý',
    shipping: 'Đang giao',
    delivered: 'Đã giao',
    cancelled: 'Đã hủy'
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Quản lý đơn hàng</h1>
          <p className="text-neutral-400 text-sm mt-1">
            Tổng số: <span className="text-white font-semibold">{orders.length}</span> đơn hàng
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-[#151515] border border-neutral-800 rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
            <input 
              type="text" 
              placeholder="Tìm theo mã đơn, tên khách hàng, email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          
          {/* Filter Toggle Button */}
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
              showFilters || hasActiveFilters
                ? 'bg-indigo-600 text-white'
                : 'bg-neutral-900 border border-neutral-800 text-white hover:bg-neutral-800'
            }`}
          >
            <LuFilter size={20} />
            <span>Bộ lọc</span>
            {hasActiveFilters && !showFilters && (
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            )}
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-neutral-800">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-400">Trạng thái</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="pending">Chờ thanh toán</option>
                  <option value="paid">Đã thanh toán</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="shipping">Đang giao</option>
                  <option value="delivered">Đã giao</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>

              {/* Payment Method Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-400">Phương thức</label>
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="">Tất cả phương thức</option>
                  <option value="vnpay">VNPay</option>
                  <option value="cod">COD</option>
                </select>
              </div>

              {/* Date From */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-400">Từ ngày</label>
                <div className="relative">
                  <LuCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-10 pr-3 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Date To */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-400">Đến ngày</label>
                <div className="relative">
                  <LuCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-10 pr-3 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex gap-3 mt-4">
              <button 
                onClick={handleSearch}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
              >
                <LuSearch size={18} />
                Tìm kiếm
              </button>
              {hasActiveFilters && (
                <button 
                  onClick={handleReset}
                  className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  <LuX size={18} />
                  Xóa bộ lọc
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-[#151515] border border-neutral-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-neutral-900 text-neutral-400 text-sm uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Mã đơn hàng</th>
                <th className="px-6 py-4 font-medium">Khách hàng</th>
                <th className="px-6 py-4 font-medium">Ngày đặt</th>
                <th className="px-6 py-4 font-medium">Tổng tiền</th>
                <th className="px-6 py-4 font-medium">Thanh toán</th>
                <th className="px-6 py-4 font-medium">Trạng thái</th>
                <th className="px-6 py-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-neutral-500">
                    Không có đơn hàng nào
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const orderId = order._id || order.id;
                  const isUpdating = updatingOrderId === orderId;
                  const isCancelled = order.status === 'cancelled';
                  
                  return (
                    <tr key={orderId} className="hover:bg-neutral-900/50 transition-colors">
                      <td className="px-6 py-4 text-indigo-400 font-medium">#{order.orderCode}</td>
                      <td className="px-6 py-4 text-white">
                        {order.shippingAddress?.fullName || order.user?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-neutral-400">
                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 text-white">
                        {order.totalAmount?.toLocaleString('vi-VN')}₫
                      </td>
                      <td className="px-6 py-4 text-neutral-400">
                        {order.paymentMethod === 'vnpay' ? 'VNPay' : 'COD'}
                      </td>
                      <td className="px-6 py-4">
                        {isCancelled ? (
                          // Đơn đã hủy - chỉ hiển thị, không cho edit
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {statusLabels[order.status] || order.status}
                          </span>
                        ) : (
                          // Dropdown chọn trạng thái
                          <div className="relative inline-block">
                            <select
                              value={order.status}
                              onChange={(e) => handleUpdateStatus(orderId, e.target.value)}
                              disabled={isUpdating}
                              className={`appearance-none px-3 py-1 pr-8 rounded-full text-xs font-medium cursor-pointer transition-all ${
                                getStatusColor(order.status)
                              } ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-110'} border-0 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            >
                              {allowedStatuses.map(status => (
                                <option key={status.value} value={status.value}>
                                  {status.label}
                                </option>
                              ))}
                            </select>
                            <LuChevronDown 
                              className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-current" 
                              size={14} 
                            />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => navigate(`/admin/orders/${orderId}`)}
                          className="p-2 text-neutral-400 hover:text-indigo-500 hover:bg-indigo-500/10 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <LuEye size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
