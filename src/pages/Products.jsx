import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";
import CategoryTabs from "../components/CategoryTabs";
import ProductCard from "../components/ProductCard";
import LaptopSections from "../components/LaptopSections";
import BuildPC from "../components/BuildPC";

/**
 * Trang danh sách sản phẩm (Products Page)
 * Hiển thị sản phẩm theo danh mục với bộ lọc
 */
export default function Products() {
  const [params, setParams] = useSearchParams();
  const dispatch = useDispatch();
  const { items: products, status } = useSelector((state) => state.products);

  // Lấy các tham số lọc từ URL
  const selectedCategory = params.get("category") || "laptop";
  const selectedBrand = params.get("brand");
  const selectedUsage = params.get("usage");

  // Tải danh sách sản phẩm khi component mount
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  // Xử lý thay đổi danh mục
  const handleCategoryChange = (cat) => {
    setParams({ category: cat });
  };

  // Lọc sản phẩm theo danh mục, thương hiệu, nhu cầu sử dụng
  const filteredProducts = products.filter(product => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'build') return false;
    
    // Map các ID tab sang giá trị category trong database
    const productCat = product.category?.toLowerCase();
    let categoryMatch = false;

    if (selectedCategory === 'parts') {
      categoryMatch = productCat === 'accessory' || productCat === 'parts' || productCat === 'linh kien';
    } else {
      categoryMatch = productCat === selectedCategory.toLowerCase();
    }

    if (!categoryMatch) return false;

    // Lọc theo thương hiệu nếu được chọn
    if (selectedBrand) {
      if (product.brand?.toLowerCase() !== selectedBrand.toLowerCase()) {
        return false;
      }
    }

    // Lọc theo nhu cầu sử dụng nếu được chọn
    if (selectedUsage) {
      const productUsage = product.usage?.toLowerCase() || "";
      if (!productUsage.includes(selectedUsage.toLowerCase())) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 pt-20 pb-32 text-white">

      {/* Tiêu đề trang */}
      <div>
        <h1 className="text-4xl font-bold mb-8">Sản phẩm</h1>
      </div>

      {/* Tab chọn danh mục */}
      <div>
        <CategoryTabs
          selected={selectedCategory}
          onChange={handleCategoryChange}
        />
      </div>

      
      {/* Bộ lọc laptop theo thương hiệu và nhu cầu */}
      {selectedCategory === 'laptop' && (
        <div>
          <LaptopSections />
        </div>
      )}

      {/* Khu vực hiển thị nội dung sản phẩm */}
      <div className="mt-10">
        {selectedCategory === 'build' ? (
          <BuildPC />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {status === 'loading' ? (
              <p className="text-neutral-400 col-span-full text-center">Đang tải sản phẩm...</p>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <ProductCard key={product.id || product._id} product={product} />
              ))
            ) : (
              <p className="text-neutral-400 col-span-full text-center">Không tìm thấy sản phẩm nào trong danh mục này.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
