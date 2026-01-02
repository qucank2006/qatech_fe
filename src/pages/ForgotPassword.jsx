import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMsg(null);
    setLoading(true);

    try {
      const res = await api.post("/auth/request-otp", { email });

      setMsg("OTP đã được gửi đến email của bạn");

      // Lưu email để sang màn OTP dùng tiếp
      localStorage.setItem("resetEmail", email);

      // Điều hướng sang màn nhập OTP
      navigate("/verify-otp");
    } catch (err) {
      setError(err.response?.data?.msg || "Không thể gửi OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex justify-center items-center px-4 relative overflow-hidden">
      <div className="w-full flex justify-center">
        <div className="bg-[#111] p-8 rounded-2xl border border-neutral-800 max-w-md w-full shadow-2xl shadow-indigo-500/10 relative z-10">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent mb-2">
              Quên mật khẩu?
            </h1>
            <p className="text-neutral-400 text-sm">
              Đừng lo, hãy nhập email để lấy lại mật khẩu.
            </p>
          </div>

          {msg && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-xl text-center mb-4 text-sm">
              {msg}
            </div>
          )}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-center mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative group">
              <FaEnvelope className="absolute top-1/2 -translate-y-1/2 left-4 text-neutral-500 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="email"
                required
                placeholder="Nhập email của bạn"
                className="w-full bg-neutral-900/50 border border-neutral-800 text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-neutral-600"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 disabled:cursor-not-allowed py-3.5 rounded-xl text-white font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all transform hover:-translate-y-0.5"
            >
              {loading ? "Đang gửi..." : "Gửi mã OTP"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              to="/login" 
              className="inline-flex items-center text-neutral-400 hover:text-white transition-colors text-sm font-medium"
            >
              <FaArrowLeft className="mr-2" /> Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
