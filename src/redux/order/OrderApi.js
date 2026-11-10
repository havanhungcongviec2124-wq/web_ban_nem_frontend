import { createAsyncThunk } from '@reduxjs/toolkit';
import { getBaseUrl } from '../../utils/baseURL';

const BASE_URL = `${getBaseUrl()}/api/orders`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('nep_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const normalizeOrder = (o) => {
  if (!o) return o;
  return {
    ...o,
    id: o.orderCode || o._id,
  };
};

// Lấy danh sách đơn hàng (Admin xem hết, hoặc lọc)
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (params = {}, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${BASE_URL}${query ? `?${query}` : ''}`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        return data.orders.map(normalizeOrder);
      }
      return rejectWithValue(data.message || 'Không thể tải đơn hàng');
    } catch (err) {
      return rejectWithValue('Lỗi kết nối khi tải đơn hàng');
    }
  }
);

// Lấy đơn hàng của cá nhân
export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/my`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        return data.orders.map(normalizeOrder);
      }
      return rejectWithValue(data.message || 'Không thể tải đơn hàng của tôi');
    } catch (err) {
      return rejectWithValue('Lỗi kết nối khi tải đơn hàng');
    }
  }
);

// Tạo đơn hàng mới
export const createOrderThunk = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(orderData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return normalizeOrder(data.order);
      }
      return rejectWithValue(data.message || 'Đặt hàng thất bại');
    } catch (err) {
      return rejectWithValue('Lỗi kết nối khi đặt hàng');
    }
  }
);

// Cập nhật trạng thái đơn hàng (Admin)
export const updateOrderStatusThunk = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, status, note }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/${orderId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status, note }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return normalizeOrder(data.order);
      }
      return rejectWithValue(data.message || 'Cập nhật trạng thái thất bại');
    } catch (err) {
      return rejectWithValue('Lỗi kết nối khi cập nhật trạng thái đơn');
    }
  }
);

