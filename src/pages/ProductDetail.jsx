import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../redux/slices/productSlice";
import { addToCart } from "../redux/slices/cartSlice";
import { LuShoppingCart, LuHeart, LuTruck, LuShieldCheck, LuRotateCcw, LuCpu, LuMonitor, LuHardDrive } from "react-icons/lu";
import { FaMemory } from "react-icons/fa";
import TechnicalSpecs from "../components/TechnicalSpecs";
import toast from "react-hot-toast";
import { getImageUrl } from "../utils/imageUrl";

export default function ProductDetail() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct: product, status } = useSelector((state) => state.products);
  const [activeImg, setActiveImg] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (slug) {
      dispatch(fetchProductById(slug));
    }
  }, [slug, dispatch]);

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center text-white">Đang tải...</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center text-white">Không tìm thấy sản phẩm</div>;
  }

  // Mock images if product doesn't have multiple
  const images = product.images?.length ? product.images : [product.image];

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, quantity }));
    toast.success("Đã thêm vào giỏ hàng!");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pt-24 pb-32 text-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* LEFT: IMAGES */}
        <div>
          <div className="space-y-4">
            <div className="aspect-[4/3] bg-white rounded-2xl overflow-hidden border border-neutral-800 flex items-center justify-center">
              <img 
                src={getImageUrl(images[activeImg])} 
                alt={product.name} 
                className="w-full h-full object-contain"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImg(index)}
                    className={`w-24 h-24 rounded-xl border-2 overflow-hidden shrink-0 transition-all ${
                      activeImg === index ? "border-indigo-500" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: INFO */}
        <div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-2xl font-bold text-indigo-400">
                {product.price?.toLocaleString('vi-VN')}đ
              </span>
              {product.oldPrice && (
                <span className="text-neutral-500 line-through">
                  {product.oldPrice?.toLocaleString('vi-VN')}đ
                </span>
              )}
              {product.discount && (
                <span className="bg-red-500/10 text-red-500 px-3 py-1 rounded-full text-sm font-bold">
                  -{product.discount}%
                </span>
              )}
            </div>

            <p className="text-neutral-400 leading-relaxed mb-8">
              {product.description || "Mô tả đang cập nhật..."}
            </p>

            {/* SPECS GRID */}
            {product.specs && (
              <div className="grid grid-cols-2 gap-4 mb-8">
                {product.specs.cpu && (
                  <div className="bg-[#151515] p-3 rounded-xl border border-neutral-800 flex items-center gap-3">
                    <LuCpu className="text-indigo-500" size={24} />
                    <div>
                      <p className="text-xs text-neutral-500">CPU</p>
                      <p className="font-medium text-sm">{product.specs.cpu}</p>
                    </div>
                  </div>
                )}
                {product.specs.ram && (
                  <div className="bg-[#151515] p-3 rounded-xl border border-neutral-800 flex items-center gap-3">
                    <FaMemory className="text-indigo-500" size={24} />
                    <div>
                      <p className="text-xs text-neutral-500">RAM</p>
                      <p className="font-medium text-sm">{product.specs.ram}</p>
                    </div>
                  </div>
                )}
                {product.specs.screen && (
                  <div className="bg-[#151515] p-3 rounded-xl border border-neutral-800 flex items-center gap-3">
                    <LuMonitor className="text-indigo-500" size={24} />
                    <div>
                      <p className="text-xs text-neutral-500">Màn hình</p>
                      <p className="font-medium text-sm">{product.specs.screen}</p>
                    </div>
                  </div>
                )}
                {product.specs.ssd && (
                  <div className="bg-[#151515] p-3 rounded-xl border border-neutral-800 flex items-center gap-3">
                    <LuHardDrive className="text-indigo-500" size={24} />
                    <div>
                      <p className="text-xs text-neutral-500">Ổ cứng</p>
                      <p className="font-medium text-sm">{product.specs.ssd}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex gap-4 mb-8">
              <div className="flex items-center bg-[#151515] rounded-xl border border-neutral-800">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 hover:text-indigo-500 transition"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 hover:text-indigo-500 transition"
                >
                  +
                </button>
              </div>
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
              >
                <LuShoppingCart /> Thêm vào giỏ
              </button>
              <button className="p-4 bg-[#151515] border border-neutral-800 rounded-xl hover:border-red-500 hover:text-red-500 transition">
                <LuHeart />
              </button>
            </div>

            {/* POLICIES */}
            <div className="space-y-4 border-t border-neutral-800 pt-6">
              <div className="flex items-center gap-3 text-sm text-neutral-300">
                <LuTruck className="text-indigo-500" size={20} />
                <span>Miễn phí vận chuyển toàn quốc</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-neutral-300">
                <LuShieldCheck className="text-indigo-500" size={20} />
                <span>Bảo hành chính hãng 12 tháng</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-neutral-300">
                <LuRotateCcw className="text-indigo-500" size={20} />
                <span>Đổi trả trong 30 ngày nếu lỗi</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      <TechnicalSpecs specs={product.specs} />
    </div>
  );
}
