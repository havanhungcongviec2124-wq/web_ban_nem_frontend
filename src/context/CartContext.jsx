import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_ORDERS, VOUCHERS } from '../data/mockData';

const CartContext = createContext();

export const DEFAULT_CART = [
  {
    cartItemId: "nem-chua-truyen-thong_nhieu-it-nhieu",
    id: "nem-chua-truyen-thong",
    name: "Nem chua truyền thống",
    pack: "10 chiếc · 200 g / gói",
    price: 85000,
    unit: "gói",
    image: "/assets/nem-truyen-thong.png",
    quantity: 2,
    spices: { garlic: "Nhiều", chili: "Ít", polyscias: "Nhiều" },
    tag: "Phần thơm tỏi · Nhẹ ớt",
  },
  {
    cartItemId: "nem-chua-truyen-thong_it-nhieu-it",
    id: "nem-chua-truyen-thong",
    name: "Nem chua truyền thống",
    pack: "10 chiếc · 200 g / gói",
    price: 85000,
    unit: "gói",
    image: "/assets/nem-truyen-thong.png",
    quantity: 1,
    spices: { garlic: "Ít", chili: "Nhiều", polyscias: "Ít" },
    tag: "Phần nhẹ tỏi · Đậm ớt",
  },
  {
    cartItemId: "combo-sum-vay",
    id: "combo-sum-vay",
    name: "Combo Sum vầy",
    pack: "30 chiếc · 600 g / combo",
    price: 235000,
    unit: "combo",
    image: "/assets/combo-sum-vay.png",
    quantity: 1,
    isCombo: true,
    comboSubItems: [
      {
        id: "nem-chua-truyen-thong",
        name: "Nem truyền thống",
        qtyText: "2 gói × 10 chiếc",
        spices: { garlic: "Ít", chili: "Ít", polyscias: "Nhiều" },
      },
      {
        id: "nem-chua-la-oi",
        name: "Nem lá ổi",
        qtyText: "1 gói × 10 chiếc",
        spices: { garlic: "Nhiều", chili: "Nhiều", polyscias: "Ít" },
      },
    ],
  },
];

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('zs_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_CART;
      }
      return DEFAULT_CART;
    } catch {
      return DEFAULT_CART;
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('nep_orders_v2');
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
      localStorage.setItem('nep_orders_v2', JSON.stringify(orders));
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

  const computeSpiceTag = (spices) => {
    if (!spices) return '';
    const garlicText = spices.garlic === 'Nhiều' ? 'thơm tỏi' : 'nhẹ tỏi';
    const chiliText = spices.chili === 'Nhiều' ? 'Đậm ớt' : 'Nhẹ ớt';
    return `Phần ${garlicText} · ${chiliText}`;
  };

  const addToCart = (product, quantity = 1, spices = null, eatTime = "Ăn ngay trong ngày", note = "") => {
    const finalSpices = spices || product.defaultSpices || {
      garlic: "Nhiều",
      chili: "Ít",
      polyscias: "Nhiều"
    };

    const isCombo = product.id === 'combo-sum-vay' || product.isCombo;
    const spiceKey = isCombo 
      ? `combo_${Date.now()}` 
      : `${finalSpices.garlic}-${finalSpices.chili}-${finalSpices.polyscias}`;
    const cartItemId = `${product.id}_${spiceKey}`;

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
        const newItem = {
          cartItemId,
          id: product.id,
          name: product.name,
          pack: product.pack || (product.unit ? `10 chiếc · 200 g / ${product.unit}` : 'Phần'),
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          unit: product.unit || "phần",
          quantity,
          spices: finalSpices,
          tag: computeSpiceTag(finalSpices),
          eatTime,
          note,
          isCombo,
          comboSubItems: isCombo ? (product.comboSubItems || DEFAULT_CART[2].comboSubItems) : null,
        };
        return [...prev, newItem];
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

  const updateItemSpices = (cartItemId, newSpices) => {
    setCart(prev => prev.map(item => {
      if (item.cartItemId === cartItemId) {
        return {
          ...item,
          spices: newSpices,
          tag: computeSpiceTag(newSpices),
        };
      }
      return item;
    }));
    showToast("Đã cập nhật lựa chọn gia vị.");
  };

  const updateComboSubSpices = (cartItemId, subIndex, newSpices) => {
    setCart(prev => prev.map(item => {
      if (item.cartItemId === cartItemId && item.comboSubItems) {
        const updatedSubs = [...item.comboSubItems];
        updatedSubs[subIndex] = {
          ...updatedSubs[subIndex],
          spices: newSpices,
        };
        return {
          ...item,
          comboSubItems: updatedSubs,
        };
      }
      return item;
    }));
    showToast("Đã cập nhật gia vị cho món trong combo.");
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
  const shippingFee = totalPrice === 0 ? 0 : 30000;
  const finalPrice = Math.max(0, totalPrice - discountAmount + shippingFee);

  const createOrder = (orderInfo) => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const stamp = `${pad(now.getHours())}:${pad(now.getMinutes())} · ${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;
    const newOrder = {
      id: `NN${pad(now.getMonth() + 1)}${pad(now.getDate())}-${String(Date.now()).slice(-3)}`,
      createdAt: stamp,
      createdAtShort: `${pad(now.getDate())}/${pad(now.getMonth() + 1)} · ${pad(now.getHours())}:${pad(now.getMinutes())}`,
      status: "Chờ xác nhận",
      paymentMethod: "COD",
      paymentStatus: "Chưa thanh toán",
      source: "Cửa hàng trực tuyến",
      items: [...cart],
      totalAmount: finalPrice,
      subtotal: totalPrice,
      discountAmount,
      shippingFee,
      voucherCode: activeVoucher ? activeVoucher.code : null,
      timeline: [
        { time: stamp.replace(`/${now.getFullYear()}`, ''), title: "Khách đặt đơn trên cửa hàng", done: true },
        { time: stamp.replace(`/${now.getFullYear()}`, ''), title: "Đã lưu gia vị, ghi chú và thời điểm sử dụng", done: true },
        { time: "", title: "Liên hệ khách, xác nhận lịch giao phù hợp", done: false, current: true },
      ],
      ...orderInfo
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setActiveVoucher(null);
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)));
    showToast(`Đã cập nhật trạng thái đơn ${orderId} sang "${newStatus}"`);
  };

  const updateOrder = (orderId, patch) => {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, ...patch } : order)));
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
        updateOrderStatus,
        updateOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
