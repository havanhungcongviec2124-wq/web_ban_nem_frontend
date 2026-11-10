import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { 
  IconAdjustments, 
  IconCart, 
  IconUser, 
  IconSparkles, 
  IconCheck, 
  IconArrowRight 
} from '../../components/Icons';

const AdminLayout = () => {
  const { orders } = useCart();
  const pendingCount = orders.filter(o => o.status === 'Chờ xác nhận' || o.status === 'Đang ủ men').length;

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      {/* Top Admin Bar */}
      <header className="bg-stone-900 text-white border-b border-stone-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-700 text-white flex items-center justify-center font-black text-sm">
              ZS
            </div>
            <div>
              <span className="font-black text-sm sm:text-base tracking-tight block">
                CỔNG QUẢN TRỊ ADMIN - NEM CHUA ZS
              </span>
              <span className="text-3xs text-emerald-400 font-semibold">
                ● Hệ thống hoạt động bình thường (Dữ liệu Frontend)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/home"
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-stone-200 transition-colors flex items-center gap-1.5"
            >
              <span>← Về Website Bán Hàng</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-4 mb-6 overflow-x-auto">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
              }`
            }
          >
            📊 Tổng Quan Dashboard
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                isActive
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
              }`
            }
          >
            <span>📦 Quản Lý Đơn Hàng & Gia Vị</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-stone-900 text-2xs font-black">
                {pendingCount}
              </span>
            )}
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200'
              }`
            }
          >
            🥩 Quản Lý Sản Phẩm & Combo
          </NavLink>
        </div>

        {/* Child Views */}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;

