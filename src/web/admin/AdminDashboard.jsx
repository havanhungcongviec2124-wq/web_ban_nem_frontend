import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCart } from '../../context/CartContext';
import { fetchUsers } from '../../redux/auth/AuthApi';
import { Card, PageTitle, StatusPill, formatVnd, normalizeStatus } from './adminUi';

const pad2 = (n) => String(n).padStart(2, '0');

// Doanh thu 7 ngày gần nhất tính từ createdAt & totalAmount THẬT của đơn hàng trong database
const buildRevenueLast7 = (orders) => {
  const days = [];
  for (let i = 6; i >= 0; i -= 1) {
    const dayStart = new Date();
    dayStart.setHours(0, 0, 0, 0);
    dayStart.setDate(dayStart.getDate() - i);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const dayOrders = orders.filter((o) => {
      const t = o.createdAtISO ? new Date(o.createdAtISO) : null;
      return t && !Number.isNaN(t.getTime()) && t >= dayStart && t < dayEnd;
    });

    days.push({
      label: `${pad2(dayStart.getDate())}/${pad2(dayStart.getMonth() + 1)}`,
      value: dayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0),
      orderCount: dayOrders.length,
      highlight: i === 0,
    });
  }
  return days;
};

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { orders } = useCart();
  const users = useSelector((state) => state.auth.users);

  // Tải danh sách người dùng thực từ backend để thống kê khách hàng
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const pending = orders.filter((o) => normalizeStatus(o.status) === 'Chờ xác nhận');
  const preparing = orders.filter((o) => normalizeStatus(o.status) === 'Đang chuẩn bị');
  const latest = orders.slice(0, 4);

  const revenueLast7 = useMemo(() => buildRevenueLast7(orders), [orders]);
  const maxRev = Math.max(...revenueLast7.map((d) => d.value), 1);
  const weekTotal = revenueLast7.reduce((s, d) => s + d.value, 0);
  const today = revenueLast7[revenueLast7.length - 1] || { value: 0, orderCount: 0 };
  const yesterday = revenueLast7[revenueLast7.length - 2] || { value: 0 };
  const todayRev = today.value;
  const todayOrders = today.orderCount;
  // So sánh doanh thu hôm nay với hôm qua (chỉ hiển thị khi hôm qua có doanh thu)
  const revTrend =
    yesterday.value > 0
      ? `${todayRev >= yesterday.value ? '↑' : '↓'} ${Math.abs(
          Math.round(((todayRev - yesterday.value) / yesterday.value) * 100)
        )}% so với hôm qua`
      : 'Chưa có dữ liệu hôm qua';

  const newUsersToday = users.filter((u) => {
    if (!u.createdAt) return false;
    const t = new Date(u.createdAt);
    const now = new Date();
    return (
      !Number.isNaN(t.getTime()) &&
      t.getDate() === now.getDate() &&
      t.getMonth() === now.getMonth() &&
      t.getFullYear() === now.getFullYear()
    );
  }).length;

  const priority = orders.filter((o) => {
    const st = normalizeStatus(o.status);
    return st === 'Chờ xác nhận' || st === 'Đang chuẩn bị';
  }).slice(0, 2);

  return (
    <div>
      <PageTitle
        title="Một ngày thật đậm đà."
        subtitle="Theo dõi bán hàng, chuẩn bị đơn và những bữa vui sắp tới — dữ liệu thực từ hệ thống."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
        {[
          {
            label: 'Doanh thu hôm nay',
            value: formatVnd(todayRev),
            hint: `${revTrend} · ${todayOrders} đơn`,
          },
          { label: 'Đơn hàng mới', value: String(orders.length), hint: `${pending.length} đơn đang chờ xác nhận` },
          { label: 'Cần chuẩn bị', value: String(preparing.length), hint: 'Theo ngày sử dụng của khách' },
          { label: 'Khách hàng mới', value: String(newUsersToday), hint: `Trong tổng ${users.length} khách hàng` },
        ].map((s) => (
          <Card key={s.label} className="px-5 py-5">
            <p className="text-[13px] text-nep-muted">{s.label}</p>
            <p className="mt-2 font-serif text-[28px] leading-none text-nep-ink tracking-[-0.5px]">{s.value}</p>
            <p className="mt-2 text-[12px] text-nep-muted">{s.hint}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-4 mb-5">
        <Card className="p-5">
          <div className="flex items-start justify-between gap-3 mb-5">
            <div>
              <p className="text-[15px] font-medium text-nep-ink">Doanh thu 7 ngày gần đây</p>
              <p className="mt-2 font-serif text-[28px] leading-none text-nep-ink">{formatVnd(weekTotal)}</p>
            </div>
            <p className="text-[12px] text-nep-muted">
              {revenueLast7[0].label}–{revenueLast7[revenueLast7.length - 1].label}
            </p>
          </div>
          <div className="h-[180px] flex items-end gap-3 px-1">
            {revenueLast7.map((d) => (
              <div key={d.label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div
                  className={`w-full rounded-md ${d.highlight ? 'bg-nep-rose' : 'bg-nep-green'}`}
                  style={{ height: `${Math.max(18, (d.value / maxRev) * 100)}%` }}
                  title={`${d.orderCount} đơn · ${formatVnd(d.value)}`}
                />
                <span className="text-[11px] text-nep-muted">{d.label}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-nep-muted">
            Doanh thu theo ngày tạo đơn (dữ liệu thực từ backend) · Đơn vị: VNĐ
          </p>
        </Card>

        <Card className="p-5">
          <div className="rounded-xl bg-[#f6ead8] px-4 py-3 mb-4">
            <p className="text-[12px] text-[#8a5a28] font-medium flex items-center gap-2">
              <img src="/assets/calendar-clock.svg" alt="" width={16} height={16} />
              {preparing.length + pending.length} đơn có giờ dùng trong 48 giờ tới
            </p>
            <p className="mt-1 text-[11px] text-[#8a5a28]/80">
              Đối chiếu lịch giao đã xác nhận. Không dùng giờ sử dụng làm giờ giao.
            </p>
          </div>
          <div className="space-y-3">
            {priority.map((o) => (
              <Link key={o.id} to={`/admin/orders/${o.id}`} className="flex items-center justify-between gap-2 py-1">
                <div>
                  <p className="text-[13px] font-medium text-nep-ink">{o.id}</p>
                  <div className="mt-1">
                    <StatusPill status={o.status} />
                  </div>
                </div>
                <p className="text-[12px] text-nep-muted whitespace-nowrap">{o.desiredEatTime?.split(' · ').reverse().join(' · ') || '—'}</p>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="px-5 py-4">
          <p className="text-[15px] font-medium text-nep-ink">Đơn hàng mới nhất</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="bg-[#eef2e8] text-nep-green">
                <th className="font-medium px-5 py-3">Mã đơn</th>
                <th className="font-medium px-5 py-3">Khách hàng</th>
                <th className="font-medium px-5 py-3">Tổng tiền</th>
                <th className="font-medium px-5 py-3">Khách dùng lúc</th>
                <th className="font-medium px-5 py-3">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {latest.map((o) => (
                <tr key={o.id} className="border-t border-nep-line">
                  <td className="px-5 py-3.5">
                    <Link to={`/admin/orders/${o.id}`} className="font-medium text-nep-ink hover:text-nep-rose">
                      {o.id}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5">{o.customerName}</td>
                  <td className="px-5 py-3.5">{formatVnd(o.totalAmount)}</td>
                  <td className="px-5 py-3.5 text-nep-muted">{o.desiredEatTime || '—'}</td>
                  <td className="px-5 py-3.5">
                    <StatusPill status={o.status} />
                  </td>
                </tr>
              ))}
              {latest.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-nep-muted">
                    Chưa có đơn hàng nào trong hệ thống.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
