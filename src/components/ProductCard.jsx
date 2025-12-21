import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import { LuHeart, LuShoppingCart, LuCpu, LuHardDrive, LuMonitor } from "react-icons/lu";
import { FaMemory } from "react-icons/fa";
import toast from "react-hot-toast";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation if inside a Link
    dispatch(addToCart({ ...product, quantity: 1 }));
    toast.success("Đã thêm vào giỏ hàng!");
  };

  return (
    <div className="bg-[#151515] border border-neutral-800 rounded-xl overflow-hidden hover:border-indigo-500/50 transition-all group flex flex-col h-full relative">
      {/* Image Area */}
      <div className="relative aspect-[4/3] bg-neutral-900 overflow-hidden">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        
        {/* Tags */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 pointer-events-none">
          {product.tags?.map((tag, index) => (
            <span key={index} className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>

        {/* Wishlist Button */}
        <button className="absolute top-2 right-2 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-red-500/80 transition-colors z-10">
          <LuHeart size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-white font-medium line-clamp-2 mb-2 h-12 hover:text-indigo-500 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Specs */}
        <div className="flex flex-wrap gap-2 mb-4 text-xs text-neutral-400">
          {product.specs?.cpu && (
            <div className="flex items-center gap-1 bg-neutral-800/50 px-2 py-1 rounded">
              <LuCpu size={12} /> {product.specs.cpu}
            </div>
          )}
          {product.specs?.ram && (
            <div className="flex items-center gap-1 bg-neutral-800/50 px-2 py-1 rounded">
              <FaMemory size={12} /> {product.specs.ram}
            </div>
          )}
          {product.specs?.screen && (
            <div className="flex items-center gap-1 bg-neutral-800/50 px-2 py-1 rounded">
              <LuMonitor size={12} /> {product.specs.screen}
            </div>
          )}
        </div>

        {/* Price & Action */}
        <div className="mt-auto flex items-center justify-between">
          <div>
            <p className="text-indigo-400 font-bold text-lg">
              {product.price?.toLocaleString('vi-VN')}đ
            </p>
            {product.oldPrice && (
              <p className="text-neutral-500 text-xs line-through">
                {product.oldPrice?.toLocaleString('vi-VN')}đ
              </p>
            )}
          </div>
          
          <button 
            onClick={handleAddToCart}
            className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
          >
            <LuShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}