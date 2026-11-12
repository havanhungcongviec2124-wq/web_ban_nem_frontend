import { createAsyncThunk } from '@reduxjs/toolkit';
import { getBaseUrl } from '../../utils/baseURL';

const BASE_URL = `${getBaseUrl()}/api/products`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('nep_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const normalizeProduct = (item) => {
  if (!item) return item;
  return {
    ...item,
    id: item.slug || item.id || item._id,
  };
};

// Lấy danh sách sản phẩm
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${BASE_URL}${query ? `?${query}` : ''}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        return data.products.map(normalizeProduct);
      }
      return rejectWithValue(data.message || 'Không thể lấy danh sách sản phẩm');
    } catch (err) {
      return rejectWithValue('Lỗi kết nối khi tải sản phẩm');
    }
  }
);

// Lấy chi tiết sản phẩm theo ID hoặc slug
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (idOrSlug, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/${idOrSlug}`);
      const data = await res.json();
      if (data.success && data.product) {
        return normalizeProduct(data.product);
      }
      return rejectWithValue(data.message || 'Không tìm thấy sản phẩm');
    } catch (err) {
      return rejectWithValue('Lỗi kết nối khi tải chi tiết sản phẩm');
    }
  }
);

// Thêm mới sản phẩm (Admin)
export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return normalizeProduct(data.product);
      }
      return rejectWithValue(data.message || 'Tạo sản phẩm thất bại');
    } catch (err) {
      return rejectWithValue('Lỗi kết nối khi tạo sản phẩm');
    }
  }
);

// Cập nhật sản phẩm (Admin)
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, data: updateData }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return normalizeProduct(data.product);
      }
      return rejectWithValue(data.message || 'Cập nhật sản phẩm thất bại');
    } catch (err) {
      return rejectWithValue('Lỗi kết nối khi cập nhật sản phẩm');
    }
  }
);

// Xoá sản phẩm (Admin)
export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (idOrSlug, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/${idOrSlug}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return idOrSlug;
      }
      return rejectWithValue(data.message || 'Xóa sản phẩm thất bại');
    } catch (err) {
      return rejectWithValue('Lỗi kết nối khi xóa sản phẩm');
    }
  }
);

// Tải ảnh sản phẩm lên server (Admin) — trả về URL công khai của ảnh
// Lưu ý: không đặt Content-Type thủ công, trình duyệt tự gắn multipart/form-data kèm boundary
export const uploadProductImage = createAsyncThunk(
  'products/uploadProductImage',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      const token = localStorage.getItem('nep_token');
      const res = await fetch(`${getBaseUrl()}/api/uploads`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success && data.url) {
        return data.url;
      }
      return rejectWithValue(data.message || 'Tải ảnh thất bại');
    } catch (err) {
      return rejectWithValue('Lỗi kết nối khi tải ảnh');
    }
  }
);

