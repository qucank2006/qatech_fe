import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../redux/slices/authSlice';
import FadeContent from '../components/FadeContent';
import { FaUser, FaBox, FaLock, FaSave, FaHistory, FaCamera } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../services/api';
import { getImageUrl } from '../utils/imageUrl';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [avatarFile, setAvatarFile] = useState(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
      setAvatarFile(file);
      toast.success("Đã chọn ảnh đại diện mới");
    }
  };

  // Info State
  const [infoData, setInfoData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });

  // Password State
  const [passData, setPassData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Orders State
  const [orders, setOrders] = useState([]);

  // Sync local state with Redux user state
  useEffect(() => {
    if (user) {
      setInfoData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
      setAvatar(getImageUrl(user.avatar));
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      // Mock data for now, replace with actual API call
      // const res = await api.get('/orders/my-orders');
      // setOrders(res.data);
      
      // Mocking
      setOrders([
        { id: 'ORD-001', date: '2025-12-20', total: 25000000, status: 'Delivered', items: 2 },
        { id: 'ORD-002', date: '2025-12-15', total: 1500000, status: 'Processing', items: 1 },
      ]);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  };

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', infoData.name);
      formData.append('phone', infoData.phone);
      formData.append('address', infoData.address);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const res = await api.put('/auth/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Kiểm tra cấu trúc response để lấy đúng object user
      const updatedUser = res.data.user || res.data;
      dispatch(updateUser(updatedUser));
      
      toast.success("Cập nhật thông tin thành công!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.msg || "Cập nhật thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const handlePassSubmit = async (e) => {
    e.preventDefault();
    if (passData.newPassword !== passData.confirmPassword) {
      return toast.error("Mật khẩu mới không khớp!");
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('password', passData.newPassword);
      
      await api.put('/auth/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success("Đổi mật khẩu thành công!");
      setPassData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.msg || "Đổi mật khẩu thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'info', label: 'Thông tin cá nhân', icon: <FaUser /> },
    { id: 'orders', label: 'Lịch sử đơn hàng', icon: <FaHistory /> },
    { id: 'password', label: 'Đổi mật khẩu', icon: <FaLock /> },
  ];

  return (
    <div className="min-h-[85vh] px-4 py-12 max-w-6xl mx-auto">
      <FadeContent blur duration={800}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* SIDEBAR */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-[#111] border border-neutral-800 rounded-2xl p-6 text-center shadow-lg">
              <div className="relative w-24 h-24 mx-auto mb-4 group">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-indigo-500/30 shadow-lg shadow-indigo-500/20">
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-indigo-600 flex items-center justify-center text-4xl font-bold text-white">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-200">
                  <FaCamera className="text-white text-xl" />
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>

              <h2 className="text-xl font-bold text-white truncate">{user?.name}</h2>
              <p className="text-neutral-500 text-sm truncate">{user?.email}</p>
              <div className="mt-3 inline-block px-3 py-1 bg-neutral-800 rounded-full text-xs text-neutral-300 capitalize border border-neutral-700">
                {user?.role || 'Thành viên'}
              </div>
            </div>

            <div className="bg-[#111] border border-neutral-800 rounded-2xl overflow-hidden shadow-lg">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-medium transition-all
                    ${activeTab === tab.id 
                      ? 'bg-indigo-600/10 text-indigo-400 border-l-4 border-indigo-500' 
                      : 'text-neutral-400 hover:bg-neutral-900 hover:text-white border-l-4 border-transparent'
                    }
                  `}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* CONTENT AREA */}
          <div className="md:col-span-3">
            <div className="bg-[#111] border border-neutral-800 rounded-2xl p-8 shadow-lg min-h-[500px]">
              
              {/* INFO TAB */}
              {activeTab === 'info' && (
                <FadeContent blur>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <FaUser className="text-indigo-500" /> Thông tin cá nhân
                  </h2>
                  <form onSubmit={handleInfoSubmit} className="space-y-6 max-w-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-400">Họ và tên</label>
                        <input
                          type="text"
                          value={infoData.name}
                          onChange={(e) => setInfoData({...infoData, name: e.target.value})}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:outline-none transition"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-400">Email</label>
                        <input
                          type="email"
                          value={infoData.email}
                          disabled
                          className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl px-4 py-3 text-neutral-500 cursor-not-allowed"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-400">Số điện thoại</label>
                        <input
                          type="tel"
                          value={infoData.phone}
                          onChange={(e) => setInfoData({...infoData, phone: e.target.value})}
                          placeholder="Chưa cập nhật"
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:outline-none transition"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-400">Địa chỉ</label>
                        <input
                          type="text"
                          value={infoData.address}
                          onChange={(e) => setInfoData({...infoData, address: e.target.value})}
                          placeholder="Chưa cập nhật"
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:outline-none transition"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition shadow-lg shadow-indigo-500/20"
                    >
                      <FaSave /> {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                  </form>
                </FadeContent>
              )}

              {/* ORDERS TAB */}
              {activeTab === 'orders' && (
                <FadeContent blur>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <FaHistory className="text-indigo-500" /> Lịch sử đơn hàng
                  </h2>
                  <div className="space-y-4">
                    {orders.length > 0 ? (
                      orders.map((order) => (
                        <div key={order.id} className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-4 hover:border-indigo-500/30 transition">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-neutral-800 rounded-lg flex items-center justify-center text-neutral-400">
                              <FaBox />
                            </div>
                            <div>
                              <p className="font-bold text-white">{order.id}</p>
                              <p className="text-sm text-neutral-500">{order.date} • {order.items} sản phẩm</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium 
                              ${order.status === 'Delivered' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}
                            `}>
                              {order.status}
                            </span>
                            <p className="font-bold text-indigo-400">{order.total.toLocaleString()}₫</p>
                            <button className="text-sm text-neutral-400 hover:text-white underline">Chi tiết</button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-neutral-500">
                        <FaBox className="mx-auto text-4xl mb-4 opacity-20" />
                        <p>Bạn chưa có đơn hàng nào.</p>
                      </div>
                    )}
                  </div>
                </FadeContent>
              )}

              {/* PASSWORD TAB */}
              {activeTab === 'password' && (
                <FadeContent blur>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <FaLock className="text-indigo-500" /> Đổi mật khẩu
                  </h2>
                  <form onSubmit={handlePassSubmit} className="space-y-6 max-w-xl">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-400">Mật khẩu hiện tại</label>
                      <input
                        type="password"
                        required
                        value={passData.currentPassword}
                        onChange={(e) => setPassData({...passData, currentPassword: e.target.value})}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:outline-none transition"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-400">Mật khẩu mới</label>
                      <input
                        type="password"
                        required
                        value={passData.newPassword}
                        onChange={(e) => setPassData({...passData, newPassword: e.target.value})}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:outline-none transition"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-400">Xác nhận mật khẩu mới</label>
                      <input
                        type="password"
                        required
                        value={passData.confirmPassword}
                        onChange={(e) => setPassData({...passData, confirmPassword: e.target.value})}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:outline-none transition"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition shadow-lg shadow-indigo-500/20 w-full"
                    >
                      {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                    </button>
                  </form>
                </FadeContent>
              )}

            </div>
          </div>
        </div>
      </FadeContent>
    </div>
  );
};

export default Profile;
