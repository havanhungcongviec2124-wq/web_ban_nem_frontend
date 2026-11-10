import { createAsyncThunk } from '@reduxjs/toolkit';
import { getBaseUrl } from '../../utils/baseURL';

const BASE_URL = `${getBaseUrl()}/api/cart`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('nep_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Lấy giỏ hàng từ server
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('nep_token');
      if (!token) return { items: [] };

      const res = await fetch(BASE_URL, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success && data.cart) {
        return data.cart;
      }
      return { items: [] };
    } catch (err) {
      return rejectWithValue('Lỗi khi tải giỏ hàng');
    }
  }
);

// Đồng bộ giỏ hàng lên server
export const syncCartThunk = createAsyncThunk(
  'cart/syncCart',
  async (items, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('nep_token');
      if (!token) return items;

      const res = await fetch(`${BASE_URL}/sync`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (data.success && data.cart) {
        return data.cart.items;
      }
      return items;
    } catch (err) {
      return rejectWithValue('Lỗi đồng bộ giỏ hàng');
    }
  }
);

