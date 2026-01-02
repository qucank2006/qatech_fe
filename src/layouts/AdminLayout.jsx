import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { 
  LuLayoutDashboard, 
  LuShoppingBag, 
  LuUsers, 
  LuShoppingCart, 
  LuLogOut, 
  LuLayers,
  LuUserCog,
  LuArrowLeft
} from "react-icons/lu";

/**
 * AdminLayout - Layout cho trang quản trị
 * Bao gồm Sidebar menu và nội dung trang chính
 */
const AdminLayout = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Xử lý đăng xuất
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Danh sách menu admin
  const menuItems = [
    { path: '/admin/dashboard', icon: <LuLayoutDashboard size={20} />, label: 'Tổng quan' },
    { path: '/admin/products', icon: <LuShoppingBag size={20} />, label: 'Sản phẩm' },
    { path: '/admin/orders', icon: <LuShoppingCart size={20} />, label: 'Đơn hàng' },
    { path: '/admin/users', icon: <LuUsers size={20} />, label: 'Khách hàng' },
  ];

  return (
    <div className="flex h-screen bg-[#0f0f0f] text-white">
      {/* Sidebar menu quản trị */}
      <aside className="w-64 bg-[#151515] border-r border-neutral-800 flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-neutral-800">
          <h1 className="text-2xl font-bold text-indigo-500">QATech Admin</h1>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-neutral-800 flex gap-2">
          <Link 
            to="/"
            className="group flex items-center justify-center p-3 text-neutral-400 hover:bg-neutral-800 hover:text-white rounded-xl transition-all duration-300 ease-in-out flex-1 hover:flex-[3] overflow-hidden"
          >
            <LuArrowLeft size={20} className="shrink-0" />
            <span className="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 whitespace-nowrap">
              Về trang chủ
            </span>
          </Link>
          <button 
            onClick={handleLogout}
            className="group flex items-center justify-center p-3 text-neutral-400 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all duration-300 ease-in-out flex-1 hover:flex-[3] overflow-hidden"
          >
            <LuLogOut size={20} className="shrink-0" />
            <span className="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2 transition-all duration-300 whitespace-nowrap">
              Đăng xuất
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 overflow-y-auto bg-[#0f0f0f]">
        <header className="h-16 bg-[#151515] border-b border-neutral-800 flex items-center justify-between px-6 sticky top-0 z-10">
          <h2 className="font-semibold text-lg">
            {menuItems.find(item => item.path === location.pathname)?.label || 'Admin'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center font-bold">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <span className="text-sm font-medium">{user?.name || 'Admin User'}</span>
          </div>
        </header>

        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
