import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStoredCombos } from '../data/mockData';

const formatVnd = (amount) => {
  return amount ? `${amount.toLocaleString('vi-VN')} đ` : '0 đ';
};

const Combos = () => {
  const [combosList, setCombosList] = useState(getStoredCombos);

  useEffect(() => {
    const handleUpdate = () => {
      setCombosList(getStoredCombos());
    };
    window.addEventListener('nep_combos_updated', handleUpdate);
    return () => window.removeEventListener('nep_combos_updated', handleUpdate);
  }, []);
  return (
    <div className="bg-[#faf7ef] min-h-screen text-[#26392c]">
      <div className="w-full px-4 sm:px-8 lg:px-[72px] pt-7 pb-20 space-y-9">
        
        {/* Breadcrumbs */}
        <nav className="text-[12px] text-[#75796c] flex items-center gap-2">
          <Link to="/home" className="hover:text-[#26392c]">Trang chủ</Link>
          <span>/</span>
          <span className="text-[#26392c] font-medium">Combo & Quà tặng</span>
        </nav>

        {/* Section Header */}
        <div className="space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#ad3c32]">
            THÊM NGƯỜI, THÊM NGON
          </p>
          <h1 className="font-serif font-bold text-[36px] sm:text-[46px] leading-[1.25] tracking-[-0.6px] text-[#22382a]">
            Chọn một combo. Đủ một bàn vui.
          </h1>
          <p className="text-[14px] leading-[1.65] text-[#6b7264] max-w-2xl">
            Mỗi món trong combo đều được chọn gia vị riêng (Tỏi, Ớt, Đinh lăng) theo đúng khẩu vị của bạn. Bấm vào từng combo để chọn vị chi tiết.
          </p>
        </div>

        {/* Combos Grid - Full Width Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {combosList.filter((c) => c.status !== 'Tạm ẩn').map((combo) => (
            <div 
              key={combo.id} 
              className="bg-[#fffefa] border border-[#dedccf] rounded-[20px] p-6 sm:p-8 flex flex-col justify-between shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:border-[#b8c9ba] transition-all group"
            >
              <div className="space-y-5">
                {/* Image */}
                <div className="overflow-hidden rounded-[16px] aspect-16/10 w-full bg-[#f4f1e8]">
                  <Link to={`/product/${combo.id}`}>
                    <img 
                      src={combo.image} 
                      alt={combo.name} 
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
                    />
                  </Link>
                </div>

                {/* Badge */}
                <div>
                  <span className="inline-block bg-[#faebe8] text-[#ad3c32] text-[11px] font-medium px-3 py-1 rounded-full">
                    {combo.badge || 'Bán chạy'}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h2 className="font-serif font-bold text-[28px] sm:text-[32px] tracking-[-0.6px] text-[#22382a] group-hover:text-[#ad3c32] transition-colors leading-tight">
                    <Link to={`/product/${combo.id}`}>
                      {combo.name}
                    </Link>
                  </h2>
                  <p className="text-[12px] text-[#7a8072] mt-1 font-medium">
                    {combo.pack}
                  </p>
                </div>

                {/* Description */}
                <p className="text-[13px] sm:text-[14px] leading-[1.65] text-[#5e6657]">
                  {combo.description || combo.shortDesc}
                </p>

                {/* Items included */}
                {combo.itemsIncluded && (
                  <div className="p-4 bg-[#f8f6ee] border border-[#e8e4da] rounded-xl space-y-1 text-[12px] text-[#4d594d]">
                    <span className="font-bold text-[#22382a] block mb-1">Trong combo bao gồm:</span>
                    {combo.itemsIncluded.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <span className="text-[#31583b]">✓</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pricing */}
                <div className="flex items-baseline gap-3 pt-1">
                  <span className="text-[26px] sm:text-[28px] font-bold text-[#ad3c32] leading-none">
                    {formatVnd(combo.price)}
                  </span>
                  {combo.originalPrice && (
                    <span className="text-[14px] text-[#9a9e94] line-through font-normal">
                      {formatVnd(combo.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-6 border-t border-[#ede9dc]">
                <Link
                  to={`/product/${combo.id}`}
                  className="w-full py-3.5 px-4 rounded-xl border border-[#31583b] bg-white hover:bg-[#31583b] text-[#31583b] hover:text-white text-[14px] font-semibold flex items-center justify-center gap-2 transition-all shadow-2xs"
                >
                  <span>Chọn gia vị cho từng món & đặt combo</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Combos;
