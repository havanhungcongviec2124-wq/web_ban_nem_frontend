import React from 'react';

export const formatVnd = (n) => `${Number(n || 0).toLocaleString('vi-VN')} ₫`;

export const Eyebrow = ({ children, className = 'text-nep-green' }) => (
  <p className={`font-semibold text-[11px] tracking-[1.5px] uppercase ${className}`}>
    {children}
  </p>
);

export const PagePad = ({ children, className = '' }) => (
  <div className={`px-4 sm:px-8 lg:px-[72px] ${className}`}>{children}</div>
);

export const SpiceChoice = ({ label, value, onChange }) => (
  <div className="flex gap-3 items-center w-full">
    <p className="text-[13px] text-nep-ink w-[78px] sm:w-[100px] shrink-0">{label}</p>
    <div className="flex flex-1 gap-1.5">
      {['Ít', 'Nhiều'].map((opt) => {
        const active = value === opt;
        return (
          <button
            type="button"
            key={opt}
            onClick={() => onChange(opt)}
            className={`flex-1 min-h-[44px] rounded-lg border text-[13px] flex items-center justify-center gap-1.5 ${
              active
                ? 'bg-nep-mint border-nep-green font-semibold text-nep-green'
                : 'bg-nep-paper border-nep-line text-nep-green'
            }`}
          >
            {active && <img src="/assets/check.svg" alt="" width={14} height={14} />}
            {opt}
          </button>
        );
      })}
    </div>
  </div>
);

export const QtyControl = ({ value, onMinus, onPlus }) => (
  <div className="border border-nep-line rounded-lg h-12 px-3.5 flex items-center gap-5">
    <button type="button" onClick={onMinus} aria-label="Giảm">
      <img src="/assets/minus-qty.svg" alt="" width={15} height={15} />
    </button>
    <span className="text-[14px] font-medium text-nep-ink min-w-[1ch] text-center">{value}</span>
    <button type="button" onClick={onPlus} aria-label="Tăng">
      <img src="/assets/plus-qty.svg" alt="" width={15} height={15} />
    </button>
  </div>
);
