import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  LuShoppingCart, 
  LuHeart, 
  LuShare2, 
  LuStar, 
  LuCheck, 
  LuShield, 
  LuTruck, 
  LuRotateCcw,
  LuCpu,
  LuHardDrive,
  LuMonitor,
  LuMemoryStick
} from "react-icons/lu";

// Mock Data Extended
const productsData = [
  {
    id: 1,
    name: "MacBook Pro 14 M3 8CPU 10GPU 8GB 512GB",
    price: 39990000,
    oldPrice: 42990000,
    description: "MacBook Pro 14 inch M3 là dòng laptop cao cấp nhất của Apple, mang đến hiệu năng vượt trội với chip M3 thế hệ mới. Màn hình Liquid Retina XDR tuyệt đẹp, thời lượng pin lên đến 22 giờ và thiết kế sang trọng.",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=1000&auto=format&fit=crop"
    ],
    specs: { 
      cpu: "Apple M3 8-core", 
      ram: "8GB Unified", 
      ssd: "512GB SSD", 
      screen: "14.2\" Liquid Retina XDR (3024 x 1964)",
      gpu: "10-core GPU",
      os: "macOS Sonoma",
      battery: "70Wh",
      weight: "1.55 kg"
    },
    rating: 4.9,
    reviews: 128,
    stock: true
  },
  {
    id: 2,
    name: "Asus ROG Zephyrus G14 Ryzen 9 7940HS RTX 4060",
    price: 45990000,
    oldPrice: 49990000,
    description: "Chiến binh Gaming mỏng nhẹ nhất thế giới. Asus ROG Zephyrus G14 sở hữu sức mạnh khủng khiếp từ Ryzen 9 và RTX 4060 trong thân hình chỉ 1.7kg. Màn hình Nebula Display 165Hz chuẩn màu điện ảnh.",
    images: [
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1000&auto=format&fit=crop"
    ],
    specs: { 
      cpu: "AMD Ryzen 9 7940HS", 
      ram: "16GB DDR5 4800MHz", 
      ssd: "1TB PCIe 4.0 NVMe", 
      screen: "14\" QHD+ 165Hz Nebula Display",
      gpu: "NVIDIA GeForce RTX 4060 8GB",
      os: "Windows 11 Home",
      battery: "76Wh",
      weight: "1.72 kg"
    },
    rating: 4.8,
    reviews: 85,
    stock: true
  },
  {
    id: 3,
    name: "Dell XPS 13 Plus i7 1360P 16GB 512GB OLED",
    price: 52990000,
    oldPrice: 55990000,
    description: "Biểu tượng của sự sang trọng và công nghệ. Dell XPS 13 Plus với thiết kế tương lai, bàn phím tràn viền và Touch Bar cảm ứng. Màn hình OLED 3.5K cảm ứng cho trải nghiệm thị giác đỉnh cao.",
    images: [
      "https://images.unsplash.com/photo-1593642632823-8f78536788c6?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=1000&auto=format&fit=crop"
    ],
    specs: { 
      cpu: "Intel Core i7-1360P", 
      ram: "16GB LPDDR5 6000MHz", 
      ssd: "512GB PCIe 4.0", 
      screen: "13.4\" 3.5K OLED Touch",
      gpu: "Intel Iris Xe Graphics",
      os: "Windows 11 Pro",
      battery: "55Wh",
      weight: "1.23 kg"
    },
    rating: 4.7,
    reviews: 42,
    stock: false
  }
];

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Simulate API fetch
    const foundProduct = productsData.find(p => p.id === parseInt(id)) || productsData[0];
    setProduct(foundProduct);
    setActiveImage(0);
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) return <div className="text-white text-center py-20">Loading...</div>;

  return (
    <div className="bg-[#0f0f0f] min-h-screen pb-20 pt-6">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-neutral-400 mb-8">
          <Link to="/" className="hover:text-indigo-500">Trang chủ</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-indigo-500">Laptop</Link>
          <span>/</span>
          <span className="text-white truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Images */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-[#151515] rounded-2xl overflow-hidden border border-neutral-800 aspect-[4/3] relative group">
              <img 
                src={product.images[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, index) => (
                <button 
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`bg-[#151515] rounded-xl overflow-hidden border aspect-square transition-all ${
                    activeImage === index ? 'border-indigo-500 ring-2 ring-indigo-500/20' : 'border-neutral-800 hover:border-neutral-600'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Info */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1 text-yellow-500">
                  <LuStar fill="currentColor" />
                  <span className="font-bold text-white">{product.rating}</span>
                </div>
                <span className="text-neutral-500">|</span>
                <span className="text-neutral-400">{product.reviews} đánh giá</span>
                <span className="text-neutral-500">|</span>
                <span className={`${product.stock ? 'text-green-500' : 'text-red-500'} font-medium flex items-center gap-1`}>
                  <LuCheck size={16} />
                  {product.stock ? 'Còn hàng' : 'Hết hàng'}
                </span>
              </div>
              
              <div className="flex items-end gap-4 mb-2">
                <span className="text-3xl font-bold text-indigo-500">
                  {product.price.toLocaleString('vi-VN')}₫
                </span>
                <span className="text-lg text-neutral-500 line-through mb-1">
                  {product.oldPrice.toLocaleString('vi-VN')}₫
                </span>
              </div>
              <p className="text-neutral-400 text-sm">Đã bao gồm VAT</p>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#1a1a1a] p-3 rounded-xl border border-neutral-800 flex items-center gap-3">
                <LuCpu className="text-indigo-500" size={24} />
                <div>
                  <p className="text-xs text-neutral-500">CPU</p>
                  <p className="text-sm font-medium text-white truncate">{product.specs.cpu}</p>
                </div>
              </div>
              <div className="bg-[#1a1a1a] p-3 rounded-xl border border-neutral-800 flex items-center gap-3">
                <LuMemoryStick className="text-indigo-500" size={24} />
                <div>
                  <p className="text-xs text-neutral-500">RAM</p>
                  <p className="text-sm font-medium text-white truncate">{product.specs.ram}</p>
                </div>
              </div>
              <div className="bg-[#1a1a1a] p-3 rounded-xl border border-neutral-800 flex items-center gap-3">
                <LuHardDrive className="text-indigo-500" size={24} />
                <div>
                  <p className="text-xs text-neutral-500">Ổ cứng</p>
                  <p className="text-sm font-medium text-white truncate">{product.specs.ssd}</p>
                </div>
              </div>
              <div className="bg-[#1a1a1a] p-3 rounded-xl border border-neutral-800 flex items-center gap-3">
                <LuMonitor className="text-indigo-500" size={24} />
                <div>
                  <p className="text-xs text-neutral-500">Màn hình</p>
                  <p className="text-sm font-medium text-white truncate">{product.specs.screen}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-4 border-t border-neutral-800">
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-[#151515] border border-neutral-800 rounded-xl">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-white font-medium">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
                  >
                    +
                  </button>
                </div>
                <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]">
                  <LuShoppingCart size={20} />
                  Thêm vào giỏ hàng
                </button>
                <button className="w-12 h-12 bg-[#151515] border border-neutral-800 rounded-xl flex items-center justify-center text-neutral-400 hover:text-red-500 hover:border-red-500/50 transition-all">
                  <LuHeart size={20} />
                </button>
              </div>
            </div>

            {/* Policies */}
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3 text-sm text-neutral-300">
                <LuShield className="text-green-500" size={18} />
                <span>Bảo hành chính hãng 12 tháng</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-neutral-300">
                <LuRotateCcw className="text-blue-500" size={18} />
                <span>1 đổi 1 trong 30 ngày nếu có lỗi</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-neutral-300">
                <LuTruck className="text-orange-500" size={18} />
                <span>Miễn phí vận chuyển toàn quốc</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Info Tabs */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[#151515] border border-neutral-800 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">Mô tả sản phẩm</h3>
              <div className="text-neutral-300 space-y-4 leading-relaxed">
                <p>{product.description}</p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-[#151515] border border-neutral-800 rounded-2xl p-6 sticky top-24">
              <h3 className="text-xl font-bold text-white mb-6">Thông số kỹ thuật</h3>
              <div className="space-y-4">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-3 border-b border-neutral-800 last:border-0">
                    <span className="text-neutral-400 capitalize">{key}</span>
                    <span className="text-white font-medium text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
