// Cấu hình các trường specs cho từng loại sản phẩm
export const specsFieldsConfig = {
  // Laptop specs
  laptop: [
    { name: 'cpuType', label: 'Loại CPU', placeholder: 'VD: Intel Core i5-12450H' },
    { name: 'ramCapacity', label: 'Dung lượng RAM', placeholder: 'VD: 16GB' },
    { name: 'ramType', label: 'Loại RAM', placeholder: 'VD: DDR5' },
    { name: 'storage', label: 'Ổ cứng', placeholder: 'VD: 512GB SSD NVMe PCIe Gen 4.0' },
    { name: 'gpuType', label: 'Card đồ họa', placeholder: 'VD: NVIDIA RTX 4060' },
    { name: 'screenSize', label: 'Kích thước màn hình', placeholder: 'VD: 15.6 inch' },
    { name: 'screenResolution', label: 'Độ phân giải', placeholder: 'VD: 1920x1080 (Full HD)' },
    { name: 'screenTechnology', label: 'Công nghệ màn hình', placeholder: 'VD: IPS, 144Hz' },
    { name: 'os', label: 'Hệ điều hành', placeholder: 'VD: Windows 11 Home' },
    { name: 'battery', label: 'Pin', placeholder: 'VD: 56WHrs, 3 cell' },
    { name: 'ports', label: 'Cổng kết nối', placeholder: 'VD: 2x USB 3.2, 1x HDMI, 1x Type-C' }
  ],

  // Parts - CPU
  'parts-cpu': [
    { name: 'chipset', label: 'Chipset', placeholder: 'VD: Intel Core i5-12400F' },
    { name: 'generation', label: 'Thế hệ', placeholder: 'VD: Thế hệ 12' },
    { name: 'series', label: 'Dòng sản phẩm', placeholder: 'VD: Core i5' },
    { name: 'socket', label: 'Socket', placeholder: 'VD: LGA1700' },
    { name: 'cores', label: 'Số nhân', placeholder: 'VD: 6' },
    { name: 'threads', label: 'Số luồng', placeholder: 'VD: 12' },
    { name: 'baseClock', label: 'Tốc độ xử lý', placeholder: 'VD: 2.5 GHz' },
    { name: 'boostClock', label: 'Tốc độ tối đa', placeholder: 'VD: 4.4 GHz' },
    { name: 'cache', label: 'Cache', placeholder: 'VD: 18MB' },
    { name: 'integratedGraphics', label: 'Chip đồ họa tích hợp', placeholder: 'VD: Không' },
    { name: 'tdp', label: 'Điện năng tiêu thụ', placeholder: 'VD: 65W' },
    { name: 'manufacturer', label: 'Hãng sản xuất', placeholder: 'VD: Intel' }
  ],

  // Parts - RAM
  'parts-ram': [
    { name: 'capacity', label: 'Dung lượng', placeholder: 'VD: 16GB' },
    { name: 'type', label: 'Loại RAM', placeholder: 'VD: DDR4' },
    { name: 'speed', label: 'Tốc độ', placeholder: 'VD: 3200MHz' },
    { name: 'latency', label: 'Độ trễ', placeholder: 'VD: CL16' },
    { name: 'voltage', label: 'Điện áp', placeholder: 'VD: 1.35V' },
    { name: 'formFactor', label: 'Chuẩn', placeholder: 'VD: DIMM' },
    { name: 'rgb', label: 'Đèn RGB', placeholder: 'VD: Có' },
    { name: 'kit', label: 'Kit', placeholder: 'VD: 1 x 16GB' }
  ],

  // Parts - GPU
  'parts-gpu': [
    { name: 'chipset', label: 'Chipset', placeholder: 'VD: NVIDIA RTX 4060 Ti' },
    { name: 'vram', label: 'Bộ nhớ VRAM', placeholder: 'VD: 8GB GDDR6' },
    { name: 'coreClock', label: 'Xung nhịp cơ bản', placeholder: 'VD: 2310 MHz' },
    { name: 'boostClock', label: 'Xung nhịp tối đa', placeholder: 'VD: 2535 MHz' },
    { name: 'memoryInterface', label: 'Bus bộ nhớ', placeholder: 'VD: 128-bit' },
    { name: 'memorySpeed', label: 'Tốc độ bộ nhớ', placeholder: 'VD: 18 Gbps' },
    { name: 'tdp', label: 'TDP', placeholder: 'VD: 160W' },
    { name: 'cooling', label: 'Tản nhiệt', placeholder: 'VD: Triple Fan' },
    { name: 'ports', label: 'Cổng xuất hình', placeholder: 'VD: 3x DP 1.4a, 1x HDMI 2.1' },
    { name: 'pciExpress', label: 'Chuẩn PCIe', placeholder: 'VD: PCIe 4.0 x16' },
    { name: 'powerConnector', label: 'Nguồn phụ', placeholder: 'VD: 1x 8-pin' }
  ],

  // Parts - Storage
  'parts-storage': [
    { name: 'capacity', label: 'Dung lượng', placeholder: 'VD: 1TB' },
    { name: 'type', label: 'Loại ổ cứng', placeholder: 'VD: SSD NVMe' },
    { name: 'interface', label: 'Chuẩn kết nối', placeholder: 'VD: M.2 PCIe Gen 4.0 x4' },
    { name: 'formFactor', label: 'Form Factor', placeholder: 'VD: M.2 2280' },
    { name: 'readSpeed', label: 'Tốc độ đọc', placeholder: 'VD: 7000 MB/s' },
    { name: 'writeSpeed', label: 'Tốc độ ghi', placeholder: 'VD: 5300 MB/s' },
    { name: 'nand', label: 'NAND Flash', placeholder: 'VD: 3D TLC' },
    { name: 'controller', label: 'Controller', placeholder: 'VD: Phison E18' },
    { name: 'warranty', label: 'Bảo hành', placeholder: 'VD: 5 năm' }
  ],

  // Parts - Mainboard
  'parts-mainboard': [
    { name: 'socket', label: 'Socket', placeholder: 'VD: LGA1700' },
    { name: 'chipset', label: 'Chipset', placeholder: 'VD: B660' },
    { name: 'formFactor', label: 'Form Factor', placeholder: 'VD: ATX' },
    { name: 'ramSlots', label: 'Khe RAM', placeholder: 'VD: 4 x DDR4' },
    { name: 'maxRam', label: 'RAM tối đa', placeholder: 'VD: 128GB' },
    { name: 'ramSpeed', label: 'Tốc độ RAM', placeholder: 'VD: 3200MHz (OC 5333MHz)' },
    { name: 'm2Slots', label: 'Khe M.2', placeholder: 'VD: 2 x M.2 (PCIe 4.0)' },
    { name: 'sataSlots', label: 'Cổng SATA', placeholder: 'VD: 4 x SATA 6Gb/s' },
    { name: 'pciSlots', label: 'Khe PCI', placeholder: 'VD: 1x PCIe 4.0 x16, 2x PCIe 3.0 x1' },
    { name: 'networkCard', label: 'Card mạng', placeholder: 'VD: 1Gb LAN' },
    { name: 'audio', label: 'Audio', placeholder: 'VD: Realtek ALC897' },
    { name: 'usbPorts', label: 'Cổng USB', placeholder: 'VD: 1x USB-C, 4x USB 3.2' },
    { name: 'rgb', label: 'Đèn RGB', placeholder: 'VD: RGB Fusion 2.0' }
  ],

  // Parts - PSU
  'parts-psu': [
    { name: 'wattage', label: 'Công suất', placeholder: 'VD: 750W' },
    { name: 'efficiency', label: 'Chứng nhận', placeholder: 'VD: 80 Plus Gold' },
    { name: 'modular', label: 'Dây rời', placeholder: 'VD: Full Modular' },
    { name: 'formFactor', label: 'Form Factor', placeholder: 'VD: ATX' },
    { name: 'cooling', label: 'Quạt tản nhiệt', placeholder: 'VD: 140mm Fan' },
    { name: 'rails', label: 'Rail', placeholder: 'VD: +12V Single Rail' },
    { name: 'connectors', label: 'Đầu cắm', placeholder: 'VD: 1x 24-pin, 2x 8-pin CPU, 4x PCIe' },
    { name: 'warranty', label: 'Bảo hành', placeholder: 'VD: 10 năm' }
  ],

  // Parts - Cooling
  'parts-cooling': [
    { name: 'type', label: 'Loại tản nhiệt', placeholder: 'VD: AIO Liquid Cooling' },
    { name: 'radiatorSize', label: 'Kích thước Radiator', placeholder: 'VD: 240mm' },
    { name: 'fanSize', label: 'Kích thước quạt', placeholder: 'VD: 2x 120mm' },
    { name: 'fanSpeed', label: 'Tốc độ quạt', placeholder: 'VD: 500-2000 RPM' },
    { name: 'airflow', label: 'Lưu lượng gió', placeholder: 'VD: 51.17 CFM' },
    { name: 'noiseLevel', label: 'Độ ồn', placeholder: 'VD: 25 dBA' },
    { name: 'tdp', label: 'TDP hỗ trợ', placeholder: 'VD: 250W' },
    { name: 'sockets', label: 'Socket hỗ trợ', placeholder: 'VD: LGA1700/1200, AM5/AM4' },
    { name: 'rgb', label: 'Đèn RGB', placeholder: 'VD: ARGB' },
    { name: 'tubingLength', label: 'Độ dài ống', placeholder: 'VD: 400mm' }
  ],

  // Parts - Case
  'parts-case': [
    { name: 'formFactor', label: 'Form Factor', placeholder: 'VD: Mid Tower ATX' },
    { name: 'material', label: 'Chất liệu', placeholder: 'VD: Thép, Kính cường lực' },
    { name: 'dimensions', label: 'Kích thước', placeholder: 'VD: 465 x 220 x 480 mm' },
    { name: 'weight', label: 'Trọng lượng', placeholder: 'VD: 8.5 kg' },
    { name: 'motherboardSupport', label: 'Bo mạch hỗ trợ', placeholder: 'VD: ATX, mATX, Mini-ITX' },
    { name: 'maxGpuLength', label: 'Độ dài GPU tối đa', placeholder: 'VD: 360mm' },
    { name: 'maxCpuCoolerHeight', label: 'Chiều cao tản nhiệt CPU', placeholder: 'VD: 165mm' },
    { name: 'maxPsuLength', label: 'Độ dài PSU tối đa', placeholder: 'VD: 220mm' },
    { name: 'driveBays', label: 'Khay ổ cứng', placeholder: 'VD: 2x 3.5", 2x 2.5"' },
    { name: 'expansionSlots', label: 'Số khe mở rộng', placeholder: 'VD: 7' },
    { name: 'fans', label: 'Quạt đi kèm', placeholder: 'VD: 3x 120mm RGB' },
    { name: 'maxFans', label: 'Số quạt tối đa', placeholder: 'VD: 6x 120mm / 4x 140mm' },
    { name: 'radiatorSupport', label: 'Hỗ trợ Radiator', placeholder: 'VD: Front: 360mm, Top: 280mm' },
    { name: 'rgb', label: 'Đèn RGB', placeholder: 'VD: RGB Controller + Remote' },
    { name: 'usb', label: 'Cổng USB mặt trước', placeholder: 'VD: 1x USB-C, 2x USB 3.0' }
  ],

  // Monitor specs
  // Monitor specs
  monitor: [
    { name: 'monitorSize', label: 'Kích thước', placeholder: 'VD: 27 inch' },
    { name: 'panelType', label: 'Tấm nền', placeholder: 'VD: IPS, VA, TN' },
    { name: 'aspectRatio', label: 'Tỉ lệ màn hình', placeholder: 'VD: 16:9, 21:9' },
    { name: 'refreshRate', label: 'Tần số quét', placeholder: 'VD: 165Hz, 144Hz' },
    { name: 'responseTime', label: 'Thời gian phản hồi', placeholder: 'VD: 1ms, 5ms' },
    { name: 'vesa', label: 'Treo tường (VESA)', placeholder: 'VD: 100x100mm, 75x75mm' },
    { name: 'ports', label: 'Cổng kết nối', placeholder: 'VD: HDMI 2.0, DisplayPort 1.4, USB 3.0' },
    { name: 'resolution', label: 'Độ phân giải màn hình', placeholder: 'VD: 2560x1440 (2K QHD), 1920x1080 (Full HD)' }
  ]
};

// Helper function để lấy specs fields dựa trên category và subCategory
export const getSpecsFields = (category, subCategory) => {
  if (category === 'parts' && subCategory) {
    const key = `parts-${subCategory}`;
    return specsFieldsConfig[key] || [];
  }
  return specsFieldsConfig[category] || [];
};
