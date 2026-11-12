import { createSlice } from '@reduxjs/toolkit';
import { fetchCart, syncCartThunk } from './CartApi';

const DEFAULT_SPICES = { garlic: 'Nhiều', chili: 'Ít', polyscias: 'Nhiều' };

// Chuẩn hóa món con trong combo: luôn có spices + qtyText
// (combo từ backend chỉ có defaultSpices, không có spices → Cart/Checkout đọc sub.spices.garlic bị crash)
const normalizeSubItems = (subs) => {
  if (!Array.isArray(subs)) return null;
  return subs.map((sub) => ({
    ...sub,
    qtyText: sub.qtyText || sub.qtyLabel || (sub.qty ? `${sub.qty} phần` : ''),
    spices: sub.spices || sub.defaultSpices || { ...DEFAULT_SPICES },
  }));
};

// Khôi phục giỏ hàng từ localStorage nếu có (chuẩn hóa lại cho giỏ tạo trước khi có fix)
const loadSavedCart = () => {
  try {
    const saved = localStorage.getItem('zs_cart');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => ({
          ...item,
          spices: item.spices || { ...DEFAULT_SPICES },
          comboSubItems: item.comboSubItems ? normalizeSubItems(item.comboSubItems) : item.comboSubItems,
        }));
      }
    }
    return [];
  } catch {
    return [];
  }
};

const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem('zs_cart', JSON.stringify(cart));
  } catch (e) {
    console.error('Lỗi lưu giỏ hàng vào storage:', e);
  }
};

const computeSpiceTag = (spices) => {
  if (!spices) return '';
  const garlicText = spices.garlic === 'Nhiều' ? 'thơm tỏi' : 'nhẹ tỏi';
  const chiliText = spices.chili === 'Nhiều' ? 'Đậm ớt' : 'Nhẹ ớt';
  return `Phần ${garlicText} · ${chiliText}`;
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadSavedCart(),
    activeVoucher: null,
    spiceModalProduct: null,
    toastMessage: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    addToCart(state, action) {
      const {
        product,
        quantity = 1,
        spices = null,
        eatTime = 'Ăn ngay trong ngày',
        note = '',
      } = action.payload;

      const finalSpices = spices || product.defaultSpices || { ...DEFAULT_SPICES };

      const isCombo = product.id === 'combo-sum-vay' || product.category === 'combo' || product.isCombo;
      const spiceKey = isCombo
        ? `combo_${Date.now()}`
        : `${finalSpices.garlic}-${finalSpices.chili}-${finalSpices.polyscias}`;
      const cartItemId = `${product.id || product.slug}_${spiceKey}`;

      const existingIndex = state.items.findIndex((item) => item.cartItemId === cartItemId);

      if (existingIndex > -1) {
        state.items[existingIndex].quantity += quantity;
        if (note) state.items[existingIndex].note = note;
      } else {
        state.items.push({
          cartItemId,
          id: product.id || product.slug,
          productSlug: product.slug || product.id,
          name: product.name,
          pack: product.pack || (product.unit ? `10 chiếc · 200 g / ${product.unit}` : 'Phần'),
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          unit: product.unit || 'phần',
          quantity,
          spices: finalSpices,
          tag: computeSpiceTag(finalSpices),
          eatTime,
          note,
          isCombo,
          comboSubItems: isCombo ? normalizeSubItems(product.comboSubItems || product.comboItems) : null,
        });
      }

      state.toastMessage = `Đã thêm "${product.name}" vào giỏ hàng!`;
      saveCartToStorage(state.items);
    },

    updateQuantity(state, action) {
      const { cartItemId, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter((item) => item.cartItemId !== cartItemId);
      } else {
        const item = state.items.find((i) => i.cartItemId === cartItemId);
        if (item) item.quantity = quantity;
      }
      saveCartToStorage(state.items);
    },

    updateItemSpices(state, action) {
      const { cartItemId, spices } = action.payload;
      const item = state.items.find((i) => i.cartItemId === cartItemId);
      if (item) {
        item.spices = spices;
        item.tag = computeSpiceTag(spices);
        state.toastMessage = 'Đã cập nhật lựa chọn gia vị.';
        saveCartToStorage(state.items);
      }
    },

    updateComboSubSpices(state, action) {
      const { cartItemId, subIndex, spices } = action.payload;
      const item = state.items.find((i) => i.cartItemId === cartItemId);
      if (item && item.comboSubItems && item.comboSubItems[subIndex]) {
        item.comboSubItems[subIndex].spices = spices;
        state.toastMessage = 'Đã cập nhật gia vị cho món trong combo.';
        saveCartToStorage(state.items);
      }
    },

    removeFromCart(state, action) {
      const cartItemId = action.payload;
      state.items = state.items.filter((item) => item.cartItemId !== cartItemId);
      state.toastMessage = 'Đã xóa sản phẩm khỏi giỏ hàng.';
      saveCartToStorage(state.items);
    },

    clearCart(state) {
      state.items = [];
      state.activeVoucher = null;
      saveCartToStorage([]);
    },

    setVoucher(state, action) {
      state.activeVoucher = action.payload;
    },

    removeVoucher(state) {
      state.activeVoucher = null;
    },

    openSpiceModal(state, action) {
      state.spiceModalProduct = action.payload;
    },

    closeSpiceModal(state) {
      state.spiceModalProduct = null;
    },

    setToast(state, action) {
      state.toastMessage = action.payload;
    },

    clearToast(state) {
      state.toastMessage = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        if (action.payload && Array.isArray(action.payload.items) && action.payload.items.length > 0) {
          state.items = action.payload.items;
          saveCartToStorage(state.items);
        }
      })
      .addCase(syncCartThunk.fulfilled, (state, action) => {
        if (Array.isArray(action.payload)) {
          state.items = action.payload;
          saveCartToStorage(state.items);
        }
      });
  },
});

export const {
  addToCart,
  updateQuantity,
  updateItemSpices,
  updateComboSubSpices,
  removeFromCart,
  clearCart,
  setVoucher,
  removeVoucher,
  openSpiceModal,
  closeSpiceModal,
  setToast,
  clearToast,
} = cartSlice.actions;

export default cartSlice.reducer;

