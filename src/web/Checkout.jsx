import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const formatVnd = (amount) => {
  return amount !== undefined && amount !== null
    ? `${amount.toLocaleString('vi-VN')} đ`
    : '0 đ';
};

const inputClass = (hasError) =>
  `w-full min-h-[46px] px-3.5 py-2.5 rounded-xl border bg-white text-[13px] text-[#26392c] placeholder:text-[#9a9e94] outline-none transition-colors ${
    hasError ? 'border-[#ad3c32] ring-1 ring-[#ad3c32]' : 'border-[#dedccf] focus:border-[#31583b]'
  }`;

const Checkout = () => {
  const { cart, finalPrice, totalPrice, shippingFee, createOrder, totalItems, showToast } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Chưa đăng nhập thì chuyển đến trang đăng nhập (backend yêu cầu xác thực để tạo đơn)
  useEffect(() => {
    if (!isAuthenticated) {
      showToast('Vui lòng đăng nhập để đặt hàng!');
      navigate('/login?redirect=/checkout', { replace: true });
    }
  }, [isAuthenticated, navigate, showToast]);

  // Form rỗng — tự động điền sẵn thông tin thật của tài khoản đang đăng nhập
  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    city: 'Hà Nội',
    ward: '',
    address: '',
    eatDate: '',
    eatTime: '',
    note: '',
    paymentMethod: 'COD', // 'COD' | 'BANK'
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="bg-[#faf7ef] min-h-screen text-[#26392c] w-full px-4 sm:px-8 lg:px-[72px] pt-12 pb-24 text-center">
        <div className="max-w-md mx-auto bg-[#fffefa] border border-[#dedccf] rounded-2xl p-10 space-y-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <p className="font-serif font-bold text-[32px] text-[#22382a]">Giỏ hàng đang trống.</p>
          <p className="text-[14px] text-[#6b7264]">
            Bạn chưa có món nào trong giỏ để thanh toán.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center justify-center min-h-12 px-6 rounded-xl bg-[#ad3c32] hover:bg-[#962f26] text-white text-[14px] font-medium shadow-xs transition-colors"
          >
            Quay lại chọn món →
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.customerName.trim()) errs.customerName = 'Vui lòng nhập họ và tên.';
    if (!formData.phone.trim()) errs.phone = 'Vui lòng nhập số điện thoại.';
    if (!formData.address.trim()) errs.address = 'Vui lòng nhập số nhà, đường / ngõ.';
    if (!formData.eatDate.trim()) errs.eatDate = 'Vui lòng chọn ngày sử dụng mong muốn.';
    if (!formData.eatTime.trim()) errs.eatTime = 'Vui lòng chọn giờ sử dụng mong muốn.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (!isAuthenticated) {
      showToast('Vui lòng đăng nhập để đặt hàng!');
      navigate('/login?redirect=/checkout');
      return;
    }

    setSubmitting(true);
    const desiredEatTime = `${formData.eatDate} · ${formData.eatTime}`;
    const result = await createOrder({
      customerName: formData.customerName.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      address: `${formData.address.trim()}${formData.ward ? `, ${formData.ward}` : ''}, ${formData.city}`,
      desiredEatTime,
      note: formData.note.trim(),
      paymentMethod:
        formData.paymentMethod === 'COD'
          ? 'Thanh toán khi nhận hàng (COD)'
          : 'Chuyển khoản ngân hàng',
    });
    setSubmitting(false);

    // Chỉ chuyển hướng khi backend đã ghi nhận đơn hàng thật
    if (result?.success && result.order?.id) {
      navigate(`/order-success/${result.order.id}`);
    }
  };

  return (
    <div className="bg-[#faf7ef] min-h-screen text-[#26392c]">
      <div className="w-full px-4 sm:px-8 lg:px-[72px] pt-7 pb-24">
        
        {/* Breadcrumb */}
        <nav className="text-[12px] text-[#75796c] mb-6 flex items-center gap-2">
          <Link to="/home" className="hover:text-[#26392c]">Trang chủ</Link>
          <span>/</span>
          <Link to="/cart" className="hover:text-[#26392c]">Giỏ hàng</Link>
          <span>/</span>
          <span className="text-[#26392c] font-medium">Thanh toán</span>
        </nav>

        {/* Heading & Step Indicator */}
        <div className="mb-8 space-y-2">
          <h1 className="font-serif font-bold text-[34px] sm:text-[42px] text-[#22382a] leading-tight tracking-[-0.6px]">
            Sắp đến bữa vui rồi.
          </h1>
          <p className="text-[13px] sm:text-[14px] text-[#6b7264]">
            Thêm thông tin nhận hàng và ngày dùng, phần còn lại để Nếp đồng hành.
          </p>

          {/* Stepper bar */}
          <div className="flex items-center gap-6 text-[13px] pt-2">
            <Link to="/cart" className="text-[#7a8072] hover:text-[#26392c] flex items-center gap-1.5">
              <span>✓</span>
              <span>Giỏ hàng</span>
            </Link>
            <span className="font-semibold text-[#ad3c32] border-b-2 border-[#ad3c32] pb-0.5">
              02 Thanh toán
            </span>
            <span className="text-[#8c9184]">
              03 Xác nhận
            </span>
          </div>
        </div>

        {/* Form Layout Grid */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: 4 Numbered Cards */}
          <div className="lg:col-span-8 space-y-5">
            
            {/* CARD 01: THÔNG TIN NHẬN HÀNG */}
            <div className="bg-[#fffefa] border border-[#dedccf] rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-4">
              <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#7d6b46]">
                01 · THÔNG TIN NHẬN HÀNG
              </p>
              <h2 className="font-serif font-bold text-[22px] text-[#22382a] -mt-2">
                Nếp gửi đến bạn
              </h2>

              <div className="space-y-4 pt-1">
                {/* Row 1: Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-medium text-[#3e4539] mb-1.5">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      placeholder="Nhập họ và tên"
                      className={inputClass(errors.customerName)}
                    />
                    {errors.customerName && (
                      <p className="text-[11px] text-[#ad3c32] mt-1">{errors.customerName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-[#3e4539] mb-1.5">
                      Số điện thoại *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Nhập số điện thoại"
                      className={inputClass(errors.phone)}
                    />
                    {errors.phone && (
                      <p className="text-[11px] text-[#ad3c32] mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Row 2: Email */}
                <div>
                  <label className="block text-[12px] font-medium text-[#3e4539] mb-1.5">
                    Email (không bắt buộc)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className={inputClass(false)}
                  />
                </div>

                {/* Row 3: City & Ward */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] font-medium text-[#3e4539] mb-1.5">
                      Tỉnh / thành phố *
                    </label>
                    <div className="relative">
                      <select
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className={`${inputClass(false)} appearance-none pr-8 cursor-pointer`}
                      >
                        <option value="Hà Nội">Hà Nội</option>
                        <option value="Thanh Hóa">Thanh Hóa</option>
                        <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                        <option value="Hải Phòng">Hải Phòng</option>
                        <option value="Đà Nẵng">Đà Nẵng</option>
                      </select>
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#7a8072] text-[12px]">
                        ▼
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12px] font-medium text-[#3e4539] mb-1.5">
                      Phường / xã *
                    </label>
                    <input
                      type="text"
                      name="ward"
                      value={formData.ward}
                      onChange={handleChange}
                      placeholder="Ví dụ: Bồ Đề"
                      className={inputClass(false)}
                    />
                  </div>
                </div>

                {/* Row 4: Street address */}
                <div>
                  <label className="block text-[12px] font-medium text-[#3e4539] mb-1.5">
                    Số nhà, đường / ngõ *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Số nhà, tên đường / ngõ"
                    className={inputClass(errors.address)}
                  />
                  {errors.address && (
                    <p className="text-[11px] text-[#ad3c32] mt-1">{errors.address}</p>
                  )}
                </div>

                {/* Bottom note */}
                <p className="text-[11px] text-[#7a8072] pt-1">
                  Phí giao hàng nội thành: 30.000 đ. Nếp xác nhận khả năng phục vụ và lịch giao sau khi nhận đơn.
                </p>
              </div>
            </div>

            {/* CARD 02: QUAN TRỌNG: NGÀY DÙNG SẢN PHẨM (Warm Amber Pastel Card) */}
            <div className="bg-[#fbf4e6] border border-[#ebdcc4] rounded-2xl p-6 space-y-3">
              <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#ad6b1f]">
                02 · QUAN TRỌNG: NGÀY DÙNG SẢN PHẨM
              </p>
              
              <div className="flex items-center gap-2 -mt-1">
                <span className="text-[18px]">📅</span>
                <h3 className="font-serif font-bold text-[20px] text-[#22382a]">
                  Bạn dự định dùng nem khi nào?
                </h3>
              </div>

              <p className="text-[12px] text-[#7a6138] leading-[1.6]">
                Nếp dùng thông tin này để tư vấn độ chua và sắp xếp giao phù hợp với bữa ăn của bạn.
              </p>

              {/* Date & Time fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-[12px] font-medium text-[#3e4539] mb-1.5">
                    Ngày sử dụng mong muốn *
                  </label>
                  <input
                    type="text"
                    name="eatDate"
                    value={formData.eatDate}
                    onChange={handleChange}
                    placeholder="dd/mm/yyyy"
                    className={inputClass(errors.eatDate)}
                  />
                  {errors.eatDate && (
                    <p className="text-[11px] text-[#ad3c32] mt-1">{errors.eatDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[12px] font-medium text-[#3e4539] mb-1.5">
                    Giờ sử dụng mong muốn *
                  </label>
                  <input
                    type="text"
                    name="eatTime"
                    value={formData.eatTime}
                    onChange={handleChange}
                    placeholder="18:30"
                    className={inputClass(errors.eatTime)}
                  />
                  {errors.eatTime && (
                    <p className="text-[11px] text-[#ad3c32] mt-1">{errors.eatTime}</p>
                  )}
                </div>
              </div>

              {/* Red warning note */}
              <p className="text-[12px] font-medium text-[#ad3c32] leading-[1.6] pt-1">
                Đây là thời điểm SỬ DỤNG, không phải giờ giao được bảo đảm. Lịch giao sẽ được Nếp liên hệ xác nhận riêng.
              </p>
            </div>

            {/* CARD 03: ĐIỀU BẠN MUỐN NHẮN */}
            <div className="bg-[#fffefa] border border-[#dedccf] rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-3">
              <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#7d6b46]">
                03 · ĐIỀU BẠN MUỐN NHẮN
              </p>

              <div>
                <label className="block text-[12px] font-medium text-[#3e4539] mb-1.5">
                  Ghi chú giao hàng
                </label>
                <textarea
                  name="note"
                  rows={3}
                  value={formData.note}
                  onChange={handleChange}
                  placeholder="Ghi chú giao hàng..."
                  className="w-full p-3 rounded-xl border border-[#dedccf] bg-white text-[13px] text-[#26392c] placeholder:text-[#9a9e94] outline-none focus:border-[#31583b] transition-colors leading-[1.6]"
                />
              </div>

              <p className="text-[11px] text-[#7a8072]">
                Ghi chú này được chuyển cho bộ phận chuẩn bị và giao hàng.
              </p>
            </div>

            {/* CARD 04: THANH TOÁN */}
            <div className="bg-[#fffefa] border border-[#dedccf] rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-3">
              <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#7d6b46]">
                04 · THANH TOÁN
              </p>

              <div className="space-y-3 pt-1">
                {/* Option 1: COD */}
                <label
                  onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: 'COD' }))}
                  className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                    formData.paymentMethod === 'COD'
                      ? 'border-2 border-[#a8c5ab] bg-[#eef4ea]'
                      : 'border border-[#dedccf] bg-[#fffefa] hover:border-[#b8b0a0]'
                  }`}
                >
                  <div className="pt-0.5">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        formData.paymentMethod === 'COD'
                          ? 'border-[#31583b]'
                          : 'border-[#ccc]'
                      }`}
                    >
                      {formData.paymentMethod === 'COD' && (
                        <div className="w-2 h-2 rounded-full bg-[#31583b]" />
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="block text-[13px] font-bold text-[#22382a]">
                      Thanh toán khi nhận hàng (COD)
                    </span>
                    <span className="text-[12px] text-[#5e6657] block mt-0.5">
                      Thanh toán {formatVnd(finalPrice)} cho người giao hàng.
                    </span>
                  </div>
                </label>

                {/* Option 2: Bank transfer */}
                <label
                  onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: 'BANK' }))}
                  className={`flex items-start gap-3.5 p-4 rounded-xl border cursor-pointer transition-all ${
                    formData.paymentMethod === 'BANK'
                      ? 'border-2 border-[#a8c5ab] bg-[#eef4ea]'
                      : 'border border-[#dedccf] bg-[#fffefa] hover:border-[#b8b0a0]'
                  }`}
                >
                  <div className="pt-0.5">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        formData.paymentMethod === 'BANK'
                          ? 'border-[#31583b]'
                          : 'border-[#ccc]'
                      }`}
                    >
                      {formData.paymentMethod === 'BANK' && (
                        <div className="w-2 h-2 rounded-full bg-[#31583b]" />
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="block text-[13px] font-bold text-[#22382a]">
                      Chuyển khoản ngân hàng
                    </span>
                    <span className="text-[12px] text-[#7a8072] block mt-0.5">
                      Thông tin chuyển khoản được gửi sau khi xác nhận đơn.
                    </span>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Order Summary Card */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* "Đơn ngon của bạn" Card */}
            <div className="bg-[#fffefa] border border-[#dedccf] rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-4">
              <div>
                <h3 className="font-serif font-bold text-[22px] text-[#22382a] leading-tight">
                  Đơn ngon của bạn
                </h3>
                <p className="text-[12px] text-[#7a8072] mt-1">
                  {cart.length} dòng hàng · {totalItems} phần đặt mua
                </p>
              </div>

              {/* Items List (Typography styled cleanly like Figma screenshot) */}
              <div className="space-y-3.5 pt-1">
                {cart.map((item, idx) => {
                  const isComboItem = Boolean(item.isCombo || item.comboSubItems);

                  return (
                    <div key={item.cartItemId || idx} className="space-y-1">
                      <div className="flex justify-between items-baseline gap-2">
                        <span className="font-semibold text-[13px] text-[#22382a]">
                          {item.name} × {item.quantity}
                        </span>
                        <span className="text-[13px] font-medium text-[#22382a] shrink-0">
                          {formatVnd(item.price * item.quantity)}
                        </span>
                      </div>

                      {/* Spice display */}
                      {!isComboItem ? (
                        <p className="text-[11px] text-[#7a8072]">
                          Tỏi: {item.spices?.garlic || 'Nhiều'} · Ớt: {item.spices?.chili || 'Ít'} · Đinh lăng: {item.spices?.polyscias || 'Nhiều'}
                        </p>
                      ) : (
                        <div className="space-y-1">
                          <p className="text-[11px] text-[#7a8072]">
                            Gia vị riêng cho 2 món - Xem bên dưới:
                          </p>
                          <p className="text-[11px] text-[#7a8072] leading-[1.5] bg-[#f8f6ee] p-2 rounded-lg border border-[#e8e4da]">
                            Trong combo:{' '}
                            {item.comboSubItems
                              ? item.comboSubItems
                                  .map(
                                    (sub) =>
                                      `${sub.name} — Tỏi: ${sub.spices?.garlic || 'Nhiều'}, Ớt: ${sub.spices?.chili || 'Ít'}, Đinh lăng: ${sub.spices?.polyscias || 'Nhiều'}`
                                  )
                                  .join('; ')
                              : 'Xem chi tiết gia vị từng món trong giỏ hàng.'}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="h-px bg-[#dedccf]" />

              {/* Subtotal & Shipping */}
              <div className="space-y-2 text-[13px] text-[#3e4539]">
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
                Giá đã gồm thuế nếu có. Phí giao nội thành mặc định 30.000 đ.
              </p>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#ad3c32] hover:bg-[#962f26] text-white font-medium text-[14px] py-3.5 rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span>Đang gửi đơn hàng...</span>
                  </>
                ) : (
                  <span>Đặt hàng · {formatVnd(finalPrice)}</span>
                )}
              </button>

              {/* Policy note */}
              <p className="text-[11px] text-[#7a8072] text-center pt-0.5">
                Đặt hàng đồng nghĩa bạn đồng ý với chính sách mua hàng của Nếp.
              </p>
            </div>

            {/* Security note under card */}
            <div className="flex items-center gap-1.5 text-[11px] text-[#7a8072] px-1">
              <span>🔒</span>
              <span>Thông tin chỉ dùng để xác nhận và phục vụ đơn hàng của bạn.</span>
            </div>

          </div>

        </form>

      </div>
    </div>
  );
};

export default Checkout;
