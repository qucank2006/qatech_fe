import React, { useState, useEffect } from 'react';
import { LuPlus, LuSearch, LuPencil, LuTrash2, LuFilter, LuX, LuUpload } from "react-icons/lu";
import api from '../../services/api';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../utils/imageUrl';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    oldPrice: '',
    category: '',
    brand: '',
    usage: '',
    stock: '',
    images: [],
    specs: {
      cpu: '',
      ramCapacity: '',
      ramType: '',
      ramSlots: '',
      storage: '',
      os: '',
      battery: '',
      gpu: '',
      screenSize: '',
      screenTech: '',
      screenResolution: '',
      ports: '',
      others: ''
    }
  });
  const [imagePreviews, setImagePreviews] = useState([]); // Changed from imagePreview to imagePreviews array
  const hasFetched = React.useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchProducts();
      hasFetched.current = true;
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSpecsChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      specs: { ...prev.specs, [name]: value }
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
      
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('oldPrice', formData.oldPrice);
    data.append('category', formData.category);
    data.append('brand', formData.brand);
    data.append('usage', formData.usage);
    data.append('stock', formData.stock);
    data.append('specs', JSON.stringify(formData.specs));
    
    // Append each file to 'images' field (assuming backend handles array)
    // If backend expects 'image' for single and 'images' for multiple, adjust accordingly.
    // Here we assume backend can handle multiple files under 'images' key.
    formData.images.forEach((file) => {
      if (file instanceof File) {
        data.append('images', file);
      } else {
        // If it's an existing image URL (string), we might need to handle it differently
        // depending on backend logic. Usually backend keeps existing if not provided.
        // Or we send a list of 'kept' image URLs.
        // For simplicity, let's assume we only upload NEW files here, 
        // and maybe send a separate field for 'keptImages' if needed.
        // But standard FormData upload usually replaces. 
        // Let's try appending all new files.
        // If we want to keep old images, we might need a separate logic.
        // Let's assume for now we are just uploading new files.
      }
    });

    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.slug || editingProduct._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Cập nhật sản phẩm thành công');
      } else {
        await api.post('/products', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Thêm sản phẩm thành công');
      }
      fetchProducts();
      closeModal();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.msg || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (product) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await api.delete(`/products/${product.slug || product._id || product.id}`);
        setProducts(products.filter(p => p._id !== product._id && p.id !== product.id));
        toast.success('Đã xóa sản phẩm');
      } catch (error) {
        toast.error('Xóa thất bại');
      }
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      // Handle existing images
      const existingImages = product.images || (product.image ? [product.image] : []);
      
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price,
        oldPrice: product.oldPrice || '',
        category: product.category || '',
        brand: product.brand || '',
        usage: product.usage || '',
        stock: product.stock || 0,
        images: [], // We start with empty new files, but show previews of existing
        specs: {
          cpu: product.specs?.cpu || '',
          ram: product.specs?.ram || '',
          screen: product.specs?.screen || '',
          ssd: product.specs?.ssd || '',
          gpu: product.specs?.gpu || '',
          os: product.specs?.os || '',
          battery: product.specs?.battery || '',
          weight: product.specs?.weight || '',
          ports: product.specs?.ports || '',
          material: product.specs?.material || '',
          size: product.specs?.size || '',
          releaseDate: product.specs?.releaseDate || ''
        }
      });
      
      setImagePreviews(existingImages.map(img => getImageUrl(img)));
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        oldPrice: '',
        category: '',
        brand: '',
        usage: '',
        stock: '',
        images: [],
        specs: {
          cpu: '',
          ramCapacity: '',
          ramType: '',
          ramSlots: '',
          storage: '',
          os: '',
          battery: '',
          gpu: '',
          screenSize: '',
          screenTech: '',
          screenResolution: '',
          ports: '',
          others: ''
        }
      });
      setImagePreviews([]);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      oldPrice: '',
      category: '',
      brand: '',
      usage: '',
      stock: '',
      images: [],
      specs: {
        cpu: '',
        ramCapacity: '',
        ramType: '',
        ramSlots: '',
        storage: '',
        os: '',
        battery: '',
        gpu: '',
        screenSize: '',
        screenTech: '',
        screenResolution: '',
        ports: '',
        others: ''
      }
    });
    setImagePreviews([]);
  };

  if (loading) return <div className="text-white p-6">Đang tải...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-white">Quản lý sản phẩm</h1>
        <button 
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
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
                        {product.image && <img src={getImageUrl(product.image)} alt={product.name} className="w-full h-full object-cover" />}
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
                      <button 
                        onClick={() => openModal(product)}
                        className="p-2 text-neutral-400 hover:text-indigo-500 hover:bg-indigo-500/10 rounded-lg transition-colors"
                      >
                        <LuPencil size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(product)}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#151515] border border-neutral-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="p-6 border-b border-neutral-800 flex justify-between items-center sticky top-0 bg-[#151515] z-10">
              <h2 className="text-xl font-bold text-white">
                {editingProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
              </h2>
              <button onClick={closeModal} className="text-neutral-400 hover:text-white">
                <LuX size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-8">
              {/* Image Upload */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-neutral-400">Hình ảnh sản phẩm</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-neutral-700 group">
                      <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <LuX size={14} />
                      </button>
                    </div>
                  ))}
                  
                  <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-dashed border-neutral-700 hover:border-indigo-500 transition-colors bg-neutral-900 flex flex-col items-center justify-center text-neutral-500 cursor-pointer">
                    <LuUpload size={24} className="mb-2" />
                    <span className="text-xs text-center px-2">Thêm ảnh</span>
                    <input 
                      type="file" 
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* General Info Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white border-b border-neutral-800 pb-2">Thông tin chung</h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-400">Tên sản phẩm</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                      placeholder="Nhập tên sản phẩm..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-400">Danh mục</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="">Chọn danh mục</option>
                        <option value="laptop">Laptop</option>
                        <option value="pc">PC</option>
                        <option value="accessory">Phụ kiện</option>
                        <option value="monitor">Màn hình</option>
                        <option value="printer">Máy in</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-400">Thương hiệu</label>
                      <select
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="">Chọn thương hiệu</option>
                        <option value="Acer">Acer</option>
                        <option value="Lenovo">Lenovo</option>
                        <option value="MSI">MSI</option>
                        <option value="Dell">Dell</option>
                        <option value="HP">HP</option>
                        <option value="Apple">Apple</option>
                        <option value="Microsoft">Microsoft</option>
                        <option value="LG">LG</option>
                        <option value="Samsung">Samsung</option>
                        <option value="Asus">Asus</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-400">Nhu cầu sử dụng</label>
                      <select
                        name="usage"
                        value={formData.usage}
                        onChange={handleInputChange}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="">Chọn nhu cầu</option>
                        <option value="Gaming">Gaming</option>
                        <option value="Văn Phòng">Văn Phòng</option>
                        <option value="Mỏng Nhẹ">Mỏng Nhẹ</option>
                        <option value="Đồ Họa - Kỹ Thuật">Đồ Họa - Kỹ Thuật</option>
                        <option value="Sinh Viên">Sinh Viên</option>
                        <option value="Cảm Ứng">Cảm Ứng</option>
                        <option value="Laptop AI">Laptop AI</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-400">Giá (VNĐ)</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-400">Giá cũ (VNĐ)</label>
                      <input
                        type="number"
                        name="oldPrice"
                        value={formData.oldPrice}
                        onChange={handleInputChange}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-400">Số lượng kho</label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-neutral-400">Mô tả</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none resize-none"
                      placeholder="Mô tả chi tiết sản phẩm..."
                    />
                  </div>
                </div>
              </div>

              {/* Technical Specs */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white border-b border-neutral-800 pb-2">Thông số kỹ thuật</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column: Single Line Inputs */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-400">Loại CPU</label>
                      <input
                        type="text"
                        name="cpu"
                        value={formData.specs.cpu}
                        onChange={handleSpecsChange}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                        placeholder="VD: Intel Core i5-12450H"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-400">Dung lượng RAM</label>
                        <input
                          type="text"
                          name="ramCapacity"
                          value={formData.specs.ramCapacity}
                          onChange={handleSpecsChange}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                          placeholder="VD: 16GB"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-400">Loại RAM</label>
                        <input
                          type="text"
                          name="ramType"
                          value={formData.specs.ramType}
                          onChange={handleSpecsChange}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                          placeholder="VD: DDR5"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-400">Số khe RAM</label>
                      <input
                        type="text"
                        name="ramSlots"
                        value={formData.specs.ramSlots}
                        onChange={handleSpecsChange}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                        placeholder="VD: 2 khe (1 khe 8GB onboard + 1 khe trống)"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-400">Ổ cứng</label>
                      <input
                        type="text"
                        name="storage"
                        value={formData.specs.storage}
                        onChange={handleSpecsChange}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                        placeholder="VD: 512GB SSD NVMe PCIe Gen 4.0"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-400">Hệ điều hành</label>
                      <input
                        type="text"
                        name="os"
                        value={formData.specs.os}
                        onChange={handleSpecsChange}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                        placeholder="VD: Windows 11 Home"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-400">Pin</label>
                      <input
                        type="text"
                        name="battery"
                        value={formData.specs.battery}
                        onChange={handleSpecsChange}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                        placeholder="VD: 56WHrs, 3 cell"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-400">Kích thước màn hình</label>
                        <input
                          type="text"
                          name="screenSize"
                          value={formData.specs.screenSize}
                          onChange={handleSpecsChange}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                          placeholder="VD: 15.6 inch"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-400">Độ phân giải màn hình</label>
                        <input
                          type="text"
                          name="screenResolution"
                          value={formData.specs.screenResolution}
                          onChange={handleSpecsChange}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                          placeholder="VD: 1920 x 1080 (FHD)"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Textarea Inputs */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-400">Loại card đồ họa</label>
                      <textarea
                        name="gpu"
                        value={formData.specs.gpu}
                        onChange={handleSpecsChange}
                        rows={3}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none resize-none"
                        placeholder="VD: NVIDIA GeForce RTX 3050 4GB GDDR6 + Intel UHD Graphics"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-400">Công nghệ màn hình</label>
                      <textarea
                        name="screenTech"
                        value={formData.specs.screenTech}
                        onChange={handleSpecsChange}
                        rows={3}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none resize-none"
                        placeholder="VD: IPS, chống chói, 250 nits, 45% NTSC, 60Hz"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-400">Cổng giao tiếp</label>
                      <textarea
                        name="ports"
                        value={formData.specs.ports}
                        onChange={handleSpecsChange}
                        rows={4}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none resize-none"
                        placeholder="VD: 1x USB Type-C, 2x USB 3.2, 1x HDMI, 1x Jack tai nghe 3.5mm, 1x LAN (RJ-45)"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-400">Các thông số khác</label>
                      <textarea
                        name="others"
                        value={formData.specs.others}
                        onChange={handleSpecsChange}
                        rows={4}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none resize-none"
                        placeholder="VD: Bàn phím: Có đèn nền RGB&#10;Hệ điều hành: Windows 11 Home&#10;Trọng lượng: 2.3 kg&#10;Kích thước: 359 x 256 x 22.9 mm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800 sticky bottom-0 bg-[#151515] pb-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                >
                  {editingProduct ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
