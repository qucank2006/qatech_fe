import React, { useState, useEffect } from 'react';
import { LuPlus, LuSearch, LuPencil, LuTrash2, LuFilter, LuX, LuUpload } from "react-icons/lu";
import api from '../../services/api';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../utils/imageUrl';
import { getSpecsFields } from '../../components/admin/SpecsFieldsConfig';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all'); // Category filter
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    oldPrice: '',
    category: '',
    subCategory: '',
    brand: '',
    usage: '',
    stock: '',
    images: [],
    specs: {} // Object động chứa thông số kỹ thuật
  });
  const [imagePreviews, setImagePreviews] = useState([]); // Array of {id, url, type: 'existing'|'new', data: file_or_url}
  const [nextId, setNextId] = useState(0); // Counter cho unique ID
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
      // Kiểm tra lỗi kết nối
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
        toast.error("Không thể kết nối đến server. Vui lòng kiểm tra backend server có đang chạy không.");
      } else {
        toast.error(error.response?.data?.msg || "Không thể tải danh sách sản phẩm");
      }
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
    setFormData(prev => {
      const updated = {
        ...prev,
        specs: {
          ...prev.specs || {},
          [name]: value
        }
      };
      return updated;
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Sử dụng functional update để tránh stale closure
      setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
      
      // Sử dụng functional update cho cả nextId và imagePreviews
      setNextId(prevId => {
        const startId = prevId;
        const newPreviews = files.map((file, idx) => ({
          id: startId + idx,
          url: URL.createObjectURL(file),
          type: 'new',
          file: file
        }));
        
        setImagePreviews(prev => {
          const updated = [...prev, ...newPreviews];
          return updated;
        });
        
        return startId + files.length;
      });
    }
    // Reset input để có thể chọn lại cùng file nếu cần
    e.target.value = '';
  };

  const removeImage = (id) => {
    const preview = imagePreviews.find(p => p.id === id);
    if (!preview) return;
    
    if (preview.type === 'new') {
      // Revoke blob URL để tránh memory leak
      if (preview.url && preview.url.startsWith('blob:')) {
        URL.revokeObjectURL(preview.url);
      }
      // Xóa file khỏi formData.images
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter(file => file !== preview.file)
      }));
    }
    // Với ảnh 'existing', chỉ cần xóa khỏi imagePreviews là đủ
    // Khi submit, hàm handleSubmit sẽ chỉ gửi những ảnh còn lại trong imagePreviews
    
    // Xóa khỏi preview list
    setImagePreviews(prev => prev.filter(p => p.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('oldPrice', formData.oldPrice);
    data.append('category', formData.category);
    data.append('subCategory', formData.subCategory || '');
    data.append('brand', formData.brand);
    data.append('usage', formData.usage);
    data.append('stock', formData.stock);
    
    // Gửi specs - từng field riêng lẻ (theo yêu cầu backend)
    const specsToSend = {};
    if (formData.specs && typeof formData.specs === 'object') {
      Object.keys(formData.specs).forEach(key => {
        const value = formData.specs[key];
        // Gửi tất cả giá trị, kể cả rỗng (backend sẽ quyết định xử lý)
        if (value !== undefined && value !== null) {
          // Convert value to string
          const stringValue = value.toString().trim();
          // Gửi ngay cả khi rỗng để backend biết field này đã được set
          data.append(key, stringValue);
          specsToSend[key] = stringValue;
        }
      });
    }
    
    // Gửi danh sách ảnh cũ cần giữ (khi edit)
    // Luôn gửi keptImages khi cập nhật để backend biết cần giữ ảnh nào
    let keptImageUrls = []; // Khai báo ở scope ngoài để có thể dùng trong debug
    let primaryImagePath = null; // Lưu path ảnh chính để debug
    if (editingProduct) {
      // Helper function để extract path tương đối từ full URL
      const extractImagePath = (url) => {
        if (!url || typeof url !== 'string') return null;
        
        // Nếu đã là path tương đối (không bắt đầu bằng http), trả về nguyên bản
        if (!url.startsWith('http')) {
          return url;
        }
        
        // Extract path từ full URL
        try {
          const urlObj = new URL(url);
          let path = urlObj.pathname;
          
          // Loại bỏ leading slash
          if (path.startsWith('/')) {
            path = path.slice(1);
          }
          
          // Nếu path bắt đầu bằng 'uploads/', giữ nguyên
          // Nếu không, có thể cần thêm 'uploads/' tùy backend
          return path;
        } catch (e) {
          // Nếu không parse được URL, thử extract thủ công
          const uploadsIndex = url.indexOf('/uploads/');
          if (uploadsIndex !== -1) {
            return url.substring(uploadsIndex + 1); // Bỏ '/'
          }
          
          // Fallback: trả về phần sau domain
          const parts = url.split('/');
          const uploadsIdx = parts.findIndex(p => p === 'uploads');
          if (uploadsIdx !== -1 && uploadsIdx < parts.length - 1) {
            return parts.slice(uploadsIdx).join('/');
          }
          
          return url; // Fallback: trả về nguyên bản nếu không extract được
        }
      };
      
      // Lấy tất cả ảnh existing từ imagePreviews
      const allKeptImages = imagePreviews
        .filter(p => p.type === 'existing' && p.originalUrl)
        .map(p => {
          const path = extractImagePath(p.originalUrl);
          return path;
        })
        .filter(url => url && typeof url === 'string' && url.trim() !== '');
      
      // Đảm bảo ảnh chính (primary image) luôn ở đầu tiên
      primaryImagePath = editingProduct.image 
        ? extractImagePath(editingProduct.image)
        : null;
      
      if (primaryImagePath) {
        // Loại bỏ ảnh chính khỏi mảng (nếu có) để tránh duplicate
        const otherImages = allKeptImages.filter(path => path !== primaryImagePath);
        // Đặt ảnh chính ở đầu tiên
        keptImageUrls = [primaryImagePath, ...otherImages];
      } else {
        // Nếu không có ảnh chính, giữ nguyên thứ tự
        keptImageUrls = allKeptImages;
      }
      
      // Fallback: Nếu không có ảnh nào trong imagePreviews nhưng editingProduct có ảnh,
      // thì giữ nguyên ảnh gốc (tránh mất ảnh do lỗi)
      if (keptImageUrls.length === 0 && imagePreviews.length === 0) {
        const fallbackImages = [];
        if (editingProduct.image && typeof editingProduct.image === 'string' && editingProduct.image.trim() !== '') {
          const path = extractImagePath(editingProduct.image);
          if (path) fallbackImages.push(path);
        }
        if (Array.isArray(editingProduct.images)) {
          editingProduct.images.forEach(img => {
            const imageUrl = typeof img === 'object' ? img.url : img;
            if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim() !== '') {
              const path = extractImagePath(imageUrl);
              if (path && !fallbackImages.includes(path)) {
                fallbackImages.push(path);
              }
            }
          });
        }
        if (fallbackImages.length > 0) {
          keptImageUrls = fallbackImages;
        }
      }
      
      // Luôn gửi keptImages, kể cả khi mảng rỗng (nếu người dùng xóa hết ảnh)
      data.append('keptImages', JSON.stringify(keptImageUrls));
      
      // Gửi thêm thông tin về ảnh chính để backend biết ảnh nào là primary
      if (primaryImagePath) {
        data.append('primaryImage', primaryImagePath);
        // Gửi thêm index của ảnh chính trong keptImages để backend dễ xác định
        const primaryImageIndex = keptImageUrls.findIndex(path => path === primaryImagePath);
        if (primaryImageIndex !== -1) {
          data.append('primaryImageIndex', primaryImageIndex.toString());
        }
      }
    }
    
    // Thêm hình ảnh mới
    const newImageFiles = [];
    formData.images.forEach((file) => {
      if (file instanceof File) {
        data.append('images', file);
        newImageFiles.push(file.name);
      }
    });

    // Debug: Log để kiểm tra
    if (editingProduct) {
      const totalImagesCount = keptImageUrls.length + newImageFiles.length;
      const primaryImageIndex = primaryImagePath ? keptImageUrls.findIndex(path => path === primaryImagePath) : -1;
    }

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
      toast.error(error.response?.data?.msg || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (product) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa "${product.name}"?`)) {
      try {
        const response = await api.delete(`/products/${product.slug || product._id || product.id}`);
        
        // Cập nhật state: filter ra sản phẩm đã xóa
        setProducts(prevProducts => 
          prevProducts.filter(p => {
            const productId = p._id || p.id;
            const deletedId = product._id || product.id;
            return productId !== deletedId;
          })
        );
        
        toast.success(response.data?.msg || 'Đã xóa sản phẩm thành công');
      } catch (error) {
        toast.error(error.response?.data?.msg || 'Xóa sản phẩm thất bại');
      }
    }
  };

  const openModal = async (product = null) => {
    if (product) {
      // Fetch đầy đủ thông tin sản phẩm bao gồm tất cả ảnh
      try {
        const res = await api.get(`/products/${product.slug || product._id}`);
        const fullProduct = res.data;
        
        setEditingProduct(fullProduct);
        
        // Lọc và validate images - chỉ lấy ảnh hợp lệ
        let existingImages = [];
        
        // Bước 1: Thêm ảnh chính từ product.image (nếu có) lên đầu
        if (fullProduct.image && typeof fullProduct.image === 'string' && fullProduct.image.trim() !== '') {
          const primaryUrl = getImageUrl(fullProduct.image);
          if (primaryUrl && primaryUrl !== 'null' && !primaryUrl.includes('null') && !primaryUrl.includes('undefined')) {
            existingImages.push(fullProduct.image);
          }
        }
        
        // Bước 2: Thêm các ảnh còn lại từ product.images (loại bỏ duplicate với ảnh chính)
        if (Array.isArray(fullProduct.images)) {
          const additionalImages = fullProduct.images
            .filter(img => {
              // Backend trả về object {url, isPrimary, alt} hoặc string
              const imageUrl = typeof img === 'object' ? img.url : img;
              
              if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
                return false;
              }
              
              // Loại bỏ ảnh trùng với ảnh chính
              if (imageUrl === fullProduct.image) {
                return false;
              }
              
              // Kiểm tra URL hợp lệ trước khi thêm vào
              const url = getImageUrl(imageUrl);
              const isValid = url && url !== 'null' && !url.includes('null') && !url.includes('undefined');
              return isValid;
            })
            .map(img => typeof img === 'object' ? img.url : img);
          
          existingImages = [...existingImages, ...additionalImages];
        }
        
        // Đảm bảo specs là object hợp lệ
        // Backend có thể trả về 'specs' hoặc 'specifications', ưu tiên 'specs' trước
        let productSpecs = fullProduct.specs || fullProduct.specifications;
        
        // Nếu cả hai đều null/undefined, để rỗng
        if (productSpecs === null || productSpecs === undefined) {
          productSpecs = {};
        }
        
        // Parse specs nếu là string
        if (typeof productSpecs === 'string') {
          try {
            productSpecs = JSON.parse(productSpecs);
          } catch (e) {
            productSpecs = {};
          }
        }
        
        // Kiểm tra nếu productSpecs là object rỗng (không có keys)
        const isValidSpecsObject = typeof productSpecs === 'object' && !Array.isArray(productSpecs);
        const hasSpecsData = isValidSpecsObject && Object.keys(productSpecs).length > 0;
        
        const validSpecs = isValidSpecsObject && hasSpecsData
          ? productSpecs 
          : {};
        
        // Map specs từ backend format sang frontend format
        // Nếu là màn hình: size → monitorSize, panel → panelType
        const isMonitor = fullProduct.category === 'man-hinh' || 
                          fullProduct.category === 'monitor' || 
                          fullProduct.subCategory === 'monitor';
        
        const mappedSpecs = {};
        if (isMonitor) {
          // Format màn hình: map size → monitorSize, panel → panelType
          if (validSpecs.size || validSpecs.monitorSize) {
            mappedSpecs.monitorSize = validSpecs.size || validSpecs.monitorSize;
          }
          if (validSpecs.panel || validSpecs.panelType) {
            mappedSpecs.panelType = validSpecs.panel || validSpecs.panelType;
          }
          if (validSpecs.aspectRatio) mappedSpecs.aspectRatio = validSpecs.aspectRatio;
          if (validSpecs.refreshRate) mappedSpecs.refreshRate = validSpecs.refreshRate;
          if (validSpecs.responseTime) mappedSpecs.responseTime = validSpecs.responseTime;
          if (validSpecs.vesa) mappedSpecs.vesa = validSpecs.vesa;
          // Xử lý ports nếu là array
          if (validSpecs.ports) {
            if (Array.isArray(validSpecs.ports)) {
              mappedSpecs.ports = validSpecs.ports.join(', ');
            } else {
              mappedSpecs.ports = validSpecs.ports;
            }
          }
          if (validSpecs.resolution) mappedSpecs.resolution = validSpecs.resolution;
        } else {
          // Format khác (laptop, parts, etc.): giữ nguyên tên field và chỉ copy các field có giá trị
          // Xử lý ports nếu là array
          if (validSpecs.ports !== undefined && validSpecs.ports !== null) {
            if (Array.isArray(validSpecs.ports)) {
              mappedSpecs.ports = validSpecs.ports.join(', ');
            } else {
              mappedSpecs.ports = validSpecs.ports;
            }
          }
          
          // Copy tất cả các field khác từ validSpecs (bao gồm cả monitor specs nếu có)
          Object.keys(validSpecs).forEach(key => {
            if (key !== 'ports') { // ports đã xử lý ở trên
              const value = validSpecs[key];
              if (value !== undefined && value !== null && value !== '') {
                mappedSpecs[key] = value;
              }
            }
          });
        }
        
        setFormData({
          name: fullProduct.name,
          description: fullProduct.description || '',
          price: fullProduct.price,
          oldPrice: fullProduct.oldPrice || '',
          category: fullProduct.category || '',
          subCategory: fullProduct.subCategory || fullProduct.type || '',
          brand: fullProduct.brand || '',
          usage: fullProduct.usage || '',
          stock: fullProduct.stock || 0,
          images: [],
          specs: mappedSpecs // Load specs object từ product (đã map format)
        });
        
        // Tạo previews cho ảnh hợp lệ với ID duy nhất
        let currentId = 0;
        const validPreviews = existingImages.map((img) => {
          const url = getImageUrl(img);
          return {
            id: currentId++,
            url: url,
            type: 'existing',
            originalUrl: img
          };
        });
        
        setImagePreviews(validPreviews);
        setNextId(currentId);
      } catch (error) {
        toast.error('Không thể tải thông tin sản phẩm');
        return;
      }
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        oldPrice: '',
        category: '',
        subCategory: '',
        brand: '',
        usage: '',
        stock: '',
        images: [],
        specs: {}
      });
      setImagePreviews([]);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    // Cleanup blob URLs để tránh memory leak
    imagePreviews.forEach(preview => {
      if (preview.type === 'new' && preview.url && preview.url.startsWith('blob:')) {
        URL.revokeObjectURL(preview.url);
      }
    });
    
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      oldPrice: '',
      category: '',
      subCategory: '',
      brand: '',
      usage: '',
      stock: '',
      images: [],
      specs: {}
    });
    setImagePreviews([]);
    setNextId(0);
  };

  if (loading) return <div className="text-white p-6">Đang tải...</div>;

  // Lọc sản phẩm theo category
  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => {
        const productCat = p.category?.toLowerCase();
        if (selectedCategory === 'parts') {
          return productCat === 'parts' || productCat === 'accessory' || productCat === 'linh kien';
        }
        return productCat === selectedCategory;
      });

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

      {/* Category Filter Tabs */}
      <div className="bg-[#151515] border border-neutral-800 rounded-xl p-4">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'laptop', label: 'Laptop' },
            { id: 'monitor', label: 'Màn hình' },
            { id: 'parts', label: 'Linh kiện' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
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
              {filteredProducts.map((product) => (
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
                      {product.stock > 10 ? 'Còn hàng' : product.stock > 0 ? 'Sắp hết' : 'Hết hàng'}
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
                  {imagePreviews.map((preview) => {
                    // Chỉ hiển thị preview nếu URL hợp lệ
                    if (!preview.url || preview.url === 'null' || preview.url.includes('null') || preview.url.includes('undefined')) {
                      return null;
                    }
                    return (
                      <div key={preview.id} className="relative aspect-square rounded-xl overflow-hidden border border-neutral-700 group">
                        <img 
                          src={preview.url} 
                          alt={`Product image ${preview.id + 1}`} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Nếu ảnh không load được, ẩn nó
                            e.target.style.display = 'none';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(preview.id)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <LuX size={14} />
                        </button>
                      </div>
                    );
                  })}
                  
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
                        <option value="parts">Linh kiện</option>
                        <option value="monitor">Màn hình</option>
                      </select>
                    </div>
                    
                    {/* Sub-category cho Linh kiện */}
                    {formData.category === 'parts' && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-400">Loại linh kiện</label>
                        <select
                          name="subCategory"
                          value={formData.subCategory}
                          onChange={handleInputChange}
                          required
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                        >
                          <option value="">Chọn loại</option>
                          <option value="cpu">CPU</option>
                          <option value="mainboard">Mainboard</option>
                          <option value="ram">RAM</option>
                          <option value="storage">Storage (Ổ cứng)</option>
                          <option value="gpu">GPU (Card đồ họa)</option>
                          <option value="psu">PSU (Nguồn)</option>
                          <option value="cooling">Cooling (Tản nhiệt)</option>
                          <option value="case">Case (Vỏ máy)</option>
                        </select>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-400">Thương hiệu</label>
                      <select
                        name="brand"
                        value={formData.brand}
                        onChange={handleInputChange}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="">Chọn thương hiệu</option>
                        {formData.category === 'parts' ? (
                          // Thương hiệu cho linh kiện
                          <>
                            <option value="ASUS">ASUS</option>
                            <option value="Intel">Intel</option>
                            <option value="MSI">MSI</option>
                            <option value="Samsung">Samsung</option>
                            <option value="Gigabyte">Gigabyte</option>
                            <option value="ASRock">ASRock</option>
                            <option value="Kingston">Kingston</option>
                            <option value="DeepCool">DeepCool</option>
                            <option value="Cooler Master">Cooler Master</option>
                            <option value="Lexar">Lexar</option>
                            <option value="Western Digital">Western Digital</option>
                            <option value="ADATA">ADATA</option>
                            <option value="Seagate">Seagate</option>
                            <option value="Xigmatek">Xigmatek</option>
                            <option value="Corsair">Corsair</option>
                            <option value="Transcend">Transcend</option>
                            <option value="AMD">AMD</option>
                            <option value="NVIDIA">NVIDIA</option>
                          </>
                        ) : formData.category === 'monitor' ? (
                          // Thương hiệu cho màn hình
                          <>
                            <option value="ASUS">ASUS</option>
                            <option value="LG">LG</option>
                            <option value="Samsung">Samsung</option>
                            <option value="MSI">MSI</option>
                            <option value="Xiaomi">Xiaomi</option>
                            <option value="Dell">Dell</option>
                            <option value="AOC">AOC</option>
                            <option value="Acer">Acer</option>
                            <option value="Philips">Philips</option>
                            <option value="ViewSonic">ViewSonic</option>
                            <option value="Lenovo">Lenovo</option>
                            <option value="E-DRA">E-DRA</option>
                          </>
                        ) : (
                          // Thương hiệu cho laptop
                          <>
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
                            <option value="Gigabyte">Gigabyte</option>
                          </>
                        )}
                      </select>
                    </div>
                    
                    {/* Nhu cầu sử dụng - chỉ hiển thị cho laptop */}
                    {formData.category === 'laptop' && (
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
                    )}
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

              {/* Technical Specs - Dynamic Fields */}
              {formData.category && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white border-b border-neutral-800 pb-2">Thông số kỹ thuật</h3>
                  {(() => {
                    const specsFields = getSpecsFields(formData.category, formData.subCategory);
                    
                    if (specsFields.length === 0) {
                      return (
                        <p className="text-neutral-500 text-sm">Chưa có cấu hình thông số cho loại sản phẩm này</p>
                      );
                    }
                    
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {specsFields.map((field) => (
                          <div key={field.name} className={`space-y-2 ${field.multiline ? 'md:col-span-2' : ''}`}>
                            <label className="text-sm font-medium text-neutral-400">{field.label}</label>
                            {field.multiline ? (
                              <textarea
                                name={field.name}
                                value={formData.specs[field.name] || ''}
                                onChange={handleSpecsChange}
                                rows={3}
                                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none resize-none"
                                placeholder={field.placeholder}
                              />
                            ) : (
                              <input
                                type="text"
                                name={field.name}
                                value={formData.specs[field.name] || ''}
                                onChange={handleSpecsChange}
                                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                                placeholder={field.placeholder}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}

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
