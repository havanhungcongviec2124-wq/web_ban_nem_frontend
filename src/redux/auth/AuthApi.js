import { createAsyncThunk } from '@reduxjs/toolkit';
import { getBaseUrl } from '../../utils/baseURL';

const BASE_URL = `${getBaseUrl()}/api/auth`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('nep_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Đăng nhập
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: (email || '').trim(),
          password: (password || '').trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { user: data.user, token: data.token };
      }
      return rejectWithValue(data.message || 'Đăng nhập không thành công');
    } catch (err) {
      return rejectWithValue('Không thể kết nối đến máy chủ backend!');
    }
  }
);

// Đăng ký
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ name, email, phone, password, role }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: (name || '').trim(),
          email: (email || '').trim(),
          phone: (phone || '').trim(),
          password: (password || '').trim(),
          role: role === 'admin' ? 'admin' : 'user',
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { user: data.user, token: data.token };
      }
      return rejectWithValue(data.message || 'Đăng ký không thành công');
    } catch (err) {
      return rejectWithValue('Không thể kết nối đến máy chủ backend!');
    }
  }
);

// Kiểm tra phiên đăng nhập (getMe)
export const getMe = createAsyncThunk(
  'auth/getMe',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('nep_token');
      if (!token) return rejectWithValue('Không có token');
      const res = await fetch(`${BASE_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.user) {
        return {
          user: {
            id: data.user._id,
            name: data.user.name,
            email: data.user.email,
            phone: data.user.phone || '',
            role: data.user.role || 'user',
            avatar: data.user.avatar || '',
            address: data.user.address || '',
          },
        };
      }
      return rejectWithValue('Token hết hạn hoặc không hợp lệ');
    } catch (err) {
      return rejectWithValue('Không thể kiểm tra phiên đăng nhập');
    }
  }
);

// Lấy danh sách users (Admin)
export const fetchUsers = createAsyncThunk(
  'auth/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/users`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        return data.users;
      }
      return rejectWithValue('Không thể tải danh sách người dùng');
    } catch (err) {
      return rejectWithValue('Lỗi tải danh sách người dùng');
    }
  }
);

