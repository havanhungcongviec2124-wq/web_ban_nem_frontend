import React from 'react';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import { PRODUCTS, COMBOS } from '../../data/mockData';
import { IconArrowRight, IconClock, IconCheck } from '../../components/Icons';

const AdminDashboard = () => {
  const { orders } = useCart();

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'Chờ xác nhận');
  const fermentingOrders = orders.filter(o => o.status === 'Đang ủ men');
  const shippingOrders = orders.filter(o => o.status === 'Đang giao hàng');
  const completedOrders = orders.filter(o => o.status === 'Hoàn thành');

  return (
    <div className="space-y-8">
      
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-2xs font-extrabold uppercase tracking-wider text-stone-500 block mb-1">
            Tổng Doanh Thu Đơn Hàng
          </span>
          <div className="text-2xl font-black text-red-700">
            {totalRevenue.toLocaleString('vi-VN')}đ
          </div>
          <div className="text-3xs text-stone-400 mt-1">
            Dựa trên {orders.length} đơn hàng hiện có
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-2xs font-extrabold uppercase tracking-wider text-stone-500 block mb-1">
            Đơn Chờ Xác Nhận
          </span>
          <div className="text-2xl font-black text-amber-600">
            {pendingOrders.length} đơn
          </div>
          <div className="text-3xs text-amber-700 mt-1 font-medium">
            Cần xưởng kiểm tra mẻ nem
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-2xs font-extrabold uppercase tracking-wider text-stone-500 block mb-1">
            Mẻ Nem Đang Ủ Men
          </span>
          <div className="text-2xl font-black text-emerald-700">
            {fermentingOrders.length} đơn
          </div>
          <div className="text-3xs text-emerald-800 mt-1 font-medium">
            Theo hẹn thời gian ăn của khách
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-2xs font-extrabold uppercase tracking-wider text-stone-500 block mb-1">
            Đang Giao & Đã Giao
          </span>
          <div className="text-2xl font-black text-stone-900">
            {shippingOrders.length + completedOrders.length} đơn
          </div>
          <div className="text-3xs text-stone-400 mt-1">
            Hỏa tốc đúng độ chín tới
          </div>
        </div>

      </div>

      {/* Latest Orders Preview */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-stone-900">Đơn Hàng Mới Nhất & Yêu Cầu Gia Vị</h3>
            <p className="text-xs text-stone-500 mt-0.5">Xưởng theo dõi yêu cầu Tỏi, Ớt, Đinh Lăng và thời gian ăn của khách</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-red-700 hover:text-red-800 flex items-center gap-1"
          >
            <span>Xem tất cả đơn</span>
            <IconArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase text-3xs tracking-wider">
              <tr>
                <th className="py-3 px-4">Mã Đơn</th>
                <th className="py-3 px-4">Khách Hàng</th>
                <th className="py-3 px-4">Thời Gian Khách Muốn Ăn</th>
                <th className="py-3 px-4">Món Nem & Tùy Chọn Gia Vị</th>
                <th className="py-3 px-4">Tổng Tiền</th>
                <th className="py-3 px-4">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-red-700">
                    #{order.id}
                  </td>
                  <td className="py-3 px-4">
                    <strong className="block text-stone-900">{order.customerName}</strong>
                    <span className="text-stone-400 text-2xs">{order.phone}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-2xs font-semibold">
                      <IconClock className="w-3 h-3 text-amber-700" />
                      {order.desiredEatTime || 'Ăn ngay'}
                    </span>
                  </td>
                  <td className="py-3 px-4 space-y-1">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="text-2xs">
                        <span className="font-semibold text-stone-900">{item.name}</span> (x{item.quantity})
                        <div className="text-3xs text-stone-500 flex items-center gap-1">
                          <span className="text-amber-800">Tỏi: {item.spices?.garlic}</span> | 
                          <span className="text-red-700">Ớt: {item.spices?.chili}</span> | 
                          <span className="text-emerald-800">Lá: {item.spices?.polyscias}</span>
                        </div>
                      </div>
                    ))}
                  </td>
                  <td className="py-3 px-4 font-black text-red-700 text-sm">
                    {order.totalAmount?.toLocaleString('vi-VN')}đ
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 rounded-md text-2xs font-bold uppercase tracking-wider ${
                      order.status === 'Hoàn thành' 
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.status === 'Đang giao hàng'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'Đang ủ men'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-amber-100 text-amber-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;

