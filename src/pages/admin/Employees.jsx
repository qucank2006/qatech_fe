import React, { useState } from 'react';
import { LuPlus, LuSearch, LuPencil, LuTrash2, LuMail, LuPhone } from "react-icons/lu";

const Employees = () => {
  const [employees] = useState([
    { id: 1, name: "Nguyễn Văn Quản Lý", position: "Manager", email: "manager@qatech.com", phone: "0901234567", status: "Active" },
    { id: 2, name: "Trần Thị Sale", position: "Sales", email: "sale1@qatech.com", phone: "0902345678", status: "Active" },
    { id: 3, name: "Lê Văn Support", position: "Support", email: "support@qatech.com", phone: "0903456789", status: "On Leave" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-white">Quản lý nhân viên</h1>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors">
          <LuPlus size={20} />
          <span>Thêm nhân viên</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-[#151515] border border-neutral-800 rounded-xl p-4">
        <div className="relative max-w-md">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
          <input 
            type="text" 
            placeholder="Tìm kiếm nhân viên..." 
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((employee) => (
          <div key={employee.id} className="bg-[#151515] border border-neutral-800 rounded-xl p-6 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {employee.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-white font-medium">{employee.name}</h3>
                  <p className="text-sm text-indigo-400">{employee.position}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium
                ${employee.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                {employee.status}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-neutral-400 text-sm">
                <LuMail size={16} />
                <span>{employee.email}</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-400 text-sm">
                <LuPhone size={16} />
                <span>{employee.phone}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-2 pt-4 border-t border-neutral-800">
              <button className="flex-1 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-sm font-medium transition-colors">
                Chi tiết
              </button>
              <button className="p-2 text-neutral-400 hover:text-indigo-500 hover:bg-indigo-500/10 rounded-lg transition-colors">
                <LuPencil size={18} />
              </button>
              <button className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                <LuTrash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Employees;
