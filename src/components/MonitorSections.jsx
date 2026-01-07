import React from "react";
import { useSearchParams } from "react-router-dom";

/**
 * Component hiển thị phần lọc sản phẩm màn hình theo thương hiệu và nhu cầu sử dụng
 * Cho phép người dùng chọn thương hiệu và loại màn hình
 */
export default function MonitorSections() {
  const [params, setParams] = useSearchParams();
  const currentBrand = params.get("brand");
  const currentUsage = params.get("usage");

  // Danh sách các thương hiệu màn hình
  const monitorBrands = [
    "ASUS", "LG", "Samsung", "MSI", "Xiaomi", "Dell",
    "AOC", "Acer", "Philips", "ViewSonic", "Lenovo", "E-DRA"
  ];

  // Danh sách nhu cầu sử dụng
  const monitorUsages = [
    "Gaming",
    "Văn phòng",
    "Đồ họa",
    "Màn hình lập trình",
    "Màn hình di động",
    "Arm màn hình"
  ];

  // Xử lý khi người dùng click chọn thương hiệu
  const handleBrandClick = (brand) => {
    const newParams = new URLSearchParams(params);
    if (currentBrand === brand) {
      newParams.delete("brand");
    } else {
      newParams.set("brand", brand);
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

  return (
    <div className="space-y-10 mb-12 mt-12">
      {/* Chọn theo thương hiệu */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-neutral-200">Chọn theo thương hiệu</h2>
        <div className="flex overflow-x-auto md:grid md:grid-cols-4 lg:grid-cols-6 gap-4 pb-2 md:pb-0 scrollbar-hide">
          {monitorBrands.map((brand, index) => {
            const isActive = currentBrand === brand;
            return (
              <div 
                key={index}
                onClick={() => handleBrandClick(brand)}
                className={`min-w-[140px] md:min-w-0 bg-[#151515] border rounded-xl p-4 flex items-center justify-center cursor-pointer transition-all group min-h-[60px]
                  ${isActive 
                    ? 'border-indigo-500 bg-indigo-500/10' 
                    : 'border-neutral-800 hover:border-indigo-500/50 hover:bg-neutral-900'
                  }
                `}
              >
                <span className={`text-sm font-medium text-center transition-colors ${isActive ? 'text-white' : 'text-neutral-300 group-hover:text-white'}`}>
                  {brand}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Phần chọn màn hình theo nhu cầu sử dụng */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-neutral-200">Chọn theo nhu cầu sử dụng</h2>
        <div className="flex overflow-x-auto md:flex-wrap gap-3 pb-2 md:pb-0 scrollbar-hide">
          {monitorUsages.map((usage, index) => {
            const isActive = currentUsage === usage;
            return (
              <div 
                key={index}
                onClick={() => handleUsageClick(usage)}
                className={`border rounded-full px-6 py-2 cursor-pointer transition-all whitespace-nowrap
                  ${isActive 
                    ? 'bg-indigo-500/20 border-indigo-500 text-white' 
                    : 'bg-[#151515] border-neutral-800 text-neutral-300 hover:border-indigo-500/50 hover:bg-neutral-900'
                  }
                `}
              >
                <span className="text-sm font-medium">{usage}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
