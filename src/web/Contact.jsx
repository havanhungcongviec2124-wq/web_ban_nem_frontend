import React, { useState } from 'react';
import { STORE_INFO } from '../data/mockData';
import { Eyebrow } from '../components/NepUI';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setSubmitted(true);
  };

  return (
    <div className="bg-nep-cream pb-16 pt-9 px-4 sm:px-8 lg:px-[72px] space-y-10">
      <div className="space-y-3 max-w-2xl">
        <Eyebrow>Nếp luôn lắng nghe</Eyebrow>
        <h1 className="font-serif font-semibold text-[36px] sm:text-[48px] leading-[1.3] tracking-[-0.6px]">
          Ghé Nếp. Hoặc để Nếp gọi lại.
        </h1>
        <p className="text-[14px] leading-[1.6] text-nep-muted">
          Đặt món, hỏi gia vị, hay cần một mâm sum vầy — cứ gửi lời, Nếp sẽ hồi đáp.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-nep-paper border border-nep-line rounded-xl p-6 space-y-4">
            <p className="font-serif font-semibold text-[22px]">Nếp Nem</p>
            <p className="text-[13px] leading-[1.6]">{STORE_INFO.address}</p>
            <p className="text-[13px]">{STORE_INFO.hotline}</p>
            <p className="text-[13px]">{STORE_INFO.email}</p>
            <p className="text-[12px] text-nep-muted">{STORE_INFO.workingHours}</p>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="bg-nep-paper border border-nep-line rounded-xl p-6 sm:p-8">
            {submitted ? (
              <div className="space-y-3">
                <Eyebrow>Đã gửi lời</Eyebrow>
                <h2 className="font-serif font-semibold text-[28px]">Nếp sẽ liên hệ {formData.phone}.</h2>
                <button type="button" onClick={() => setSubmitted(false)} className="text-[13px] text-nep-green">
                  Gửi lời khác
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="font-serif font-semibold text-[22px]">Để lại lời nhắn</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    required
                    placeholder="Họ và tên"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="min-h-12 px-3.5 rounded-lg border border-nep-line bg-nep-cream text-[13px] outline-none"
                  />
                  <input
                    required
                    placeholder="Số điện thoại"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="min-h-12 px-3.5 rounded-lg border border-nep-line bg-nep-cream text-[13px] outline-none"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email (nếu có)"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full min-h-12 px-3.5 rounded-lg border border-nep-line bg-nep-cream text-[13px] outline-none"
                />
                <textarea
                  rows={4}
                  placeholder="Bạn muốn Nếp giúp gì?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-3 rounded-lg border border-nep-line bg-nep-cream text-[13px] outline-none"
                />
                <button type="submit" className="min-h-12 px-[22px] rounded-lg bg-nep-rose text-white text-[14px] font-semibold">
                  Gửi cho Nếp →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
