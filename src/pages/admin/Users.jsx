import React, { useState, useEffect } from 'react';
import { LuSearch, LuFilter, LuUserCheck, LuUserX } from "react-icons/lu";
import api from '../../services/api';
import toast from 'react-hot-toast';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = React.useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchUsers();
      hasFetched.current = true;
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users'); // Or /admin/users
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Blocked' : 'Active';
    if (window.confirm(`Bạn có chắc chắn muốn ${newStatus === 'Blocked' ? 'chặn' : 'bỏ chặn'} người dùng này?`)) {
      try {
        await api.put(`/users/${id}/status`, { status: newStatus });
        setUsers(users.map(u => u.id === id || u._id === id ? { ...u, status: newStatus } : u));
        toast.success(`Đã cập nhật trạng thái thành ${newStatus}`);
      } catch (error) {
        toast.error('Cập nhật thất bại');
      }
    }
  };

  if (loading) return <div className="text-white p-6">Đang tải...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-white">Quản lý người dùng</h1>
      </div>

      {/* Filters & Search */}
      <div className="bg-[#151515] border border-neutral-800 rounded-xl p-4 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
          <input 
            type="text" 
            placeholder="Tìm kiếm người dùng..." 
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

      {/* Users Table */}
      <div className="bg-[#151515] border border-neutral-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-neutral-900 text-neutral-400 text-sm uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Người dùng</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Vai trò</th>
                <th className="px-6 py-4 font-medium">Ngày tham gia</th>
                <th className="px-6 py-4 font-medium">Trạng thái</th>
                <th className="px-6 py-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {users.map((user) => (
                <tr key={user.id || user._id} className="hover:bg-neutral-900/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                        {user.name?.charAt(0)}
                      </div>
                      <span className="text-white font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-neutral-400">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${user.role === 'Admin' || user.role === 'admin' ? 'bg-purple-500/10 text-purple-500' : 'bg-neutral-800 text-neutral-400'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-400">{user.joinDate || new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleStatusChange(user.id || user._id, user.status)}
                        className="p-2 text-neutral-400 hover:text-indigo-500 hover:bg-indigo-500/10 rounded-lg transition-colors"
                        title={user.status === 'Active' ? 'Chặn người dùng' : 'Bỏ chặn'}
                      >
                        {user.status === 'Active' ? <LuUserX size={18} /> : <LuUserCheck size={18} />}
                      </button>
                    </div>
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

export default Users;
