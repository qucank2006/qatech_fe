import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const email = localStorage.getItem("resetEmail");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      return setError("Mật khẩu không khớp");
    }

    try {
      await api.post("/auth/reset-password", {
        email,
        password
      });

      localStorage.removeItem("resetEmail");

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.msg || "Không thể đặt lại mật khẩu");
    }
  };

  return (
    <div className="min-h-[80vh] flex justify-center items-center px-4">
      <div className="w-full flex justify-center">
        <div className="bg-[#111] p-8 rounded-2xl border border-neutral-800 max-w-md w-full shadow-2xl shadow-indigo-500/10">

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent mb-2">
              Đặt lại mật khẩu
            </h1>
            <p className="text-neutral-400 text-sm">
              Hãy nhập mật khẩu mới thật an toàn nhé.
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-center mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="relative group">
              <FaLock className="absolute top-1/2 -translate-y-1/2 left-4 text-neutral-500 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="password"
                required
                placeholder="Mật khẩu mới"
                className="w-full bg-neutral-900/50 border border-neutral-800 text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-neutral-600"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="relative group">
              <FaLock className="absolute top-1/2 -translate-y-1/2 left-4 text-neutral-500 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="password"
                required
                placeholder="Xác nhận mật khẩu"
                className="w-full bg-neutral-900/50 border border-neutral-800 text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-neutral-600"
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 py-3.5 rounded-xl text-white font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all transform hover:-translate-y-0.5"
            >
              Đặt lại mật khẩu
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
