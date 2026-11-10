import React from 'react';

export const formatVnd = (n) => `${Number(n || 0).toLocaleString('vi-VN')} ₫`;

export const STATUS_STYLES = {
  'Chờ xác nhận': 'bg-[#f6ead8] text-[#9a6a32]',
  'Đang chuẩn bị': 'bg-[#e7eee0] text-[#3f6a48]',
  'Đang giao': 'bg-[#f7e4de] text-[#ad3c32]',
  'Hoàn tất': 'bg-[#e8efe4] text-[#5c7a62]',
  'Đã hủy': 'bg-nep-mint text-nep-muted',
};

export const normalizeStatus = (status) => {
  if (status === 'Đang ủ men' || status === 'Đang đóng gói') return 'Đang chuẩn bị';
  if (status === 'Đang giao hàng') return 'Đang giao';
  if (status === 'Hoàn thành') return 'Hoàn tất';
  return status || 'Chờ xác nhận';
};

export const StatusPill = ({ status }) => {
  const label = normalizeStatus(status);
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${STATUS_STYLES[label] || 'bg-nep-mint text-nep-green'}`}>
      {label}
    </span>
  );
};

export const Card = ({ children, className = '' }) => (
  <div className={`bg-nep-paper rounded-[18px] border border-nep-line ${className}`}>{children}</div>
);

export const PageTitle = ({ title, subtitle }) => (
  <div className="mb-6">
    <h1 className="font-serif text-[32px] sm:text-[36px] leading-none tracking-[-0.8px] text-nep-ink">{title}</h1>
    {subtitle && <p className="mt-2 text-[13px] text-nep-muted">{subtitle}</p>}
  </div>
);

export const FieldLabel = ({ children, required }) => (
  <label className="block text-[12px] font-medium text-nep-ink mb-1.5">
    {children}
    {required && <span className="text-nep-rose"> *</span>}
  </label>
);

export const Input = ({ className = '', ...props }) => (
  <input
    {...props}
    className={`w-full h-11 px-3.5 rounded-xl border border-nep-line bg-white text-[13px] text-nep-ink placeholder:text-nep-muted outline-none focus:border-nep-green ${className}`}
  />
);

export const Textarea = ({ className = '', ...props }) => (
  <textarea
    {...props}
    className={`w-full px-3.5 py-3 rounded-xl border border-nep-line bg-white text-[13px] text-nep-ink placeholder:text-nep-muted outline-none focus:border-nep-green resize-none ${className}`}
  />
);

export const Select = ({ className = '', children, ...props }) => (
  <select
    {...props}
    className={`w-full h-11 px-3.5 rounded-xl border border-nep-line bg-white text-[13px] text-nep-ink outline-none focus:border-nep-green ${className}`}
  >
    {children}
  </select>
);

export const SearchInput = ({ value, onChange, placeholder }) => (
  <div className="flex items-center gap-2.5 flex-1 min-w-0 h-11 px-3.5 rounded-xl border border-nep-line bg-nep-paper">
    <img src="/assets/search.svg" alt="" width={16} height={16} />
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="flex-1 bg-transparent text-[13px] text-nep-ink placeholder:text-nep-muted outline-none"
    />
  </div>
);

export const PrimaryButton = ({ children, className = '', ...props }) => (
  <button
    type="button"
    {...props}
    className={`inline-flex items-center justify-center gap-1.5 h-11 px-4 rounded-xl bg-nep-rose text-white text-[13px] font-semibold hover:opacity-90 disabled:opacity-50 ${className}`}
  >
    {children}
  </button>
);

export const GhostButton = ({ children, className = '', ...props }) => (
  <button
    type="button"
    {...props}
    className={`inline-flex items-center justify-center gap-1.5 h-11 px-4 rounded-xl border border-nep-line bg-nep-paper text-nep-green text-[13px] font-medium hover:bg-nep-mint ${className}`}
  >
    {children}
  </button>
);

export const SpiceToggle = ({ label, value, onChange }) => (
  <div className="flex items-center gap-3">
    <span className="w-16 text-[13px] text-nep-ink shrink-0">{label}</span>
    <div className="flex flex-1 gap-2">
      {['Ít', 'Nhiều'].map((opt) => {
        const active = value === opt;
        return (
          <button
            type="button"
            key={opt}
            onClick={() => onChange(opt)}
            className={`flex-1 h-10 rounded-lg border text-[13px] flex items-center justify-center gap-1.5 ${
              active ? 'bg-nep-mint border-nep-green font-semibold text-nep-green' : 'bg-white border-nep-line text-nep-green'
            }`}
          >
            {active && <img src="/assets/check.svg" alt="" width={13} height={13} />}
            {opt}
          </button>
        );
      })}
    </div>
  </div>
);

export const spiceLine = (spices) => {
  if (!spices) return '';
  return `Tỏi: ${spices.garlic} · Ớt: ${spices.chili} · Đinh lăng: ${spices.polyscias}`;
};

export const IconGrid = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

export const IconBox = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
    <path d="M3.3 7L12 12l8.7-5M12 22V12" />
  </svg>
);

export const IconLayers = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

export const IconList = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" strokeLinecap="round" />
  </svg>
);

export const IconPeople = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>
);

export const IconClipboard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
  </svg>
);

export const IconBell = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M18 8A6 6 0 106 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
  </svg>
);

export const IconChat = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);
