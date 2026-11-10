import { createSlice } from '@reduxjs/toolkit';
import {
  fetchCategories,
  fetchAllCategoriesAdmin,
  createCategory,
  updateCategory,
  deleteCategory,
} from './CategoryApi';

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearCategoryError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Fetch All Categories Admin
    builder
      .addCase(fetchAllCategoriesAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllCategoriesAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchAllCategoriesAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Create Category
    builder
      .addCase(createCategory.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });

    // Update Category
    builder
      .addCase(updateCategory.fulfilled, (state, action) => {
        const idx = state.items.findIndex(
          (c) => c._id === action.payload._id || c.id === action.payload.id || c.slug === action.payload.slug
        );
        if (idx !== -1) {
          state.items[idx] = action.payload;
        }
      });

    // Delete Category
    builder
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (c) => c._id !== action.payload && c.id !== action.payload && c.slug !== action.payload
        );
      });
  },
});

export const { clearCategoryError } = categorySlice.actions;
export default categorySlice.reducer;

