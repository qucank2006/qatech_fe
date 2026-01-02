import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

/**
 * Component Footer - Phần chân trang của website
 * Hiển thị thông tin giới thiệu, liên kết nhanh, mạng xã hội và đăng ký nhận tin
 */
export default function Footer() {
  return (
    <footer className="w-full border-t border-neutral-800 bg-black mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* Cột 1 - Giới thiệu công ty */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">QATech</h2>
          <p className="text-neutral-400 leading-relaxed">
            Nền tảng mua sắm công nghệ hiện đại — mang đến sản phẩm chất lượng
            cùng trải nghiệm tốt nhất.
          </p>
        </div>

        {/* Cột 2 - Liên kết nhanh */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Liên kết nhanh</h3>
          <ul className="space-y-2 text-neutral-400">
            <li><Link to="/products" className="hover:text-white transition">Sản phẩm</Link></li>
            <li><Link to="/cart" className="hover:text-white transition">Giỏ hàng</Link></li>
            <li><Link to="/login" className="hover:text-white transition">Đăng nhập</Link></li>
            <li><Link to="/register" className="hover:text-white transition">Đăng ký</Link></li>
          </ul>
        </div>

        {/* Cột 3 - Kết nối mạng xã hội */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Kết nối với chúng tôi</h3>
          <div className="flex gap-4 text-neutral-300 text-2xl">
            <a href="#" className="hover:text-indigo-400 transition"><FaFacebookF /></a>
            <a href="#" className="hover:text-indigo-400 transition"><FaInstagram /></a>
            <a href="#" className="hover:text-indigo-400 transition"><FaYoutube /></a>
          </div>
        </div>

        {/* Cột 4 - Đăng ký nhận tin */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Đăng ký nhận bản tin</h3>
          <p className="text-neutral-400 mb-3 text-sm">
            Nhận thông báo về ưu đãi, sản phẩm mới và tin tức công nghệ.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="flex-1 px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-700 
                         text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-xl 
                         font-semibold text-white transition"
            >
              Đăng ký
            </button>
          </div>
        </div>

      </div>

      {/* Thông tin bản quyền */}
      <div className="text-center py-6 text-neutral-600 border-t border-neutral-900 text-sm">
        © 2025 QATech. All rights reserved.
      </div>
    </footer>
  );
}
