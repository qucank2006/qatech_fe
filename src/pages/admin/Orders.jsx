import React, { useState } from 'react';
import { LuSearch, LuEye, LuFilter } from "react-icons/lu";

const Orders = () => {
  const [orders] = useState([
    { id: "#ORD-001", customer: "Nguyễn Văn A", date: "2024-03-15", total: "42.990.000₫", status: "Completed", payment: "Credit Card" },
    { id: "#ORD-002", customer: "Trần Thị B", date: "2024-03-14", total: "38.990.000₫", status: "Processing", payment: "COD" },
    { id: "#ORD-003", customer: "Lê Văn C", date: "2024-03-14", total: "45.990.000₫", status: "Pending", payment: "Bank Transfer" },
    { id: "#ORD-004", customer: "Phạm Thị D", date: "2024-03-13", total: "32.990.000₫", status: "Cancelled", payment: "Credit Card" },
    { id: "#ORD-005", customer: "Hoàng Văn E", date: "2024-03-12", total: "28.990.000₫", status: "Completed", payment: "COD" },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-500/10 text-green-500';
      case 'Processing': return 'bg-blue-500/10 text-blue-500';
      case 'Pending': return 'bg-yellow-500/10 text-yellow-500';
      case 'Cancelled': return 'bg-red-500/10 text-red-500';
      default: return 'bg-neutral-500/10 text-neutral-500';
    }
  };

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
                <tr key={order.id} className="hover:bg-neutral-900/50 transition-colors">
                  <td className="px-6 py-4 text-indigo-400 font-medium">{order.id}</td>
                  <td className="px-6 py-4 text-white">{order.customer}</td>
                  <td className="px-6 py-4 text-neutral-400">{order.date}</td>
                  <td className="px-6 py-4 text-white">{order.total}</td>
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
