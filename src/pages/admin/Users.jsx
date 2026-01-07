import React, { useState, useEffect } from 'react';
import { LuSearch, LuUserCheck, LuUserX, LuMail, LuCalendar, LuUsers } from "react-icons/lu";
import api from '../../services/api';
import toast from 'react-hot-toast';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const hasFetched = React.useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchUsers();
      hasFetched.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Chỉ lấy khách hàng (customer)
      const params = { page: 1, limit: 50, role: 'customer' };
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.isActive = statusFilter;

      const response = await api.get('/users', { params });
      
      // Xử lý nhiều format response khác nhau
      const usersData = response.data.users || response.data.data || response.data || [];
      // Đảm bảo chỉ lấy customer
      const customers = Array.isArray(usersData) 
        ? usersData.filter(u => u.role === 'customer' || !u.role)
        : [];
      setUsers(customers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error("Không thể tải danh sách khách hàng");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    hasFetched.current = false;
    fetchUsers();
  };

  const handleStatusChange = async (userId, currentStatus) => {
    const isActive = currentStatus === 'Active' || currentStatus === true;
    
    if (window.confirm(`Bạn có chắc chắn muốn ${isActive ? 'chặn' : 'bỏ chặn'} người dùng này?`)) {
      try {
        await api.put(`/users/${userId}/status`, { isActive: !isActive });
        
        // Cập nhật local state
        setUsers(users.map(u => 
          (u._id || u.id) === userId 
            ? { ...u, isActive: !isActive, status: !isActive ? 'Active' : 'Blocked' } 
            : u
        ));
        
        toast.success(`Đã ${isActive ? 'chặn' : 'bỏ chặn'} người dùng`);
      } catch (error) {
        console.error('Error updating status:', error);
        toast.error('Cập nhật thất bại');
      }
    }
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
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LuUsers className="text-indigo-500" />
            Quản lý khách hàng
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            Tổng số: <span className="text-white font-semibold">{users.length}</span> khách hàng
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-[#151515] border border-neutral-800 rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
            <input 
              type="text" 
              placeholder="Tìm theo tên hoặc email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="true">Hoạt động</option>
            <option value="false">Bị chặn</option>
          </select>
        </div>

        <div className="flex gap-3 mt-4">
          <button 
            onClick={handleSearch}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            <LuSearch size={18} />
            Tìm kiếm
          </button>
          <button 
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('');
              hasFetched.current = false;
              fetchUsers();
            }}
            className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Đặt lại
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#151515] border border-neutral-800 rounded-xl overflow-hidden">
        {users.length === 0 ? (
          <div className="text-center py-12 text-neutral-400">
            <LuUsers size={48} className="mx-auto mb-4 opacity-50" />
            <p>Không tìm thấy khách hàng nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-neutral-900 text-neutral-400 text-sm">
                <tr>
                  <th className="px-6 py-4 font-semibold">KHÁCH HÀNG</th>
                  <th className="px-6 py-4 font-semibold">EMAIL</th>
                  <th className="px-6 py-4 font-semibold">NGÀY ĐĂNG KÝ</th>
                  <th className="px-6 py-4 font-semibold">TRẠNG THÁI</th>
                  <th className="px-6 py-4 font-semibold text-right">THAO TÁC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {users.map((user) => {
                  const userId = String(user._id || user.id || '');
                  const isActive = user.isActive !== false && user.status !== 'Blocked';
                  
                  return (
                    <tr key={userId} className="hover:bg-neutral-900/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="text-white font-medium">{user.name || 'Không có tên'}</p>
                            <p className="text-neutral-500 text-xs">ID: {userId.slice(-8) || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-neutral-400">
                          <LuMail size={16} />
                          <span className="text-sm">{user.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-neutral-400 text-sm">
                          <LuCalendar size={16} />
                          {user.createdAt 
                            ? new Date(user.createdAt).toLocaleDateString('vi-VN')
                            : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 w-fit ${
                          isActive
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400' : 'bg-red-400'}`}></span>
                          {isActive ? 'Hoạt động' : 'Bị chặn'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleStatusChange(userId, isActive)}
                            className={`p-2 rounded-lg transition-all ${
                              isActive
                                ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                                : 'text-green-400 hover:text-green-300 hover:bg-green-500/10'
                            }`}
                            title={isActive ? 'Chặn người dùng' : 'Bỏ chặn người dùng'}
                          >
                            {isActive ? <LuUserX size={20} /> : <LuUserCheck size={20} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
