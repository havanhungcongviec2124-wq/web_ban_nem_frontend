import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../redux/auth/AuthApi';
import { fetchOrders } from '../../redux/order/OrderApi';
import { Card, FieldLabel, Input, PageTitle, SearchInput, StatusPill, formatVnd } from './adminUi';

const AdminCustomers = () => {
  const dispatch = useDispatch();
  const rawUsers = useSelector((state) => state.auth.users);
  const orders = useSelector((state) => state.orders.items);

  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState('');

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchOrders());
  }, [dispatch]);

  const customerList = useMemo(() => {
    if (rawUsers && rawUsers.length > 0) {
      return rawUsers.map((u, idx) => {
        const userOrders = orders.filter(
          (o) => (o.userId && o.userId === u._id) || (o.email && o.email === u.email) || (o.phone && o.phone === u.phone)
        );
        const totalSpent = userOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        const lastOrder = userOrders[0];

        return {
          id: u._id || `KH_${idx}`,
          name: u.name,
          phone: u.phone || 'Chưa cập nhật',
          email: u.email,
          address: u.address || 'Chưa cập nhật',
          returning: userOrders.length > 1,
          orderCount: userOrders.length,
          spent: totalSpent,
          lastOrderId: lastOrder ? (lastOrder.orderCode || lastOrder.id) : null,
          lastOrderTotal: lastOrder ? lastOrder.totalAmount : 0,
          lastOrderStatus: lastOrder ? lastOrder.status : 'Chưa có đơn',
          lastOrderAt: lastOrder ? (lastOrder.createdAtShort || 'Hôm nay') : 'Mới tạo',
          since: u.createdAt ? new Date(u.createdAt).toLocaleDateString('vi-VN') : '2026',
          note: u.role === 'admin' ? 'Tài khoản Quản trị viên (Admin)' : 'Khách hàng thành viên',
        };
      });
    }

    // Chưa tải được dữ liệu người dùng từ backend → danh sách rỗng, không dùng dữ liệu mẫu
    return [];
  }, [rawUsers, orders]);

  useEffect(() => {
    if (customerList.length > 0 && !selectedId) {
      setSelectedId(customerList[0].id);
    }
  }, [customerList, selectedId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customerList;
    return customerList.filter((c) => `${c.name} ${c.phone} ${c.email}`.toLowerCase().includes(q));
  }, [customerList, query]);

  const selected = filtered.find((c) => c.id === selectedId) || filtered[0] || customerList[0];

  const totalCustomers = customerList.length;
  const returningCount = customerList.filter((c) => c.returning).length;
  const avgOrders = totalCustomers > 0 ? (orders.length / totalCustomers).toFixed(1) : '1.0';

  return (
    <div>
      <PageTitle title="Khách hàng" subtitle="Hiểu khẩu vị, chăm sóc từng cuộc sum vầy." />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <Card className="px-5 py-5">
          <p className="text-[13px] text-nep-muted">Tổng khách hàng</p>
          <p className="mt-2 font-serif text-[32px] leading-none text-nep-ink">{totalCustomers}</p>
          <p className="mt-2 text-[12px] text-nep-muted">Dữ liệu thực từ hệ thống</p>
        </Card>
        <Card className="px-5 py-5">
          <p className="text-[13px] text-nep-muted">Khách quay lại</p>
          <p className="mt-2 font-serif text-[32px] leading-none text-nep-ink">{returningCount}</p>
          <p className="mt-2 text-[12px] text-nep-muted">
            {totalCustomers > 0 ? ((returningCount / totalCustomers) * 100).toFixed(0) : 0}% tổng khách
          </p>
        </Card>
        <Card className="px-5 py-5">
          <p className="text-[13px] text-nep-muted">Đơn trung bình / khách</p>
          <p className="mt-2 font-serif text-[32px] leading-none text-nep-ink">{avgOrders}</p>
          <p className="mt-2 text-[12px] text-nep-muted">Tính trên đơn đặt hàng</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-5">
        <div className="space-y-4">
          <SearchInput value={query} onChange={setQuery} placeholder="Tìm tên, số điện thoại hoặc email..." />
          <Card className="overflow-hidden">
            <div className="px-5 py-4 text-[13px] text-nep-muted">Danh sách người dùng / khách hàng</div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="bg-[#eef2e8] text-nep-green">
                    <th className="font-medium px-5 py-3">Khách hàng</th>
                    <th className="font-medium px-5 py-3">Số đơn</th>
                    <th className="font-medium px-5 py-3">Tổng chi tiêu</th>
                    <th className="font-medium px-5 py-3">Gần nhất</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedId(c.id)}
                      className={`border-t border-nep-line cursor-pointer ${c.id === selected?.id ? 'bg-[#f7faf3]' : 'hover:bg-nep-cream'}`}
                    >
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-nep-ink">{c.name}</p>
                        <p className="text-[12px] text-nep-muted">{c.phone}</p>
                      </td>
                      <td className="px-5 py-3.5">{c.orderCount}</td>
                      <td className="px-5 py-3.5 font-medium">{formatVnd(c.spent)}</td>
                      <td className="px-5 py-3.5">{c.lastOrderAt}</td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-nep-muted">
                        Chưa có khách hàng nào trong hệ thống.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <p className="px-5 py-3 text-[12px] text-nep-muted">
              Hiển thị {filtered.length} / {totalCustomers} tài khoản
            </p>
          </Card>
        </div>

        {selected && (
          <Card className="p-5 h-fit">
            <p className="font-serif text-[22px] text-nep-ink">{selected.name}</p>
            <p className="mt-1 text-[12px] text-nep-muted">
              {selected.returning ? 'Khách quay lại' : 'Khách mới'} · {selected.id}
            </p>
            <p className="mt-1 text-[12px] text-nep-muted">Tham gia từ {selected.since}</p>

            <div className="mt-4 space-y-3">
              <div>
                <FieldLabel>Điện thoại</FieldLabel>
                <Input readOnly value={selected.phone} />
              </div>
              <div>
                <FieldLabel>Email</FieldLabel>
                <Input readOnly value={selected.email} />
              </div>
              <div>
                <FieldLabel>Địa chỉ gần nhất</FieldLabel>
                <Input readOnly value={selected.address} />
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-nep-line">
              <p className="text-[13px] text-nep-muted">
                Đơn gần nhất {selected.lastOrderId ? `· ${selected.lastOrderId}` : ''}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-[20px] font-semibold text-nep-rose">{formatVnd(selected.lastOrderTotal)}</p>
                <StatusPill status={selected.lastOrderStatus} />
              </div>
              {selected.note && <p className="mt-3 text-[12px] text-nep-muted leading-relaxed">{selected.note}</p>}
              {selected.lastOrderId && (
                <Link
                  to={`/admin/orders/${selected.lastOrderId}`}
                  className="mt-4 h-11 rounded-xl border border-nep-line flex items-center justify-center text-[13px] text-nep-green font-medium hover:bg-nep-mint"
                >
                  Xem đơn hàng →
                </Link>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminCustomers;
