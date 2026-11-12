import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addToCart as addToCartAction,
  updateQuantity as updateQuantityAction,
  updateItemSpices as updateItemSpicesAction,
  updateComboSubSpices as updateComboSubSpicesAction,
  removeFromCart as removeFromCartAction,
  clearCart as clearCartAction,
  setVoucher as setVoucherAction,
  removeVoucher as removeVoucherAction,
  openSpiceModal as openSpiceModalAction,
  closeSpiceModal as closeSpiceModalAction,
  setToast as setToastAction,
  clearToast as clearToastAction,
} from '../redux/cart/CartSlice';
import {
  fetchOrders,
  fetchMyOrders,
  createOrderThunk,
  updateOrderStatusThunk,
} from '../redux/order/OrderApi';
import { clearMyOrders } from '../redux/order/OrderSlice';

// Danh sách mã giảm giá chính thức
export const VOUCHERS = [
  { code: 'NEP10', discount: 10000, minOrder: 150000, desc: 'Giảm 10.000đ cho đơn từ 150.000đ' },
  { code: 'SUMVAY20', discount: 20000, minOrder: 300000, desc: 'Giảm 20.000đ cho đơn từ 300.000đ' },
  { code: 'FREESHIP', discount: 30000, minOrder: 200000, desc: 'Miễn phí vận chuyển (giảm 30.000đ)' },
];

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const activeVoucher = useSelector((state) => state.cart.activeVoucher);
  const spiceModalProduct = useSelector((state) => state.cart.spiceModalProduct);
  const toastMessage = useSelector((state) => state.cart.toastMessage);
  const orders = useSelector((state) => state.orders.items);
  const myOrders = useSelector((state) => state.orders.myOrders);
  const { isAuthenticated, isAdmin, user: authUser } = useSelector((state) => state.auth);
  const authUserId = authUser?.id || null;

  // Tải đơn hàng thực tế từ backend khi đã đăng nhập.
  // Phụ thuộc cả id người dùng để refetch khi đổi tài khoản (đăng ký/đăng nhập user khác)
  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(clearMyOrders());
      return;
    }
    if (isAdmin) {
      dispatch(fetchOrders());
    } else {
      dispatch(clearMyOrders());
      dispatch(fetchMyOrders());
    }
  }, [dispatch, isAuthenticated, isAdmin, authUserId]);

  // Tự tắt Toast sau 3.5s
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        dispatch(clearToastAction());
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, dispatch]);

  const showToast = (msg) => {
    dispatch(setToastAction(msg));
  };

  const openSpiceModal = (product) => {
    dispatch(openSpiceModalAction(product));
  };

  const closeSpiceModal = () => {
    dispatch(closeSpiceModalAction());
  };

  const addToCart = (product, quantity = 1, spices = null, eatTime = "Ăn ngay trong ngày", note = "") => {
    dispatch(
      addToCartAction({
        product,
        quantity,
        spices,
        eatTime,
        note,
      })
    );
  };

  const updateQuantity = (cartItemId, newQty) => {
    dispatch(updateQuantityAction({ cartItemId, quantity: newQty }));
  };

  const updateItemSpices = (cartItemId, newSpices) => {
    dispatch(updateItemSpicesAction({ cartItemId, spices: newSpices }));
  };

  const updateComboSubSpices = (cartItemId, subIndex, newSpices) => {
    dispatch(updateComboSubSpicesAction({ cartItemId, subIndex, spices: newSpices }));
  };

  const removeFromCart = (cartItemId) => {
    dispatch(removeFromCartAction(cartItemId));
  };

  const clearCart = () => {
    dispatch(clearCartAction());
  };

  // Số "đơn" (dòng hàng) trong giỏ — dùng cho badge icon giỏ ở Header
  const cartCount = cart.length;
  // Tổng số phần theo số lượng từng dòng (combo ×1 + nem ×2 = 3 phần)
  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

  const applyVoucher = (code) => {
    const found = VOUCHERS.find((v) => v.code.toUpperCase() === code.trim().toUpperCase());
    if (!found) {
      return { success: false, message: 'Mã giảm giá không hợp lệ!' };
    }
    if (totalPrice < found.minOrder) {
      return {
        success: false,
        message: `Đơn hàng tối thiểu phải từ ${found.minOrder.toLocaleString('vi-VN')}đ để dùng mã này!`,
      };
    }
    dispatch(setVoucherAction(found));
    return { success: true, message: `Áp dụng thành công: ${found.desc}` };
  };

  const removeVoucher = () => {
    dispatch(removeVoucherAction());
  };

  const discountAmount = activeVoucher ? activeVoucher.discount : 0;
  const shippingFee = totalPrice === 0 ? 0 : 30000;
  const finalPrice = Math.max(0, totalPrice - discountAmount + shippingFee);

  const createOrder = async (orderInfo) => {
    const payload = {
      customerName: orderInfo.customerName,
      phone: orderInfo.phone,
      email: orderInfo.email,
      address: orderInfo.address,
      desiredEatTime: orderInfo.desiredEatTime,
      note: orderInfo.note,
      paymentMethod: orderInfo.paymentMethod?.includes('COD') ? 'COD' : 'bank_transfer',
      items: cart.map((it) => ({
        productSlug: it.productSlug || it.id || '',
        name: it.name,
        image: it.image,
        pack: it.pack,
        price: it.price,
        quantity: it.quantity,
        unit: it.unit || 'gói',
        isCombo: it.isCombo || false,
        spices: it.spices || {},
        tag: it.tag || '',
        comboSubItems: it.comboSubItems || [],
      })),
      subtotal: totalPrice,
      shippingFee,
      totalAmount: finalPrice,
      voucherCode: activeVoucher ? activeVoucher.code : '',
      voucherDiscount: discountAmount,
    };

    const resultAction = await dispatch(createOrderThunk(payload));

    if (createOrderThunk.fulfilled.match(resultAction)) {
      clearCart();
      dispatch(removeVoucherAction());
      showToast('Đặt hàng thành công!');
      return { success: true, order: resultAction.payload };
    }

    // Đặt hàng thất bại ở backend — không tạo dữ liệu giả, báo lỗi thật cho người dùng
    showToast(`Đặt hàng thất bại: ${resultAction.payload || 'Lỗi kết nối máy chủ!'}`);
    return { success: false, message: resultAction.payload || 'Lỗi kết nối máy chủ!' };
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    // Hỗ trợ truyền chuỗi trạng thái hoặc object { status, assignee, scheduleNote, paymentStatus }
    const updateData = typeof newStatus === 'string' ? { status: newStatus } : newStatus;
    const resultAction = await dispatch(updateOrderStatusThunk({ orderId, ...updateData }));

    if (updateOrderStatusThunk.fulfilled.match(resultAction)) {
      if (typeof newStatus === 'string') {
        showToast(`Đã cập nhật trạng thái đơn sang "${newStatus}"`);
      } else {
        showToast('Đã cập nhật thông tin giao hàng cho đơn!');
      }
    } else {
      showToast(`Cập nhật thất bại: ${resultAction.payload || 'Lỗi kết nối!'}`);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        updateItemSpices,
        updateComboSubSpices,
        removeFromCart,
        clearCart,
        cartCount,
        totalItems,
        totalPrice,
        shippingFee,
        discountAmount,
        finalPrice,
        activeVoucher,
        applyVoucher,
        removeVoucher,
        openSpiceModal,
        closeSpiceModal,
        spiceModalProduct,
        toastMessage,
        showToast,
        orders,
        myOrders,
        createOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
