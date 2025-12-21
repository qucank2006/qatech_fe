import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../redux/slices/authSlice';
import api from '../services/api';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import FadeContent from '../components/FadeContent';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  dispatch(loginStart());

  try {
    const response = await api.post('/auth/login', formData);

    // Save token + user
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));

    dispatch(loginSuccess({
      token: response.data.token,
      user: response.data.user
    }));

    toast.success("Đăng nhập thành công!");
    navigate('/');
  } catch (err) {
    const errorMessage = err.response?.data?.msg || 'Login failed. Please try again.';
    dispatch(loginFailure(errorMessage));
  }
};


  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative overflow-hidden">
      <FadeContent blur duration={800}>
        <div className="bg-[#111] border border-neutral-800 p-8 rounded-2xl shadow-2xl shadow-indigo-500/10 w-full max-w-xl relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-cyan-400 bg-clip-text text-transparent mb-2">Chào mừng trở lại</h1>
            <p className="text-neutral-400 text-sm">Đăng nhập để tiếp tục đến QATech</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-6 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300 ml-1">Địa chỉ Email</label>
              <div className="relative group">
                <FaEnvelope className="absolute top-1/2 -translate-y-1/2 left-4 text-neutral-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-neutral-900/50 border border-neutral-800 text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-neutral-600"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300 ml-1">Mật khẩu</label>
              <div className="relative group">
                <FaLock className="absolute top-1/2 -translate-y-1/2 left-4 text-neutral-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-neutral-900/50 border border-neutral-800 text-white rounded-xl py-3 pl-11 pr-10 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-neutral-600"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 -translate-y-1/2 right-4 text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-neutral-400 hover:text-neutral-300 cursor-pointer">
                <input type="checkbox" className="mr-2 rounded bg-neutral-800 border-neutral-700 text-indigo-500 
                                                  focus:ring-indigo-500 focus:ring-offset-neutral-900" />
                Ghi nhớ đăng nhập
              </label>
              <Link to="/forgot-password" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang đăng nhập...
                </span>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-neutral-400 text-sm">
            Bạn chưa có tài khoản?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Tạo tài khoản
            </Link>
          </div>
        </div>
      </FadeContent>
    </div>
  );
};

export default Login;
