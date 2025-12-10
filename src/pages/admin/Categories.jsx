import React, { useState } from 'react';
import { LuPlus, LuSearch, LuPencil, LuTrash2 } from "react-icons/lu";

const Categories = () => {
  const [categories] = useState([
    { id: 1, name: "Laptop Gaming", count: 45, status: "Active" },
    { id: 2, name: "Laptop Văn phòng", count: 32, status: "Active" },
    { id: 3, name: "MacBook", count: 12, status: "Active" },
    { id: 4, name: "Phụ kiện", count: 156, status: "Active" },
    { id: 5, name: "Màn hình", count: 24, status: "Inactive" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-white">Quản lý danh mục</h1>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors">
          <LuPlus size={20} />
          <span>Thêm danh mục</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-[#151515] border border-neutral-800 rounded-xl p-4">
        <div className="relative max-w-md">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
          <input 
            type="text" 
            placeholder="Tìm kiếm danh mục..." 
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-[#151515] border border-neutral-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-neutral-900 text-neutral-400 text-sm uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Tên danh mục</th>
                <th className="px-6 py-4 font-medium">Số lượng sản phẩm</th>
                <th className="px-6 py-4 font-medium">Trạng thái</th>
                <th className="px-6 py-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-neutral-900/50 transition-colors">
                  <td className="px-6 py-4 text-white font-medium">{category.name}</td>
                  <td className="px-6 py-4 text-neutral-400">{category.count} sản phẩm</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium
                      ${category.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-neutral-500/10 text-neutral-500'}`}>
                      {category.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-neutral-400 hover:text-indigo-500 hover:bg-indigo-500/10 rounded-lg transition-colors">
                        <LuPencil size={18} />
                      </button>
                      <button className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                        <LuTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Categories;
