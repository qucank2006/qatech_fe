/**
 * Utility functions để format dữ liệu hiển thị
 */

/**
 * Extract tên CPU ngắn gọn từ chuỗi CPU đầy đủ
 * Loại bỏ thông số kỹ thuật như clock speed, cache, số lõi, luồng
 * 
 * @param {string} cpuString - Chuỗi CPU đầy đủ
 * @returns {string} - Tên CPU ngắn gọn
 * 
 * @example
 * extractCPUName("Intel Core 5 210H 2.2 GHz (12MB Cache, up to 4.8 GHz, 8 lõi, 12 luồng)")
 * // Returns: "Intel Core 5 210H"
 * 
 * extractCPUName("Intel Core i5-12400F 2.5GHz")
 * // Returns: "Intel Core i5-12400F"
 * 
 * extractCPUName("AMD Ryzen 7 5800X 3.8GHz")
 * // Returns: "AMD Ryzen 7 5800X"
 */
export function extractCPUName(cpuString) {
  if (!cpuString) return '';

  // Xử lý riêng cho Apple chip - chỉ lấy "Apple M1", "Apple M2", "Apple M3"...
  const applePattern = /Apple\s+M\d+/i;
  const appleMatch = cpuString.match(applePattern);
  if (appleMatch) {
    return appleMatch[0].trim();
  }

  // Pattern để match tên CPU chính:
  // Intel Core [i3/i5/i7/i9 hoặc 3/5/7/9] + số model + suffix (H/K/F/U/X/...)
  // AMD Ryzen [3/5/7/9] + số model + suffix (X/G/...)
  const patterns = [
    // Intel Core i3/i5/i7/i9 (ví dụ: Intel Core i5-12400F, Intel Core i7 13700K)
    /Intel\s+Core\s+i[3579][-\s]?\d+[A-Z]*/i,
    
    // Intel Core 3/5/7/9 (ví dụ: Intel Core 5 210H, Intel Core 7 150U)
    /Intel\s+Core\s+[3579]\s+\d+[A-Z]*/i,
    
    // AMD Ryzen 3/5/7/9 (ví dụ: AMD Ryzen 7 5800X, AMD Ryzen 5 7600)
    /AMD\s+Ryzen\s+[3579]\s+\d+[A-Z]*/i,
    
    // Intel Pentium, Celeron
    /Intel\s+(Pentium|Celeron)\s+[A-Z]?\d+[A-Z]*/i,
    
    // AMD Athlon
    /AMD\s+Athlon\s+[A-Z]?\d+[A-Z]*/i,
  ];

  // Thử match với từng pattern
  for (const pattern of patterns) {
    const match = cpuString.match(pattern);
    if (match) {
      return match[0].trim();
    }
  }

  // Nếu không match pattern nào, cắt ở ký tự đầu tiên của các từ khóa kỹ thuật
  const technicalKeywords = [
    'GHz', 'MHz', 'Cache', 'lõi', 'luồng', 'core', 'thread',
    'MB', 'up to', 'base', 'boost', 'turbo', 'nhân'
  ];

  let result = cpuString;
  for (const keyword of technicalKeywords) {
    const index = result.toLowerCase().indexOf(keyword.toLowerCase());
    if (index > -1) {
      result = result.substring(0, index).trim();
      break;
    }
  }

  // Loại bỏ dấu ngoặc và nội dung bên trong
  result = result.replace(/\([^)]*\)/g, '').trim();
  
  // Loại bỏ số GHz/MHz còn sót lại
  result = result.replace(/\d+\.?\d*\s*(GHz|MHz)/gi, '').trim();

  return result;
}

/**
 * Extract tên GPU ngắn gọn
 * @param {string} gpuString - Chuỗi GPU đầy đủ
 * @returns {string} - Tên GPU ngắn gọn
 */
export function extractGPUName(gpuString) {
  if (!gpuString) return '';

  // Pattern cho NVIDIA, AMD, Intel GPU
  const patterns = [
    // NVIDIA (ví dụ: RTX 4060, GTX 1650, RTX 4090 Ti)
    /(NVIDIA\s+)?(GeForce\s+)?(RTX|GTX)\s+\d+(\s+Ti)?/i,
    
    // AMD (ví dụ: RX 6700 XT, RX 7900 XTX)
    /(AMD\s+)?(Radeon\s+)?RX\s+\d+(\s+(XT|XTX))?/i,
    
    // Intel (ví dụ: Arc A770, Iris Xe)
    /Intel\s+(Arc|Iris)\s+[A-Z0-9]+/i,
  ];

  for (const pattern of patterns) {
    const match = gpuString.match(pattern);
    if (match) {
      return match[0].trim();
    }
  }

  // Fallback: cắt ở từ khóa kỹ thuật
  const result = gpuString.split(/\d+GB|GDDR|VRAM/i)[0].trim();
  return result;
}

/**
 * Format dung lượng RAM
 * @param {string|number} ramCapacity - Dung lượng RAM
 * @returns {string} - RAM formatted
 */
export function formatRAM(ramCapacity) {
  if (!ramCapacity) return '';
  
  const ramStr = String(ramCapacity).toUpperCase();
  
  // Nếu đã có GB thì return luôn
  if (ramStr.includes('GB')) {
    return ramStr;
  }
  
  // Nếu là số thuần thì thêm GB
  if (!isNaN(ramCapacity)) {
    return `${ramCapacity}GB`;
  }
  
  return ramStr;
}

/**
 * Format kích thước màn hình
 * @param {string|number} screenSize - Kích thước màn hình
 * @returns {string} - Screen size formatted
 */
export function formatScreenSize(screenSize) {
  if (!screenSize) return '';
  
  const sizeStr = String(screenSize);
  
  // Nếu đã có inch/inches thì return luôn
  if (sizeStr.toLowerCase().includes('inch')) {
    return sizeStr;
  }
  
  // Nếu là số thì thêm inch
  if (!isNaN(screenSize)) {
    return `${screenSize} inch`;
  }
  
  return sizeStr;
}
