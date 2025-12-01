import React from "react";
import { useSearchParams } from "react-router-dom";
import { LuCpu, LuHardDrive, LuMonitor, LuBox, LuFan, LuZap } from "react-icons/lu";
import { BsMotherboard, BsMemory } from "react-icons/bs";

/**
 * Component hiển thị phần lọc sản phẩm linh kiện máy tính theo thương hiệu và loại sản phẩm
 * Cho phép người dùng chọn thương hiệu và loại linh kiện (CPU, RAM, GPU, etc.)
 */
export default function PartsSections() {
  const [params, setParams] = useSearchParams();
  const currentBrand = params.get("brand");
  const currentType = params.get("type");

  // Danh sách các thương hiệu linh kiện
  const partsBrands = [
    "ASUS", "Intel", "MSI", "Samsung", "Gigabyte", "ASRock", 
    "Kingston", "DeepCool", "Cooler Master", "Lexar", 
    "Western Digital", "ADATA", "Seagate", "Xigmatek", 
    "Corsair", "Transcend"
  ];

  // Danh sách các loại linh kiện
  const partsTypes = [
    { title: "CPU", icon: <LuCpu className="text-2xl" /> },
    { title: "Mainboard", icon: <BsMotherboard className="text-2xl" /> },
    { title: "RAM", icon: <BsMemory className="text-2xl" /> },
    { title: "Ổ cứng", icon: <LuHardDrive className="text-2xl" />, value: "storage" },
    { title: "Card màn hình", icon: <LuMonitor className="text-2xl" />, value: "gpu" },
    { title: "Nguồn máy tính", icon: <LuZap className="text-2xl" />, value: "psu" },
    { title: "Tản nhiệt", icon: <LuFan className="text-2xl" />, value: "cooling" },
    { title: "Case máy tính", icon: <LuBox className="text-2xl" />, value: "case" }
  ];

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

  // Xử lý khi người dùng click chọn loại sản phẩm
  const handleTypeClick = (typeValue) => {
    const newParams = new URLSearchParams(params);
    if (currentType === typeValue) {
      newParams.delete("type");
    } else {
      newParams.set("type", typeValue);
    }
    setParams(newParams);
  };

  return (
    <div className="space-y-10 mb-12 mt-12">
      {/* Chọn theo thương hiệu */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-neutral-200">Linh kiện máy tính</h2>
        <div className="flex overflow-x-auto md:grid md:grid-cols-4 lg:grid-cols-8 gap-4 pb-2 md:pb-0 scrollbar-hide">
          {partsBrands.map((brand, index) => {
            const isActive = currentBrand === brand;
            return (
              <div 
                key={index}
                onClick={() => handleBrandClick(brand)}
                className={`min-w-[120px] md:min-w-0 bg-[#151515] border rounded-xl p-4 flex items-center justify-center cursor-pointer transition-all group min-h-[60px]
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

      {/* Phần chọn loại sản phẩm */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-neutral-200">Chọn loại sản phẩm</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {partsTypes.map((type, index) => {
            const typeValue = type.value || type.title.toLowerCase();
            const isActive = currentType === typeValue;
            return (
              <div 
                key={index}
                onClick={() => handleTypeClick(typeValue)}
                className={`bg-[#151515] border rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all group min-h-[100px]
                  ${isActive 
                    ? 'border-indigo-500 bg-indigo-500/10' 
                    : 'border-neutral-800 hover:border-indigo-500/50 hover:bg-neutral-900'
                  }
                `}
              >
                <div className={`transition-colors ${isActive ? 'text-white' : 'text-neutral-400 group-hover:text-white'}`}>
                  {type.icon}
                </div>
                <span className={`text-xs mt-2 text-center transition-colors ${isActive ? 'text-white font-medium' : 'text-neutral-400 group-hover:text-white'}`}>
                  {type.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
