import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LuMenu, LuX, LuSearch, LuShoppingCart, LuUser, LuLogOut } from "react-icons/lu";
import { FiHome, FiBox, FiLogIn } from "react-icons/fi";
import { logout } from "../redux/slices/authSlice";
import toast from "react-hot-toast";
import { getImageUrl } from "../utils/imageUrl";

/**
 * Component Header - Thanh điều hướng chính của ứng dụng
 * Bao gồm: Logo, thanh tìm kiếm, menu điều hướng, giỏ hàng, thông tin người dùng
 * Responsive với menu mobile và desktop
 */
export default function Header() {
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // Tính tổng số lượng sản phẩm trong giỏ hàng
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  // Xử lý tìm kiếm sản phẩm
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
      setOpen(false);
      setShowSearch(false);
    }
  };

  // Xử lý đăng xuất với xác nhận
  const handleLogout = () => {
    toast((t) => (
      <div className="flex flex-col gap-3 min-w-[200px]">
        <p className="font-medium text-center">Bạn có chắc muốn đăng xuất?</p>
        <div className="flex gap-2 justify-center">
          <button 
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            Hủy
          </button>
          <button 
            onClick={() => {
              toast.dismiss(t.id);
              dispatch(logout());
              navigate("/login");
              toast.success("Đã đăng xuất thành công");
            }}
            className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    ), {
      duration: 4000,
      position: 'top-center',
      style: {
        background: '#fff',
        color: '#000',
        padding: '16px',
        borderRadius: '12px',
      },
    });
  };

  return (
    <header className="w-full border-b border-neutral-800 bg-black/30 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* Logo thương hiệu */}
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">
            QATech
          </span>
        </Link>

        {/* Thanh tìm kiếm - Phiên bản Desktop */}
        <div className="hidden md:flex flex-1 justify-center px-8">
          <form onSubmit={handleSearch} className="flex items-center bg-[#151515] border border-neutral-800 rounded-full px-4 py-2 w-full max-w-md focus-within:border-indigo-500 transition-colors">
            <LuSearch className="text-neutral-500 mr-2" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..." 
              className="bg-transparent border-none outline-none text-white w-full text-sm placeholder-neutral-500"
            />
          </form>
        </div>

        {/* Menu điều hướng - Phiên bản Desktop */}
        <nav className="hidden md:flex items-center gap-8 text-neutral-300">
          <Link to="/" className="flex items-center gap-2 hover:text-white transition-colors">
            <FiHome size={20} />
            Trang chủ
          </Link>
          <Link to="/products" className="flex items-center gap-2 hover:text-white transition-colors">
            <FiBox size={20} />
            Sản phẩm
          </Link>
          
          <Link to="/cart" className="relative flex items-center gap-2 hover:text-white transition-colors">
            <div className="relative">
              <LuShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </div>
            Giỏ hàng
          </Link>

          {isAuthenticated ? (
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 text-white hover:text-indigo-400 transition-colors focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-neutral-700">
                  {user?.avatar ? (
                    <img 
                      src={getImageUrl(user.avatar)} 
                      alt={user.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-indigo-600 flex items-center justify-center font-bold text-white">
                      {user?.name?.charAt(0).toUpperCase() || <LuUser />}
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium hidden lg:block">{user?.name}</span>
              </button>

              {/* Menu dropdown người dùng */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-[#111] border border-neutral-800 rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-3 border-b border-neutral-800 mb-2">
                    <p className="text-sm font-medium text-white">{user?.name}</p>
                    <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
                  </div>
                  
                  {user?.role === 'admin' && (
                    <Link 
                      to="/admin/dashboard" 
                      className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                      Trang quản trị
                    </Link>
                  )}
                  
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    Quản lý tài khoản
                  </Link>

                  <div className="border-t border-neutral-800 mt-2 pt-2">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-neutral-800 hover:text-red-300 transition-colors flex items-center gap-2"
                    >
                      <LuLogOut size={16} />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-2 hover:text-white transition-colors">
              <FiLogIn size={20} />
              Đăng nhập
            </Link>
          )}
        </nav>

        {/* Các nút hành động - Phiên bản Mobile */}
        <div className="flex items-center gap-4 md:hidden">
          <Link to="/cart" className="relative text-neutral-300">
            <LuShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          <button 
            className="text-2xl text-neutral-300"
            onClick={() => {
              setShowSearch(!showSearch);
              setOpen(false);
            }}
          >
            <LuSearch />
          </button>

          <button 
            className="text-2xl text-neutral-300"
            onClick={() => {
              setOpen(!open);
              setShowSearch(false);
            }}
          >
            {open ? <LuX /> : <LuMenu />}
          </button>
        </div>
      </div>

      {/* Thanh tìm kiếm - Phiên bản Mobile */}
      <div
        className={`md:hidden bg-black border-t border-neutral-800 overflow-hidden transition-all duration-300 ${
          showSearch ? "max-h-24 py-4" : "max-h-0"
        }`}
      >
        <div className="px-6">
          <form onSubmit={handleSearch} className="flex items-center bg-[#151515] border border-neutral-800 rounded-full px-4 py-2 focus-within:border-indigo-500 transition-colors">
            <LuSearch className="text-neutral-500 mr-2" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm..." 
              className="bg-transparent border-none outline-none text-white w-full text-sm placeholder-neutral-500"
              autoFocus
            />
          </form>
        </div>
      </div>

      {/* Menu dropdown - Phiên bản Mobile */}
      <div
        className={`md:hidden bg-black border-t border-neutral-800 overflow-hidden transition-all duration-300 ${
          open ? "max-h-80 py-4" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col items-center gap-4 text-neutral-300">
          <Link to="/" className="hover:text-white" onClick={() => setOpen(false)}>Trang chủ</Link>
          <Link to="/products" className="hover:text-white" onClick={() => setOpen(false)}>Sản phẩm</Link>
          
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2 text-white py-2 border-t border-neutral-800 w-full justify-center">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-neutral-700">
                  {user?.avatar ? (
                    <img 
                      src={getImageUrl(user.avatar)} 
                      alt={user.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-indigo-600 flex items-center justify-center font-bold text-white">
                      {user?.name?.charAt(0).toUpperCase() || <LuUser />}
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium">{user?.name}</span>
              </div>
              <button 
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                className="text-red-500 hover:text-red-400"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <Link to="/login" className="hover:text-white" onClick={() => setOpen(false)}>Đăng nhập</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
