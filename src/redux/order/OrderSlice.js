import { createSlice } from '@reduxjs/toolkit';
import {
  fetchOrders,
  fetchMyOrders,
  createOrderThunk,
  updateOrderStatusThunk,
} from './OrderApi';

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    items: [],
    myOrders: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearOrderError(state) {
      state.error = null;
    },
    clearMyOrders(state) {
      // Xoá đơn cũ khi đổi tài khoản — tránh hiển thị đơn của người dùng trước
      state.myOrders = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch Orders
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Fetch My Orders
    builder
      .addCase(fetchMyOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myOrders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Create Order
    builder
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.myOrders.unshift(action.payload);
      });

    // Update Order Status
    builder
      .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
        const updateInList = (list) => {
          const idx = list.findIndex(
            (o) => o._id === action.payload._id || o.orderCode === action.payload.orderCode || o.id === action.payload.id
          );
          if (idx !== -1) {
            list[idx] = action.payload;
          }
        };
        updateInList(state.items);
        updateInList(state.myOrders);
      });
  },
});

export const { clearOrderError, clearMyOrders } = orderSlice.actions;
export default orderSlice.reducer;

