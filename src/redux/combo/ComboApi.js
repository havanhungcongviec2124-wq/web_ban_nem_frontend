import { createAsyncThunk } from '@reduxjs/toolkit';
import { getBaseUrl } from '../../utils/baseURL';

const BASE_URL = `${getBaseUrl()}/api/combos`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('nep_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const normalizeCombo = (c) => {
  if (!c) return c;
  return {
    ...c,
    id: c.slug || c.id || c._id,
    isCombo: true,
  };
};

// Lấy danh sách combos
export const fetchCombos = createAsyncThunk(
  'combos/fetchCombos',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(BASE_URL);
      const data = await res.json();
      if (data.success && Array.isArray(data.combos)) {
        return data.combos.map(normalizeCombo);
      }
      return rejectWithValue(data.message || 'Không thể tải danh sách combo');
    } catch (err) {
      return rejectWithValue('Lỗi kết nối khi tải danh sách combo');
    }
  }
);

// Lấy chi tiết combo theo ID hoặc slug
export const fetchComboById = createAsyncThunk(
  'combos/fetchComboById',
  async (idOrSlug, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/${idOrSlug}`);
      const data = await res.json();
      if (data.success && data.combo) {
        return normalizeCombo(data.combo);
      }
      return rejectWithValue(data.message || 'Không tìm thấy combo');
    } catch (err) {
      return rejectWithValue('Lỗi kết nối khi tải chi tiết combo');
    }
  }
);

// Tạo mới combo (Admin)
export const createCombo = createAsyncThunk(
  'combos/createCombo',
  async (comboData, { rejectWithValue }) => {
    try {
      const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(comboData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return normalizeCombo(data.combo);
      }
      return rejectWithValue(data.message || 'Tạo combo thất bại');
    } catch (err) {
      return rejectWithValue('Lỗi kết nối khi tạo combo');
    }
  }
);

// Cập nhật combo (Admin)
export const updateCombo = createAsyncThunk(
  'combos/updateCombo',
  async ({ id, data: updateData }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return normalizeCombo(data.combo);
      }
      return rejectWithValue(data.message || 'Cập nhật combo thất bại');
    } catch (err) {
      return rejectWithValue('Lỗi kết nối khi cập nhật combo');
    }
  }
);

// Xoá combo (Admin)
export const deleteCombo = createAsyncThunk(
  'combos/deleteCombo',
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
      return rejectWithValue(data.message || 'Xóa combo thất bại');
    } catch (err) {
      return rejectWithValue('Lỗi kết nối khi xóa combo');
    }
  }
);

