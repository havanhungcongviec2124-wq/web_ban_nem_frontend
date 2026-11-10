import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/AuthSlice';
import productReducer from './product/ProductSlice';
import comboReducer from './combo/ComboSlice';
import categoryReducer from './category/CategorySlice';
import orderReducer from './order/OrderSlice';
import cartReducer from './cart/CartSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    combos: comboReducer,
    categories: categoryReducer,
    orders: orderReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;

