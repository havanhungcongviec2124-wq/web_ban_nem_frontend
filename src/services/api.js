import { getBaseUrl } from '../utils/baseURL';

const BASE_URL = getBaseUrl();

const getAuthHeaders = () => {
  const token = localStorage.getItem('nep_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Normalize item to ensure item.id exists
const normalizeItem = (item) => {
  if (!item) return item;
  return {
    ...item,
    id: item.slug || item.id || item._id,
  };
};

// --- PRODUCTS ---
export const getProducts = async (params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE_URL}/api/products${query ? `?${query}` : ''}`);
    const data = await res.json();
    if (data.success && Array.isArray(data.products)) {
      return data.products.map(normalizeItem);
    }
    return [];
  } catch (err) {
    if (import.meta.env.DEV) console.error('Lỗi tải sản phẩm:', err);
    return [];
  }
};

export const getProductByIdOrSlug = async (idOrSlug) => {
  try {
    const res = await fetch(`${BASE_URL}/api/products/${idOrSlug}`);
    const data = await res.json();
    if (data.success && data.product) {
      return normalizeItem(data.product);
    }
    return null;
  } catch (err) {
    if (import.meta.env.DEV) console.error('Lỗi tải chi tiết sản phẩm:', err);
    return null;
  }
};

export const createProduct = async (productData) => {
  const res = await fetch(`${BASE_URL}/api/products`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });
  return await res.json();
};

export const updateProduct = async (idOrSlug, productData) => {
  const res = await fetch(`${BASE_URL}/api/products/${idOrSlug}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });
  return await res.json();
};

export const deleteProduct = async (idOrSlug) => {
  const res = await fetch(`${BASE_URL}/api/products/${idOrSlug}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return await res.json();
};

// --- COMBOS ---
export const getCombos = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/combos`);
    const data = await res.json();
    if (data.success && Array.isArray(data.combos)) {
      return data.combos.map((c) => ({
        ...c,
        id: c.slug || c.id || c._id,
        isCombo: true,
      }));
    }
    return [];
  } catch (err) {
    if (import.meta.env.DEV) console.error('Lỗi tải combo:', err);
    return [];
  }
};

export const getComboByIdOrSlug = async (idOrSlug) => {
  try {
    const res = await fetch(`${BASE_URL}/api/combos/${idOrSlug}`);
    const data = await res.json();
    if (data.success && data.combo) {
      return {
        ...data.combo,
        id: data.combo.slug || data.combo.id || data.combo._id,
        isCombo: true,
      };
    }
    return null;
  } catch (err) {
    if (import.meta.env.DEV) console.error('Lỗi tải chi tiết combo:', err);
    return null;
  }
};

export const createCombo = async (comboData) => {
  const res = await fetch(`${BASE_URL}/api/combos`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(comboData),
  });
  return await res.json();
};

export const updateCombo = async (idOrSlug, comboData) => {
  const res = await fetch(`${BASE_URL}/api/combos/${idOrSlug}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(comboData),
  });
  return await res.json();
};

export const deleteCombo = async (idOrSlug) => {
  const res = await fetch(`${BASE_URL}/api/combos/${idOrSlug}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return await res.json();
};

// --- CATEGORIES ---
export const getCategories = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/categories`);
    const data = await res.json();
    if (data.success && Array.isArray(data.categories)) {
      return data.categories.map((c) => ({
        ...c,
        id: c.slug || c.id || c._id,
      }));
    }
    return [];
  } catch (err) {
    if (import.meta.env.DEV) console.error('Lỗi tải danh mục:', err);
    return [];
  }
};

// --- ORDERS ---
export const getOrders = async (params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE_URL}/api/orders${query ? `?${query}` : ''}`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (data.success && Array.isArray(data.orders)) {
      return data.orders.map((o) => ({
        ...o,
        id: o.orderCode || o._id,
      }));
    }
    return [];
  } catch (err) {
    if (import.meta.env.DEV) console.error('Lỗi tải đơn hàng:', err);
    return [];
  }
};

export const createOrder = async (orderData) => {
  const res = await fetch(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(orderData),
  });
  return await res.json();
};

export const updateOrderStatus = async (orderId, updateData) => {
  const res = await fetch(`${BASE_URL}/api/orders/${orderId}/status`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updateData),
  });
  return await res.json();
};

// --- USERS (Admin) ---
export const getUsers = async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/users`, {
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (data.success && Array.isArray(data.users)) {
      return data.users;
    }
    return [];
  } catch (err) {
    if (import.meta.env.DEV) console.error('Lỗi tải danh sách người dùng:', err);
    return [];
  }
};

