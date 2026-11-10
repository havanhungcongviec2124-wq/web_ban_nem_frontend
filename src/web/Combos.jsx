import React from 'react';
import { COMBOS } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { 
  IconCheck, 
  IconSparkles, 
  IconShieldCheck, 
  IconTruck, 
  IconCart,
  IconArrowRight 
} from '../components/Icons';

const Combos = () => {
  const { openSpiceModal } = useCart();

  return (
    <div className="bg-stone-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Section */}
        <div className="bg-linear-to-r from-stone-900 via-red-950 to-stone-900 rounded-3xl p-8 sm:p-12 text-white mb-10 shadow-xl border border-red-900/40 relative overflow-hidden">
          <div className="max-w-3xl relative z-10">
            <span className="text-xs font-black uppercase tracking-widest text-amber-300 bg-red-900/60 border border-red-700/60 px-3 py-1 rounded-full inline-block mb-3">
              Tiết Kiệm Lên Đến 25%
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Combo Nem Xứ Thanh Thượng Hạng
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm mt-3 leading-relaxed">
              Giải pháp trọn gói hoàn hảo cho bữa tiệc sum họp gia đình, tụ tập bạn bè hoặc set quà biếu tặng sang trọng. Mỗi combo đều đi kèm đầy đủ các loại nem đặc sản, tương ớt đặc biệt và cho phép tùy biến gia vị Tỏi, Ớt, Đinh Lăng độc lập!
            </p>
          </div>
        </div>

        {/* Combo Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {COMBOS.map((combo) => {
            const savings = combo.originalPrice - combo.price;
            const savingPercent = Math.round((savings / combo.originalPrice) * 100);

            return (
              <div 
                key={combo.id}
                className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image & Badges */}
                  <div className="relative aspect-16/9 w-full overflow-hidden bg-stone-100">
                    <img 
                      src={combo.image} 
                      alt={combo.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="bg-red-700 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                        {combo.badge}
                      </span>
                      <span className="bg-emerald-700 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-md">
                        Giảm {savingPercent}%
                      </span>
                    </div>
                    <span className="absolute bottom-3 right-3 bg-stone-900/80 backdrop-blur-md text-amber-300 text-xs font-bold px-3 py-1 rounded-lg">
                      Đã bán {combo.soldCount}+ set
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 sm:p-8 space-y-4">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-stone-900 hover:text-red-700 transition-colors">
                        <Link to={`/product/${combo.id}`}>
                          {combo.name}
                        </Link>
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                        {combo.shortDesc}
                      </p>
                    </div>

                    {/* Detailed Items list */}
                    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                      <span className="text-xs font-black uppercase tracking-wider text-red-800 block mb-1">
                        📦 Thành phần set combo bao gồm:
                      </span>
                      <div className="space-y-1.5">
                        {combo.itemsIncluded.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-700">
                            <IconCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="font-medium">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Default spice note */}
                    <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-2xs text-amber-950 flex items-center justify-between">
                      <span className="font-bold">🌶️ Khẩu vị mặc định:</span>
                      <span>Tỏi: {combo.defaultSpices.garlic} • Ớt: {combo.defaultSpices.chili} • Đinh lăng: {combo.defaultSpices.polyscias}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Pricing & CTA */}
                <div className="p-6 sm:p-8 pt-0 border-t border-stone-100 mt-auto">
                  <div className="flex items-baseline justify-between mb-4 pt-4">
                    <div>
                      <span className="text-2xl sm:text-3xl font-black text-red-700">
                        {combo.price.toLocaleString('vi-VN')}đ
                      </span>
                      <span className="text-xs text-stone-400 line-through ml-2 font-medium">
                        {combo.originalPrice.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      Tiết kiệm {savings.toLocaleString('vi-VN')}đ
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Link
                      to={`/product/${combo.id}`}
                      className="py-3 px-4 rounded-xl border-2 border-stone-300 text-stone-700 font-bold text-xs text-center hover:bg-stone-50 transition-colors flex items-center justify-center gap-1"
                    >
                      <span>Xem Chi Tiết Combo</span>
                      <IconArrowRight className="w-4 h-4" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => openSpiceModal(combo)}
                      className="py-3 px-4 rounded-xl bg-linear-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white font-extrabold text-xs text-center flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                    >
                      <IconCart className="w-4 h-4" />
                      <span>Chọn Vị & Mua Ngay</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Policy guarantee strip */}
        <div className="mt-12 p-6 bg-white rounded-2xl border border-stone-200 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="space-y-1">
            <span className="text-2xl block">🎁</span>
            <h4 className="font-bold text-stone-900 text-sm">Hộp Quà Biếu Lịch Sự</h4>
            <p className="text-xs text-stone-500">Kèm túi xách và thiệp chúc mừng theo yêu cầu</p>
          </div>
          <div className="space-y-1">
            <span className="text-2xl block">📦</span>
            <h4 className="font-bold text-stone-900 text-sm">Đóng Thùng Xốp Lạnh</h4>
            <p className="text-xs text-stone-500">Đảm bảo nem luôn tươi ngon khi chuyển đi xa</p>
          </div>
          <div className="space-y-1">
            <span className="text-2xl block">⚡</span>
            <h4 className="font-bold text-stone-900 text-sm">Hỏa Tốc Đúng Hẹn</h4>
            <p className="text-xs text-stone-500">Giao trước giờ tiệc hoặc hẹn giờ theo ý bạn</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Combos;

