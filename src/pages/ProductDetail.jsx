import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById, fetchRelatedProducts } from "../redux/slices/productSlice";
import ProductCard from "../components/ProductCard";
import { addToCart } from "../redux/slices/cartSlice";
import { LuShoppingCart, LuHeart, LuTruck, LuShieldCheck, LuRotateCcw, LuCpu, LuMonitor, LuHardDrive, LuChevronLeft, LuChevronRight, LuPlus, LuMinus } from "react-icons/lu";
import { FaMemory } from "react-icons/fa";
import TechnicalSpecs from "../components/TechnicalSpecs";
import ProductReviews from "../components/ProductReviews";
import toast from "react-hot-toast";
import { getImageUrl } from "../utils/imageUrl";

export default function ProductDetail() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct: product, status, relatedProducts, relatedStatus } = useSelector((state) => state.products);
  const [activeImg, setActiveImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  useEffect(() => {
    if (slug) {
      dispatch(fetchProductById(slug));
    }
  }, [slug, dispatch]);

  // Tải danh sách sản phẩm tương tự khi có thông tin sản phẩm
  useEffect(() => {
    if (product?._id || product?.id) {
      dispatch(fetchRelatedProducts({
        category: product.category,
        brand: product.brand,
        currentProductId: product._id || product.id,
        limit: 8
      }));
    }
  }, [product?._id, product?.id, product?.category, product?.brand, dispatch]);

  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center text-white">Đang tải...</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center text-white">Không tìm thấy sản phẩm</div>;
  }

  // Mock images if product doesn't have multiple
  // Xử lý cả trường hợp images là array of objects hoặc array of strings
  const images = product.images?.length 
    ? product.images.map(img => typeof img === 'object' ? img.url : img) 
    : [product.image];

  const handleAddToCart = () => {
    if (quantity < 1) {
      toast.error("Số lượng phải lớn hơn 0");
      return;
    }
    if (product.stock && quantity > product.stock) {
      toast.error(`Chỉ còn ${product.stock} sản phẩm trong kho`);
      return;
    }
    dispatch(addToCart({ ...product, quantity }));
    toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
  };

  const handleQuantityChange = (value) => {
    const numValue = parseInt(value) || 1;
    if (numValue < 1) {
      setQuantity(1);
      return;
    }
    if (product.stock && numValue > product.stock) {
      setQuantity(product.stock);
      toast.error(`Chỉ còn ${product.stock} sản phẩm trong kho`);
      return;
    }
    setQuantity(numValue);
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncreaseQuantity = () => {
    const maxQuantity = product.stock || 999;
    if (quantity < maxQuantity) {
      setQuantity(quantity + 1);
    } else {
      toast.error(`Chỉ còn ${maxQuantity} sản phẩm trong kho`);
    }
  };

  const handlePrevImage = () => {
    setActiveImg((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImg((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pt-24 pb-32 text-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* LEFT: IMAGES */}
        <div>
          <div className="space-y-3">
            <div className="aspect-video bg-white rounded-2xl overflow-hidden border border-neutral-800 flex items-center justify-center">
              <img 
                src={getImageUrl(images[activeImg])} 
                alt={product.name} 
                className="w-full h-full object-contain"
              />
            </div>
            {images.length > 1 && (
              <div className="relative">
                {/* Nút Previous */}
                <button
                  onClick={handlePrevImage}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-all"
                  aria-label="Previous image"
                >
                  <LuChevronLeft size={20} />
                </button>

                {/* Thumbnails */}
                <div className="flex gap-3 overflow-hidden px-10">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImg(index)}
                      className={`w-20 h-20 rounded-lg border-2 overflow-hidden shrink-0 transition-all ${
                        activeImg === index ? "border-indigo-500" : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>

                {/* Nút Next */}
                <button
                  onClick={handleNextImage}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-all"
                  aria-label="Next image"
                >
                  <LuChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: INFO */}
        <div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl font-bold text-indigo-400">
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

            {/* POLICIES */}
            <div className="space-y-3 mb-6">
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

            {/* SỐ LƯỢNG VÀ BUTTON THÊM GIỎ */}
            <div className="space-y-3 mb-6">
              {/* Hiển thị tồn kho */}
              {product.stock && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-neutral-400">Tồn kho:</span>
                  <span className={`font-semibold ${product.stock > 10 ? 'text-green-500' : 'text-yellow-500'}`}>
                    {product.stock} sản phẩm
                  </span>
                </div>
              )}

              {/* Chọn số lượng và Button thêm giỏ cùng 1 hàng */}
              <div className="flex items-center gap-4">
                {/* Chọn số lượng */}
                <div className="flex items-center">
                  {/* <span className="text-sm text-neutral-400 mr-3">Số lượng:</span> */}
                  <div className="flex items-center border-2 border-neutral-700 rounded-xl overflow-hidden bg-neutral-900 hover:border-indigo-500/50 transition-colors">
                    <button
                      onClick={handleDecreaseQuantity}
                      disabled={quantity <= 1}
                      className="px-4 py-3 text-white hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors active:scale-95"
                      aria-label="Giảm số lượng"
                    >
                      <LuMinus size={18} />
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.stock || 999}
                      value={quantity}
                      onChange={(e) => handleQuantityChange(e.target.value)}
                      className="w-16 text-center bg-transparent text-white font-bold text-lg py-3 border-x-2 border-neutral-700 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      onClick={handleIncreaseQuantity}
                      disabled={product.stock ? quantity >= product.stock : false}
                      className="px-4 py-3 text-white hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors active:scale-95"
                      aria-label="Tăng số lượng"
                    >
                      <LuPlus size={18} />
                    </button>
                  </div>
                </div>

                {/* Button thêm vào giỏ hàng */}
                <button 
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-700 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <LuShoppingCart size={20} /> 
                  {product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* MÔ TÁ & THÔNG SỐ KỸ THUẬT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16 items-start">
        {/* Cột 1: Mô tả chi tiết */}
        <div className="bg-[#151515] border border-neutral-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4">Mô tả sản phẩm</h2>
          <div className="relative">
            <div 
              className={`text-neutral-300 leading-relaxed whitespace-pre-line overflow-hidden transition-all duration-300 ${
                isDescriptionExpanded ? 'max-h-none' : 'max-h-[400px]'
              }`}
            >
              {product.description || "Mô tả đang cập nhật..."}
            </div>
            
            {/* Gradient overlay khi rút gọn */}
            {!isDescriptionExpanded && product.description && product.description.length > 500 && (
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#151515] to-transparent pointer-events-none" />
            )}
          </div>
          
          {/* Button Xem thêm / Thu gọn */}
          {product.description && product.description.length > 500 && (
            <button
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="mt-4 text-indigo-400 hover:text-indigo-300 font-medium text-sm flex items-center gap-1 transition-colors"
            >
              {isDescriptionExpanded ? (
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

        {/* Cột 2: Thông số kỹ thuật */}
        <div className="sticky top-24 self-start">
          <TechnicalSpecs product={product} />
        </div>
      </div>

      {/* ĐÁNH GIÁ SẢN PHẨM */}
      <div className="mt-16">
        <ProductReviews productId={product._id || product.id} />
      </div>

      {/* CÓ THỂ BẠN CŨNG THÍCH */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className="mt-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Có thể bạn cũng thích</h2>
           
          </div>
          
          {relatedStatus === 'loading' ? (
            <div className="text-center py-12 text-neutral-400">
              Đang tải sản phẩm tương tự...
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct._id || relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
