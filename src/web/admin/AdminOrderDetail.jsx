import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import {
  Card,
  FieldLabel,
  GhostButton,
  Input,
  PrimaryButton,
  StatusPill,
  Textarea,
  formatVnd,
  normalizeStatus,
  spiceLine,
  IconChat,
} from './adminUi';

const spiceShort = (spices) => {
  if (!spices) return '';
  return `Tỏi: ${spices.garlic || 'Nhiều'} · Ớt: ${spices.chili || 'Ít'} · Đinh lăng: ${spices.polyscias || 'Nhiều'}`;
};

const AdminOrderDetail = () => {
  const { orderId } = useParams();
  const { orders, updateOrderStatus } = useCart();
  const order = orders.find((o) => o.id === orderId);
  const [assignee, setAssignee] = useState(order?.assignee || '');
  const [scheduleNote, setScheduleNote] = useState(order?.scheduleNote || '');

  if (!order) {
    return (
      <Card className="p-8 text-center">
        <p className="font-medium">Không tìm thấy đơn {orderId}</p>
        <Link to="/admin/orders" className="text-[13px] text-nep-rose mt-2 inline-block">
          Quay lại danh sách
        </Link>
      </Card>
    );
  }

  const status = normalizeStatus(order.status);
  const itemsSubtotal = (order.items || []).reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0);
  const subtotal = order.subtotal ?? itemsSubtotal;
  const shipping = order.shippingFee ?? 30000;
  // Cảnh báo khi cùng một món (khác gia vị) xuất hiện trên nhiều dòng đơn
  const nonComboSlugs = (order.items || [])
    .filter((i) => !i.isCombo)
    .map((i) => i.productSlug || i.id || i.name);
  const sameProductTwice = nonComboSlugs.some(
    (slug) => nonComboSlugs.filter((s) => s === slug).length >= 2
  );

  // Luồng thao tác của admin theo trạng thái đơn
  const NEXT_STEP = {
    'Chờ xác nhận': { label: 'Xác nhận đơn', next: 'Đang chuẩn bị' },
    'Đang chuẩn bị': { label: 'Bắt đầu giao hàng', next: 'Đang giao' },
    'Đang giao': { label: 'Hoàn tất giao hàng', next: 'Hoàn tất' },
  };
  const nextStep = NEXT_STEP[status];

  const confirmOrder = () => {
    if (nextStep) updateOrderStatus(order.id, nextStep.next);
  };

  const saveDelivery = () => {
    // Lưu thông tin giao hàng (người giao, lịch đã thống nhất) xuống backend
    updateOrderStatus(order.id, { assignee, scheduleNote });
  };

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-5">
        <div>
          <h1 className="font-serif text-[32px] sm:text-[36px] leading-none tracking-[-0.8px] text-nep-ink">
            Đơn {order.id}
          </h1>
          <p className="mt-2 text-[13px] text-nep-muted">
            Đặt lúc {order.createdAt} · {order.source || 'Cửa hàng trực tuyến'}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <StatusPill status={status} />
            <span className="inline-flex items-center rounded-full bg-[#f6ead8] text-[#9a6a32] text-[11px] px-2.5 py-1">
              {order.paymentMethod || 'COD'} · {order.paymentStatus || 'Chưa thanh toán'}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <GhostButton onClick={() => window.print()}>In phiếu</GhostButton>
          {nextStep && <PrimaryButton onClick={confirmOrder}>{nextStep.label}</PrimaryButton>}
          {status === 'Hoàn tất' && (
            <span className="inline-flex items-center rounded-full bg-nep-green/10 text-nep-green text-[13px] font-medium px-4">
              Đơn đã hoàn tất ✓
            </span>
          )}
          {status === 'Đã hủy' && (
            <span className="inline-flex items-center rounded-full bg-nep-rose/10 text-nep-rose text-[13px] font-medium px-4">
              Đơn đã bị hủy
            </span>
          )}
        </div>
      </div>

      <div className="rounded-2xl bg-[#f6ead8] px-5 py-4 mb-5">
        <p className="text-[12px] text-[#8a5a28] font-medium flex items-center gap-2">
          <img src="/assets/calendar-clock.svg" alt="" width={16} height={16} />
          Khách dự định sử dụng
        </p>
        <p className="mt-1 font-serif text-[22px] text-nep-ink">{order.desiredEatTime || 'Chưa ghi'}</p>
        <p className="mt-1 text-[12px] text-[#8a5a28]/80">
          Đây là thời điểm sử dụng, không phải giờ giao được báo đám. Nếp sẽ liên hệ để sắp xếp giao phù hợp.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">
        <div className="space-y-4">
          <Card className="p-5">
            <p className="font-medium text-[15px] text-nep-ink">Sản phẩm & gia vị cần chuẩn bị</p>
            <p className="text-[12px] text-nep-muted mt-1">
              {order.lineCount || order.items?.length} dòng mua · {order.items?.reduce((s, i) => s + (i.quantity || 1), 0)} phần đặt
              {order.pieceCount ? ` · Tổng ${order.pieceCount} chiếc / ${order.weightLabel}` : ''}
            </p>

            {sameProductTwice && (
              <div className="mt-3 rounded-xl bg-[#f7e4de] px-4 py-3">
                <p className="text-[13px] font-medium text-nep-rose">Không gộp hai dòng nem truyền thống</p>
                <p className="text-[12px] text-nep-muted mt-0.5">
                  Cùng mã sản phẩm nhưng khác gia vị. Combo cũng có lựa chọn riêng cho từng món.
                </p>
              </div>
            )}

            <div className="mt-4 space-y-4">
              {order.items?.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="rounded-2xl border border-nep-line p-4">
                  <div className="flex gap-3">
                    <img src={item.image || '/assets/nem-truyen-thong.png'} alt="" className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-[18px] text-nep-green">{item.name}</p>
                      <p className="text-[12px] text-nep-muted mt-0.5">{item.pack || item.unit}</p>
                      <p className="text-[12px] text-nep-muted">{formatVnd(item.price)} / {item.unit || 'gói'}</p>
                      {item.tag && <p className="text-[12px] text-[#9a6a32] mt-1">{item.tag}</p>}
                    </div>
                  </div>
                  {!item.isCombo && item.spices && (
                    <p className="mt-3 text-[12px] text-nep-green">{spiceShort(item.spices)}</p>
                  )}
                  {item.isCombo && item.comboSubItems && (
                    <div className="mt-3 rounded-xl bg-[#eef3e8] p-3 space-y-2">
                      {item.comboSubItems.map((sub, sidx) => (
                        <div key={sidx} className="text-[12px]">
                          <p className="font-medium text-nep-ink">
                            {sub.name} · {sub.qtyText}
                          </p>
                          <p className="text-nep-muted">{spiceLine(sub.spices)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-3 flex items-center justify-between text-[13px]">
                    <span className="text-nep-muted">
                      Số lượng: {item.quantity} {item.unit || ''}
                    </span>
                    <span className="font-semibold text-nep-rose">{formatVnd((item.price || 0) * (item.quantity || 1))}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <p className="font-medium text-[15px] text-nep-ink mb-4">Lịch sử xử lý</p>
            <div className="space-y-4">
              {(order.timeline || []).map((ev, i) => (
                <div key={i} className="flex gap-3">
                  <span className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${ev.done ? 'bg-nep-green' : 'border border-nep-green bg-transparent'}`} />
                  <div>
                    {ev.time && <p className="text-[12px] text-nep-muted">{ev.time}</p>}
                    <p className="text-[13px] text-nep-ink">{ev.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <p className="font-medium text-[15px] text-nep-ink">Khách hàng & địa chỉ</p>
            <p className="mt-3 font-medium">{order.customerName}</p>
            <p className="mt-1 text-[13px] text-nep-green">{order.phone}</p>
            {order.email && <p className="mt-1 text-[13px] text-nep-muted">{order.email}</p>}
            <p className="mt-3 text-[13px] text-nep-ink">{order.address}</p>
            {order.customerId && (
              <p className="mt-3 text-[12px] text-nep-muted">Khách quay lại · {order.customerId}</p>
            )}
          </Card>

          {order.note && (
            <div className="rounded-2xl border border-[#f0cfc6] bg-[#fbf3f0] p-5">
              <p className="text-[13px] font-medium text-nep-rose flex items-center gap-2">
                <IconChat /> Khách nhắn khi giao
              </p>
              <p className="mt-2 text-[13px] text-nep-ink">{order.note}</p>
            </div>
          )}

          <Card className="p-5">
            <p className="font-medium text-[15px] text-nep-ink">Thông tin thực hiện giao</p>
            <p className="text-[12px] text-nep-muted mt-1">Lịch giao chưa xác nhận</p>
            <div className="mt-3">
              <FieldLabel>Người giao / đơn vị vận chuyển</FieldLabel>
              <Input value={assignee} placeholder="Chưa phân công" onChange={(e) => setAssignee(e.target.value)} />
            </div>
            <div className="mt-3">
              <FieldLabel>Lịch giao thống nhất với khách</FieldLabel>
              <Input value={scheduleNote} placeholder="Chưa thống nhất — cần liên hệ" onChange={(e) => setScheduleNote(e.target.value)} />
            </div>
            <p className="mt-3 text-[11px] text-nep-muted">
              Tham khảo giờ sử dụng {order.desiredEatTime}. Không tự điền giờ này thành giờ giao.
            </p>
            <GhostButton className="w-full mt-3" onClick={saveDelivery}>
              Cập nhật giao hàng
            </GhostButton>
          </Card>

          <Card className="p-5">
            <p className="font-medium text-[15px] text-nep-ink mb-3">Thanh toán</p>
            <div className="flex justify-between text-[13px] py-1">
              <span className="text-nep-muted">Tạm tính</span>
              <span>{formatVnd(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[13px] py-1">
              <span className="text-nep-muted">Phí giao hàng</span>
              <span>{formatVnd(shipping)}</span>
            </div>
            <div className="flex justify-between items-center pt-3 mt-2 border-t border-nep-line">
              <span className="font-medium">Tổng cộng</span>
              <span className="text-[20px] font-semibold text-nep-rose">{formatVnd(order.totalAmount)}</span>
            </div>
            <p className="mt-3 text-[12px] text-nep-muted">
              COD · Thu đủ khi nhận hàng. {order.paymentStatus || 'Chưa ghi nhận thanh toán.'}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
