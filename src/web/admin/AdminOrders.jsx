import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { 
  IconClock, 
  IconCheck, 
  IconGarlic, 
  IconChili, 
  IconHerb, 
  IconMapPin, 
  IconPhone,
  IconSearch
} from '../../components/Icons';

const AdminOrders = () => {
  const { orders, updateOrderStatus } = useCart();
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const statuses = [
    'Chờ xác nhận',
    'Đang ủ men',
    'Đang đóng gói',
    'Đang giao hàng',
    'Hoàn thành',
    'Đã hủy'
  ];

  const filteredOrders = orders.filter(order => {
    if (statusFilter !== 'ALL' && order.status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      const matchId = order.id.toLowerCase().includes(q);
      const matchName = (order.customerName || '').toLowerCase().includes(q);
      const matchPhone = (order.phone || '').toLowerCase().includes(q);
      if (!matchId && !matchName && !matchPhone) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-stone-900">Quản Lý Đơn Hàng & Khẩu Vị Nem</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Xem chính xác yêu cầu Tỏi, Ớt, Đinh Lăng và thời gian khách dự kiến ăn để ủ mẻ nem đúng ngày
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <input 
              type="text"
              placeholder="Tìm mã đơn, tên, số ĐT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <IconSearch className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-stone-300 rounded-xl bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-red-600"
          >
            <option value="ALL">Tất cả trạng thái ({orders.length})</option>
            {statuses.map(st => (
              <option key={st} value={st}>
                {st} ({orders.filter(o => o.status === st).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Cards List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div 
              key={order.id}
              className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 sm:p-6 space-y-4 hover:border-red-300 transition-colors"
            >
              {/* Top row: Order ID, Time, Status Change */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-base font-black text-red-700">
                    #{order.id}
                  </span>
                  <span className="text-xs text-stone-400">
                    Đặt lúc: {order.createdAt}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-3xs font-bold uppercase">
                    {order.paymentMethod}
                  </span>
                </div>

                {/* Status selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-500 font-semibold">Trạng thái:</span>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none ${
                      order.status === 'Hoàn thành'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : order.status === 'Đang giao hàng'
                          ? 'bg-blue-50 text-blue-800 border-blue-300'
                          : order.status === 'Đang ủ men'
                            ? 'bg-purple-50 text-purple-800 border-purple-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                    }`}
                  >
                    {statuses.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Middle row: Customer info & Desired Eating Time */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-stone-700 bg-stone-50 p-3.5 rounded-xl border border-stone-200/60">
                <div>
                  <span className="text-stone-400 text-3xs uppercase font-bold block mb-1">Khách Hàng:</span>
                  <div className="font-bold text-stone-900 text-sm">{order.customerName}</div>
                  <div className="text-red-700 font-semibold">{order.phone}</div>
                </div>

                <div>
                  <span className="text-stone-400 text-3xs uppercase font-bold block mb-1">Địa chỉ giao:</span>
                  <div className="leading-snug text-stone-800">{order.address}</div>
                  {order.note && (
                    <div className="text-stone-500 italic mt-1 text-2xs">
                      Ghi chú: "{order.note}"
                    </div>
                  )}
                </div>

                <div className="bg-amber-100/70 p-2.5 rounded-lg border border-amber-200 text-amber-950">
                  <span className="text-amber-900 text-3xs uppercase font-black flex items-center gap-1 mb-1">
                    <IconClock className="w-3.5 h-3.5 text-amber-700" />
                    Thời gian khách muốn ăn nem:
                  </span>
                  <div className="font-bold text-xs">
                    {order.desiredEatTime || 'Ăn ngay trong ngày'}
                  </div>
                  <div className="text-3xs text-amber-800 mt-0.5">
                    * Xưởng lưu ý chọn mẻ nem có độ lên men phù hợp
                  </div>
                </div>
              </div>

              {/* Items in order with individual spice selections */}
              <div>
                <span className="text-3xs uppercase font-extrabold text-stone-400 block mb-2">
                  Chi tiết món nem & Tùy chọn gia vị độc lập:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {order.items?.map((item, idx) => (
                    <div 
                      key={idx}
                      className="p-3 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold text-stone-900 text-xs">{item.name}</span>
                        <span className="text-xs font-black text-red-700 shrink-0">
                          x{item.quantity}
                        </span>
                      </div>

                      {/* Spice tags */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1 text-2xs">
                        <span className={`px-2 py-0.5 rounded-md font-semibold ${
                          item.spices?.garlic === 'Nhiều' ? 'bg-amber-100 text-amber-900' : 'bg-stone-100 text-stone-700'
                        }`}>
                          🧄 Tỏi: <strong>{item.spices?.garlic || 'Nhiều'}</strong>
                        </span>
                        <span className={`px-2 py-0.5 rounded-md font-semibold ${
                          item.spices?.chili === 'Nhiều' ? 'bg-red-100 text-red-900' : 'bg-stone-100 text-stone-700'
                        }`}>
                          🌶️ Ớt: <strong>{item.spices?.chili || 'Ít'}</strong>
                        </span>
                        <span className={`px-2 py-0.5 rounded-md font-semibold ${
                          item.spices?.polyscias === 'Nhiều' ? 'bg-emerald-100 text-emerald-900' : 'bg-stone-100 text-stone-700'
                        }`}>
                          🌿 Lá: <strong>{item.spices?.polyscias || 'Nhiều'}</strong>
                        </span>
                      </div>

                      {item.note && (
                        <div className="text-3xs text-stone-500 italic">
                          "{item.note}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Total amount */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs text-stone-500">
                  {order.items?.length} loại nem • Giao hàng tận nơi
                </span>
                <div className="text-right">
                  <span className="text-xs text-stone-500 mr-2">Tổng thu:</span>
                  <span className="text-lg font-black text-red-700">
                    {order.totalAmount?.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 bg-white rounded-2xl border border-stone-200 text-center text-stone-500">
          <p className="font-semibold text-sm">Không có đơn hàng nào theo bộ lọc này</p>
        </div>
      )}

    </div>
  );
};

export default AdminOrders;

