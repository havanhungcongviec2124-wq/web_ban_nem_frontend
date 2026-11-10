import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { IconMenu, IconX } from './Icons';

const Header = () => {
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

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

          <Link to="/admin" aria-label="Tài khoản">
            <img src="/assets/user.svg" alt="" width={20} height={20} />
          </Link>

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
        </div>
      )}
    </header>
  );
};

export default Header;
