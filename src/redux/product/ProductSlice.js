import { createSlice } from '@reduxjs/toolkit';
import {
  fetchProducts,
  fetchProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from './ProductApi';

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    selectedProduct: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearSelectedProduct(state) {
      state.selectedProduct = null;
    },
    clearProductError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Fetch Product By ID
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Create Product
    builder
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      });

    // Update Product
    builder
      .addCase(updateProduct.fulfilled, (state, action) => {
        const idx = state.items.findIndex(
          (p) => p._id === action.payload._id || p.id === action.payload.id || p.slug === action.payload.slug
        );
        if (idx !== -1) {
          state.items[idx] = action.payload;
        }
        if (state.selectedProduct && (state.selectedProduct._id === action.payload._id || state.selectedProduct.id === action.payload.id)) {
          state.selectedProduct = action.payload;
        }
      });

    // Delete Product
    builder
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (p) => p._id !== action.payload && p.id !== action.payload && p.slug !== action.payload
        );
      });
  },
});

export const { clearSelectedProduct, clearProductError } = productSlice.actions;
export default productSlice.reducer;

