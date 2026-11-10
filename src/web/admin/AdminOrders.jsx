import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Card, GhostButton, PageTitle, SearchInput, StatusPill, formatVnd, normalizeStatus } from './adminUi';

const TABS = [
  { id: 'ALL', label: 'Tất cả' },
  { id: 'Chờ xác nhận', label: 'Chờ xác nhận' },
  { id: 'Đang chuẩn bị', label: 'Đang chuẩn bị' },
  { id: 'Đang giao', label: 'Đang giao' },
  { id: 'Hoàn tất', label: 'Hoàn tất' },
];

const AdminOrders = () => {
  const { orders } = useCart();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const tab = params.get('status') || 'ALL';

  const counts = useMemo(() => {
    const c = { ALL: orders.length };
    TABS.slice(1).forEach((t) => {
      c[t.id] = orders.filter((o) => normalizeStatus(o.status) === t.id).length;
    });
    return c;
  }, [orders]);

  const filtered = orders.filter((order) => {
    if (tab !== 'ALL' && normalizeStatus(order.status) !== tab) return false;
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      const blob = `${order.id} ${order.customerName} ${order.phone}`.toLowerCase();
      if (!blob.includes(q)) return false;
    }
    return true;
  });

  return (
    <div>
      <PageTitle
        title="Đơn hàng"
        subtitle="Theo dõi trạng thái giao và thời điểm khách dự định sử dụng — hai thông tin riêng biệt."
      />

      <div className="flex flex-wrap gap-2 mb-5">
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setParams(t.id === 'ALL' ? {} : { status: t.id })}
              className={`h-10 px-3.5 rounded-full text-[13px] border ${
                active ? 'bg-nep-green text-nep-cream border-nep-green' : 'bg-nep-paper text-nep-green border-nep-line'
              }`}
            >
              {t.label}{' '}
              <span className={active ? 'text-white/80' : 'text-nep-rose'}>{counts[t.id] || 0}</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col lg:flex-row gap-3 mb-4">
        <SearchInput value={query} onChange={setQuery} placeholder="Tìm mã đơn, tên khách hoặc số điện thoại..." />
        <GhostButton className="shrink-0">Xuất danh sách</GhostButton>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button type="button" className="h-10 px-3 rounded-xl border border-[#ead9b8] bg-[#f6ead8] text-[12px] text-[#8a5a28]">
          Ngày dùng: 06–08/11/2026 ▾
        </button>
        <button type="button" className="h-10 px-3 rounded-xl border border-nep-line bg-nep-paper text-[12px] text-nep-green">
          Mới đặt gần đây ▾
        </button>
      </div>

      <div className="rounded-xl bg-[#eef3e8] px-4 py-3 mb-4">
        <p className="text-[13px] font-medium text-nep-green">Ngày, giờ dùng ≠ lịch giao được báo đám</p>
        <p className="text-[12px] text-nep-muted mt-0.5">
          Mở chi tiết xem đầy đủ gia vị, ghi chú khách và xác nhận lịch giao riêng trước khi chuẩn bị.
        </p>
      </div>

      <Card className="overflow-hidden">
        <div className="px-5 py-4 text-[13px] text-nep-muted">
          Đơn mới gần đây · {filtered.length} / {orders.length} đơn
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="bg-[#eef2e8] text-nep-green">
                <th className="font-medium px-5 py-3">Mã đơn</th>
                <th className="font-medium px-5 py-3">Khách hàng</th>
                <th className="font-medium px-5 py-3">Đặt lúc</th>
                <th className="font-medium px-5 py-3">Tổng tiền</th>
                <th className="font-medium px-5 py-3">Khách dùng lúc</th>
                <th className="font-medium px-5 py-3">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id} className="border-t border-nep-line hover:bg-nep-cream/80">
                  <td className="px-5 py-3.5">
                    <Link to={`/admin/orders/${o.id}`} className="font-medium text-nep-ink hover:text-nep-rose">
                      {o.id}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5">{o.customerName}</td>
                  <td className="px-5 py-3.5 text-nep-muted">{o.createdAtShort || o.createdAt}</td>
                  <td className="px-5 py-3.5">{formatVnd(o.totalAmount)}</td>
                  <td className="px-5 py-3.5 text-nep-muted">{o.desiredEatTime || '—'}</td>
                  <td className="px-5 py-3.5">
                    <StatusPill status={o.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="px-5 py-3 text-[12px] text-nep-muted">Trang 1 / 1</p>
      </Card>
    </div>
  );
};

export default AdminOrders;
