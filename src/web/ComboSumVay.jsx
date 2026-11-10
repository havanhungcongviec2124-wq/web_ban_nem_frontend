import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComboById } from '../redux/combo/ComboApi';
import { useCart } from '../context/CartContext';

const formatVnd = (amount) => {
  return amount ? `${amount.toLocaleString('vi-VN')} đ` : '0 đ';
};

const ComboSumVay = () => {
  const dispatch = useDispatch();
  const { addToCart } = useCart();
  const selectedCombo = useSelector((state) => state.combos.selectedCombo);
  const combos = useSelector((state) => state.combos.items);

  useEffect(() => {
    dispatch(fetchComboById('combo-sum-vay'));
  }, [dispatch]);

  const combo =
    (selectedCombo && selectedCombo.slug === 'combo-sum-vay' ? selectedCombo : null) ||
    combos.find((c) => c.slug === 'combo-sum-vay' || c.id === 'combo-sum-vay') || {
      id: 'combo-sum-vay',
      slug: 'combo-sum-vay',
      name: 'Combo Sum vầy',
      badge: 'Combo bán chạy · Dành cho 4 – 6 người',
      pack: '30 chiếc · 600 g / combo',
      price: 235000,
      originalPrice: 265000,
      image: '/assets/combo-sum-vay.png',
      shortDesc: 'Hai vị nem, một bàn chuyện trò. Đủ đầy cho bữa gặp gỡ gia đình hoặc buổi hẹn bạn bè cuối tuần.',
    };

  const [quantity, setQuantity] = useState(1);

  const [spicesTrad, setSpicesTrad] = useState({
    garlic: 'Ít',
    chili: 'Ít',
    polyscias: 'Nhiều',
  });

  const [spicesLeaf, setSpicesLeaf] = useState({
    garlic: 'Nhiều',
    chili: 'Nhiều',
    polyscias: 'Ít',
  });

  const handleAddToCart = () => {
    const spiceSummary = `Nem truyền thống: Tỏi ${spicesTrad.garlic}, Ớt ${spicesTrad.chili}, Đinh lăng ${spicesTrad.polyscias} · Nem lá ổi: Tỏi ${spicesLeaf.garlic}, Ớt ${spicesLeaf.chili}, Đinh lăng ${spicesLeaf.polyscias}`;
    addToCart(combo, quantity, spicesTrad, 'Ăn ngay trong ngày', spiceSummary);
  };

  return (
    <div className="bg-[#faf7ef] min-h-screen text-[#26392c]">
      <div className="w-full px-4 sm:px-8 lg:px-[72px] pt-7 pb-20">
        
        {/* Breadcrumb */}
        <nav className="text-[12px] text-[#75796c] mb-7 flex items-center gap-2">
          <Link to="/home" className="hover:text-[#26392c]">Trang chủ</Link>
          <span>/</span>
          <Link to="/combos" className="hover:text-[#26392c]">Combo</Link>
          <span>/</span>
          <span className="text-[#26392c] font-medium">Combo Sum vầy</span>
        </nav>

        {/* 1. TOP MAIN SECTION (2 COLUMNS - FULL WIDTH) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start mb-16">
          
          {/* Left: Big photo of Combo Sum vầy */}
          <div className="lg:col-span-6">
            <div className="overflow-hidden rounded-[20px] bg-[#fffefa] border border-[#dedccf] shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
              <img
                src={combo.image || '/assets/combo-sum-vay.png'}
                alt={combo.name}
                className="w-full h-auto aspect-4/3 sm:aspect-[4/3] object-cover"
              />
            </div>
          </div>

          {/* Right: Info & Description */}
          <div className="lg:col-span-6 pt-1 flex flex-col justify-between">
            <div>
              {/* Badge */}
              <div className="mb-3">
                <span className="inline-block bg-[#faebe8] text-[#ad3c32] text-[11px] font-medium px-3.5 py-1 rounded-full">
                  {combo.badge || 'Combo bán chạy · Dành cho 4 – 6 người'}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-serif font-bold text-[38px] sm:text-[46px] text-[#22382a] leading-[1.2] tracking-[-0.8px] mb-3">
                {combo.name}
              </h1>

              {/* Short Desc */}
              <p className="text-[13px] sm:text-[14px] leading-[1.65] text-[#6b7264] mb-5 max-w-xl">
                {combo.shortDesc || combo.description}
              </p>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 mb-2.5">
                <span className="font-bold text-[30px] sm:text-[34px] text-[#ad3c32] leading-none tracking-tight">
                  {formatVnd(combo.price)}
                </span>
                {combo.originalPrice && (
                  <span className="text-[15px] text-[#9a9e94] line-through font-normal">
                    {formatVnd(combo.originalPrice)}
                  </span>
                )}
              </div>

              {/* Discount pill */}
              <div className="mb-6">
                <span className="inline-block bg-[#e8eedf] text-[#31583b] text-[12px] font-medium px-3.5 py-1 rounded-full">
                  Tiết kiệm 30.000 đ so với mua lẻ
                </span>
              </div>

              {/* "Trong combo có gì?" */}
              <div className="space-y-1.5 pt-1">
                <h3 className="font-bold text-[13px] text-[#22382a]">
                  Trong combo có gì?
                </h3>
                <ul className="text-[13px] text-[#3e4539] space-y-1">
                  <li>• 2 gói nem truyền thống × 10 chiếc (400 g)</li>
                  <li>• 1 gói nem lá ổi × 10 chiếc (200 g)</li>
                </ul>
                <p className="text-[12px] text-[#7a8072] pt-0.5">
                  Tổng 30 chiếc · 600 g
                </p>
                <p className="text-[12px] text-[#7a8072] pt-3 flex items-center gap-1 font-normal">
                  <span>Chọn gia vị riêng cho từng món ngay bên dưới</span>
                  <span>↓</span>
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* 2. MIDDLE SECTION: "Mỗi món, đúng vị bạn thích." */}
        <div className="mt-8 mb-10">
          <p className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#7d6b46] mb-2">
            KHÔNG CHỌN CHUNG CHO CẢ COMBO
          </p>
          <h2 className="font-serif font-bold text-[32px] sm:text-[40px] text-[#22382a] leading-[1.25] tracking-[-0.6px] mb-2">
            Mỗi món, đúng vị bạn thích.
          </h2>
          <p className="text-[13px] text-[#6b7264] max-w-2xl mb-7">
            Cả hai món đều cần chọn đủ Tỏi, Ớt, Đinh lăng. Gia vị áp dụng cho toàn bộ phần của món đó trong mỗi combo.
          </p>

          {/* 2 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Card 1: Nem chua truyền thống */}
            <div className="bg-[#fffefa] border border-[#dedccf] rounded-[18px] p-6 sm:p-7 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between">
              <div>
                {/* Header with thumbnail */}
                <div className="flex items-center gap-3.5 mb-6">
                  <img
                    src="/assets/nem-truyen-thong.png"
                    alt="Nem chua truyền thống"
                    className="w-14 h-14 rounded-xl object-cover shrink-0 border border-[#eee]"
                  />
                  <div>
                    <h3 className="font-semibold text-[17px] text-[#22382a] leading-tight">
                      Nem chua truyền thống
                    </h3>
                    <p className="text-[12px] text-[#7a8072] mt-1">
                      2 gói • 10 chiếc · 400 g
                    </p>
                  </div>
                </div>

                {/* Spices Rows */}
                <div className="space-y-3.5">
                  {/* Tỏi */}
                  <div className="flex items-center">
                    <span className="w-20 text-[13px] font-medium text-[#26392c]">Tỏi</span>
                    <div className="flex-1 grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setSpicesTrad((s) => ({ ...s, garlic: 'Ít' }))}
                        className={`py-2 px-3 text-[13px] rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                          spicesTrad.garlic === 'Ít'
                            ? 'bg-[#e8eedf] border border-[#a8c5ab] text-[#22382a] font-medium'
                            : 'bg-white border border-[#dedccf] text-[#555] hover:border-[#b8b0a0]'
                        }`}
                      >
                        {spicesTrad.garlic === 'Ít' && <span className="font-bold">✓</span>}
                        <span>Ít</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSpicesTrad((s) => ({ ...s, garlic: 'Nhiều' }))}
                        className={`py-2 px-3 text-[13px] rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                          spicesTrad.garlic === 'Nhiều'
                            ? 'bg-[#e8eedf] border border-[#a8c5ab] text-[#22382a] font-medium'
                            : 'bg-white border border-[#dedccf] text-[#555] hover:border-[#b8b0a0]'
                        }`}
                      >
                        {spicesTrad.garlic === 'Nhiều' && <span className="font-bold">✓</span>}
                        <span>Nhiều</span>
                      </button>
                    </div>
                  </div>

                  {/* Ớt */}
                  <div className="flex items-center">
                    <span className="w-20 text-[13px] font-medium text-[#26392c]">Ớt</span>
                    <div className="flex-1 grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setSpicesTrad((s) => ({ ...s, chili: 'Ít' }))}
                        className={`py-2 px-3 text-[13px] rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                          spicesTrad.chili === 'Ít'
                            ? 'bg-[#e8eedf] border border-[#a8c5ab] text-[#22382a] font-medium'
                            : 'bg-white border border-[#dedccf] text-[#555] hover:border-[#b8b0a0]'
                        }`}
                      >
                        {spicesTrad.chili === 'Ít' && <span className="font-bold">✓</span>}
                        <span>Ít</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSpicesTrad((s) => ({ ...s, chili: 'Nhiều' }))}
                        className={`py-2 px-3 text-[13px] rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                          spicesTrad.chili === 'Nhiều'
                            ? 'bg-[#e8eedf] border border-[#a8c5ab] text-[#22382a] font-medium'
                            : 'bg-white border border-[#dedccf] text-[#555] hover:border-[#b8b0a0]'
                        }`}
                      >
                        {spicesTrad.chili === 'Nhiều' && <span className="font-bold">✓</span>}
                        <span>Nhiều</span>
                      </button>
                    </div>
                  </div>

                  {/* Đinh lăng */}
                  <div className="flex items-center">
                    <span className="w-20 text-[13px] font-medium text-[#26392c]">Đinh lăng</span>
                    <div className="flex-1 grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setSpicesTrad((s) => ({ ...s, polyscias: 'Ít' }))}
                        className={`py-2 px-3 text-[13px] rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                          spicesTrad.polyscias === 'Ít'
                            ? 'bg-[#e8eedf] border border-[#a8c5ab] text-[#22382a] font-medium'
                            : 'bg-white border border-[#dedccf] text-[#555] hover:border-[#b8b0a0]'
                        }`}
                      >
                        {spicesTrad.polyscias === 'Ít' && <span className="font-bold">✓</span>}
                        <span>Ít</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSpicesTrad((s) => ({ ...s, polyscias: 'Nhiều' }))}
                        className={`py-2 px-3 text-[13px] rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                          spicesTrad.polyscias === 'Nhiều'
                            ? 'bg-[#e8eedf] border border-[#a8c5ab] text-[#22382a] font-medium'
                            : 'bg-white border border-[#dedccf] text-[#555] hover:border-[#b8b0a0]'
                        }`}
                      >
                        {spicesTrad.polyscias === 'Nhiều' && <span className="font-bold">✓</span>}
                        <span>Nhiều</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Nem chua lá ổi */}
            <div className="bg-[#fffefa] border border-[#dedccf] rounded-[18px] p-6 sm:p-7 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between">
              <div>
                {/* Header with thumbnail */}
                <div className="flex items-center gap-3.5 mb-6">
                  <img
                    src="/assets/nem-la-oi.png"
                    alt="Nem chua lá ổi"
                    className="w-14 h-14 rounded-xl object-cover shrink-0 border border-[#eee]"
                  />
                  <div>
                    <h3 className="font-semibold text-[17px] text-[#22382a] leading-tight">
                      Nem chua lá ổi
                    </h3>
                    <p className="text-[12px] text-[#7a8072] mt-1">
                      1 gói • 10 chiếc · 200 g
                    </p>
                  </div>
                </div>

                {/* Spices Rows */}
                <div className="space-y-3.5">
                  {/* Tỏi */}
                  <div className="flex items-center">
                    <span className="w-20 text-[13px] font-medium text-[#26392c]">Tỏi</span>
                    <div className="flex-1 grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setSpicesLeaf((s) => ({ ...s, garlic: 'Ít' }))}
                        className={`py-2 px-3 text-[13px] rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                          spicesLeaf.garlic === 'Ít'
                            ? 'bg-[#e8eedf] border border-[#a8c5ab] text-[#22382a] font-medium'
                            : 'bg-white border border-[#dedccf] text-[#555] hover:border-[#b8b0a0]'
                        }`}
                      >
                        {spicesLeaf.garlic === 'Ít' && <span className="font-bold">✓</span>}
                        <span>Ít</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSpicesLeaf((s) => ({ ...s, garlic: 'Nhiều' }))}
                        className={`py-2 px-3 text-[13px] rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                          spicesLeaf.garlic === 'Nhiều'
                            ? 'bg-[#e8eedf] border border-[#a8c5ab] text-[#22382a] font-medium'
                            : 'bg-white border border-[#dedccf] text-[#555] hover:border-[#b8b0a0]'
                        }`}
                      >
                        {spicesLeaf.garlic === 'Nhiều' && <span className="font-bold">✓</span>}
                        <span>Nhiều</span>
                      </button>
                    </div>
                  </div>

                  {/* Ớt */}
                  <div className="flex items-center">
                    <span className="w-20 text-[13px] font-medium text-[#26392c]">Ớt</span>
                    <div className="flex-1 grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setSpicesLeaf((s) => ({ ...s, chili: 'Ít' }))}
                        className={`py-2 px-3 text-[13px] rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                          spicesLeaf.chili === 'Ít'
                            ? 'bg-[#e8eedf] border border-[#a8c5ab] text-[#22382a] font-medium'
                            : 'bg-white border border-[#dedccf] text-[#555] hover:border-[#b8b0a0]'
                        }`}
                      >
                        {spicesLeaf.chili === 'Ít' && <span className="font-bold">✓</span>}
                        <span>Ít</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSpicesLeaf((s) => ({ ...s, chili: 'Nhiều' }))}
                        className={`py-2 px-3 text-[13px] rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                          spicesLeaf.chili === 'Nhiều'
                            ? 'bg-[#e8eedf] border border-[#a8c5ab] text-[#22382a] font-medium'
                            : 'bg-white border border-[#dedccf] text-[#555] hover:border-[#b8b0a0]'
                        }`}
                      >
                        {spicesLeaf.chili === 'Nhiều' && <span className="font-bold">✓</span>}
                        <span>Nhiều</span>
                      </button>
                    </div>
                  </div>

                  {/* Đinh lăng */}
                  <div className="flex items-center">
                    <span className="w-20 text-[13px] font-medium text-[#26392c]">Đinh lăng</span>
                    <div className="flex-1 grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setSpicesLeaf((s) => ({ ...s, polyscias: 'Ít' }))}
                        className={`py-2 px-3 text-[13px] rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                          spicesLeaf.polyscias === 'Ít'
                            ? 'bg-[#e8eedf] border border-[#a8c5ab] text-[#22382a] font-medium'
                            : 'bg-white border border-[#dedccf] text-[#555] hover:border-[#b8b0a0]'
                        }`}
                      >
                        {spicesLeaf.polyscias === 'Ít' && <span className="font-bold">✓</span>}
                        <span>Ít</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSpicesLeaf((s) => ({ ...s, polyscias: 'Nhiều' }))}
                        className={`py-2 px-3 text-[13px] rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                          spicesLeaf.polyscias === 'Nhiều'
                            ? 'bg-[#e8eedf] border border-[#a8c5ab] text-[#22382a] font-medium'
                            : 'bg-white border border-[#dedccf] text-[#555] hover:border-[#b8b0a0]'
                        }`}
                      >
                        {spicesLeaf.polyscias === 'Nhiều' && <span className="font-bold">✓</span>}
                        <span>Nhiều</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 3. ACTION BAR (CARD PILL) */}
        <div className="bg-[#e8eedf] border border-[#cadbc2] rounded-[18px] px-6 py-4.5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_2px_6px_rgba(0,0,0,0.02)]">
          {/* Left notice */}
          <div>
            <h4 className="font-semibold text-[15px] text-[#22382a] leading-snug">
              Đã chọn gia vị cho cả 2 món
            </h4>
            <p className="text-[12px] text-[#5e6657] mt-0.5">
              Bạn có thể kiểm tra và chỉnh lại từng món trong giỏ hàng.
            </p>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-[13px] text-[#3e4539] font-medium whitespace-nowrap">
              Số combo
            </span>

            {/* Stepper */}
            <div className="bg-[#fffefa] border border-[#cbd8c6] rounded-lg flex items-center px-1.5 py-1">
              <button
                type="button"
                onClick={() => setQuantity((n) => Math.max(1, n - 1))}
                className="w-7 h-7 flex items-center justify-center text-[#555] hover:text-black font-semibold text-[15px] transition-colors"
                aria-label="Giảm số lượng"
              >
                −
              </button>
              <span className="w-8 text-center font-semibold text-[14px] text-[#22382a]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((n) => n + 1)}
                className="w-7 h-7 flex items-center justify-center text-[#555] hover:text-black font-semibold text-[15px] transition-colors"
                aria-label="Tăng số lượng"
              >
                +
              </button>
            </div>

            {/* Add button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="bg-[#ad3c32] hover:bg-[#962f26] text-white font-medium text-[14px] px-6 py-3 rounded-lg shadow-xs transition-all whitespace-nowrap active:scale-[0.99]"
            >
              Thêm combo · {formatVnd((combo.price || 235000) * quantity)}
            </button>
          </div>
        </div>

        {/* 4. TWO-COLUMN INFO SECTION */}
        <div className="mt-16 pt-10 border-t border-[#dedccf] grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          
          {/* Left Column */}
          <div className="space-y-2.5">
            <h3 className="font-serif font-semibold text-[22px] text-[#22382a] leading-tight">
              Hai món, cùng nếp chỉn chu
            </h3>
            <p className="text-[13px] leading-[1.65] text-[#5e6657]">
              Nem truyền thống: thịt heo, bì heo, thính gạo, gia vị, tỏi, ớt, đinh lăng. Nem lá ổi có thêm lá ổi tạo hương thơm. Lượng gia vị theo lựa chọn riêng của từng món.
            </p>
          </div>

          {/* Right Column */}
          <div className="space-y-2.5">
            <h3 className="font-serif font-semibold text-[22px] text-[#22382a] leading-tight">
              Dùng ngon đúng dịp
            </h3>
            <p className="text-[13px] leading-[1.65] text-[#5e6657]">
              Giữ lạnh ở 0 – 4°C khi nem đạt độ chua phù hợp; xem hạn dùng trên nhãn. Nhập ngày, giờ sử dụng khi thanh toán để Nếp tự vấn lịch giao — không phải giờ giao được bảo đảm.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ComboSumVay;
