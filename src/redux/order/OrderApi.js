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
  // Định dạng lại thời gian tạo đơn từ backend (ISO) sang dạng hiển thị tiếng Việt
  let createdAt = o.createdAt;
  let createdAtShort = o.createdAtShort;
  const createdAtISO = o.createdAtISO || (o.createdAt instanceof Date ? '' : o.createdAt);
  if (o.createdAt && !o.createdAtShort) {
    const d = new Date(o.createdAt);
    if (!Number.isNaN(d.getTime())) {
      const hh = String(d.getHours()).padStart(2, '0');
      const mm = String(d.getMinutes()).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const MM = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      createdAt = `${hh}:${mm} · ${dd}/${MM}/${yyyy}`;
      createdAtShort = `${dd}/${MM} · ${hh}:${mm}`;
    }
  }
  return {
    ...o,
    id: o.orderCode || o._id,
    createdAtISO,
    createdAt,
    createdAtShort,
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

// Lấy đơn hàng của cá nhân (GET /api/orders/my-orders)
export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/my-orders`, {
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

// Cập nhật trạng thái đơn hàng (Admin) — hỗ trợ cả status, assignee, scheduleNote, paymentStatus
export const updateOrderStatusThunk = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderId, ...updateData }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/${orderId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData),
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

