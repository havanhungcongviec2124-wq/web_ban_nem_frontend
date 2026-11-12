import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Eyebrow, formatVnd } from '../components/NepUI';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const { orders, myOrders } = useCart();
  const allOrders = useMemo(() => [...(orders || []), ...(myOrders || [])], [orders, myOrders]);
  const order = useMemo(
    () => allOrders.find((o) => o.id === orderId) || allOrders[0],
    [allOrders, orderId]
  );

  if (!order) {
    return (
      <div className="bg-nep-cream py-20 text-center">
        <p className="font-serif text-[24px]">Chưa thấy đơn này.</p>
        <Link to="/home" className="text-[13px] text-nep-green mt-3 inline-block">
          Về trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-nep-cream pb-16 pt-9 px-4 sm:px-8 lg:px-18">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-3">
          <Eyebrow>Nếp đã nhận đơn</Eyebrow>
          <h1 className="font-serif font-semibold text-[36px] sm:text-[42px] leading-[1.3] tracking-[-0.6px]">
            Cảm ơn bạn.<br />Nếp sẽ liên hệ để hẹn giao.
          </h1>
          <p className="text-[14px] text-nep-muted">
            Mã đơn <span className="font-semibold text-nep-rose">#{order.id}</span>
          </p>
        </div>

        <div className="bg-nep-blush rounded-xl p-5">
          <p className="text-[12px] uppercase tracking-[1.5px] font-semibold text-nep-rose">Ngày bạn muốn thưởng thức</p>
          <p className="font-serif text-[22px] mt-1">{order.desiredEatTime || 'Sẽ thống nhất khi Nếp gọi'}</p>
          <p className="text-[12px] text-nep-muted mt-1">Trạng thái: {order.status}</p>
        </div>

        <div className="bg-nep-paper border border-nep-line rounded-xl p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px]">
            <div>
              <p className="text-nep-muted">Người nhận</p>
              <p className="font-semibold">{order.customerName}</p>
              <p>{order.phone}</p>
            </div>
            <div>
              <p className="text-nep-muted">Giao tới</p>
              <p>{order.address}</p>
              <p className="text-nep-muted mt-1">{order.paymentMethod}</p>
            </div>
          </div>
          {order.note && <p className="text-[13px] text-nep-muted">Ghi chú: {order.note}</p>}

          <div className="h-px bg-nep-line" />
          {order.items?.map((item, idx) => (
            <div key={idx} className="flex justify-between gap-3 text-[13px]">
              <div>
                <p className="font-semibold">{item.name} ×{item.quantity}</p>
                <p className="text-[12px] text-nep-muted">
                  Tỏi {item.spices?.garlic} · Ớt {item.spices?.chili} · Đinh lăng {item.spices?.polyscias}
                </p>
              </div>
              <p className="text-nep-rose font-semibold">{formatVnd(item.price * item.quantity)}</p>
            </div>
          ))}
          <div className="h-px bg-nep-line" />
          <div className="flex justify-between items-baseline">
            <span className="font-semibold">Tổng</span>
            <span className="text-[24px] font-semibold text-nep-rose">{formatVnd(order.totalAmount)}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to="/home" className="min-h-12 px-5 rounded-lg border border-nep-line text-nep-green text-[14px] font-semibold flex items-center">
            Về trang chủ
          </Link>
          <Link to="/products" className="min-h-12 px-5 rounded-lg bg-nep-rose text-white text-[14px] font-semibold flex items-center">
            Chọn thêm món →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
