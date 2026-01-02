import React, { useState } from 'react';
import { LuCpu, LuHardDrive, LuMonitor, LuPlus, LuBox } from "react-icons/lu";
import { FaMemory } from "react-icons/fa";

/**
 * Component BuildPC - Công cụ xây dựng cấu hình PC tùy chỉnh
 * Cho phép người dùng chọn từng linh kiện để tạo bộ máy tính theo nhu cầu
 */

// Danh sách các linh kiện PC có thể chọn
const components = [
  { id: 'cpu', label: 'Vi xử lý (CPU)', icon: <LuCpu size={24} /> },
  { id: 'mainboard', label: 'Bo mạch chủ (Mainboard)', icon: <LuCpu size={24} /> },
  { id: 'ram', label: 'Bộ nhớ (RAM)', icon: <FaMemory size={24} /> },
  { id: 'hdd', label: 'Ổ cứng (HDD/SSD)', icon: <LuHardDrive size={24} /> },
  { id: 'vga', label: 'Card đồ họa (VGA)', icon: <LuMonitor size={24} /> },
  { id: 'case', label: 'Vỏ máy (Case)', icon: <LuBox size={24} /> },
  { id: 'psu', label: 'Nguồn (PSU)', icon: <LuCpu size={24} /> },
];

export default function BuildPC() {
  const [selectedParts, setSelectedParts] = useState({});

  // Xử lý khi người dùng chọn linh kiện
  const handleSelectPart = (partId) => {
    console.log(`Select part: ${partId}`);
    alert(`Chức năng chọn ${partId} đang được phát triển`);
  };

  // Tính tổng giá trị các linh kiện đã chọn
  const totalPrice = Object.values(selectedParts).reduce((total, part) => total + (part.price || 0), 0);

  return (
    <div className="space-y-8">
      <div>
        <div className="bg-[#151515] border border-neutral-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-white">Xây dựng cấu hình PC</h2>
          <p className="text-neutral-400 mb-8">Chọn từng linh kiện để xây dựng bộ máy tính mơ ước của bạn.</p>

          <div className="space-y-4">
            {components.map((comp) => (
              <div key={comp.id} className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 flex items-center justify-between hover:border-indigo-500/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-neutral-800 rounded-lg flex items-center justify-center text-neutral-400">
                    {comp.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{comp.label}</h3>
                    {selectedParts[comp.id] ? (
                      <p className="text-indigo-400">{selectedParts[comp.id].name}</p>
                    ) : (
                      <p className="text-sm text-neutral-500">Chưa chọn linh kiện</p>
                    )}
                  </div>
                </div>
                
                <button 
                  onClick={() => handleSelectPart(comp.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2
                    ${selectedParts[comp.id] 
                      ? 'bg-neutral-800 text-white hover:bg-neutral-700' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                >
                  {selectedParts[comp.id] ? 'Thay đổi' : <><LuPlus /> Chọn</>}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-neutral-800 flex justify-between items-center">
            <div>
              <p className="text-neutral-400">Tổng chi phí dự kiến</p>
              <p className="text-3xl font-bold text-indigo-400">{totalPrice.toLocaleString()}₫</p>
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-indigo-500/20">
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
