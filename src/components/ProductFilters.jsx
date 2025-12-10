import React, { useState, useEffect, useRef } from "react";
import { LuFilter, LuChevronDown } from "react-icons/lu";

const filters = [
  { id: "price", label: "Giá" },
  { id: "cpu", label: "CPU" },
  { id: "ram", label: "RAM" },
  { id: "ssd", label: "Ổ cứng" },
  { id: "screen", label: "Màn hình" },
];

export default function ProductFilters() {
  const [activeFilter, setActiveFilter] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 50000000]);
  const [selectedCPUs, setSelectedCPUs] = useState([]);
  const [selectedRAMs, setSelectedRAMs] = useState([]);
  const filterRef = useRef(null);

  const cpuOptions = [
    "Intel Core i3", "Intel Core i5", "Intel Core i7", "Intel Core i9",
    "Intel Celeron / Pentium", "AMD Ryzen 5", "AMD Ryzen 7", "AMD Ryzen 9",
    "Apple M2", "Apple M3", "Intel Core Ultra 5", "Intel Core Ultra 7", "Intel Core Ultra 9",
    "Qualcomm Snapdragon", "Snapdragon X Plus", "Apple M4", "Apple M4 Pro", "Apple M4 Max", "Apple M5"
  ];

  const ramOptions = [
    "8GB", "16GB", "24GB", "32GB", "36GB", "48GB", "64GB", "128GB"
  ];

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setActiveFilter(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), priceRange[1] - 1000000);
    setPriceRange([value, priceRange[1]]);
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), priceRange[0] + 1000000);
    setPriceRange([priceRange[0], value]);
  };

  const handleCpuToggle = (cpu) => {
    if (selectedCPUs.includes(cpu)) {
      setSelectedCPUs(selectedCPUs.filter(c => c !== cpu));
    } else {
      setSelectedCPUs([...selectedCPUs, cpu]);
    }
  };

  const handleRamToggle = (ram) => {
    if (selectedRAMs.includes(ram)) {
      setSelectedRAMs(selectedRAMs.filter(r => r !== ram));
    } else {
      setSelectedRAMs([...selectedRAMs, ram]);
    }
  };

  return (
    <div ref={filterRef} className="flex items-center gap-3 overflow-x-auto md:overflow-visible md:flex-wrap pb-2 md:pb-0 scrollbar-hide relative z-20">
      <div className="flex items-center gap-2 px-4 py-2 bg-[#151515] border border-neutral-800 rounded-lg text-neutral-300 whitespace-nowrap">
        <LuFilter />
        <span className="font-medium">Bộ lọc</span>
      </div>
      
      <div className="w-px h-6 bg-neutral-800 mx-2 shrink-0"></div>

      {filters.map((f) => (
        <div key={f.id} className="relative">
          <button 
            onClick={() => setActiveFilter(activeFilter === f.id ? null : f.id)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all whitespace-nowrap
              ${activeFilter === f.id 
                ? "bg-neutral-800 border-indigo-500 text-white" 
                : "bg-[#151515] border-neutral-800 text-neutral-300 hover:border-indigo-500/50 hover:bg-neutral-900"
              }`}
          >
            <span>{f.label}</span>
            <LuChevronDown size={16} className={`transition-transform ${activeFilter === f.id ? "rotate-180" : ""}`} />
          </button>

          {/* PRICE POPUP */}
          {activeFilter === f.id && f.id === "price" && (
            <div className="absolute top-full left-0 mt-2 w-[320px] bg-[#1e1e1e] border border-neutral-800 rounded-xl shadow-2xl p-4 z-50">
              <h3 className="text-sm font-medium text-neutral-300 mb-4">Hãy chọn mức giá phù hợp với bạn</h3>
              
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-sm text-white flex-1 text-center">
                  {priceRange[0].toLocaleString('vi-VN')}đ
                </div>
                <span className="text-neutral-500">-</span>
                <div className="bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-sm text-white flex-1 text-center">
                  {priceRange[1].toLocaleString('vi-VN')}đ
                </div>
              </div>

              {/* Dual Range Slider */}
              <div className="relative h-6 mb-6 mx-2">
                 {/* Visual Track */}
                 <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 bg-neutral-700 rounded"></div>
                 {/* Active Range */}
                 <div 
                   className="absolute top-1/2 -translate-y-1/2 h-1 bg-indigo-600 rounded"
                   style={{ 
                     left: `${(priceRange[0] / 100000000) * 100}%`, 
                     right: `${100 - (priceRange[1] / 100000000) * 100}%` 
                   }}
                 ></div>

                 {/* Range Inputs */}
                 <input 
                    type="range" 
                    min="0" 
                    max="100000000" 
                    step="1000000"
                    value={priceRange[0]}
                    onChange={handleMinChange}
                    className="absolute top-1/2 -translate-y-1/2 left-0 right-0 w-full h-1 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-indigo-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:shadow-md z-20"
                 />
                 <input 
                    type="range" 
                    min="0" 
                    max="100000000" 
                    step="1000000"
                    value={priceRange[1]}
                    onChange={handleMaxChange}
                    className="absolute top-1/2 -translate-y-1/2 left-0 right-0 w-full h-1 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-indigo-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:shadow-md z-20"
                 />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                 <button className="px-3 py-1 text-xs bg-neutral-800 rounded text-neutral-400 hover:text-white" onClick={() => setPriceRange([0, 15000000])}>Dưới 15tr</button>
                 <button className="px-3 py-1 text-xs bg-neutral-800 rounded text-neutral-400 hover:text-white" onClick={() => setPriceRange([15000000, 25000000])}>15tr - 25tr</button>
                 <button className="px-3 py-1 text-xs bg-neutral-800 rounded text-neutral-400 hover:text-white" onClick={() => setPriceRange([25000000, 35000000])}>25tr - 35tr</button>
                 <button className="px-3 py-1 text-xs bg-neutral-800 rounded text-neutral-400 hover:text-white" onClick={() => setPriceRange([35000000, 100000000])}>Trên 35tr</button>
              </div>

              <div className="flex gap-2 mt-6">
                <button 
                  onClick={() => setActiveFilter(null)}
                  className="flex-1 px-4 py-2 rounded-lg border border-neutral-700 text-neutral-300 hover:bg-neutral-800 transition"
                >
                  Đóng
                </button>
                <button 
                  onClick={() => setActiveFilter(null)}
                  className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                >
                  Xem kết quả
                </button>
              </div>
            </div>
          )}

          {/* CPU POPUP */}
          {activeFilter === f.id && f.id === "cpu" && (
            <div className="absolute top-full left-0 mt-2 w-[400px] bg-[#1e1e1e] border border-neutral-800 rounded-xl shadow-2xl p-4 z-50">
              <div className="flex flex-wrap gap-2 mb-6">
                {cpuOptions.map((cpu) => (
                  <button
                    key={cpu}
                    onClick={() => handleCpuToggle(cpu)}
                    className={`px-3 py-1.5 text-sm rounded-full border transition-all
                      ${selectedCPUs.includes(cpu)
                        ? "bg-indigo-600/20 border-indigo-500 text-indigo-400"
                        : "bg-neutral-900 border-neutral-700 text-neutral-300 hover:border-neutral-500"
                      }`}
                  >
                    {cpu}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => setActiveFilter(null)}
                  className="flex-1 px-4 py-2 rounded-lg border border-neutral-700 text-neutral-300 hover:bg-neutral-800 transition"
                >
                  Đóng
                </button>
                <button 
                  onClick={() => setActiveFilter(null)}
                  className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                >
                  Xem kết quả
                </button>
              </div>
            </div>
          )}

          {/* RAM POPUP */}
          {activeFilter === f.id && f.id === "ram" && (
            <div className="absolute top-full left-0 mt-2 w-[320px] bg-[#1e1e1e] border border-neutral-800 rounded-xl shadow-2xl p-4 z-50">
              <div className="flex flex-wrap gap-2 mb-6">
                {ramOptions.map((ram) => (
                  <button
                    key={ram}
                    onClick={() => handleRamToggle(ram)}
                    className={`px-3 py-1.5 text-sm rounded-full border transition-all
                      ${selectedRAMs.includes(ram)
                        ? "bg-indigo-600/20 border-indigo-500 text-indigo-400"
                        : "bg-neutral-900 border-neutral-700 text-neutral-300 hover:border-neutral-500"
                      }`}
                  >
                    {ram}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => setActiveFilter(null)}
                  className="flex-1 px-4 py-2 rounded-lg border border-neutral-700 text-neutral-300 hover:bg-neutral-800 transition"
                >
                  Đóng
                </button>
                <button 
                  onClick={() => setActiveFilter(null)}
                  className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                >
                  Xem kết quả
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
