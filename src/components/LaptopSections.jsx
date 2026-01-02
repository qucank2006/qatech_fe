import React from "react";
import { useSearchParams } from "react-router-dom";
import { techLogos } from "../data/logos";

/**
 * Component hiển thị phần lọc sản phẩm laptop theo thương hiệu và nhu cầu sử dụng
 * Cho phép người dùng chọn thương hiệu laptop và loại laptop phù hợp với nhu cầu
 */
export default function LaptopSections() {
  const [params, setParams] = useSearchParams();
  const currentBrand = params.get("brand");
  const currentUsage = params.get("usage");

  // Lọc danh sách các thương hiệu laptop từ dữ liệu logo
  const targetBrands = ["Apple", "Dell", "HP", "Lenovo", "ASUS", "Acer", "MSI", "Microsoft", "LG", "Samsung"];
  const laptopBrands = techLogos.filter(brand => targetBrands.includes(brand.title));

  // Xử lý khi người dùng click chọn thương hiệu
  const handleBrandClick = (brandTitle) => {
    const newParams = new URLSearchParams(params);
    if (currentBrand === brandTitle) {
      newParams.delete("brand");
    } else {
      newParams.set("brand", brandTitle);
    }
    setParams(newParams);
  };

  // Xử lý khi người dùng click chọn nhu cầu sử dụng
  const handleUsageClick = (usage) => {
    const newParams = new URLSearchParams(params);
    if (currentUsage === usage) {
      newParams.delete("usage");
    } else {
      newParams.set("usage", usage);
    }
    setParams(newParams);
  };

  const laptopNeeds = [
    "Gaming", "Văn Phòng", "Mỏng Nhẹ", 
    "Đồ Họa - Kỹ Thuật", "Sinh Viên", 
    "Cảm Ứng", "Laptop AI"
  ];

  return (
    <div className="space-y-10 mb-12 mt-12">
      {/* Shop by Brand */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-neutral-200">Chọn theo thương hiệu</h2>
        <div className="flex overflow-x-auto md:grid md:grid-cols-4 lg:grid-cols-6 gap-4 pb-2 md:pb-0 scrollbar-hide">
          {laptopBrands.map((brand, index) => {
            const isActive = currentBrand === brand.title;
            return (
              <div 
                key={index}
                onClick={() => handleBrandClick(brand.title)}
                className={`min-w-[140px] md:min-w-0 bg-[#151515] border rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all group
                  ${isActive 
                    ? 'border-indigo-500 bg-indigo-500/10' 
                    : 'border-neutral-800 hover:border-indigo-500/50 hover:bg-neutral-900'
                  }
                `}
              >
                <div className={`text-4xl transition-colors ${isActive ? 'text-white' : 'text-neutral-400 group-hover:text-white'}`}>
                  {brand.node}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Phần chọn laptop theo nhu cầu sử dụng */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-neutral-200">Chọn theo nhu cầu sử dụng</h2>
        <div className="flex overflow-x-auto md:flex-wrap gap-3 pb-2 md:pb-0 scrollbar-hide">
          {laptopNeeds.map((need, index) => {
            const isActive = currentUsage === need;
            return (
              <div 
                key={index}
                onClick={() => handleUsageClick(need)}
                className={`border rounded-full px-6 py-2 cursor-pointer transition-all whitespace-nowrap
                  ${isActive 
                    ? 'bg-indigo-500/20 border-indigo-500 text-white' 
                    : 'bg-[#151515] border-neutral-800 text-neutral-300 hover:border-indigo-500/50 hover:bg-neutral-900'
                  }
                `}
              >
                <span className="text-sm font-medium">{need}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}