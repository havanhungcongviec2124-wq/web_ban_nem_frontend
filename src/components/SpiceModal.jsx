import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatVnd, QtyControl, SpiceChoice } from './NepUI';

const SpiceModal = () => {
  const { spiceModalProduct, closeSpiceModal, addToCart } = useCart();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [spices, setSpices] = useState({ garlic: 'Nhiều', chili: 'Ít', polyscias: 'Nhiều' });

  useEffect(() => {
    if (spiceModalProduct) {
      setQuantity(1);
      setSpices(spiceModalProduct.defaultSpices || { garlic: 'Nhiều', chili: 'Ít', polyscias: 'Nhiều' });
    }
  }, [spiceModalProduct]);

  if (!spiceModalProduct) return null;

  const add = (buyNow = false) => {
    addToCart(spiceModalProduct, quantity, spices);
    closeSpiceModal();
    if (buyNow) navigate('/cart');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-nep-ink/50" onClick={closeSpiceModal}>
      <div
        className="relative w-full max-w-[480px] bg-nep-cream rounded-xl overflow-hidden max-h-[90vh] flex flex-col animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-nep-line">
          <div>
            <p className="font-serif font-semibold text-[22px] text-nep-green leading-[1.3]">{spiceModalProduct.name}</p>
            <p className="text-[12px] text-nep-muted mt-1">{spiceModalProduct.pack || spiceModalProduct.unit}</p>
          </div>
          <button type="button" onClick={closeSpiceModal} className="text-nep-green text-[20px] leading-none" aria-label="Đóng">
            ×
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          <div className="flex items-center gap-3">
            <img src={spiceModalProduct.image} alt="" className="w-16 h-16 object-cover rounded-lg" />
            <p className="text-[18px] font-semibold text-nep-rose">{formatVnd(spiceModalProduct.price)}</p>
          </div>

          <div className="space-y-3">
            <p className="text-[13px] font-semibold text-nep-green">Chọn Tỏi, Ớt, Đinh lăng</p>
            <SpiceChoice label="Tỏi" value={spices.garlic} onChange={(v) => setSpices((s) => ({ ...s, garlic: v }))} />
            <SpiceChoice label="Ớt" value={spices.chili} onChange={(v) => setSpices((s) => ({ ...s, chili: v }))} />
            <SpiceChoice label="Đinh lăng" value={spices.polyscias} onChange={(v) => setSpices((s) => ({ ...s, polyscias: v }))} />
            <p className="text-[11px] leading-[1.6] text-nep-muted">Mỗi loại chỉ có hai mức Ít / Nhiều. Ngày dùng bạn chọn lúc thanh toán.</p>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-[13px] font-medium">Số lượng</p>
            <QtyControl
              value={quantity}
              onMinus={() => setQuantity((n) => Math.max(1, n - 1))}
              onPlus={() => setQuantity((n) => n + 1)}
            />
          </div>
        </div>

        <div className="p-5 border-t border-nep-line flex items-center gap-3 bg-nep-paper">
          <div className="flex-1">
            <p className="text-[11px] text-nep-muted">Tạm tính</p>
            <p className="text-[18px] font-semibold text-nep-rose">{formatVnd(spiceModalProduct.price * quantity)}</p>
          </div>
          <button
            type="button"
            onClick={() => add(false)}
            className="min-h-12 px-4 rounded-lg border border-nep-line text-nep-green text-[13px] font-semibold"
          >
            Thêm vào giỏ
          </button>
          <button
            type="button"
            onClick={() => add(true)}
            className="min-h-12 px-4 rounded-lg bg-nep-rose text-white text-[13px] font-semibold"
          >
            Mua ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpiceModal;
