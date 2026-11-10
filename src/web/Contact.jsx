import React, { useState } from 'react';
import { STORE_INFO } from '../data/mockData';
import { IconPhone, IconMapPin, IconShieldCheck, IconCheck } from '../components/Icons';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    type: 'Mua lẻ / Thắc mắc',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setSubmitted(true);
  };

  return (
    <div className="bg-stone-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-widest text-red-700 bg-red-100 px-3 py-1 rounded-full inline-block">
            Kết Nối Với Chúng Tôi
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Liên Hệ & Đặt Nem Số Lượng Lớn
          </h1>
          <p className="text-stone-600 text-sm">
            Hỗ trợ tư vấn đặt nem sỉ, đặt tiệc cưới hỏi, liên hoan công ty hoặc quà tặng doanh nghiệp với chiết khấu tốt nhất.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: Contact Info & Branches */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
              <h3 className="text-lg font-black text-stone-900 pb-3 border-b border-stone-100">
                Thông Tin Cơ Sở ZS Food
              </h3>

              <div className="space-y-4 text-xs text-stone-700">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                    <IconMapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-stone-900">Xưởng chính tại Thanh Hóa:</strong>
                    <span>{STORE_INFO.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <IconPhone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-stone-900">Hotline đặt hàng 24/7:</strong>
                    <span className="text-red-700 font-bold text-sm">{STORE_INFO.hotline}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    ✉️
                  </div>
                  <div>
                    <strong className="block text-stone-900">Email liên hệ:</strong>
                    <span>{STORE_INFO.email}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100">
                <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider mb-2">
                  Chi nhánh phân phối toàn quốc:
                </h4>
                <div className="space-y-2 text-2xs text-stone-600">
                  {STORE_INFO.branches.map((b, idx) => (
                    <div key={idx} className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/60">
                      {b}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Message Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs">
              <h3 className="text-lg font-black text-stone-900 mb-2">
                Gửi Tin Nhắn / Yêu Cầu Báo Giá Sỉ
              </h3>
              <p className="text-xs text-stone-500 mb-6">
                Để lại thông tin, nhân viên tư vấn của ZS Food sẽ liên hệ lại với bạn trong vòng 15 phút.
              </p>

              {submitted ? (
                <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-xl">
                    <IconCheck className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-emerald-950 text-base">Đã gửi yêu cầu thành công!</h4>
                  <p className="text-xs text-emerald-800">
                    Cảm ơn bạn đã liên hệ. Chúng tôi sẽ gọi lại cho số điện thoại <strong>{formData.phone}</strong> sớm nhất.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs text-emerald-700 underline font-semibold mt-2"
                  >
                    Gửi yêu cầu khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Họ và tên của bạn <span className="text-red-600">*</span>
                      </label>
                      <input 
                        type="text" 
                        required
                        placeholder="Nguyễn Văn A"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Số điện thoại liên hệ <span className="text-red-600">*</span>
                      </label>
                      <input 
                        type="tel" 
                        required
                        placeholder="0912.xxx.xxx"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Email (nếu có)
                      </label>
                      <input 
                        type="email" 
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-red-600"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Mục đích liên hệ
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
                      >
                        <option value="Mua lẻ / Thắc mắc">Mua nem lẻ / Thắc mắc khẩu vị</option>
                        <option value="Đặt tiệc công ty / cưới hỏi">Đặt tiệc liên hoan / cưới hỏi (trên 100 chiếc)</option>
                        <option value="Đại lý phân phối">Hợp tác làm đại lý phân phối</option>
                        <option value="Quà biếu doanh nghiệp">Đặt hộp quà biếu doanh nghiệp</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Nội dung tin nhắn / Ghi chú số lượng
                    </label>
                    <textarea 
                      rows="4"
                      placeholder="Cho biết số lượng nem bạn cần, ngày cần giao hoặc khẩu vị gia vị đặc thù..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-red-600"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-linear-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white font-bold text-sm shadow-md transition-all"
                  >
                    Gửi Yêu Cầu Tư Vấn Ngay
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Contact;

