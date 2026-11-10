import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { 
  IconShieldCheck, 
  IconTruck, 
  IconClock, 
  IconCheck, 
  IconArrowRight,
  IconGarlic,
  IconChili,
  IconHerb
} from '../components/Icons';

const Checkout = () => {
  const { cart, finalPrice, totalPrice, shippingFee, discountAmount, activeVoucher, createOrder } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    address: '',
    city: 'Hà Nội',
    deliveryTimeOption: 'Giao càng sớm càng tốt',
    desiredEatTime: 'Ăn ngay tối nay (nem chín tới)',
    note: '',
    paymentMethod: 'COD' // 'COD', 'VIETQR', 'MOMO'
  });

  const [errors, setErrors] = useState({});

  if (cart.length === 0) {
    return (
      <div className="bg-stone-50 min-h-screen py-16 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-stone-200 shadow-xs">
          <h2 className="text-xl font-bold text-stone-900 mb-2">Giỏ hàng của bạn đang trống</h2>
          <p className="text-xs text-stone-500 mb-6">Vui lòng chọn món nem trước khi tiến hành thanh toán.</p>
          <Link to="/products" className="px-6 py-2.5 rounded-xl bg-red-700 text-white font-bold text-xs">
            Quay lại chọn nem
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.customerName.trim()) errs.customerName = 'Vui lòng nhập họ và tên của bạn';
    if (!formData.phone.trim()) {
      errs.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9+-. ]{9,13}$/.test(formData.phone.trim())) {
      errs.phone = 'Số điện thoại không hợp lệ';
    }
    if (!formData.address.trim()) errs.address = 'Vui lòng nhập địa chỉ nhận hàng chi tiết';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newOrder = createOrder({
      customerName: formData.customerName.trim(),
      phone: formData.phone.trim(),
      address: `${formData.address.trim()}, ${formData.city}`,
      desiredEatTime: formData.desiredEatTime,
      deliveryTimeOption: formData.deliveryTimeOption,
      note: formData.note.trim(),
      paymentMethod: 
        formData.paymentMethod === 'COD' 
          ? 'COD (Thanh toán khi nhận hàng)' 
          : formData.paymentMethod === 'VIETQR' 
            ? 'Chuyển khoản VietQR ngân hàng' 
            : 'Ví điện tử MoMo / ZaloPay',
    });

    navigate(`/order-success/${newOrder.id}`);
  };

  return (
    <div className="bg-stone-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
            Thanh Toán & Xác Nhận Đơn Hàng
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Vui lòng điền thông tin để tiệm chuẩn bị mẻ nem đúng chuẩn yêu cầu của bạn
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 7 cols: Customer info, eating time & payment */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Customer Information Card */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <h3 className="font-bold text-base text-stone-900 flex items-center gap-2 pb-2 border-b border-stone-100">
                  <span className="w-6 h-6 rounded-full bg-red-700 text-white text-xs flex items-center justify-center font-bold">1</span>
                  Thông Tin Người Nhận Hàng
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Họ và tên của bạn <span className="text-red-600">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="customerName"
                      placeholder="VD: Nguyễn Văn Hùng"
                      value={formData.customerName}
                      onChange={handleChange}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 ${
                        errors.customerName ? 'border-red-500 ring-1 ring-red-500' : 'border-stone-300 focus:ring-red-600'
                      }`}
                    />
                    {errors.customerName && <p className="text-2xs text-red-600 mt-1">{errors.customerName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Số điện thoại nhận hàng <span className="text-red-600">*</span>
                    </label>
                    <input 
                      type="tel" 
                      name="phone"
                      placeholder="VD: 0912.345.678"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 ${
                        errors.phone ? 'border-red-500 ring-1 ring-red-500' : 'border-stone-300 focus:ring-red-600'
                      }`}
                    />
                    {errors.phone && <p className="text-2xs text-red-600 mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Địa chỉ chi tiết (Số nhà, tên ngõ/đường, phường/xã) <span className="text-red-600">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="address"
                      placeholder="VD: Số 28 Vạn Bảo, Phường Liễu Giai"
                      value={formData.address}
                      onChange={handleChange}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 ${
                        errors.address ? 'border-red-500 ring-1 ring-red-500' : 'border-stone-300 focus:ring-red-600'
                      }`}
                    />
                    {errors.address && <p className="text-2xs text-red-600 mt-1">{errors.address}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Tỉnh / Thành Phố
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-red-600 font-medium"
                    >
                      <option value="Hà Nội">Hà Nội</option>
                      <option value="Thanh Hóa">Thanh Hóa</option>
                      <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                      <option value="Hải Phòng">Hải Phòng</option>
                      <option value="Đà Nẵng">Đà Nẵng</option>
                      <option value="Tỉnh thành khác">Tỉnh thành khác (Gửi xe/CPN)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* CRITICAL FEATURE: Desired Eating Time & Delivery Note */}
              <div className="bg-white p-6 rounded-2xl border-2 border-emerald-600/40 shadow-xs space-y-4">
                <h3 className="font-bold text-base text-emerald-950 flex items-center justify-between pb-2 border-b border-stone-100">
                  <span className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs flex items-center justify-center font-bold">2</span>
                    Thời Gian Sử Dụng & Ghi Chú Giao Hàng
                  </span>
                  <span className="text-2xs px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold uppercase">
                    Đặc thù nem chua
                  </span>
                </h3>

                <div>
                  <label className="block text-xs font-bold text-stone-900 mb-1.5">
                    Bạn dự kiến ăn nem vào thời gian nào? <span className="text-red-600">*</span>
                  </label>
                  <p className="text-2xs text-stone-500 mb-2">
                    * Xưởng sẽ dựa vào thông tin này để chọn mẻ nem có độ chín lên men hoàn hảo đúng bữa ăn của bạn.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { val: 'Ăn ngay tối nay (nem chín tới)', label: 'Ăn ngay trong ngày', sub: 'Mẻ nem đã chín tới ăn liền' },
                      { val: 'Chiều mai mới ăn (liên hoan)', label: 'Ngày mai mới dùng', sub: 'Mẻ nem đang ủ, mai vừa ngon' },
                      { val: 'Cuối tuần / Làm quà biếu', label: 'Cuối tuần / Quà biếu', sub: 'Mẻ nem mới gói sáng nay' },
                    ].map((item) => (
                      <label 
                        key={item.val}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          formData.desiredEatTime === item.val
                            ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold shadow-2xs'
                            : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="desiredEatTime" 
                          value={item.val}
                          checked={formData.desiredEatTime === item.val}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className="block leading-tight">{item.label}</div>
                        <div className="text-3xs text-stone-500 font-normal mt-1">{item.sub}</div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Ghi chú đặc biệt cho tài xế hoặc xưởng nem:
                  </label>
                  <textarea 
                    name="note"
                    rows="2"
                    placeholder="VD: Gọi trước khi giao 15 phút, gửi thêm 2 gói tương ớt, bọc xốp kỹ giúp mình..."
                    value={formData.note}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-red-600"
                  ></textarea>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <h3 className="font-bold text-base text-stone-900 flex items-center gap-2 pb-2 border-b border-stone-100">
                  <span className="w-6 h-6 rounded-full bg-red-700 text-white text-xs flex items-center justify-center font-bold">3</span>
                  Phương Thức Thanh Toán
                </h3>

                <div className="space-y-2.5">
                  <label className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    formData.paymentMethod === 'COD' 
                      ? 'border-red-600 bg-red-50/50 shadow-2xs' 
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="COD"
                      checked={formData.paymentMethod === 'COD'}
                      onChange={handleChange}
                      className="text-red-600 focus:ring-red-500"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-stone-900 block">Thanh toán khi nhận hàng (COD)</span>
                      <span className="text-stone-500">Kiểm tra nem tươi ngon rồi thanh toán tiền mặt cho shipper</span>
                    </div>
                  </label>

                  <label className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    formData.paymentMethod === 'VIETQR' 
                      ? 'border-red-600 bg-red-50/50 shadow-2xs' 
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="VIETQR"
                      checked={formData.paymentMethod === 'VIETQR'}
                      onChange={handleChange}
                      className="text-red-600 focus:ring-red-500"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-stone-900 block">Chuyển khoản Ngân Hàng qua mã VietQR (Nhanh chóng)</span>
                      <span className="text-stone-500">Quét mã QR tự động điền số tiền và nội dung đơn hàng</span>
                    </div>
                  </label>

                  <label className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    formData.paymentMethod === 'MOMO' 
                      ? 'border-red-600 bg-red-50/50 shadow-2xs' 
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="MOMO"
                      checked={formData.paymentMethod === 'MOMO'}
                      onChange={handleChange}
                      className="text-red-600 focus:ring-red-500"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-stone-900 block">Ví điện tử MoMo / ZaloPay</span>
                      <span className="text-stone-500">Thanh toán tức thì qua ví điện tử</span>
                    </div>
                  </label>
                </div>
              </div>

            </div>

            {/* Right 5 cols: Order Items & Confirmation Card */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4 sticky top-28">
                <h3 className="font-black text-base text-stone-900 pb-3 border-b border-stone-100 flex items-center justify-between">
                  <span>Sản Phẩm Đặt Mua ({cart.length})</span>
                  <Link to="/cart" className="text-xs text-red-700 hover:underline font-semibold">
                    Sửa giỏ hàng
                  </Link>
                </h3>

                {/* Items preview list */}
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.cartItemId} className="flex items-start gap-3 text-xs pb-3 border-b border-stone-100 last:border-0 last:pb-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-12 h-12 rounded-lg object-cover border border-stone-100 shrink-0" 
                      />
                      <div className="flex-1">
                        <div className="font-bold text-stone-900">{item.name}</div>
                        <div className="text-2xs text-stone-500">
                          SL: <strong>x{item.quantity}</strong> ({item.unit}) • {item.price.toLocaleString('vi-VN')}đ
                        </div>
                        {/* Selected spices display */}
                        <div className="text-3xs text-stone-600 flex items-center gap-1.5 pt-0.5 font-medium">
                          <span className="text-amber-800">Tỏi: {item.spices?.garlic}</span>
                          <span>•</span>
                          <span className="text-red-700">Ớt: {item.spices?.chili}</span>
                          <span>•</span>
                          <span className="text-emerald-800">Lá: {item.spices?.polyscias}</span>
                        </div>
                      </div>
                      <div className="font-bold text-red-700 shrink-0">
                        {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary calculation */}
                <div className="pt-3 border-t border-stone-200 space-y-2 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>Tạm tính tiền hàng:</span>
                    <span className="font-semibold text-stone-900">{totalPrice.toLocaleString('vi-VN')}đ</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Phí vận chuyển:</span>
                    <span>
                      {shippingFee === 0 ? (
                        <span className="text-emerald-600 font-bold">Miễn phí ship</span>
                      ) : (
                        <span className="font-semibold text-stone-900">{shippingFee.toLocaleString('vi-VN')}đ</span>
                      )}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-red-700 font-bold">
                      <span>Mã giảm giá ({activeVoucher?.code}):</span>
                      <span>-{discountAmount.toLocaleString('vi-VN')}đ</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
                    <span className="text-sm font-black text-stone-900">Tổng thanh toán:</span>
                    <span className="text-2xl font-black text-red-700">
                      {finalPrice.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-linear-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transition-all transform active:scale-98"
                >
                  <span>Xác Nhận & Đặt Hàng Ngay</span>
                  <IconArrowRight className="w-4 h-4" />
                </button>

                <p className="text-center text-3xs text-stone-400">
                  Bằng việc bấm đặt hàng, bạn đồng ý với chính sách giao hàng và đổi trả của ZS Food.
                </p>
              </div>

            </div>

          </div>
        </form>

      </div>
    </div>
  );
};

export default Checkout;

