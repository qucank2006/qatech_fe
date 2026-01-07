import React, { useState, useEffect } from 'react';
import { 
  LuSearch, LuUserPlus, LuUserCheck, LuUserX, LuMail, LuCalendar, 
  LuPencil, LuTrash2, LuX, LuEye, LuEyeOff, LuShield, LuUserCog
} from "react-icons/lu";
import api from '../../services/api';
import toast from 'react-hot-toast';

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
    phone: ''
  });

  const hasFetched = React.useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchStaff();
      hasFetched.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const params = { page: 1, limit: 50 };
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.isActive = statusFilter;
      // Lọc chỉ admin và employee
      if (roleFilter) {
        params.role = roleFilter;
      } else {
        params.roles = 'admin,employee';
      }

      const response = await api.get('/users', { params });
      
      const usersData = response.data.users || response.data.data || response.data || [];
      // Lọc chỉ lấy admin và employee
      const staffData = Array.isArray(usersData) 
        ? usersData.filter(u => u.role === 'admin' || u.role === 'employee')
        : [];
      setStaff(staffData);
    } catch (error) {
      console.error('Error fetching staff:', error);
      toast.error("Không thể tải danh sách nhân sự");
      setStaff([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    hasFetched.current = false;
    fetchStaff();
  };

  const handleReset = () => {
    setSearchTerm('');
    setRoleFilter('');
    setStatusFilter('');
    hasFetched.current = false;
    fetchStaff();
  };

  // Open modal for create
  const openCreateModal = () => {
    setModalMode('create');
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'employee',
      phone: ''
    });
    setSelectedStaff(null);
    setShowPassword(false);
    setShowModal(true);
  };

  // Open modal for edit
  const openEditModal = (staffMember) => {
    setModalMode('edit');
    setFormData({
      name: staffMember.name || '',
      email: staffMember.email || '',
      password: '',
      role: staffMember.role || 'employee',
      phone: staffMember.phone || ''
    });
    setSelectedStaff(staffMember);
    setShowPassword(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedStaff(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'employee',
      phone: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (modalMode === 'create' && !formData.password) {
      toast.error('Vui lòng nhập mật khẩu');
      return;
    }

    setSubmitting(true);
    try {
      if (modalMode === 'create') {
        // Tạo nhân sự mới
        await api.post('/users/staff', formData);
        toast.success('Tạo tài khoản nhân sự thành công');
      } else {
        // Cập nhật nhân sự
        const staffId = selectedStaff._id || selectedStaff.id;
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password;
        
        await api.put(`/users/${staffId}`, updateData);
        toast.success('Cập nhật thông tin thành công');
      }
      
      closeModal();
      fetchStaff();
    } catch (error) {
      console.error('Error saving staff:', error);
      toast.error(error.response?.data?.msg || 'Có lỗi xảy ra');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (staffId, currentStatus) => {
    const isActive = currentStatus === true || currentStatus === 'Active';
    
    if (window.confirm(`Bạn có chắc chắn muốn ${isActive ? 'vô hiệu hóa' : 'kích hoạt'} tài khoản này?`)) {
      try {
        await api.put(`/users/${staffId}/status`, { isActive: !isActive });
        
        setStaff(staff.map(s => 
          String(s._id || s.id) === staffId 
            ? { ...s, isActive: !isActive } 
            : s
        ));
        
        toast.success(`Đã ${isActive ? 'vô hiệu hóa' : 'kích hoạt'} tài khoản`);
      } catch (error) {
        console.error('Error updating status:', error);
        toast.error('Cập nhật thất bại');
      }
    }
  };

  const handleDelete = async (staffMember) => {
    const staffId = String(staffMember._id || staffMember.id);
    const staffName = staffMember.name || staffMember.email;
    
    if (window.confirm(`Bạn có chắc chắn muốn xóa nhân sự "${staffName}"? Hành động này không thể hoàn tác.`)) {
      try {
        await api.delete(`/users/${staffId}`);
        setStaff(staff.filter(s => String(s._id || s.id) !== staffId));
        toast.success('Đã xóa nhân sự');
      } catch (error) {
        console.error('Error deleting staff:', error);
        toast.error(error.response?.data?.msg || 'Không thể xóa nhân sự');
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <LuUserCog className="text-indigo-500" />
            Quản lý nhân sự
          </h1>
          <p className="text-neutral-400 text-sm mt-1">
            Tổng số: <span className="text-white font-semibold">{staff.length}</span> nhân sự
          </p>
        </div>
        <button 
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg transition-colors font-medium"
        >
          <LuUserPlus size={20} />
          Thêm nhân sự
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-[#151515] border border-neutral-800 rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="">Tất cả vai trò</option>
            <option value="employee">Nhân viên</option>
            <option value="admin">Quản trị viên</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="true">Hoạt động</option>
            <option value="false">Vô hiệu hóa</option>
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
            onClick={handleReset}
            className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Đặt lại
          </button>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-[#151515] border border-neutral-800 rounded-xl overflow-hidden">
        {staff.length === 0 ? (
          <div className="text-center py-12 text-neutral-400">
            <LuUserCog size={48} className="mx-auto mb-4 opacity-50" />
            <p>Không tìm thấy nhân sự nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-neutral-900 text-neutral-400 text-sm">
                <tr>
                  <th className="px-6 py-4 font-semibold">NHÂN SỰ</th>
                  <th className="px-6 py-4 font-semibold">LIÊN HỆ</th>
                  <th className="px-6 py-4 font-semibold">VAI TRÒ</th>
                  <th className="px-6 py-4 font-semibold">NGÀY TẠO</th>
                  <th className="px-6 py-4 font-semibold">TRẠNG THÁI</th>
                  <th className="px-6 py-4 font-semibold text-right">THAO TÁC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {staff.map((member) => {
                  const staffId = String(member._id || member.id || '');
                  const isActive = member.isActive !== false;
                  
                  return (
                    <tr key={staffId} className="hover:bg-neutral-900/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                            member.role === 'admin' 
                              ? 'bg-gradient-to-br from-purple-600 to-pink-600' 
                              : 'bg-gradient-to-br from-orange-500 to-yellow-500'
                          }`}>
                            {member.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="text-white font-medium">{member.name || 'Không có tên'}</p>
                            <p className="text-neutral-500 text-xs">ID: {staffId.slice(-8) || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-neutral-400">
                            <LuMail size={14} />
                            <span className="text-sm">{member.email}</span>
                          </div>
                          {member.phone && (
                            <p className="text-neutral-500 text-xs">{member.phone}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 ${
                          member.role === 'admin'
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                            : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                        }`}>
                          <LuShield size={12} />
                          {member.role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-neutral-400 text-sm">
                          <LuCalendar size={16} />
                          {member.createdAt 
                            ? new Date(member.createdAt).toLocaleDateString('vi-VN')
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
                          {isActive ? 'Hoạt động' : 'Vô hiệu hóa'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-1">
                          <button 
                            onClick={() => openEditModal(member)}
                            className="p-2 rounded-lg text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-all"
                            title="Sửa thông tin"
                          >
                            <LuPencil size={18} />
                          </button>
                          <button 
                            onClick={() => handleStatusChange(staffId, isActive)}
                            className={`p-2 rounded-lg transition-all ${
                              isActive
                                ? 'text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10'
                                : 'text-green-400 hover:text-green-300 hover:bg-green-500/10'
                            }`}
                            title={isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
                          >
                            {isActive ? <LuUserX size={18} /> : <LuUserCheck size={18} />}
                          </button>
                          <button 
                            onClick={() => handleDelete(member)}
                            className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                            title="Xóa nhân sự"
                          >
                            <LuTrash2 size={18} />
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

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1a1a] border border-neutral-800 rounded-2xl w-full max-w-md">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-neutral-800">
              <h2 className="text-xl font-bold text-white">
                {modalMode === 'create' ? 'Thêm nhân sự mới' : 'Chỉnh sửa nhân sự'}
              </h2>
              <button 
                onClick={closeModal}
                className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-white"
              >
                <LuX size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nhập họ và tên"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="example@email.com"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                  disabled={modalMode === 'edit'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">
                  {modalMode === 'create' ? 'Mật khẩu' : 'Mật khẩu mới'} 
                  {modalMode === 'create' && <span className="text-red-500">*</span>}
                  {modalMode === 'edit' && <span className="text-neutral-500 text-xs ml-2">(để trống nếu không đổi)</span>}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={modalMode === 'create' ? 'Nhập mật khẩu' : 'Nhập mật khẩu mới'}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                  >
                    {showPassword ? <LuEyeOff size={20} /> : <LuEye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">
                  Vai trò <span className="text-red-500">*</span>
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="employee">Nhân viên</option>
                  <option value="admin">Quản trị viên</option>
                </select>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg font-medium transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                >
                  {submitting ? 'Đang xử lý...' : modalMode === 'create' ? 'Tạo tài khoản' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;
