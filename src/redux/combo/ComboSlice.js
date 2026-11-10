import { createSlice } from '@reduxjs/toolkit';
import {
  fetchCombos,
  fetchComboById,
  createCombo,
  updateCombo,
  deleteCombo,
} from './ComboApi';

const comboSlice = createSlice({
  name: 'combos',
  initialState: {
    items: [],
    selectedCombo: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearSelectedCombo(state) {
      state.selectedCombo = null;
    },
    clearComboError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Combos
    builder
      .addCase(fetchCombos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCombos.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchCombos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Fetch Combo By ID
    builder
      .addCase(fetchComboById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchComboById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedCombo = action.payload;
      })
      .addCase(fetchComboById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Create Combo
    builder
      .addCase(createCombo.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      });

    // Update Combo
    builder
      .addCase(updateCombo.fulfilled, (state, action) => {
        const idx = state.items.findIndex(
          (c) => c._id === action.payload._id || c.id === action.payload.id || c.slug === action.payload.slug
        );
        if (idx !== -1) {
          state.items[idx] = action.payload;
        }
        if (state.selectedCombo && (state.selectedCombo._id === action.payload._id || state.selectedCombo.id === action.payload.id)) {
          state.selectedCombo = action.payload;
        }
      });

    // Delete Combo
    builder
      .addCase(deleteCombo.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (c) => c._id !== action.payload && c.id !== action.payload && c.slug !== action.payload
        );
      });
  },
});

export const { clearSelectedCombo, clearComboError } = comboSlice.actions;
export default comboSlice.reducer;

