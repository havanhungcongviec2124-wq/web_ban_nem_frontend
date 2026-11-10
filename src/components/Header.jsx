import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { IconMenu, IconX } from './Icons';

const Header = () => {
  const { totalItems, showToast } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Đóng dropdown khi bấm ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    showToast('Đã đăng xuất tài khoản!');
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Sản phẩm', path: '/products' },
    { name: 'Combo sum vầy', path: '/combos' },
    { name: 'Chuyện Nếp Nem', path: '/about' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-nep-cream">
      <div className="bg-nep-green text-center px-4 py-[9px]">
        <p className="text-[11px] text-nep-cream">Gói chút vị quê · Gửi trọn vị thương</p>
      </div>

      <div className="flex items-center justify-between gap-4 px-4 sm:px-8 lg:px-[72px] py-[22px]">
        <Link to="/home" className="flex items-center gap-[9px] shrink-0">
          <img src="/assets/leaf.svg" alt="" width={32} height={32} />
          <span className="font-serif font-bold text-[28px] sm:text-[32px] tracking-[-1.3px] text-nep-green leading-none">
            Nếp Nem
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-[26px] text-[13px] text-nep-green">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => (isActive ? 'font-medium' : 'hover:opacity-70')}
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4 sm:gap-[22px]">
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center gap-2.5 bg-nep-paper border border-nep-line rounded-full p-3 w-[244px]"
          >
            <img src="/assets/search.svg" alt="" width={17} height={17} />
            <input
              type="text"
              placeholder="Bạn muốn ăn nem gì?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-[12px] text-nep-ink placeholder:text-nep-muted outline-none"
            />
          </form>

          {/* User Account Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-1.5 p-1 rounded-full hover:bg-black/5 transition-colors focus:outline-none"
              aria-label="Tài khoản"
            >
              <div className="relative">
                <img src="/assets/user.svg" alt="" width={20} height={20} />
                {isAuthenticated && (
                  <span
                    className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border border-nep-cream ${
                      isAdmin ? 'bg-nep-rose' : 'bg-nep-green'
                    }`}
                  />
                )}
              </div>
              {isAuthenticated && (
                <span className="hidden xl:inline text-[12px] font-medium text-nep-green max-w-[90px] truncate">
                  {user?.name?.split(' ').pop()}
                </span>
              )}
            </button>

            {/* Dropdown Menu */}
            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-nep-line shadow-lg py-3 px-3 z-50 animate-fade-in text-[13px]">
                {isAuthenticated ? (
                  <div>
                    {/* User Profile Info */}
                    <div className="px-2 py-2 border-b border-nep-line mb-2">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-nep-ink truncate">{user?.name}</p>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            isAdmin
                              ? 'bg-[#ffebee] text-nep-rose border border-nep-rose/20'
                              : 'bg-[#eef3e8] text-nep-green border border-nep-green/20'
                          }`}
                        >
                          {isAdmin ? 'Admin' : 'Khách hàng'}
                        </span>
                      </div>
                      <p className="text-[11px] text-nep-muted truncate mt-0.5">{user?.email}</p>
                    </div>

                    {/* Actions */}
                    <div className="space-y-1">
                      {isAdmin ? (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center justify-between px-2.5 py-2 rounded-xl bg-nep-green text-nep-cream hover:bg-[#203223] transition-colors font-medium text-[12px]"
                        >
                          <span>Trang Quản trị Admin</span>
                          <span>→</span>
                        </Link>
                      ) : (
                        <Link
                          to="/cart"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center justify-between px-2.5 py-2 rounded-xl text-nep-ink hover:bg-nep-cream transition-colors text-[12px]"
                        >
                          <span>Giỏ hàng của tôi</span>
                          <span className="text-nep-green font-medium">({totalItems})</span>
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left px-2.5 py-2 rounded-xl text-nep-rose hover:bg-[#fff0f0] transition-colors text-[12px] flex items-center justify-between"
                      >
                        <span>Đăng xuất</span>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="font-semibold text-nep-ink px-2 pt-1 pb-1">Tài khoản Nếp Nem</p>
                    <p className="text-[11px] text-nep-muted px-2 pb-3">
                      Đăng nhập để quản lý đơn hàng hoặc truy cập bảng quản trị.
                    </p>
                    <div className="space-y-2">
                      <Link
                        to="/login"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full flex items-center justify-center py-2 rounded-xl bg-nep-green text-nep-cream font-medium text-[12px] hover:bg-[#203223] transition-colors"
                      >
                        Đăng nhập
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full flex items-center justify-center py-2 rounded-xl border border-nep-line text-nep-ink font-medium text-[12px] hover:bg-nep-cream transition-colors"
                      >
                        Đăng ký tài khoản mới
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <Link to="/cart" className="flex items-center gap-[5px]" aria-label="Giỏ hàng">
            <img src="/assets/bag.svg" alt="" width={20} height={20} />
            <span className="text-[12px] font-medium text-nep-green">{totalItems}</span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-nep-green"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <IconX className="w-6 h-6" /> : <IconMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      <div className="h-px bg-nep-line w-full" />

      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-nep-line bg-nep-cream px-4 py-4 space-y-3">
          <form onSubmit={handleSearch} className="flex items-center gap-2 bg-nep-paper border border-nep-line rounded-full p-3">
            <img src="/assets/search.svg" alt="" width={17} height={17} />
            <input
              type="text"
              placeholder="Bạn muốn ăn nem gì?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-[12px] outline-none"
            />
          </form>
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[14px] text-nep-green"
            >
              {link.name}
            </NavLink>
          ))}

          {/* Mobile Auth Section */}
          <div className="pt-3 border-t border-nep-line">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between py-1">
                  <div>
                    <p className="text-[13px] font-medium text-nep-ink">{user?.name}</p>
                    <p className="text-[11px] text-nep-muted">{user?.email}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${isAdmin ? 'bg-nep-rose/10 text-nep-rose' : 'bg-nep-green/10 text-nep-green'}`}>
                    {isAdmin ? 'Admin' : 'Khách hàng'}
                  </span>
                </div>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center py-2 rounded-xl bg-nep-green text-nep-cream text-[13px] font-medium"
                  >
                    Vào trang Quản trị Admin
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-1.5 text-[13px] text-nep-rose font-medium"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 rounded-xl bg-nep-green text-nep-cream text-[12px] font-medium"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 rounded-xl border border-nep-line text-nep-ink text-[12px] font-medium bg-white"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
