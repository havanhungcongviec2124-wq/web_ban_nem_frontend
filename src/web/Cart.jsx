import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { 
  IconTrash, 
  IconPlus, 
  IconMinus, 
  IconArrowRight, 
  IconCheck, 
  IconGarlic, 
  IconChili, 
  IconHerb,
  IconClock,
  IconShieldCheck
} from '../components/Icons';
import { VOUCHERS } from '../data/mockData';

const Cart = () => {
  const { 
    cart, 
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
    removeVoucher
  } = useCart();

  const navigate = useNavigate();
  const [voucherInput, setVoucherInput] = useState('');
  const [voucherMsg, setVoucherMsg] = useState({ text: '', isError: false });

  const handleApplyVoucher = (e) => {
    e.preventDefault();
    if (!voucherInput.trim()) return;
    const res = applyVoucher(voucherInput);
    if (res.success) {
      setVoucherMsg({ text: res.message, isError: false });
      setVoucherInput('');
    } else {
      setVoucherMsg({ text: res.message, isError: true });
    }
  };

  if (cart.length === 0) {
    return (
      <div className="bg-stone-50 min-h-screen py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white rounded-3xl border border-stone-200 p-10 shadow-xs">
            <span className="text-6xl block mb-4">🛒</span>
            <h2 className="text-2xl font-black text-stone-900 mb-2">Giỏ hàng của bạn đang trống</h2>
            <p className="text-stone-500 text-sm mb-6">
              Bạn chưa chọn món nem nào. Hãy khám phá ngay các món nem chua đặc sản và combo tiết kiệm tại ZS Food nhé!
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-sm shadow-md transition-all"
            >
              <span>Xem Thực Đơn Nem</span>
              <IconArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
              Giỏ Hàng Của Bạn ({totalItems} món)
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Kiểm tra kỹ khẩu vị gia vị và thời gian dự kiến ăn trước khi đặt hàng
            </p>
          </div>
          <button 
            onClick={clearCart}
            className="text-xs text-stone-400 hover:text-red-700 underline font-medium self-start sm:self-auto"
          >
            Xóa tất cả
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => (
              <div 
                key={item.cartItemId}
                className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row gap-4 sm:items-center justify-between"
              >
                {/* Product image & details */}
                <div className="flex items-start gap-4 flex-1">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-stone-100 shrink-0"
                  />
                  <div className="space-y-1.5 flex-1">
                    <h3 className="font-bold text-stone-900 text-sm sm:text-base leading-snug">
                      <Link to={`/product/${item.id}`} className="hover:text-red-700">
                        {item.name}
                      </Link>
                    </h3>
                    
                    <div className="text-xs font-semibold text-red-700">
                      {item.price.toLocaleString('vi-VN')}đ <span className="text-stone-400 font-normal">/ {item.unit || 'phần'}</span>
                    </div>

                    {/* Spices tags: Garlic, Chili, Polyscias */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1 text-2xs">
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 font-medium flex items-center gap-1">
                        <IconGarlic className="text-xs" /> Tỏi: <strong>{item.spices?.garlic || 'Nhiều'}</strong>
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-red-50 text-red-900 border border-red-200 font-medium flex items-center gap-1">
                        <IconChili className="text-xs" /> Ớt: <strong>{item.spices?.chili || 'Ít'}</strong>
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-200 font-medium flex items-center gap-1">
                        <IconHerb className="text-xs" /> Đinh Lăng: <strong>{item.spices?.polyscias || 'Nhiều'}</strong>
                      </span>
                    </div>

                    {/* Eat time & Note */}
                    {item.eatTime && (
                      <div className="text-2xs text-stone-500 flex items-center gap-1 pt-0.5">
                        <IconClock className="w-3 h-3 text-stone-400 shrink-0" />
                        <span>Thời gian ăn: <strong className="text-stone-700">{item.eatTime}</strong></span>
                      </div>
                    )}
                    {item.note && (
                      <div className="text-2xs text-stone-400 italic">
                        Ghi chú: "{item.note}"
                      </div>
                    )}
                  </div>
                </div>

                {/* Quantity and Actions */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                  <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-stone-50">
                    <button 
                      type="button" 
                      onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                      className="p-1.5 text-stone-600 hover:bg-stone-200 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <IconMinus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-stone-900">{item.quantity}</span>
                    <button 
                      type="button" 
                      onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                      className="p-1.5 text-stone-600 hover:bg-stone-200 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <IconPlus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="text-sm sm:text-base font-black text-red-700 block">
                      {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                    </span>
                    <button 
                      type="button"
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="text-2xs text-stone-400 hover:text-red-700 flex items-center gap-1 mt-1"
                    >
                      <IconTrash className="w-3 h-3" />
                      <span>Xóa</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-3">
              <IconShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>
                <strong>Cam kết ZS Food:</strong> Mọi lựa chọn gia vị (Tỏi, Ớt, Đinh Lăng) và thời gian ăn đều được truyền tải trực tiếp tới xưởng gói nem để đảm bảo nem chuẩn vị nhất!
              </span>
            </div>
          </div>

          {/* Right: Order Summary & Voucher */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Voucher Box */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900">
                Mã Khuyến Mãi / Voucher
              </h3>

              {activeVoucher ? (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black text-red-700 block">
                      Mã: {activeVoucher.code}
                    </span>
                    <span className="text-2xs text-stone-600">
                      -{activeVoucher.discount.toLocaleString('vi-VN')}đ ({activeVoucher.desc})
                    </span>
                  </div>
                  <button 
                    onClick={removeVoucher}
                    className="text-xs text-stone-400 hover:text-red-700 font-bold"
                  >
                    Hủy
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyVoucher} className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Nhập mã giảm giá..."
                    value={voucherInput}
                    onChange={(e) => setVoucherInput(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs border border-stone-300 rounded-lg uppercase font-semibold focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-900 hover:bg-black text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    Áp dụng
                  </button>
                </form>
              )}

              {voucherMsg.text && (
                <div className={`text-2xs ${voucherMsg.isError ? 'text-red-600' : 'text-emerald-700'}`}>
                  {voucherMsg.text}
                </div>
              )}

              {/* Suggested vouchers */}
              <div className="pt-2 border-t border-stone-100">
                <span className="text-3xs text-stone-400 uppercase font-bold block mb-1.5">Gợi ý mã hot:</span>
                <div className="flex flex-wrap gap-1.5 text-2xs">
                  {VOUCHERS.map(v => (
                    <button
                      key={v.code}
                      type="button"
                      onClick={() => {
                        setVoucherInput(v.code);
                        applyVoucher(v.code);
                      }}
                      className="px-2 py-1 bg-stone-100 hover:bg-red-50 text-stone-700 hover:text-red-700 rounded-md border border-stone-200 font-mono font-bold"
                    >
                      {v.code}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Total Summary */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <h3 className="font-black text-base text-stone-900 pb-3 border-b border-stone-100">
                Tóm Tắt Đơn Hàng
              </h3>

              <div className="space-y-2.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Tạm tính tiền hàng:</span>
                  <span className="font-bold text-stone-800">{totalPrice.toLocaleString('vi-VN')}đ</span>
                </div>

                <div className="flex justify-between">
                  <span>Phí vận chuyển:</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 font-bold">Miễn phí (Đơn ≥300k)</span>
                    ) : (
                      <span className="font-bold text-stone-800">{shippingFee.toLocaleString('vi-VN')}đ</span>
                    )}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-red-700 font-semibold">
                    <span>Giảm giá khuyến mãi:</span>
                    <span>-{discountAmount.toLocaleString('vi-VN')}đ</span>
                  </div>
                )}

                <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-stone-900">Tổng thanh toán:</span>
                  <span className="text-2xl font-black text-red-700">
                    {finalPrice.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="w-full py-4 rounded-xl bg-linear-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <span>Tiến Hành Đặt Hàng</span>
                <IconArrowRight className="w-4 h-4" />
              </button>

              <Link
                to="/products"
                className="block text-center text-xs font-semibold text-stone-500 hover:text-red-700 pt-1"
              >
                ← Tiếp tục mua thêm nem
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Cart;

