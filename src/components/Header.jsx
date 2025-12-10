import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LuMenu, LuX, LuUser, LuLogOut, LuSettings, LuChevronDown } from "react-icons/lu";
import { logout } from "../redux/slices/authSlice";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    dispatch(logout());
    setUserMenuOpen(false);
    setOpen(false);
    navigate("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="w-full border-b border-neutral-800 bg-black/30 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* LOGO */}
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">
          QATech
        </Link>

        {/* PC MENU */}
        <nav className="hidden md:flex items-center gap-8 text-neutral-300">
          <Link to="/" className="hover:text-white transition-colors">Trang chủ</Link>
          <Link to="/products" className="hover:text-white transition-colors">Sản phẩm</Link>
          <Link to="/cart" className="hover:text-white transition-colors">Giỏ hàng</Link>
          
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 hover:text-white transition-colors focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0).toUpperCase() || <LuUser />}
                </div>
                <span className="font-medium max-w-[150px] truncate">{user?.name || "User"}</span>
                <LuChevronDown className={`transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {/* User Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#151515] border border-neutral-800 rounded-xl shadow-xl overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-3 border-b border-neutral-800">
                    <p className="text-sm text-white font-medium truncate">{user?.name}</p>
                    <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
                  </div>
                  
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <LuSettings size={16} />
                    Quản lý trang cá nhân
                  </Link>
                  
                  {user?.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <LuUser size={16} />
                      Trang quản trị
                    </Link>
                  )}

                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-colors text-left"
                  >
                    <LuLogOut size={16} />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="hover:text-white transition-colors">Đăng nhập</Link>
          )}
        </nav>

        {/* MOBILE MENU BUTTON */}
        <button 
          className="md:hidden text-2xl text-neutral-300"
          onClick={() => setOpen(!open)}
        >
          {open ? <LuX /> : <LuMenu />}
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      <div
        className={`md:hidden bg-black border-t border-neutral-800 overflow-hidden transition-all duration-300 ${
          open ? "max-h-96 py-4" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col items-center gap-4 text-neutral-300 px-4">
          <Link to="/" onClick={() => setOpen(false)} className="hover:text-white w-full text-center py-2">
            Trang chủ
          </Link>
          <Link to="/products" onClick={() => setOpen(false)} className="hover:text-white w-full text-center py-2">
            Sản phẩm
          </Link>
          <Link to="/cart" onClick={() => setOpen(false)} className="hover:text-white w-full text-center py-2">
            Giỏ hàng
          </Link>
          
          {isAuthenticated ? (
            <div className="w-full border-t border-neutral-800 pt-4 mt-2 flex flex-col gap-2">
              <div className="flex items-center gap-3 px-4 py-2 bg-neutral-900 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm text-white font-medium truncate">{user?.name}</p>
                  <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
                </div>
              </div>
              
              <Link 
                to="/profile" 
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 rounded-lg"
              >
                <LuSettings size={16} />
                Quản lý trang cá nhân
              </Link>

              {user?.role === 'admin' && (
                <Link 
                  to="/admin" 
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 rounded-lg"
                >
                  <LuUser size={16} />
                  Trang quản trị
                </Link>
              )}
              
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-neutral-800 rounded-lg w-full text-left"
              >
                <LuLogOut size={16} />
                Đăng xuất
              </button>
            </div>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)} className="hover:text-white w-full text-center py-2">
              Đăng nhập
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
