import React from "react";
import { techLogos } from "../data/logos";

export default function LaptopSections() {
  // Filter logos for Laptop brands
  const targetBrands = ["Apple", "Dell", "HP", "Lenovo", "Asus", "Acer", "MSI", "Microsoft", "LG", "Samsung"];
  const laptopBrands = techLogos.filter(brand => targetBrands.includes(brand.title));

  const laptopNeeds = [
    "Văn Phòng", "Gaming", "Mỏng Nhẹ", 
    "Đồ Họa - Kỹ Thuật", "Sinh Viên", 
    "Cảm Ứng", "Laptop AI"
  ];

  return (
    <div className="space-y-10 mb-12 mt-12">
      {/* Shop by Brand */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-neutral-200">Chọn theo thương hiệu</h2>
        <div className="flex overflow-x-auto md:grid md:grid-cols-4 lg:grid-cols-6 gap-4 pb-2 md:pb-0 scrollbar-hide">
          {laptopBrands.map((brand, index) => (
            <div 
              key={index}
              className="min-w-[140px] md:min-w-0 bg-[#151515] border border-neutral-800 hover:border-indigo-500/50 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-neutral-900 group"
            >
              <div className="text-4xl text-neutral-400 group-hover:text-white transition-colors">
                {brand.node}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shop by Needs */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-neutral-200">Chọn theo nhu cầu sử dụng</h2>
        <div className="flex overflow-x-auto md:flex-wrap gap-3 pb-2 md:pb-0 scrollbar-hide">
          {laptopNeeds.map((need, index) => (
            <div 
              key={index}
              className="bg-[#151515] border border-neutral-800 hover:border-indigo-500/50 rounded-full px-6 py-2 cursor-pointer transition-all hover:bg-neutral-900 whitespace-nowrap"
            >
              <span className="text-neutral-300 text-sm font-medium">{need}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}