import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { IconX, IconChili, IconGarlic, IconHerb, IconCheck, IconPlus, IconMinus } from './Icons';
import { useNavigate } from 'react-router-dom';

const SpiceModal = () => {
  const { spiceModalProduct, closeSpiceModal, addToCart } = useCart();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [spices, setSpices] = useState({
    garlic: "Nhiều",
    chili: "Ít",
    polyscias: "Nhiều"
  });
  const [eatTime, setEatTime] = useState("Ăn ngay trong ngày (chín tới)");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (spiceModalProduct) {
      setQuantity(1);
      setSpices(spiceModalProduct.defaultSpices || {
        garlic: "Nhiều",
        chili: "Ít",
        polyscias: "Nhiều"
      });
      setEatTime("Ăn ngay trong ngày (chín tới)");
      setNote("");
    }
  }, [spiceModalProduct]);

  if (!spiceModalProduct) return null;

  const handleSpiceToggle = (type, value) => {
    setSpices(prev => ({ ...prev, [type]: value }));
  };

  const handleAddToCart = (isBuyNow = false) => {
    addToCart(spiceModalProduct, quantity, spices, eatTime, note);
    closeSpiceModal();
    if (isBuyNow) {
      navigate('/cart');
    }
  };

  const eatTimeOptions = [
    { label: "Ăn ngay trong ngày (chín tới)", desc: "Mẻ nem ủ đủ độ, chua thanh dịu, bóc ăn liền cực ngon" },
    { label: "1 - 2 ngày tới mới ăn", desc: "Mẻ nem mới gói, ủ men tự nhiên vừa chín đúng dịp bạn dùng" },
    { label: "Làm quà biếu / Để tủ mát", desc: "Nem gói mới nhất, giữ độ giòn tươi ngon lâu hơn" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-linear-to-r from-red-700 to-red-800 text-white">
          <div className="flex items-center space-x-3">
            <span className="p-1.5 bg-white/10 rounded-lg text-xl">🌶️</span>
            <div>
              <h3 className="font-bold text-lg leading-tight">Tùy Chọn Gia Vị & Đặt Nem</h3>
              <p className="text-xs text-red-100">Khẩu vị gia truyền chuẩn gu của bạn</p>
            </div>
          </div>
          <button 
            onClick={closeSpiceModal}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
          >
            <IconX className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 overflow-y-auto space-y-5 text-stone-800 text-sm">
          {/* Product snapshot */}
          <div className="flex items-center gap-4 p-3 bg-stone-50 rounded-xl border border-stone-200">
            <img 
              src={spiceModalProduct.image} 
              alt={spiceModalProduct.name} 
              className="w-16 h-16 object-cover rounded-lg shadow-xs"
            />
            <div className="flex-1">
              <h4 className="font-semibold text-stone-900 text-base">{spiceModalProduct.name}</h4>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-red-700 font-bold text-lg">
                  {spiceModalProduct.price.toLocaleString('vi-VN')}đ
                </span>
                {spiceModalProduct.originalPrice && (
                  <span className="text-stone-400 text-xs line-through">
                    {spiceModalProduct.originalPrice.toLocaleString('vi-VN')}đ
                  </span>
                )}
                <span className="text-xs text-stone-500 font-medium ml-1">
                  ({spiceModalProduct.unit || 'Phần'})
                </span>
              </div>
            </div>
          </div>

          {/* SPICE OPTIONS: Garlic, Chili, Polyscias */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-600"></span>
                Tùy chỉnh thành phần gia vị:
              </span>
              <span className="text-xs text-stone-500 italic">Chọn độc lập theo ý thích</span>
            </div>

            {/* Garlic */}
            <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconGarlic className="text-xl" />
                <div>
                  <div className="font-semibold text-stone-900">Lát Tỏi Ta</div>
                  <div className="text-xs text-stone-500">Tỏi tía thái lát mỏng thơm lừng</div>
                </div>
              </div>
              <div className="flex bg-white rounded-lg p-1 border border-stone-200 shadow-2xs">
                {['Ít', 'Nhiều'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSpiceToggle('garlic', opt)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                      spices.garlic === opt 
                        ? 'bg-amber-600 text-white shadow-xs' 
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {opt} tỏi
                  </button>
                ))}
              </div>
            </div>

            {/* Chili */}
            <div className="p-3.5 bg-red-50/50 rounded-xl border border-red-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconChili className="text-xl" />
                <div>
                  <div className="font-semibold text-stone-900">Ớt Chỉ Thiên</div>
                  <div className="text-xs text-stone-500">Ớt tươi đỏ cay the nồng nàn</div>
                </div>
              </div>
              <div className="flex bg-white rounded-lg p-1 border border-stone-200 shadow-2xs">
                {['Ít', 'Nhiều'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSpiceToggle('chili', opt)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                      spices.chili === opt 
                        ? 'bg-red-600 text-white shadow-xs' 
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {opt} ớt
                  </button>
                ))}
              </div>
            </div>

            {/* Polyscias */}
            <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconHerb className="text-xl" />
                <div>
                  <div className="font-semibold text-stone-900">Lá Đinh Lăng</div>
                  <div className="text-xs text-stone-500">Đinh lăng nếp bùi chát thơm mát</div>
                </div>
              </div>
              <div className="flex bg-white rounded-lg p-1 border border-stone-200 shadow-2xs">
                {['Ít', 'Nhiều'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSpiceToggle('polyscias', opt)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                      spices.polyscias === opt 
                        ? 'bg-emerald-700 text-white shadow-xs' 
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {opt} lá
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* EATING TIME PREFERENCE */}
          <div className="space-y-2 pt-2 border-t border-stone-200">
            <label className="font-bold text-stone-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              Thời gian bạn dự kiến ăn nem:
            </label>
            <p className="text-xs text-stone-500">
              * Rất quan trọng! Xưởng sẽ chọn đúng mẻ nem lên men vừa độ cho thời gian thưởng thức của bạn.
            </p>
            <div className="grid grid-cols-1 gap-2 pt-1">
              {eatTimeOptions.map((opt) => (
                <label 
                  key={opt.label}
                  className={`flex items-start gap-3 p-2.5 rounded-xl border cursor-pointer transition-all ${
                    eatTime === opt.label 
                      ? 'border-emerald-600 bg-emerald-50/70 shadow-2xs ring-1 ring-emerald-600' 
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <input 
                    type="radio" 
                    name="eatTimeOption" 
                    value={opt.label}
                    checked={eatTime === opt.label}
                    onChange={(e) => setEatTime(e.target.value)}
                    className="mt-1 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-stone-900 block">{opt.label}</span>
                    <span className="text-stone-500">{opt.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Quantity and Note */}
          <div className="flex items-center justify-between pt-2">
            <span className="font-bold text-stone-900">Số lượng ({spiceModalProduct.unit || 'phần'}):</span>
            <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white">
              <button 
                type="button" 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 text-stone-600 hover:bg-stone-100 transition-colors"
              >
                <IconMinus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center font-bold text-stone-900">{quantity}</span>
              <button 
                type="button" 
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 text-stone-600 hover:bg-stone-100 transition-colors"
              >
                <IconPlus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Ghi chú thêm cho tiệm (Tùy chọn):
            </label>
            <input 
              type="text"
              placeholder="VD: Cho thêm tương ớt, bó chặt tay, giao trước 17h..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center gap-3">
          <div className="flex-1">
            <span className="text-xs text-stone-500 block">Tổng tiền:</span>
            <span className="text-lg font-bold text-red-700">
              {(spiceModalProduct.price * quantity).toLocaleString('vi-VN')}đ
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleAddToCart(false)}
            className="flex-1 py-2.5 px-3 rounded-xl border-2 border-red-700 text-red-700 font-bold text-sm hover:bg-red-50 transition-colors text-center"
          >
            Thêm vào giỏ
          </button>

          <button
            type="button"
            onClick={() => handleAddToCart(true)}
            className="flex-1 py-2.5 px-3 rounded-xl bg-linear-to-r from-red-700 to-red-800 text-white font-bold text-sm hover:from-red-800 hover:to-red-900 shadow-md transition-all text-center"
          >
            Mua ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpiceModal;

