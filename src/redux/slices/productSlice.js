import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

/**
 * Product Slice - Quản lý danh sách sản phẩm
 * Chức năng: Tải danh sách sản phẩm, chi tiết sản phẩm, bộ lọc
 */

// Async thunk để tải danh sách sản phẩm
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/products');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch products');
    }
  }
);

// Async thunk để tải chi tiết sản phẩm theo ID hoặc slug
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (slugOrId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/${slugOrId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch product');
    }
  }
);

// Async thunk để tải danh sách sản phẩm tương tự
export const fetchRelatedProducts = createAsyncThunk(
  'products/fetchRelatedProducts',
  async ({ category, brand, currentProductId, limit = 8 }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (brand) params.append('brand', brand);
      if (limit) params.append('limit', limit);
      
      const response = await api.get(`/products?${params.toString()}`);
      // Lọc bỏ sản phẩm hiện tại khỏi danh sách
      const filtered = response.data.filter(p => p._id !== currentProductId && p.id !== currentProductId);
      return filtered.slice(0, limit);
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch related products');
    }
  }
);

const initialState = {
  items: [],
  selectedProduct: null,
  relatedProducts: [],
  status: 'idle',
  relatedStatus: 'idle',
  error: null,
  filters: {
    category: null,
    search: '',
  },
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Thiết lập bộ lọc sản phẩm
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    // Xóa sản phẩm được chọn
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Tải danh sách sản phẩm
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Tải chi tiết sản phẩm
      .addCase(fetchProductById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Tải sản phẩm tương tự
      .addCase(fetchRelatedProducts.pending, (state) => {
        state.relatedStatus = 'loading';
      })
      .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
        state.relatedStatus = 'succeeded';
        state.relatedProducts = action.payload;
      })
      .addCase(fetchRelatedProducts.rejected, (state) => {
        state.relatedStatus = 'failed';
      });
  },
});

export const { setFilters, clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
