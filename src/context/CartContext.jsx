import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_ORDERS, VOUCHERS } from '../data/mockData';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('zs_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('zs_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [activeVoucher, setActiveVoucher] = useState(null);
  const [spiceModalProduct, setSpiceModalProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('zs_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('zs_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const openSpiceModal = (product) => {
    setSpiceModalProduct(product);
  };

  const closeSpiceModal = () => {
    setSpiceModalProduct(null);
  };

  const addToCart = (product, quantity = 1, spices = null, eatTime = "Ăn ngay trong ngày", note = "") => {
    const finalSpices = spices || product.defaultSpices || {
      garlic: "Nhiều",
      chili: "Ít",
      polyscias: "Nhiều"
    };

    const spiceKey = `${finalSpices.garlic}-${finalSpices.chili}-${finalSpices.polyscias}`;
    const cartItemId = `${product.id}_${spiceKey}_${eatTime || 'default'}`;

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
          note: note || next[existingIndex].note
        };
        return next;
      } else {
        return [
          ...prev,
          {
            cartItemId,
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.image,
            unit: product.unit || "Phần",
            quantity,
            spices: finalSpices,
            eatTime,
            note
          }
        ];
      }
    });

    showToast(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  const updateQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev => prev.map(item => item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item));
  };

  const removeFromCart = (cartItemId) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
    showToast("Đã xóa sản phẩm khỏi giỏ hàng.");
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const applyVoucher = (code) => {
    const found = VOUCHERS.find(v => v.code.toUpperCase() === code.trim().toUpperCase());
    if (!found) {
      return { success: false, message: "Mã giảm giá không hợp lệ!" };
    }
    if (totalPrice < found.minOrder) {
      return { 
        success: false, 
        message: `Đơn hàng tối thiểu phải từ ${found.minOrder.toLocaleString('vi-VN')}đ để dùng mã này!` 
      };
    }
    setActiveVoucher(found);
    return { success: true, message: `Áp dụng thành công: ${found.desc}` };
  };

  const removeVoucher = () => {
    setActiveVoucher(null);
  };

  const discountAmount = activeVoucher ? activeVoucher.discount : 0;
  const shippingFee = totalPrice >= 300000 || totalPrice === 0 ? 0 : 25000;
  const finalPrice = Math.max(0, totalPrice - discountAmount + shippingFee);

  const createOrder = (orderInfo) => {
    const newOrder = {
      id: `ZS-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toLocaleString('vi-VN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
      }),
      status: "Chờ xác nhận",
      items: [...cart],
      totalAmount: finalPrice,
      subtotal: totalPrice,
      discountAmount,
      shippingFee,
      voucherCode: activeVoucher ? activeVoucher.code : null,
      ...orderInfo
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setActiveVoucher(null);
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
    showToast(`Đã cập nhật trạng thái đơn #${orderId} sang "${newStatus}"`);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
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
        createOrder,
        updateOrderStatus
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

