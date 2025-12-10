import React from "react";
import { useSearchParams } from "react-router-dom";
import CategoryTabs from "../components/CategoryTabs";
import LaptopSections from "../components/LaptopSections";
import ProductFilters from "../components/ProductFilters";
import ProductCard from "../components/ProductCard";

// Mock Data (Tượng trưng)
const mockProducts = [
  {
    id: 1,
    name: "MacBook Pro 14 M3 8CPU 10GPU 8GB 512GB",
    price: 39990000,
    oldPrice: 42990000,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop",
    specs: { cpu: "M3", ram: "8GB", ssd: "512GB", screen: "14.2\"" },
    tags: ["Mới", "Giảm 3%"]
  },
  {
    id: 2,
    name: "Asus ROG Zephyrus G14 Ryzen 9 7940HS RTX 4060",
    price: 45990000,
    oldPrice: 49990000,
    image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=1000&auto=format&fit=crop",
    specs: { cpu: "R9 7940HS", ram: "16GB", ssd: "1TB", screen: "14\" 165Hz" },
    tags: ["Gaming", "Hot"]
  },
  {
    id: 3,
    name: "Dell XPS 13 Plus i7 1360P 16GB 512GB OLED",
    price: 52990000,
    oldPrice: 55990000,
    image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?q=80&w=1000&auto=format&fit=crop",
    specs: { cpu: "i7 1360P", ram: "16GB", ssd: "512GB", screen: "13.4\" OLED" },
    tags: ["Sang trọng"]
  },
  {
    id: 4,
    name: "Lenovo Legion 5 Pro i7 13700HX RTX 4060",
    price: 38990000,
    oldPrice: 41990000,
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=1000&auto=format&fit=crop",
    specs: { cpu: "i7 13700HX", ram: "16GB", ssd: "512GB", screen: "16\" 2K" },
    tags: ["Best Seller"]
  },
  {
    id: 5,
    name: "HP Spectre x360 14 i7 1355U 16GB 1TB",
    price: 42990000,
    oldPrice: 46990000,
    image: "https://images.unsplash.com/photo-1544731612-de7f96afe55f?q=80&w=1000&auto=format&fit=crop",
    specs: { cpu: "i7 1355U", ram: "16GB", ssd: "1TB", screen: "13.5\" Touch" },
    tags: ["2-in-1"]
  },
  {
    id: 6,
    name: "MSI Raider GE78 HX i9 13980HX RTX 4080",
    price: 89990000,
    oldPrice: 95990000,
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1000&auto=format&fit=crop",
    specs: { cpu: "i9 13980HX", ram: "32GB", ssd: "2TB", screen: "17\" 240Hz" },
    tags: ["Khủng long"]
  },
  {
    id: 7,
    name: "Acer Swift Go 14 i5 13500H 16GB 512GB",
    price: 19990000,
    oldPrice: 22990000,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1000&auto=format&fit=crop",
    specs: { cpu: "i5 13500H", ram: "16GB", ssd: "512GB", screen: "14\" OLED" },
    tags: ["Giá tốt"]
  },
  {
    id: 8,
    name: "LG Gram 2023 i7 1360P 16GB 512GB",
    price: 35990000,
    oldPrice: 39990000,
    image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=1000&auto=format&fit=crop",
    specs: { cpu: "i7 1360P", ram: "16GB", ssd: "512GB", screen: "16\"" },
    tags: ["Siêu nhẹ"]
  }
];

export default function Products() {
  const [params, setParams] = useSearchParams();

  // category hiện tại
  const selectedCategory = params.get("category") || "laptop";

  const handleCategoryChange = (cat) => {
    setParams({ category: cat });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pt-20 pb-32 text-white">

      {/* TITLE */}
      <h1 className="text-4xl font-bold mb-8">Sản phẩm</h1>

      {/* CATEGORY TABS */}
      <CategoryTabs
        selected={selectedCategory}
        onChange={handleCategoryChange}
      />


      {/* LAPTOP SPECIFIC SECTIONS */}
      {selectedCategory === "laptop" && <LaptopSections />}

      {/* FILTERS */}
      <div className="mt-8 mb-6">
        <ProductFilters />
      </div>

      {/* PRODUCT GRID */}
      <div className="mt-10">
        {selectedCategory === "laptop" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {mockProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#151515] rounded-xl border border-neutral-800">
            <p className="text-neutral-400 text-lg">Sản phẩm thuộc danh mục này đang được cập nhật...</p>
          </div>
        )}
      </div>
    </div>
  );
}
