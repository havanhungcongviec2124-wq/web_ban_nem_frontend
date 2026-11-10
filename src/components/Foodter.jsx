import React from 'react';
import { Link } from 'react-router-dom';
import { STORE_INFO } from '../data/siteContent';

const Foodter = () => {
  return (
    <footer className="bg-nep-footer text-nep-cream px-4 sm:px-8 lg:px-[72px] py-14 space-y-8">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
        <div className="w-full lg:w-[400px] space-y-4">
          <div className="flex items-center gap-[9px]">
            <img src="/assets/leaf-light.svg" alt="" width={32} height={32} />
            <span className="font-serif font-bold text-[32px] tracking-[-1.3px] leading-none">Nếp Nem</span>
          </div>
          <p className="text-[14px] leading-[1.6]">
            Một gói nem, một nếp nhà. Món quen được chăm chút cho những cuộc sum vầy hôm nay.
          </p>
          <p className="text-[13px]">{STORE_INFO.email}</p>
        </div>

        <div className="flex-1 space-y-3.5">
          <p className="font-semibold text-[11px] tracking-[1.5px] uppercase">Ghé Nếp chọn nem</p>
          <Link to="/products" className="block text-[13px] hover:opacity-80">Tất cả sản phẩm</Link>
          <Link to="/combos" className="block text-[13px] hover:opacity-80">Combo & quà tặng</Link>
          <Link to="/products" className="block text-[13px] hover:opacity-80">Chọn gia vị theo ý</Link>
        </div>

        <div className="flex-1 space-y-3.5">
          <p className="font-semibold text-[11px] tracking-[1.5px] uppercase">Nếp luôn lắng nghe</p>
          <Link to="/contact" className="block text-[13px] hover:opacity-80">Hướng dẫn đặt hàng</Link>
          <Link to="/news" className="block text-[13px] hover:opacity-80">Giao hàng & bảo quản</Link>
          <Link to="/contact" className="block text-[13px] hover:opacity-80">Đổi trả & quyền riêng tư</Link>
        </div>
      </div>

      <div className="h-px bg-white/20" />
      <p className="text-[11px] leading-[1.6]">
        © 2026 Nếp Nem · Thương hiệu ý tưởng. Từng món ngon, trọn một nếp thương.
      </p>
    </footer>
  );
};

export default Foodter;
