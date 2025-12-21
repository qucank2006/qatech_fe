import React, { useState, useEffect } from 'react';
import { LuPlus, LuSearch, LuPencil, LuTrash2, LuFilter } from "react-icons/lu";
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = React.useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchProducts();
      hasFetched.current = true;
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products'); // Or /admin/products
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await api.delete(`/products/${id}`);
        setProducts(products.filter(p => p._id !== id)); // Assuming _id
        toast.success('Đã xóa sản phẩm');
      } catch (error) {
        toast.error('Xóa thất bại');
      }
    }
  };

  if (loading) return <div className="text-white p-6">Đang tải...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-white">Quản lý sản phẩm</h1>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors">
          <LuPlus size={20} />
          <span>Thêm sản phẩm</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-[#151515] border border-neutral-800 rounded-xl p-4 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
          <input 
            type="text" 
            placeholder="Tìm kiếm sản phẩm..." 
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 text-white px-4 py-2 rounded-lg hover:bg-neutral-800">
            <LuFilter size={20} />
            <span>Bộ lọc</span>
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#151515] border border-neutral-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-neutral-900 text-neutral-400 text-sm uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Sản phẩm</th>
                <th className="px-6 py-4 font-medium">Danh mục</th>
                <th className="px-6 py-4 font-medium">Giá</th>
                <th className="px-6 py-4 font-medium">Kho</th>
                <th className="px-6 py-4 font-medium">Trạng thái</th>
                <th className="px-6 py-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {products.map((product) => (
                <tr key={product._id || product.id} className="hover:bg-neutral-900/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-neutral-800 rounded-lg overflow-hidden">
                        {product.image && <img src={product.image} alt={product.name} className="w-full h-full object-cover" />}
                      </div>
                      <span className="text-white font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-neutral-400">{product.category}</td>
                  <td className="px-6 py-4 text-white">{product.price?.toLocaleString()}₫</td>
                  <td className="px-6 py-4 text-neutral-400">{product.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium
                      ${product.stock > 10 ? 'bg-green-500/10 text-green-500' : 
                        product.stock > 0 ? 'bg-yellow-500/10 text-yellow-500' : 
                        'bg-red-500/10 text-red-500'}`}>
                      {product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-neutral-400 hover:text-indigo-500 hover:bg-indigo-500/10 rounded-lg transition-colors">
                        <LuPencil size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product._id || product.id)}
                        className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <LuTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
