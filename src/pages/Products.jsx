import React from "react";
import { useSearchParams } from "react-router-dom";
import CategoryTabs from "../components/CategoryTabs";

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

      {/* CURRENT SELECTED CATEGORY */}
      <p className="mt-6 text-xl">
        Đang xem:{" "}
        <span className="text-indigo-400 font-semibold">
          {selectedCategory}
        </span>
      </p>

      {/* PRODUCT GRID (sau này fetch API sẽ để đây) */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* demo product */}
        <div className="bg-[#151515] rounded-xl p-4 border border-neutral-800">
          <p className="text-neutral-300">Demo product</p>
        </div>
      </div>
    </div>
  );
}
