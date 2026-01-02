import React from 'react';

/**
 * Component TechnicalSpecs - Hiển thị bảng thông số kỹ thuật sản phẩm
 * Render các thông số dưới dạng bảng với label tiếng Việt
 */
export default function TechnicalSpecs({ specs }) {
  if (!specs) return null;

  // Mapping từ key sang label tiếng Việt
  const specLabels = {
    cpu: "Loại CPU",
    ramCapacity: "Dung lượng RAM",
    ramType: "Loại RAM",
    ramSlots: "Số khe RAM",
    storage: "Ổ cứng",
    os: "Hệ điều hành",
    battery: "Pin",
    gpu: "Loại card đồ họa",
    screenSize: "Kích thước màn hình",
    screenTech: "Công nghệ màn hình",
    screenResolution: "Độ phân giải màn hình",
    ports: "Cổng giao tiếp",
    others: "Các thông số khác",
  };

  // Hàm lấy label hoặc format key thành dạng hiển thị
  const getLabel = (key) => {
    return specLabels[key] || key.charAt(0).toUpperCase() + key.slice(1);
  };

  return (
    <div className="bg-[#151515] rounded-2xl border border-neutral-800 p-6 mt-12">
      <h2 className="text-xl font-bold mb-6 text-white">Thông số kỹ thuật</h2>
      <div className="overflow-hidden rounded-xl border border-neutral-800">
        <table className="w-full text-sm text-left">
          <tbody>
            {Object.entries(specs).map(([key, value], index) => (
              <tr 
                key={key} 
                className={index % 2 === 0 ? "bg-neutral-900/50" : "bg-transparent"}
              >
                <td className="p-4 text-neutral-400 font-medium w-1/3 border-b border-neutral-800/50">
                  {getLabel(key)}
                </td>
                <td className="p-4 text-white border-b border-neutral-800/50">
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
