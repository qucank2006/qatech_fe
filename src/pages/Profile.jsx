import React, { useState } from "react";
import { useSelector } from "react-redux";
import { LuUser, LuPackage, LuLock, LuCamera, LuSave } from "react-icons/lu";
import FadeContent from "../components/FadeContent";

export default function Profile() {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("info");

  // Mock data for orders
  const orders = [
    { id: "#ORD-001", date: "10/12/2025", total: "25.000.000đ", status: "Đang giao", items: 2 },
    { id: "#ORD-002", date: "05/11/2025", total: "12.500.000đ", status: "Hoàn thành", items: 1 },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <FadeContent blur={true} duration={600}>
          <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-indigo-400 to-cyan-300 bg-clip-text text-transparent">
            Quản lý tài khoản
          </h1>
        </FadeContent>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <FadeContent blur={false} duration={600} delay={100}>
              <div className="bg-[#151515] border border-neutral-800 rounded-2xl p-4 sticky top-24">
                <div className="flex flex-col items-center mb-6 pb-6 border-b border-neutral-800">
                  <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-2xl font-bold mb-3 relative group cursor-pointer overflow-hidden">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <LuCamera />
                    </div>
                  </div>
                  <h2 className="font-semibold text-lg">{user?.name || "User Name"}</h2>
                  <p className="text-sm text-neutral-400">{user?.email || "user@example.com"}</p>
                </div>

                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab("info")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === "info"
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                        : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                    }`}
                  >
                    <LuUser size={20} />
                    <span>Thông tin cá nhân</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === "orders"
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                        : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                    }`}
                  >
                    <LuPackage size={20} />
                    <span>Lịch sử đơn hàng</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("password")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === "password"
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                        : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                    }`}
                  >
                    <LuLock size={20} />
                    <span>Đổi mật khẩu</span>
                  </button>
                </nav>
              </div>
            </FadeContent>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <FadeContent blur={false} duration={600} delay={200}>
              <div className="bg-[#151515] border border-neutral-800 rounded-2xl p-6 min-h-[500px]">
                
                {/* Personal Info Tab */}
                {activeTab === "info" && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                      <LuUser className="text-indigo-400" /> Thông tin cá nhân
                    </h2>
                    <form className="space-y-6 max-w-2xl">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm text-neutral-400">Họ và tên</label>
                          <input
                            type="text"
                            defaultValue={user?.name}
                            className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm text-neutral-400">Số điện thoại</label>
                          <input
                            type="tel"
                            placeholder="Chưa cập nhật"
                            className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm text-neutral-400">Email</label>
                          <input
                            type="email"
                            defaultValue={user?.email}
                            disabled
                            className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-xl px-4 py-3 text-neutral-500 cursor-not-allowed"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm text-neutral-400">Ngày sinh</label>
                          <input
                            type="date"
                            className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-neutral-400">Địa chỉ</label>
                        <textarea
                          rows="3"
                          placeholder="Nhập địa chỉ giao hàng mặc định..."
                          className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                        ></textarea>
                      </div>
                      <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2">
                        <LuSave /> Lưu thay đổi
                      </button>
                    </form>
                  </div>
                )}

                {/* Orders Tab */}
                {activeTab === "orders" && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                      <LuPackage className="text-indigo-400" /> Lịch sử đơn hàng
                    </h2>
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="bg-[#0a0a0a] border border-neutral-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-indigo-500/50 transition-colors">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="font-semibold text-white">{order.id}</span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                order.status === "Hoàn thành" 
                                  ? "bg-green-500/10 text-green-400" 
                                  : "bg-yellow-500/10 text-yellow-400"
                              }`}>
                                {order.status}
                              </span>
                            </div>
                            <p className="text-sm text-neutral-400">Ngày đặt: {order.date} • {order.items} sản phẩm</p>
                          </div>
                          <div className="flex items-center justify-between md:justify-end gap-4">
                            <span className="font-bold text-indigo-400">{order.total}</span>
                            <button className="text-sm text-neutral-300 hover:text-white underline">
                              Chi tiết
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Change Password Tab */}
                {activeTab === "password" && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                      <LuLock className="text-indigo-400" /> Đổi mật khẩu
                    </h2>
                    <form className="space-y-6 max-w-md">
                      <div className="space-y-2">
                        <label className="text-sm text-neutral-400">Mật khẩu hiện tại</label>
                        <input
                          type="password"
                          className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-neutral-400">Mật khẩu mới</label>
                        <input
                          type="password"
                          className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-neutral-400">Xác nhận mật khẩu mới</label>
                        <input
                          type="password"
                          className="w-full bg-[#0a0a0a] border border-neutral-800 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                      </div>
                      <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2">
                        <LuSave /> Cập nhật mật khẩu
                      </button>
                    </form>
                  </div>
                )}

              </div>
            </FadeContent>
          </div>
        </div>
      </div>
    </div>
  );
}