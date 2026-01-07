import React, { useState } from 'react';
import { LuCpu, LuHardDrive, LuPlus, LuBox, LuCircuitBoard, LuMemoryStick, LuMonitorCheck, LuFan, LuZap, LuX, LuCheck, LuLoader, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import api from '../services/api';
import { getImageUrl } from '../utils/imageUrl';
import toast from 'react-hot-toast';

/**
 * Component BuildPC - Công cụ xây dựng cấu hình PC tùy chỉnh
 * Cho phép người dùng chọn từng linh kiện để tạo bộ máy tính theo nhu cầu
 */

// Danh sách các linh kiện PC có thể chọn
const components = [
  { id: 'cpu', label: 'Vi xử lý (CPU)', icon: <LuCpu size={24} />, subCategory: 'cpu' },
  { id: 'mainboard', label: 'Bo mạch chủ (Mainboard)', icon: <LuCircuitBoard size={24} />, subCategory: 'mainboard' },
  { id: 'ram', label: 'Bộ nhớ (RAM)', icon: <LuMemoryStick size={24} />, subCategory: 'ram' },
  { id: 'hdd', label: 'Ổ cứng (HDD/SSD)', icon: <LuHardDrive size={24} />, subCategory: 'storage' },
  { id: 'vga', label: 'Card đồ họa (VGA)', icon: <LuMonitorCheck size={24} />, subCategory: 'gpu' },
  { id: 'cooling', label: 'Tản nhiệt (Cooling)', icon: <LuFan size={24} />, subCategory: 'cooling' },
  { id: 'case', label: 'Vỏ máy (Case)', icon: <LuBox size={24} />, subCategory: 'case' },
  { id: 'psu', label: 'Nguồn (PSU)', icon: <LuZap size={24} />, subCategory: 'psu' },
];

export default function BuildPC() {
  const dispatch = useDispatch();
  const [selectedParts, setSelectedParts] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [currentPartType, setCurrentPartType] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  // Xử lý khi người dùng click chọn linh kiện
  const handleSelectPart = async (partId, subCategory) => {
    setCurrentPartType(partId);
    setShowModal(true);
    setLoading(true);
    setSelectedBrands([]);
    setPriceRange({ min: '', max: '' });
    
    try {
      const res = await api.get('/products', {
        params: {
          category: 'parts',
          subCategory: subCategory
        }
      });
      setProducts(res.data);
      
      // Lấy danh sách brands unique
      const uniqueBrands = [...new Set(res.data.map(p => p.brand).filter(Boolean))];
      setBrands(uniqueBrands);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  // Lọc sản phẩm theo brand và giá
  const filteredProducts = products.filter(product => {
    // Filter by brand
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
      return false;
    }
    
    // Filter by price
    if (priceRange.min && product.price < parseInt(priceRange.min)) {
      return false;
    }
    if (priceRange.max && product.price > parseInt(priceRange.max)) {
      return false;
    }
    
    return true;
  });

  // Toggle brand selection
  const toggleBrand = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  // Chọn sản phẩm cụ thể
  const handleSelectProduct = (product) => {
    setSelectedParts(prev => ({
      ...prev,
      [currentPartType]: {
        id: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0],
        brand: product.brand
      }
    }));
    setShowModal(false);
    toast.success(`Đã chọn ${product.name}`);
  };

  // Tính tổng giá trị các linh kiện đã chọn
  const totalPrice = Object.values(selectedParts).reduce((total, part) => total + (part.price || 0), 0);

  // Thêm tất cả linh kiện vào giỏ hàng
  const handleAddAllToCart = async () => {
    const selectedItems = Object.values(selectedParts);
    
    if (selectedItems.length === 0) {
      toast.error('Vui lòng chọn ít nhất một linh kiện');
      return;
    }

    try {
      // Thêm từng sản phẩm vào giỏ hàng
      for (const item of selectedItems) {
        dispatch(addToCart({
          _id: item.id,
          name: item.name,
          price: item.price,
          images: [item.image],
          brand: item.brand,
          quantity: 1
        }));
      }
      
      toast.success(`Đã thêm ${selectedItems.length} linh kiện vào giỏ hàng`);
      
      // Reset selected parts
      setSelectedParts({});
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="bg-[#151515] border border-neutral-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-white">Xây dựng cấu hình PC</h2>
          <p className="text-neutral-400 mb-8">Chọn từng linh kiện để xây dựng bộ máy tính mơ ước của bạn.</p>

          <div className="space-y-4">
            {components.map((comp) => (
              <div key={comp.id} className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 flex items-center justify-between hover:border-indigo-500/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-neutral-800 rounded-lg flex items-center justify-center text-neutral-400">
                    {comp.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{comp.label}</h3>
                    {selectedParts[comp.id] ? (
                      <div>
                        <p className="text-sm text-indigo-400 line-clamp-1">{selectedParts[comp.id].name}</p>
                        <p className="text-xs text-neutral-500">{selectedParts[comp.id].price?.toLocaleString('vi-VN')}₫</p>
                      </div>
                    ) : (
                      <p className="text-sm text-neutral-500">Chưa chọn linh kiện</p>
                    )}
                  </div>
                </div>
                
                <button 
                  onClick={() => handleSelectPart(comp.id, comp.subCategory)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2
                    ${selectedParts[comp.id] 
                      ? 'bg-neutral-800 text-white hover:bg-neutral-700' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                >
                  {selectedParts[comp.id] ? 'Thay đổi' : <><LuPlus /> Chọn</>}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-neutral-800 flex justify-between items-center">
            <div>
              <p className="text-neutral-400">Tổng chi phí dự kiến</p>
              <p className="text-3xl font-bold text-indigo-400">{totalPrice.toLocaleString()}₫</p>
            </div>
            <button 
              onClick={handleAddAllToCart}
              disabled={Object.keys(selectedParts).length === 0}
              className={`px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${
                Object.keys(selectedParts).length === 0
                  ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-indigo-500/20'
              }`}
            >
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>

      {/* Modal chọn sản phẩm */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 border-b border-neutral-700">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  {components.find(c => c.id === currentPartType)?.icon}
                </span>
                Chọn {components.find(c => c.id === currentPartType)?.label}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all"
              >
                <LuX size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex">
              {/* Sidebar Filters */}
              <div className="w-72 bg-[#0f0f0f] border-r border-neutral-800 overflow-y-auto">
                <div className="p-5">
                  {/* Brand Filter */}
                  <div className="mb-6">
                    <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wide flex items-center gap-2">
                      <div className="w-1 h-4 bg-indigo-500 rounded-full"></div>
                      Hãng sản xuất
                    </h4>
                    <div className="space-y-2">
                      {brands.map(brand => (
                        <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={selectedBrands.includes(brand)}
                              onChange={() => toggleBrand(brand)}
                              className="peer sr-only"
                            />
                            <div className="w-5 h-5 border-2 border-neutral-600 rounded peer-checked:border-indigo-500 peer-checked:bg-indigo-500 transition-all flex items-center justify-center">
                              {selectedBrands.includes(brand) && (
                                <LuCheck size={14} className="text-white" />
                              )}
                            </div>
                          </div>
                          <span className="text-neutral-300 text-sm group-hover:text-white transition-colors">
                            {brand}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range Filter */}
                  <div className="mb-6">
                    <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wide flex items-center gap-2">
                      <div className="w-1 h-4 bg-indigo-500 rounded-full"></div>
                      Khoảng giá
                    </h4>
                    <div className="space-y-3">
                      <input
                        type="number"
                        placeholder="Từ"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      />
                      <input
                        type="number"
                        placeholder="Đến"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {(selectedBrands.length > 0 || priceRange.min || priceRange.max) && (
                    <button
                      onClick={() => {
                        setSelectedBrands([]);
                        setPriceRange({ min: '', max: '' });
                      }}
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-2.5 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-red-500/20"
                    >
                      Xóa bộ lọc
                    </button>
                  )}
                </div>
              </div>

              {/* Products Grid */}
              <div className="flex-1 overflow-y-auto bg-[#0a0a0a]">
                <div className="p-6">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                      <LuLoader className="animate-spin text-indigo-500 mb-4" size={48} />
                      <p className="text-neutral-400">Đang tải sản phẩm...</p>
                    </div>
                  ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-20">
                      <div className="w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                        <LuBox size={40} className="text-neutral-600" />
                      </div>
                      <p className="text-neutral-400 text-lg font-medium">Không tìm thấy sản phẩm phù hợp</p>
                      <p className="text-neutral-600 text-sm mt-2">Thử điều chỉnh bộ lọc của bạn</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredProducts.map((product) => {
                        const isSelected = selectedParts[currentPartType]?.id && selectedParts[currentPartType]?.id === product._id;
                        console.log('Product:', product.name, 'ID:', product._id, 'Selected ID:', selectedParts[currentPartType]?.id, 'isSelected:', isSelected);
                        return (
                          <div
                            key={product._id}
                            className={`bg-[#0f0f0f] border rounded-xl p-5 transition-all hover:shadow-xl ${
                              isSelected
                                ? 'border-indigo-500 shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-500/20'
                                : 'border-neutral-800 hover:border-neutral-700'
                            }`}
                          >
                            <div className="flex gap-5">
                              {/* Image */}
                              <div className="w-36 h-36 bg-neutral-900 rounded-xl overflow-hidden flex-shrink-0 border border-neutral-800">
                                {product.images?.[0] ? (
                                  <img
                                    src={getImageUrl(product.images[0])}
                                    alt={product.name}
                                    className="w-full h-full object-contain p-2"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-neutral-600">
                                    {components.find(c => c.id === currentPartType)?.icon}
                                  </div>
                                )}
                              </div>

                              {/* Info */}
                              <div className="flex-1">
                                <h4 className="font-bold text-white mb-3 text-lg leading-tight">
                                  {product.name}
                                </h4>
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                  <div className="flex items-center gap-2">
                                    <span className="text-neutral-500 text-xs">Mã SP:</span>
                                    <span className="text-neutral-300 text-sm font-mono">{product._id?.slice(-8) || 'N/A'}</span>
                                  </div>
                                  {product.brand && (
                                    <div className="flex items-center gap-2">
                                      <span className="text-neutral-500 text-xs">Hãng:</span>
                                      <span className="text-indigo-400 text-sm font-semibold">{product.brand}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2">
                                    <span className="text-neutral-500 text-xs">Bảo hành:</span>
                                    <span className="text-neutral-300 text-sm">36 tháng</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-neutral-500 text-xs">Tình trạng:</span>
                                    <span className={`text-sm font-semibold ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                      {product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-xs text-neutral-500 mb-1">Giá tiền</p>
                                    <p className="text-2xl font-bold text-indigo-400">
                                      {product.price?.toLocaleString('vi-VN')}₫
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => handleSelectProduct(product)}
                                    disabled={product.stock === 0}
                                    className={`px-6 py-3 rounded-lg font-semibold transition-all shadow-lg ${
                                      isSelected
                                        ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-green-500/30'
                                        : product.stock === 0
                                        ? 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-indigo-500/30'
                                    }`}
                                  >
                                    {isSelected ? (
                                      <span className="flex items-center gap-2">
                                        <LuCheck size={18} /> Đã chọn
                                      </span>
                                    ) : product.stock === 0 ? (
                                      'Hết hàng'
                                    ) : (
                                      'Chọn'
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
