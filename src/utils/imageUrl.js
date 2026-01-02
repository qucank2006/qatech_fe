/**
 * Utility function để tạo URL đầy đủ cho hình ảnh
 * Xử lý các trường hợp: URL tuyệt đối, blob, đường dẫn tương đối
 * @param {string} path - Đường dẫn hình ảnh
 * @returns {string|null} - URL đầy đủ của hình ảnh
 */
export const getImageUrl = (path) => {
  if (!path) return null;

  // Chuẩn hóa backslash thành forward slash
  const cleanPath = path.replace(/\\/g, '/');

  // Nếu đã là URL đầy đủ hoặc blob URL, trả về nguyên bản
  if (cleanPath.startsWith('http') || cleanPath.startsWith('blob:')) return cleanPath;
  
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api', '') 
    : 'http://localhost:5000';

  // Loại bỏ dấu / ở đầu path nếu có
  const formattedPath = cleanPath.startsWith('/') ? cleanPath.slice(1) : cleanPath;

  // Nếu path đã bao gồm 'uploads/', không thêm lại nữa
  if (formattedPath.startsWith('uploads/')) {
    return `${baseUrl}/${formattedPath}`;
  }
    
  return `${baseUrl}/uploads/${formattedPath}`;
};
