import React, { useMemo, useState } from 'react';
import { Outlet, NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import {
  IconGrid,
  IconBox,
  IconLayers,
  IconList,
  IconPeople,
  IconClipboard,
  IconBell,
} from './adminUi';

const NAV = [
  { to: '/admin', end: true, label: 'Tổng quan', icon: IconGrid },
  { to: '/admin/products', label: 'Sản phẩm', icon: IconBox },
  { to: '/admin/combos', label: 'Combo', icon: IconLayers },
  { to: '/admin/categories', label: 'Danh mục', icon: IconList },
  { to: '/admin/customers', label: 'Khách hàng', icon: IconPeople },
  { to: '/admin/orders', label: 'Đơn hàng', icon: IconClipboard },
];

const PAGE_CRUMB = {
  '/admin': 'Tổng quan',
  '/admin/products': 'Sản phẩm',
  '/admin/combos': 'Combo',
  '/admin/categories': 'Danh mục',
  '/admin/customers': 'Khách hàng',
  '/admin/orders': 'Đơn hàng',
};

const weekdayVi = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { showToast } = useCart();
  const [open, setOpen] = useState(false);

  const handleAdminLogout = () => {
    logout();
    showToast('Đã đăng xuất khỏi tài khoản Quản trị!');
    navigate('/login');
  };

  const displayName = user?.name || 'Quản trị viên';
  const displayRole = user?.role === 'admin' ? 'Quản trị hệ thống' : 'Tài khoản người dùng';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(-2)
    .join('')
    .toUpperCase() || 'AD';

  const crumb = useMemo(() => {
    if (location.pathname.startsWith('/admin/orders/')) return 'Đơn hàng';
    return PAGE_CRUMB[location.pathname] || 'Quản trị';
  }, [location.pathname]);

  const today = useMemo(() => {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${weekdayVi[d.getDay()]}, ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  }, []);

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3 h-11 text-[13px] ${
      isActive ? 'bg-[#2d4d38] text-nep-cream font-medium' : 'text-nep-cream/75 hover:bg-white/5 hover:text-nep-cream'
    }`;

  const sidebar = (
    <aside className="w-58 h-full shrink-0 bg-nep-footer text-nep-cream flex flex-col min-h-screen">
      <div className="px-5 h-18 flex items-center gap-2.5">
        <img src="/assets/leaf-light.svg" alt="" width={22} height={22} />
        <span className="font-serif font-bold text-[22px] tracking-[-0.7px]">Nếp Nem</span>
      </div>

      <nav className="px-3 flex-1 space-y-0.5">
        {NAV.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={navClass} onClick={() => setOpen(false)}>
            <item.icon />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-4 py-5 mt-auto border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#3d6550] text-[11px] font-semibold flex items-center justify-center shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium leading-tight truncate">{displayName}</p>
            <p className="text-[11px] text-nep-cream/55 mt-0.5 truncate">{displayRole}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-[12px] pt-2 border-t border-white/5">
          <Link to="/home" className="flex items-center gap-1.5 text-nep-cream/70 hover:text-white transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <path d="M9 22V12h6v10" />
            </svg>
            Xem cửa hàng
          </Link>

          <button
            type="button"
            onClick={handleAdminLogout}
            className="text-nep-rose hover:underline transition-colors flex items-center gap-1 cursor-pointer"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </aside>
  );
  return (
    <div className="min-h-screen bg-nep-cream flex text-nep-ink">
      <div className="hidden lg:block">{sidebar}</div>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-black/40" aria-label="Đóng menu" onClick={() => setOpen(false)} />
          <div className="relative h-full w-58">{sidebar}</div>
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-18 px-4 sm:px-8 flex items-center justify-between bg-nep-cream border-b border-nep-line/70">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="lg:hidden h-10 w-10 rounded-xl border border-nep-line bg-nep-paper text-nep-green"
              onClick={() => setOpen(true)}
              aria-label="Mở menu"
            >
              ☰
            </button>
            <p className="text-[13px] text-nep-muted">
              Quản trị cửa hàng <span className="text-nep-line mx-1">/</span> {crumb}
            </p>
          </div>
          <div className="flex items-center gap-4 text-[13px] text-nep-muted">
            <span className="hidden sm:inline">{today}</span>
            <span className="text-nep-green">
              <IconBell />
            </span>
          </div>
        </header>
        <div className="flex-1 px-4 sm:px-8 py-7">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
