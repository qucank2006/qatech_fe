import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";
import { LuX } from "react-icons/lu";
import CategoryTabs from "../components/CategoryTabs";
import ProductCard from "../components/ProductCard";
import LaptopSections from "../components/LaptopSections";
import PartsSections from "../components/PartsSections";
import MonitorSections from "../components/MonitorSections";
import BuildPC from "../components/BuildPC";

/**
 * Trang danh sách sản phẩm (Products Page)
 * Hiển thị sản phẩm theo danh mục với bộ lọc và tìm kiếm
 */
export default function Products() {
  const [params, setParams] = useSearchParams();
  const dispatch = useDispatch();
  const { items: products, status } = useSelector((state) => state.products);

  // Lấy các tham số lọc từ URL
  const selectedCategory = params.get("category") || "laptop";
  const selectedBrand = params.get("brand");
  const selectedUsage = params.get("usage");
  const selectedType = params.get("type"); // Loại linh kiện (CPU, RAM, GPU, etc.)
  const searchQuery = params.get("search") || "";

  // Tải danh sách sản phẩm khi component mount
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  // Xử lý thay đổi danh mục
  const handleCategoryChange = (cat) => {
    // Giữ lại search query khi chuyển category
    const newParams = { category: cat };
    if (searchQuery) {
      newParams.search = searchQuery;
    }
    setParams(newParams);
  };

  // Xóa search query
  const handleClearSearch = () => {
    const newParams = {};
    if (selectedCategory && selectedCategory !== 'laptop') {
      newParams.category = selectedCategory;
    }
    setParams(newParams);
  };

  // Lọc sản phẩm theo danh mục, thương hiệu, nhu cầu sử dụng, tìm kiếm
  const filteredProducts = products.filter(product => {
    // Lọc theo từ khóa tìm kiếm trước
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchName = product.name?.toLowerCase().includes(query);
      const matchBrand = product.brand?.toLowerCase().includes(query);
      const matchCategory = product.category?.toLowerCase().includes(query);
      const matchDescription = product.description?.toLowerCase().includes(query);
      
      if (!matchName && !matchBrand && !matchCategory && !matchDescription) {
        return false;
      }
    }

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

    // Lọc theo loại sản phẩm (cho linh kiện)
    if (selectedType) {
      const productType = product.type?.toLowerCase() || product.subCategory?.toLowerCase() || "";
      if (!productType.includes(selectedType.toLowerCase())) {
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

      {/* Banner kết quả tìm kiếm */}
      {searchQuery && (
        <div className="mb-6 p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-white font-medium">
              Kết quả tìm kiếm cho: <span className="text-indigo-400">"{searchQuery}"</span>
            </p>
            <p className="text-sm text-neutral-400 mt-1">
              Tìm thấy {filteredProducts.length} sản phẩm
            </p>
          </div>
          <button
            onClick={handleClearSearch}
            className="p-2 hover:bg-indigo-500/20 rounded-lg transition-colors text-indigo-400 hover:text-indigo-300"
            aria-label="Xóa tìm kiếm"
          >
            <LuX size={20} />
          </button>
        </div>
      )}

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

      {/* Bộ lọc linh kiện theo thương hiệu và loại sản phẩm */}
      {selectedCategory === 'parts' && (
        <div>
          <PartsSections />
        </div>
      )}

      {/* Bộ lọc màn hình theo thương hiệu */}
      {selectedCategory === 'monitor' && (
        <div>
          <MonitorSections />
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
              filteredProducts.map((product) => (
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
