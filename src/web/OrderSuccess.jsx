import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { 
  IconCheck, 
  IconTruck, 
  IconClock, 
  IconPhone, 
  IconGarlic, 
  IconChili, 
  IconHerb, 
  IconShieldCheck,
  IconArrowRight 
} from '../components/Icons';
import { STORE_INFO } from '../data/mockData';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const { orders } = useCart();

  const order = useMemo(() => {
    return orders.find(o => o.id === orderId) || orders[0];
  }, [orders, orderId]);

  if (!order) {
    return (
      <div className="bg-stone-50 min-h-screen py-16 text-center">
        <h2 className="text-xl font-bold">Không tìm thấy thông tin đơn hàng</h2>
        <Link to="/home" className="text-red-700 underline text-sm mt-4 inline-block">
          Về trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Success Card */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden p-6 sm:p-10 text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 text-3xl shadow-xs">
            <IconCheck className="w-10 h-10" />
          </div>

          <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full inline-block mb-2">
            Đặt Hàng Thành Công
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
            Cảm Ơn Quý Khách Đã Đặt Nem Tại ZS Food!
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-lg mx-auto">
            Mã đơn hàng của bạn là <strong className="text-red-700 text-base">#{order.id}</strong>. Tiệm đang chuẩn bị mẻ nem đúng với khẩu vị gia vị và thời gian bạn yêu cầu.
          </p>

          <div className="mt-6 p-4 bg-amber-50/80 rounded-2xl border border-amber-200 text-xs text-amber-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-2.5">
              <IconClock className="w-5 h-5 text-amber-700 shrink-0" />
              <div>
                <span className="font-bold block">Thời gian bạn muốn ăn nem:</span>
                <span className="text-amber-800 font-semibold">{order.desiredEatTime || 'Ăn ngay trong ngày'}</span>
              </div>
            </div>
            <span className="px-3 py-1 bg-amber-200/60 text-amber-900 rounded-lg text-2xs font-extrabold uppercase shrink-0">
              Trạng thái: {order.status}
            </span>
          </div>
        </div>

        {/* Order Details Breakdown */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-black text-stone-900 pb-3 border-b border-stone-100 flex items-center justify-between">
            <span>Chi Tiết Đơn Hàng #{order.id}</span>
            <span className="text-xs text-stone-400 font-normal">{order.createdAt}</span>
          </h2>

          {/* Delivery & Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-700 bg-stone-50 p-4 rounded-2xl border border-stone-200">
            <div>
              <span className="text-stone-400 block font-medium">Người nhận:</span>
              <strong className="text-stone-900 text-sm">{order.customerName}</strong>
              <div className="mt-1 font-semibold">{order.phone}</div>
            </div>
            <div>
              <span className="text-stone-400 block font-medium">Địa chỉ giao hàng:</span>
              <p className="font-medium text-stone-800 leading-snug">{order.address}</p>
              <div className="mt-1 text-stone-500">PT thanh toán: {order.paymentMethod}</div>
            </div>
          </div>

          {order.note && (
            <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-600 border border-stone-200">
              <strong className="text-stone-900">Ghi chú giao hàng:</strong> {order.note}
            </div>
          )}

          {/* Items breakdown with spices */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
              Danh sách nem đã chọn
            </h3>
            <div className="space-y-3">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl border border-stone-100 hover:border-stone-200 transition-colors">
                  <div className="space-y-1">
                    <h4 className="font-bold text-stone-900 text-xs sm:text-sm">{item.name}</h4>
                    <div className="flex items-center gap-2 text-2xs text-stone-500">
                      <span>SL: <strong className="text-stone-800">x{item.quantity}</strong></span>
                      <span>•</span>
                      <span className="text-amber-800 font-semibold">Tỏi: {item.spices?.garlic}</span>
                      <span>•</span>
                      <span className="text-red-700 font-semibold">Ớt: {item.spices?.chili}</span>
                      <span>•</span>
                      <span className="text-emerald-800 font-semibold">Đinh lăng: {item.spices?.polyscias}</span>
                    </div>
                  </div>
                  <div className="font-bold text-red-700 text-sm">
                    {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing total */}
          <div className="pt-4 border-t border-stone-200 space-y-1.5 text-xs text-stone-600 text-right">
            <div>Tạm tính: <strong className="text-stone-900">{order.subtotal?.toLocaleString('vi-VN') || order.totalAmount?.toLocaleString('vi-VN')}đ</strong></div>
            {order.shippingFee !== undefined && (
              <div>Phí vận chuyển: <strong className="text-stone-900">{order.shippingFee === 0 ? 'Miễn phí' : `${order.shippingFee.toLocaleString('vi-VN')}đ`}</strong></div>
            )}
            {order.discountAmount > 0 && (
              <div className="text-red-700 font-bold">Giảm giá: -{order.discountAmount.toLocaleString('vi-VN')}đ</div>
            )}
            <div className="text-base sm:text-lg font-black text-red-700 pt-2 border-t border-stone-100">
              Tổng tiền thanh toán: {order.totalAmount?.toLocaleString('vi-VN')}đ
            </div>
          </div>

          {/* Next action buttons */}
          <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <Link
              to="/home"
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 font-bold text-xs text-center"
            >
              ← Về trang chủ
            </Link>

            <Link
              to="/admin/orders"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-linear-to-r from-red-700 to-red-800 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 shadow-md"
            >
              <span>Xem Đơn Hàng Trong Quản Trị Admin</span>
              <IconArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderSuccess;

