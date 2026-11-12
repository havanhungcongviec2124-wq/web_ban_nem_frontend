import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Eyebrow, formatVnd } from '../components/NepUI';
import { normalizeStatus } from './admin/adminUi';

const STATUS_STYLES = {
  'Chờ xác nhận': 'bg-[#f6ead8] text-[#9a6a32]',
  'Đang chuẩn bị': 'bg-[#e7eee0] text-[#3f6a48]',
  'Đang giao': 'bg-[#f7e4de] text-[#ad3c32]',
  'Hoàn tất': 'bg-[#e8efe4] text-[#5c7a62]',
  'Đã hủy': 'bg-nep-mint text-nep-muted',
};

const StatusPill = ({ status }) => {
  const label = normalizeStatus(status);
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${
        STATUS_STYLES[label] || 'bg-nep-mint text-nep-green'
      }`}
    >
      {label}
    </span>
  );
};

const MyOrders = () => {
  const { myOrders } = useCart();
  const { user, isAuthenticated } = useAuth();

  // Chưa đăng nhập — yêu cầu đăng nhập để xem đơn (đơn hàng gắn với tài khoản trên hệ thống)
  if (!isAuthenticated) {
    return (
      <div className="bg-nep-cream pb-16 pt-9 px-4 sm:px-8 text-center space-y-3">
        <p className="font-serif text-[26px] text-nep-ink">Đăng nhập để xem đơn hàng của bạn.</p>
        <p className="text-[13px] text-nep-muted">
          Lịch sử đơn hàng được lưu theo tài khoản trên hệ thống.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center justify-center min-h-12 px-6 rounded-xl bg-nep-rose text-white text-[14px] font-semibold"
        >
          Đăng nhập →
        </Link>
      </div>
    );
  }

  const sorted = [...(myOrders || [])].sort(
    (a, b) => new Date(b.createdAtISO || b.createdAt || 0) - new Date(a.createdAtISO || a.createdAt || 0)
  );

  return (
    <div className="bg-nep-cream pb-16 pt-9 px-4 sm:px-8 lg:px-18 space-y-8">
      <p className="text-[12px] text-nep-muted">
        <Link to="/home">Trang chủ</Link>
        {'  /  '}
        Đơn hàng của tôi
      </p>

      <div className="space-y-3.5">
        <Eyebrow>Nếp ghi lại từng lần sum vầy</Eyebrow>
        <h1 className="font-serif font-semibold text-[36px] sm:text-[48px] leading-[1.3] tracking-[-0.6px]">
          Đơn hàng của tôi.
        </h1>
        <p className="text-[14px] leading-[1.6] text-nep-muted">
          {user?.name ? `${user.name} ơi, ` : ''}đây là các đơn bạn đã đặt tại Nếp Nem — dữ liệu được lấy trực tiếp từ
          hệ thống.
        </p>
      </div>

      {sorted.length === 0 ? (
        <div className="bg-nep-paper border border-nep-line rounded-2xl p-8 text-center space-y-3">
          <p className="font-serif text-[22px] text-nep-ink">Bạn chưa có đơn hàng nào.</p>
          <p className="text-[13px] text-nep-muted">
            Món nem nhà Nếp đang chờ bạn chọn cho lần sum vầy tới.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center justify-center min-h-12 px-6 rounded-xl bg-nep-rose text-white text-[14px] font-semibold"
          >
            Chọn món ngay →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map((order) => (
            <Link
              key={order.id}
              to={`/order-success/${order.id}`}
              className="block bg-nep-paper border border-nep-line rounded-2xl p-5 sm:p-6 hover:border-nep-green/50 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="font-semibold text-nep-ink text-[15px]">#{order.id}</p>
                  <p className="text-[12px] text-nep-muted">
                    Đặt lúc {order.createdAtShort || order.createdAt}
                    {order.items ? ` · ${order.items.length} món` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-3 sm:gap-5">
                  <StatusPill status={order.status} />
                  <p className="font-semibold text-nep-rose text-[16px]">{formatVnd(order.totalAmount)}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-nep-line/60 flex flex-wrap items-center gap-x-5 gap-y-1 text-[12px] text-nep-muted">
                <span>
                  Dự định dùng: <span className="text-nep-ink">{order.desiredEatTime || 'Sẽ thống nhất khi gọi'}</span>
                </span>
                <span>
                  Thanh toán: <span className="text-nep-ink">{order.paymentMethod === 'bank_transfer' ? 'Chuyển khoản' : 'COD'}</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
