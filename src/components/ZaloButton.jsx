import React from 'react';
import zaloIcon from '../assets/Icon_of_Zalo.svg';
import { STORE_INFO } from '../data/siteContent';

// Zalo deep link: mở app Zalo nếu đã cài, còn không thì mở trang chat trên web.
const ZALO_PHONE = STORE_INFO.zalo.replace(/[^\d]/g, '');
const ZALO_LINK = `https://zalo.me/${ZALO_PHONE}`;
const ZALO_PHONE_DISPLAY = STORE_INFO.zalo;

const ZaloButton = () => {
  return (
    <a
      href={ZALO_LINK}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat Zalo với Nếp Nem qua số ${ZALO_PHONE_DISPLAY}`}
      title={`Chat Zalo: ${ZALO_PHONE_DISPLAY}`}
      className="group fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex items-center gap-3"
    >
      {/* Nhãn hiện khi rê chuột (ẩn trên điện thoại để không che nội dung) */}
      <span className="pointer-events-none hidden sm:flex translate-x-2 items-center rounded-full bg-nep-ink px-4 py-2 text-[12px] font-medium tracking-wide text-nep-cream opacity-0 shadow-lg transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
        Chat Zalo · {ZALO_PHONE_DISPLAY}
      </span>

      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-[0_10px_30px_-8px_rgba(0,104,255,0.7)] ring-1 ring-black/5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-105 group-active:scale-95">
        {/* Vòng lan toả nhẹ để gây chú ý */}
        <span className="absolute inset-0 rounded-full bg-[#0068FF]/25 animate-zalo-ping" aria-hidden="true" />
        <img src={zaloIcon} alt="Zalo" className="relative h-9 w-9" />
      </span>
    </a>
  );
};

export default ZaloButton;
