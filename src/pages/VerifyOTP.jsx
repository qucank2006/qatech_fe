import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import FadeContent from '../components/FadeContent';

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const email = localStorage.getItem("resetEmail");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await api.post("/auth/verify-otp", { email, otp });

      navigate("/reset-password");
    } catch (err) {
      setError(err.response?.data?.msg || "OTP không hợp lệ");
    }
  };

  return (
    <div className="min-h-[80vh] flex justify-center items-center px-4">
      <FadeContent blur duration={800}>
        <div className="bg-[#111] p-8 rounded-2xl border border-neutral-800 max-w-xl w-full shadow-2xl shadow-indigo-500/10">

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent mb-2">
              Xác thực OTP
            </h1>
            <p className="text-neutral-400 text-sm">
              Mã xác thực đã được gửi tới <span className="text-white font-medium">{email}</span>
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-center mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="000000"
                className="w-full bg-neutral-900/50 border border-neutral-800 text-white rounded-xl py-4 px-4 text-center tracking-[0.5em] text-2xl font-bold focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-neutral-700 placeholder:tracking-normal"
                onChange={(e) => setOtp(e.target.value)}
              />
              <p className="text-center text-xs text-neutral-500 mt-2">Nhập 6 chữ số mã xác thực</p>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 py-3.5 rounded-xl text-white font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all transform hover:-translate-y-0.5"
            >
              Xác nhận
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <button 
              onClick={() => navigate(-1)} 
              className="text-neutral-400 hover:text-white text-sm transition-colors"
            >
              Quay lại
            </button>
          </div>

        </div>
      </FadeContent>
    </div>
  );
};

export default VerifyOtp;
