import React, { useEffect, useState } from 'react';
import { LuDollarSign, LuShoppingBag, LuShoppingCart, LuUsers, LuTrendingUp } from "react-icons/lu";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';

const StatCard = ({ title, value, change, icon: Icon, color }) => (
  <div className="bg-[#151515] border border-neutral-800 rounded-xl p-6">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
      <span className={`text-sm font-medium ${change >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center gap-1`}>
        {change >= 0 ? '+' : ''}{change}%
        <LuTrendingUp size={14} />
      </span>
    </div>
    <h3 className="text-neutral-400 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-white">{value}</p>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        const data = res.data;

        setStats([
          { title: "Tổng doanh thu", value: data.totalRevenue?.toLocaleString() + '₫', change: 10, icon: LuDollarSign, color: "bg-indigo-600" },
          { title: "Đơn hàng", value: data.totalOrders, change: 5, icon: LuShoppingCart, color: "bg-blue-600" },
          { title: "Sản phẩm đã bán", value: data.totalProductsSold, change: 8, icon: LuShoppingBag, color: "bg-orange-600" },
          { title: "Khách hàng mới", value: data.newCustomers, change: 12, icon: LuUsers, color: "bg-green-600" },
        ]);

        setRevenueData(data.revenueChart || []);
        setTopProducts(data.topSellingProducts || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Fallback to empty state to prevent crash
        setStats([
          { title: "Tổng doanh thu", value: "0₫", change: 0, icon: LuDollarSign, color: "bg-indigo-600" },
          { title: "Đơn hàng", value: "0", change: 0, icon: LuShoppingCart, color: "bg-blue-600" },
          { title: "Sản phẩm đã bán", value: "0", change: 0, icon: LuShoppingBag, color: "bg-orange-600" },
          { title: "Khách hàng mới", value: "0", change: 0, icon: LuUsers, color: "bg-green-600" },
        ]);
        setRevenueData([]);
        setTopProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="text-white p-6">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-[#151515] border border-neutral-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">Doanh thu 7 ngày qua</h3>
          <div className="h-80 w-full min-h-[320px]">
            {revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis 
                    dataKey="label" 
                    stroke="#737373" 
                    tick={{ fill: '#737373', fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                  />
                  <YAxis 
                    stroke="#737373" 
                    tick={{ fill: '#737373', fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}tr`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#151515', borderColor: '#262626', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value) => [`${value} triệu`, 'Doanh thu']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#4f46e5" 
                    strokeWidth={3}
                    dot={{ fill: '#4f46e5', strokeWidth: 2, r: 4, stroke: '#151515' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-neutral-500">
                Chưa có dữ liệu doanh thu
              </div>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-[#151515] border border-neutral-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">Sản phẩm bán chạy</h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-neutral-900/50 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-white">{product.name}</h4>
                  <p className="text-xs text-neutral-500">{product.sales} đã bán</p>
                </div>
                <span className="text-sm font-bold text-indigo-400">{product.revenue}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
