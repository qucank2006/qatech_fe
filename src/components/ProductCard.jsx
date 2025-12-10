import React from "react";
import { Link } from "react-router-dom";
import { LuHeart, LuShoppingCart, LuCpu, LuHardDrive, LuMonitor } from "react-icons/lu";
import { FaMemory } from "react-icons/fa";

export default function ProductCard({ product }) {
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
          <div className="flex items-center gap-1 bg-neutral-800/50 px-2 py-1 rounded">
            <LuCpu size={12} /> {product.specs.cpu}
          </div>
          <div className="flex items-center gap-1 bg-neutral-800/50 px-2 py-1 rounded">
            <FaMemory size={12} /> {product.specs.ram}
          </div>
          <div className="flex items-center gap-1 bg-neutral-800/50 px-2 py-1 rounded">
            <LuHardDrive size={12} /> {product.specs.ssd}
          </div>
          <div className="flex items-center gap-1 bg-neutral-800/50 px-2 py-1 rounded">
            <LuMonitor size={12} /> {product.specs.screen}
          </div>
        </div>

        {/* Price */}
        <div className="mt-auto">
          <div className="flex items-end gap-2 mb-1">
            <span className="text-indigo-500 font-bold text-lg">
              {product.price.toLocaleString('vi-VN')}đ
            </span>
            {product.oldPrice && (
              <span className="text-neutral-500 text-sm line-through mb-1">
                {product.oldPrice.toLocaleString('vi-VN')}đ
              </span>
            )}
          </div>
          
          {/* Action */}
          <button className="w-full mt-3 bg-neutral-800 hover:bg-indigo-600 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
            <LuShoppingCart size={16} />
            Thêm vào giỏ
          </button>
        </div>
      </div>
    </div>
  );
}
