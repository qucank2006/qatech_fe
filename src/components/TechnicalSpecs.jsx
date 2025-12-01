import React, { useState } from 'react';

/**
 * Component TechnicalSpecs - Hiển thị bảng thông số kỹ thuật sản phẩm
 * Render các thông số dưới dạng bảng với label tiếng Việt
 * Có thể thu gọn/mở rộng khi có nhiều thông số
 */
export default function TechnicalSpecs({ product }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!product) return null;

  // Parse specs từ product.specs
  let productSpecs = product.specs || {};
  
  // Parse specs nếu là string
  if (typeof productSpecs === 'string') {
    try {
      productSpecs = JSON.parse(productSpecs);
    } catch (e) {
      console.error('Error parsing specs:', e);
      productSpecs = {};
    }
  }
  
  // Đảm bảo specs là object
  const validSpecs = typeof productSpecs === 'object' && !Array.isArray(productSpecs) 
    ? productSpecs 
    : {};
  
  // Xác định format specs (màn hình hay không)
  const isMonitor = product.category === 'man-hinh' || 
                    product.category === 'monitor' || 
                    product.subCategory === 'monitor';
  
  // Map specs từ backend format sang frontend format
  const getSpecValue = (key) => {
    if (isMonitor) {
      // Format màn hình: size → monitorSize, panel → panelType
      const map = {
        monitorSize: validSpecs.size || validSpecs.monitorSize,
        panelType: validSpecs.panel || validSpecs.panelType,
        aspectRatio: validSpecs.aspectRatio,
        refreshRate: validSpecs.refreshRate,
        responseTime: validSpecs.responseTime,
        vesa: validSpecs.vesa,
        ports: Array.isArray(validSpecs.ports) 
          ? validSpecs.ports.join(', ') 
          : validSpecs.ports,
        resolution: validSpecs.resolution
      };
      return map[key] || '';
    } else {
      // Format khác: giữ nguyên tên field
      if (key === 'ports' && Array.isArray(validSpecs.ports)) {
        return validSpecs.ports.join(', ');
      }
      return validSpecs[key] || '';
    }
  };

  // Mapping từ key sang label tiếng Việt
  const specLabels = {
    cpuType: "Loại CPU",
    ramCapacity: "Dung lượng RAM",
    ramType: "Loại RAM",
    ramSlots: "Số khe RAM",
    storage: "Ổ cứng",
    os: "Hệ điều hành",
    battery: "Pin",
    gpuType: "Loại card đồ họa",
    screenSize: "Kích thước màn hình",
    screenTechnology: "Công nghệ màn hình",
    screenResolution: "Độ phân giải màn hình",
    monitorSize: "Kích thước",
    panelType: "Tấm nền",
    aspectRatio: "Tỉ lệ màn hình",
    refreshRate: "Tần số quét",
    responseTime: "Thời gian phản hồi",
    vesa: "Treo tường (VESA)",
    ports: "Cổng kết nối",
    resolution: "Độ phân giải màn hình",
    otherSpecs: "Các thông số khác",
  };

  // Lấy các specs fields từ product.specs
  const specs = {};
  
  // Thêm các field từ specLabels nếu có trong validSpecs
  Object.keys(specLabels).forEach(key => {
    const value = getSpecValue(key);
    if (value && value.toString().trim() !== '') {
      specs[key] = value;
    }
  });
  
  // Thêm các field khác từ validSpecs (cho các field không có trong specLabels)
  Object.keys(validSpecs).forEach(key => {
    if (!specLabels.hasOwnProperty(key) && validSpecs[key] && validSpecs[key].toString().trim() !== '') {
      specs[key] = validSpecs[key];
    }
  });

  // Nếu không có specs nào, không hiển thị
  if (Object.keys(specs).length === 0) return null;

  // Hàm lấy label
  const getLabel = (key) => {
    return specLabels[key] || key.charAt(0).toUpperCase() + key.slice(1);
  };

  const specsEntries = Object.entries(specs);
  const showExpandButton = specsEntries.length > 6;
  const displayedSpecs = isExpanded ? specsEntries : specsEntries.slice(0, 6);

  return (
    <div className="bg-[#151515] rounded-2xl border border-neutral-800 p-6">
      <h2 className="text-2xl font-bold mb-4 text-white">Thông số kỹ thuật</h2>
      <div className="relative">
        <div className="overflow-hidden rounded-xl border border-neutral-800">
          <table className="w-full text-sm text-left">
            <tbody>
              {displayedSpecs.map(([key, value], index) => (
                <tr 
                  key={key} 
                  className={index % 2 === 0 ? "bg-neutral-900/50" : "bg-transparent"}
                >
                  <td className="p-4 text-neutral-400 font-medium w-2/5 border-b border-neutral-800/50">
                    {getLabel(key)}
                  </td>
                  <td className="p-4 text-white border-b border-neutral-800/50 whitespace-pre-line">
                    {value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Gradient overlay khi thu gọn */}
        {!isExpanded && showExpandButton && (
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#151515] to-transparent pointer-events-none rounded-xl" />
        )}
      </div>

      {/* Button Xem thêm / Thu gọn */}
      {showExpandButton && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 text-indigo-400 hover:text-indigo-300 font-medium text-sm flex items-center gap-1 transition-colors"
        >
          {isExpanded ? (
            <>
              Thu gọn
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </>
          ) : (
            <>
              Xem thêm 
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </>
          )}
        </button>
      )}
    </div>
  );
}
