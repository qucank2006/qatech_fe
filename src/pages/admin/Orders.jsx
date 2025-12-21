import React, { useState, useEffect } from 'react';
import { LuSearch, LuEye, LuFilter } from "react-icons/lu";
import api from '../../services/api';
import toast from 'react-hot-toast';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = React.useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchOrders();
      hasFetched.current = true;
    }
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders'); // Or /admin/orders
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Không thể tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-500/10 text-green-500';
      case 'Processing': return 'bg-blue-500/10 text-blue-500';
      case 'Pending': return 'bg-yellow-500/10 text-yellow-500';
      case 'Cancelled': return 'bg-red-500/10 text-red-500';
      default: return 'bg-neutral-500/10 text-neutral-500';
    }
  };

  if (loading) return <div className="text-white p-6">Đang tải...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-white">Quản lý đơn hàng</h1>
      </div>

      {/* Filters & Search */}
      <div className="bg-[#151515] border border-neutral-800 rounded-xl p-4 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
          <input 
            type="text" 
            placeholder="Tìm kiếm đơn hàng..." 
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 text-white px-4 py-2 rounded-lg hover:bg-neutral-800">
            <LuFilter size={20} />
            <span>Bộ lọc</span>
          </button>
        </div>
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
              {orders.map((order) => (
                <tr key={order.id || order._id} className="hover:bg-neutral-900/50 transition-colors">
                  <td className="px-6 py-4 text-indigo-400 font-medium">{order.id || order._id}</td>
                  <td className="px-6 py-4 text-white">{order.customer}</td>
                  <td className="px-6 py-4 text-neutral-400">{order.date}</td>
                  <td className="px-6 py-4 text-white">{order.total?.toLocaleString()}₫</td>
                  <td className="px-6 py-4 text-neutral-400">{order.payment}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-neutral-400 hover:text-indigo-500 hover:bg-indigo-500/10 rounded-lg transition-colors">
                      <LuEye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
