import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LuMenu, LuX } from "react-icons/lu";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full border-b border-neutral-800 bg-black/30 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* LOGO */}
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent">
          QATech
        </Link>

        {/* PC MENU */}
        <nav className="hidden md:flex gap-8 text-neutral-300">
          <Link to="/" className="hover:text-white">Trang chủ</Link>
          <Link to="/products" className="hover:text-white">Sản phẩm</Link>
          <Link to="/cart" className="hover:text-white">Giỏ hàng</Link>
          <Link to="/login" className="hover:text-white">Đăng nhập</Link>
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
          open ? "max-h-60 py-4" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col items-center gap-4 text-neutral-300">
          <Link to="/" onClick={() => setOpen(false)} className="hover:text-white">
            Trang chủ
          </Link>
          <Link to="/products" onClick={() => setOpen(false)} className="hover:text-white">
            Sản phẩm
          </Link>
          <Link to="/cart" onClick={() => setOpen(false)} className="hover:text-white">
            Giỏ hàng
          </Link>
          <Link to="/login" onClick={() => setOpen(false)} className="hover:text-white">
            Đăng nhập
          </Link>
        </nav>
      </div>
    </header>
  );
}
