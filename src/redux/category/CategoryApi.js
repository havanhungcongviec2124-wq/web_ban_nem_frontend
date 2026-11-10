import { createAsyncThunk } from '@reduxjs/toolkit';
import { getBaseUrl } from '../../utils/baseURL';

const BASE_URL = `${getBaseUrl()}/api/categories`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('nep_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const normalizeCategory = (c) => {
  if (!c) return c;
  return {
    ...c,
    id: c.slug || c.id || c._id,
  };
};

// Lấy danh mục đang hiển thị
export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(BASE_URL);
      const data = await res.json();
      if (data.success && Array.isArray(data.categories)) {
        return data.categories.map(normalizeCategory);
      }
      return rejectWithValue(data.message || 'Không thể tải danh mục');
    } catch (err) {
      return rejectWithValue('Lỗi kết nối khi tải danh mục');
    }
  }
);

// Lấy tất cả danh mục (Admin - bao gồm cả ẩn)
export const fetchAllCategoriesAdmin = createAsyncThunk(
  'categories/fetchAllCategoriesAdmin',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/admin/all`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.categories)) {
        return data.categories.map(normalizeCategory);
      }
      return rejectWithValue(data.message || 'Không thể tải tất cả danh mục');
    } catch (err) {
      return rejectWithValue('Lỗi kết nối khi tải danh mục');
    }
  }
);

// Tạo mới danh mục
export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(categoryData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return normalizeCategory(data.category);
      }
      return rejectWithValue(data.message || 'Tạo danh mục thất bại');
    } catch (err) {
      return rejectWithValue('Lỗi kết nối khi tạo danh mục');
    }
  }
);

// Cập nhật danh mục
export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, data: updateData }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return normalizeCategory(data.category);
      }
      return rejectWithValue(data.message || 'Cập nhật danh mục thất bại');
    } catch (err) {
      return rejectWithValue('Lỗi kết nối khi cập nhật danh mục');
    }
  }
);

// Xoá danh mục
export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
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
      return rejectWithValue(data.message || 'Xóa danh mục thất bại');
    } catch (err) {
      return rejectWithValue('Lỗi kết nối khi xóa danh mục');
    }
  }
);

