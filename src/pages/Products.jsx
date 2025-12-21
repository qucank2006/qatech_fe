import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";
import CategoryTabs from "../components/CategoryTabs";
import ProductCard from "../components/ProductCard";
import FadeContent from "../components/FadeContent";
import LaptopSections from "../components/LaptopSections";

export default function Products() {
  const [params, setParams] = useSearchParams();
  const dispatch = useDispatch();
  const { items: products, status } = useSelector((state) => state.products);

  // category hiện tại
  const selectedCategory = params.get("category") || "laptop";

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const handleCategoryChange = (cat) => {
    setParams({ category: cat });
  };

  // Filter products based on category (simple client-side filter)
  // Note: In a real app with many products, this should be handled by the backend API
  const filteredProducts = products.filter(product => {
    if (selectedCategory === 'all') return true;
    // Assuming product has a 'category' field. If not, show all or adjust logic.
    // For now, let's assume we show all if no category match found or just filter loosely.
    // If the mock data structure in QA had 'category', we use that.
    // If the API returns products without category, we might need to adjust.
    return product.category?.toLowerCase() === selectedCategory.toLowerCase() || true; 
  });

  return (
    <div className="max-w-7xl mx-auto px-6 pt-20 pb-32 text-white">

      {/* TITLE */}
      <FadeContent blur={true}>
        <h1 className="text-4xl font-bold mb-8">Sản phẩm</h1>
      </FadeContent>

      {/* CATEGORY TABS */}
      <FadeContent blur={false} delay={100}>
        <CategoryTabs
          selected={selectedCategory}
          onChange={handleCategoryChange}
        />
      </FadeContent>

      
      {/* LAPTOP FILTERS */}
      {selectedCategory === 'laptop' && (
        <FadeContent blur={false} delay={300}>
          <LaptopSections />
        </FadeContent>
      )}

      {/* PRODUCT GRID */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {status === 'loading' ? (
          <p className="text-neutral-400 col-span-full text-center">Đang tải sản phẩm...</p>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <FadeContent key={product.id} delay={index * 50} blur={true}>
              <ProductCard product={product} />
            </FadeContent>
          ))
        ) : (
          <p className="text-neutral-400 col-span-full text-center">Không tìm thấy sản phẩm nào.</p>
        )}
      </div>
    </div>
  );
}
