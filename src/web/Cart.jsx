import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const formatVnd = (amount) => {
  return amount !== undefined && amount !== null
    ? `${amount.toLocaleString('vi-VN')} đ`
    : '0 đ';
};

const Cart = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    totalItems,
    totalPrice,
    shippingFee,
    finalPrice,
    updateItemSpices,
    updateComboSubSpices,
  } = useCart();

  const navigate = useNavigate();

  // State to track which item is currently being edited for spices
  // format: { cartItemId, subIndex: null | number }
  const [editingSpiceTarget, setEditingSpiceTarget] = useState(null);
  const [tempSpices, setTempSpices] = useState({ garlic: 'Ít', chili: 'Ít', polyscias: 'Nhiều' });

  // Detect if there are multiple lines of the same product with different spices
  const hasMultipleSameProduct = React.useMemo(() => {
    const idCounts = {};
    for (const item of cart) {
      idCounts[item.id] = (idCounts[item.id] || 0) + 1;
    }
    return Object.values(idCounts).some((count) => count > 1);
  }, [cart]);

  const handleOpenEditSpice = (cartItemId, currentSpices, subIndex = null) => {
    setEditingSpiceTarget({ cartItemId, subIndex });
    setTempSpices(currentSpices || { garlic: 'Ít', chili: 'Ít', polyscias: 'Nhiều' });
  };

  const handleSaveSpices = () => {
    if (!editingSpiceTarget) return;
    const { cartItemId, subIndex } = editingSpiceTarget;
    if (subIndex !== null) {
      updateComboSubSpices(cartItemId, subIndex, tempSpices);
    } else {
      updateItemSpices(cartItemId, tempSpices);
    }
    setEditingSpiceTarget(null);
  };

  if (cart.length === 0) {
    return (
      <div className="bg-[#faf7ef] min-h-screen text-[#26392c] w-full px-4 sm:px-8 lg:px-18 pt-12 pb-24 text-center">
        <div className="max-w-md mx-auto bg-[#fffefa] border border-[#dedccf] rounded-2xl p-10 space-y-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <p className="font-serif font-bold text-[32px] text-[#22382a]">Giỏ hàng đang trống.</p>
          <p className="text-[14px] text-[#6b7264]">
            Chọn một gói nem, một combo — rồi Nếp lo phần còn lại.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center justify-center min-h-12 px-6 rounded-xl bg-[#ad3c32] hover:bg-[#962f26] text-white text-[14px] font-medium shadow-xs transition-colors"
          >
            Chọn món ngon ngay →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#faf7ef] min-h-screen text-[#26392c]">
      <div className="w-full px-4 sm:px-8 lg:px-18 pt-7 pb-24">
        
        {/* Breadcrumb */}
        <nav className="text-[12px] text-[#75796c] mb-6 flex items-center gap-2">
          <Link to="/home" className="hover:text-[#26392c]">Trang chủ</Link>
          <span>/</span>
          <span className="text-[#26392c] font-medium">Giỏ hàng</span>
        </nav>

        {/* Heading & Step Indicator */}
        <div className="mb-8 space-y-3">
          <h1 className="font-serif font-bold text-[34px] sm:text-[42px] text-[#22382a] leading-tight tracking-[-0.6px]">
            Gói đủ vị, sẵn sàng vui.
          </h1>

          {/* Stepper bar */}
          <div className="flex items-center gap-6 text-[13px] pt-1">
            <span className="font-semibold text-[#ad3c32] border-b-2 border-[#ad3c32] pb-0.5">
              01 Giỏ hàng
            </span>
            <span className="text-[#8c9184]">
              02 Thanh toán
            </span>
            <span className="text-[#8c9184]">
              03 Xác nhận
            </span>
          </div>
        </div>

        {/* Main Grid: Left Items List (8 cols), Right Summary (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Pink Notice Box: "Cùng món, khác gia vị = hai dòng riêng" */}
            {hasMultipleSameProduct && (
              <div className="bg-[#faebe8] border border-[#f5d9d4] rounded-2xl p-4 sm:p-4.5 mb-5 space-y-1">
                <h4 className="font-bold text-[13px] text-[#ad3c32]">
                  Cùng món, khác gia vị = hai dòng riêng
                </h4>
                <p className="text-[12px] text-[#7a4d46] leading-[1.6]">
                  Hai phần nem truyền thống dưới đây được giữ riêng để Nếp gói đúng khẩu vị. Kiểm tra từng dòng trước khi thanh toán nhé.
                </p>
              </div>
            )}

            {/* Cart Items List */}
            <div className="space-y-4">
              {cart.map((item) => {
                const isComboItem = Boolean(item.isCombo || item.comboSubItems);

                return (
                  <div
                    key={item.cartItemId}
                    className="bg-[#fffefa] border border-[#dedccf] rounded-2xl p-5 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-4 relative"
                  >
                    {/* Top Row: Thumbnail + Info + Delete button */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-[#eee]"
                        />
                        <div className="space-y-0.5">
                          <h3 className="font-semibold text-[17px] text-[#22382a] leading-tight">
                            <Link to={`/product/${item.id}`} className="hover:text-[#ad3c32]">
                              {item.name}
                            </Link>
                          </h3>
                          <p className="text-[12px] text-[#7a8072]">
                            {item.pack || (item.unit ? `10 chiếc · 200 g / ${item.unit}` : 'Phần')}
                          </p>
                          <p className="text-[12px] text-[#7a8072]">
                            {formatVnd(item.price)} / {item.unit || 'gói'}
                          </p>

                          {/* Tag pill if single item */}
                          {!isComboItem && item.tag && (
                            <div className="pt-1">
                              <span className="inline-block bg-[#e8eedf] text-[#31583b] text-[11px] font-medium px-2.5 py-0.5 rounded-full">
                                {item.tag}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Remove button '×' */}
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-[#9a9e94] hover:text-[#ad3c32] text-[22px] leading-none transition-colors p-1"
                        aria-label="Xóa dòng này"
                        title="Xóa dòng này"
                      >
                        ×
                      </button>
                    </div>

                    {/* Middle: Mint Spice Box */}
                    <div className="bg-[#eef4ea] border border-[#cadbc2]/60 rounded-xl p-3.5 sm:p-4 text-[12px]">
                      {isComboItem && item.comboSubItems ? (
                        /* Combo item with sub-items */
                        <div className="space-y-3">
                          {item.comboSubItems.map((sub, sIdx) => {
                            const isEditingThisSub =
                              editingSpiceTarget?.cartItemId === item.cartItemId &&
                              editingSpiceTarget?.subIndex === sIdx;

                            return (
                              <div key={sub.id || sIdx} className="space-y-1">
                                <p className="font-medium text-[#22382a] text-[12px]">
                                  {sub.name} · {sub.qtyText}
                                </p>
                                <p className="text-[#4d594d] text-[12px]">
                                  Tỏi: {sub.spices.garlic} · Ớt: {sub.spices.chili} · Đinh lăng: {sub.spices.polyscias}
                                </p>
                                
                                {!isEditingThisSub ? (
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditSpice(item.cartItemId, sub.spices, sIdx)}
                                    className="text-[11px] text-[#7a8072] hover:text-[#22382a] underline cursor-pointer block pt-0.5"
                                  >
                                    Chỉnh gia vị món này
                                  </button>
                                ) : (
                                  <div className="mt-2.5 pt-2 border-t border-[#cadbc2] space-y-2 bg-white/70 p-2.5 rounded-lg">
                                    <div className="flex items-center gap-2 text-[11px]">
                                      <span className="w-16 font-semibold">Tỏi:</span>
                                      {['Ít', 'Nhiều'].map((opt) => (
                                        <button
                                          key={opt}
                                          type="button"
                                          onClick={() => setTempSpices((s) => ({ ...s, garlic: opt }))}
                                          className={`px-2.5 py-1 rounded text-2xs font-medium border ${
                                            tempSpices.garlic === opt
                                              ? 'bg-[#31583b] text-white border-[#31583b]'
                                              : 'bg-white text-[#555] border-[#ccc]'
                                          }`}
                                        >
                                          {opt}
                                        </button>
                                      ))}
                                    </div>
                                    <div className="flex items-center gap-2 text-[11px]">
                                      <span className="w-16 font-semibold">Ớt:</span>
                                      {['Ít', 'Nhiều'].map((opt) => (
                                        <button
                                          key={opt}
                                          type="button"
                                          onClick={() => setTempSpices((s) => ({ ...s, chili: opt }))}
                                          className={`px-2.5 py-1 rounded text-2xs font-medium border ${
                                            tempSpices.chili === opt
                                              ? 'bg-[#31583b] text-white border-[#31583b]'
                                              : 'bg-white text-[#555] border-[#ccc]'
                                          }`}
                                        >
                                          {opt}
                                        </button>
                                      ))}
                                    </div>
                                    <div className="flex items-center gap-2 text-[11px]">
                                      <span className="w-16 font-semibold">Đinh lăng:</span>
                                      {['Ít', 'Nhiều'].map((opt) => (
                                        <button
                                          key={opt}
                                          type="button"
                                          onClick={() => setTempSpices((s) => ({ ...s, polyscias: opt }))}
                                          className={`px-2.5 py-1 rounded text-2xs font-medium border ${
                                            tempSpices.polyscias === opt
                                              ? 'bg-[#31583b] text-white border-[#31583b]'
                                              : 'bg-white text-[#555] border-[#ccc]'
                                          }`}
                                        >
                                          {opt}
                                        </button>
                                      ))}
                                    </div>
                                    <div className="flex items-center gap-2 pt-1">
                                      <button
                                        type="button"
                                        onClick={handleSaveSpices}
                                        className="px-3 py-1 bg-[#31583b] text-white rounded text-2xs font-bold"
                                      >
                                        Lưu gia vị
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setEditingSpiceTarget(null)}
                                        className="text-2xs text-[#777] hover:underline"
                                      >
                                        Hủy
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        /* Single product spice display */
                        <div>
                          <p className="text-[#22382a] font-medium text-[13px]">
                            Tỏi: {item.spices?.garlic || 'Nhiều'} · Ớt: {item.spices?.chili || 'Ít'} · Đinh lăng: {item.spices?.polyscias || 'Nhiều'}
                          </p>

                          {editingSpiceTarget?.cartItemId !== item.cartItemId ? (
                            <button
                              type="button"
                              onClick={() => handleOpenEditSpice(item.cartItemId, item.spices, null)}
                              className="text-[12px] text-[#5e6657] hover:text-[#22382a] underline cursor-pointer block mt-1"
                            >
                              Chỉnh gia vị
                            </button>
                          ) : (
                            <div className="mt-2.5 pt-2 border-t border-[#cadbc2] space-y-2 bg-white/70 p-2.5 rounded-lg">
                              <div className="flex items-center gap-2 text-[11px]">
                                <span className="w-16 font-semibold">Tỏi:</span>
                                {['Ít', 'Nhiều'].map((opt) => (
                                  <button
                                    key={opt}
                                    type="button"
                                    onClick={() => setTempSpices((s) => ({ ...s, garlic: opt }))}
                                    className={`px-2.5 py-1 rounded text-2xs font-medium border ${
                                      tempSpices.garlic === opt
                                        ? 'bg-[#31583b] text-white border-[#31583b]'
                                        : 'bg-white text-[#555] border-[#ccc]'
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>
                              <div className="flex items-center gap-2 text-[11px]">
                                <span className="w-16 font-semibold">Ớt:</span>
                                {['Ít', 'Nhiều'].map((opt) => (
                                  <button
                                    key={opt}
                                    type="button"
                                    onClick={() => setTempSpices((s) => ({ ...s, chili: opt }))}
                                    className={`px-2.5 py-1 rounded text-2xs font-medium border ${
                                      tempSpices.chili === opt
                                        ? 'bg-[#31583b] text-white border-[#31583b]'
                                        : 'bg-white text-[#555] border-[#ccc]'
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>
                              <div className="flex items-center gap-2 text-[11px]">
                                <span className="w-16 font-semibold">Đinh lăng:</span>
                                {['Ít', 'Nhiều'].map((opt) => (
                                  <button
                                    key={opt}
                                    type="button"
                                    onClick={() => setTempSpices((s) => ({ ...s, polyscias: opt }))}
                                    className={`px-2.5 py-1 rounded text-2xs font-medium border ${
                                      tempSpices.polyscias === opt
                                        ? 'bg-[#31583b] text-white border-[#31583b]'
                                        : 'bg-white text-[#555] border-[#ccc]'
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>
                              <div className="flex items-center gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={handleSaveSpices}
                                  className="px-3 py-1 bg-[#31583b] text-white rounded text-2xs font-bold"
                                >
                                  Lưu gia vị
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingSpiceTarget(null)}
                                  className="text-2xs text-[#777] hover:underline"
                                >
                                  Hủy
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bottom Row: Stepper & Line Total */}
                    <div className="flex items-center justify-between pt-1">
                      {/* Stepper */}
                      <div className="bg-[#fffefa] border border-[#cbd8c6] rounded-lg flex items-center px-1.5 py-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-[#555] hover:text-black font-semibold text-[15px] transition-colors"
                          aria-label="Giảm"
                        >
                          −
                        </button>
                        <span className="w-7 text-center font-semibold text-[14px] text-[#22382a]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-[#555] hover:text-black font-semibold text-[15px] transition-colors"
                          aria-label="Tăng"
                        >
                          +
                        </button>
                      </div>

                      {/* Line Total */}
                      <div className="text-right">
                        <span className="font-bold text-[17px] text-[#22382a]">
                          {formatVnd(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Back link */}
            <div className="pt-2">
              <Link
                to="/products"
                className="text-[13px] text-[#5e6657] hover:text-[#22382a] flex items-center gap-1.5 transition-colors font-medium"
              >
                <span>←</span>
                <span>Chọn thêm món ngon</span>
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN (SUMMARY & OCCASION NOTE) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Card 1: "Đơn ngon của bạn" */}
            <div className="bg-[#fffefa] border border-[#dedccf] rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-4">
              <div>
                <h3 className="font-serif font-bold text-[22px] text-[#22382a] leading-tight">
                  Đơn ngon của bạn
                </h3>
                <p className="text-[12px] text-[#7a8072] mt-1">
                  {cart.length} dòng hàng · {totalItems} phần đặt mua
                </p>
              </div>

              {/* Subtotal & Shipping */}
              <div className="space-y-2.5 text-[13px] text-[#3e4539] pt-2">
                <div className="flex justify-between items-center">
                  <span>Tạm tính</span>
                  <span className="font-medium text-[#22382a]">{formatVnd(totalPrice)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Phí giao hàng</span>
                  <span className="font-medium text-[#22382a]">{formatVnd(shippingFee)}</span>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-[#dedccf]" />

              {/* Total */}
              <div className="flex justify-between items-baseline pt-1">
                <span className="font-bold text-[16px] text-[#22382a]">Tổng cộng</span>
                <span className="font-bold text-[24px] text-[#22382a]">
                  {formatVnd(finalPrice)}
                </span>
              </div>

              {/* Tax note */}
              <p className="text-[11px] text-[#8c9184] leading-relaxed">
                Giá đã gồm thuế nếu có. Phí giao nội thành theo địa chỉ mẫu.
              </p>

              {/* Checkout CTA */}
              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="w-full bg-[#ad3c32] hover:bg-[#962f26] text-white font-medium text-[14px] py-3.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-[0.99]"
              >
                <span>Tiến hành thanh toán</span>
                <span>→</span>
              </button>

              {/* Step info caption */}
              <p className="text-[11px] text-[#7a8072] text-center pt-0.5">
                Bạn có thể chọn ngày, giờ sử dụng ở bước tiếp theo.
              </p>
            </div>

            {/* Card 2: "Dành cho dịp nào của bạn?" */}
            <div className="bg-[#fbf4e6] border border-[#ebdcc4] rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-2 font-bold text-[13px] text-[#82541c]">
                <span className="text-[15px]">📅</span>
                <h4>Dành cho dịp nào của bạn?</h4>
              </div>
              <p className="text-[12px] text-[#785b34] leading-[1.65]">
                Ở bước tiếp theo, hãy nhập ngày, giờ mong muốn sử dụng. Nếp liên hệ sắp xếp giao phù hợp, không mặc định đó là giờ giao.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Cart;
