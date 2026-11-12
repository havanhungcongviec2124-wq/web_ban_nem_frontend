import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, fetchProducts } from '../redux/product/ProductApi';
import { fetchComboById } from '../redux/combo/ComboApi';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { Eyebrow, formatVnd, QtyControl, SpiceChoice } from '../components/NepUI';

const ProductDetail = () => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const products = useSelector((state) => state.products.items);
  const selectedProduct = useSelector((state) => state.products.selectedProduct);
  const selectedCombo = useSelector((state) => state.combos.selectedCombo);
  const isLoadingProduct = useSelector((state) => state.products.isLoading);
  const isLoadingCombo = useSelector((state) => state.combos.isLoading);

  useEffect(() => {
    if (!id) return;
    dispatch(fetchProductById(id));
    dispatch(fetchComboById(id));
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [id, dispatch, products.length]);

  // Chỉ dùng sản phẩm/combo THẬT trả về từ backend — không dùng dữ liệu mẫu
  const product = useMemo(() => {
    if (selectedProduct && (selectedProduct.slug === id || selectedProduct.id === id || selectedProduct._id === id)) {
      return selectedProduct;
    }
    if (selectedCombo && (selectedCombo.slug === id || selectedCombo.id === id || selectedCombo._id === id)) {
      return selectedCombo;
    }
    const found = products.find((p) => p.slug === id || p.id === id || p._id === id);
    return found || null;
  }, [id, selectedProduct, selectedCombo, products]);

  const isCombo = Boolean(product) && (product.category === 'combo' || Boolean(product.comboItems));
  const [quantity, setQuantity] = useState(1);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [spices, setSpices] = useState({ garlic: 'Nhiều', chili: 'Ít', polyscias: 'Nhiều' });
  const [itemSpices, setItemSpices] = useState([]);

  useEffect(() => {
    if (!product) return;
    setQuantity(1);
    setGalleryIndex(0);
    setSpices(product.defaultSpices || { garlic: 'Nhiều', chili: 'Ít', polyscias: 'Nhiều' });
    if (product.comboItems && Array.isArray(product.comboItems)) {
      setItemSpices(
        product.comboItems.map((item) => ({
          id: item.id || item.productSlug,
          name: item.name || item.productSlug,
          spices: item.defaultSpices || { garlic: 'Nhiều', chili: 'Ít', polyscias: 'Nhiều' },
        }))
      );
    }
  }, [product]);

  const gallery = product && product.gallery?.length ? product.gallery : product ? [product.image] : [];
  const related = useMemo(
    () => products.filter((p) => (p.slug || p.id) !== (product?.slug || product?.id)).slice(0, 4),
    [products, product]
  );

  const spiceNote = isCombo
    ? itemSpices
        .map(
          (item) =>
            `${item.name}: Tỏi ${item.spices?.garlic || 'Vừa'}, Ớt ${item.spices?.chili || 'Vừa'}, Đinh lăng ${
              item.spices?.polyscias || 'Vừa'
            }`
        )
        .join(' · ')
    : '';

  const handleAdd = (buyNow = false) => {
    // Combo: gắn lựa chọn gia vị từng món vào sub items để giỏ hàng nhận đúng
    const enriched = isCombo
      ? {
          ...product,
          comboSubItems: (product.comboItems || []).map((item, idx) => ({
            ...item,
            spices: itemSpices[idx]?.spices || item.defaultSpices,
          })),
        }
      : product;
    addToCart(enriched, quantity, spices, 'Ăn ngay trong ngày', spiceNote);
    if (buyNow) navigate('/cart');
  };

  // Đang tải dữ liệu thật từ backend
  if (!product && (isLoadingProduct || isLoadingCombo)) {
    return (
      <div className="bg-nep-cream pb-16 pt-9 px-4 sm:px-8 text-center">
        <div className="inline-flex items-center gap-2 text-nep-muted">
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <span className="text-[14px]">Đang tải thông tin món ăn từ hệ thống...</span>
        </div>
      </div>
    );
  }

  // Không tìm thấy sản phẩm trong hệ thống
  if (!product) {
    return (
      <div className="bg-nep-cream pb-16 pt-9 px-4 sm:px-8 text-center space-y-3">
        <p className="font-serif text-[26px] text-nep-ink">Chưa thấy món này.</p>
        <p className="text-[13px] text-nep-muted">
          Món có thể đã bị ẩn, hết bán hoặc chưa có trong hệ thống.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center justify-center min-h-12 px-6 rounded-xl bg-nep-rose text-white text-[14px] font-semibold"
        >
          Xem các món khác →
        </Link>
      </div>
    );
  }

  const comboItems = product.comboItems || [];
  const savings = product.originalPrice ? Math.max(0, product.originalPrice - product.price) : 0;

  // ===== TRANG CHI TIẾT COMBO — theo bản thiết kế combo_sum_vay_thong_tin =====
  if (isCombo) {
    return (
      <div className="bg-nep-cream pb-16 pt-9 px-4 sm:px-8 lg:px-18 space-y-12">
        <p className="text-[12px] text-nep-muted">
          <Link to="/home">Trang chủ</Link>
          {'  /  '}
          <Link to="/combos">Combo</Link>
          {'  /  '}
          {product.name}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          <div className="lg:col-span-6 space-y-3">
            <img
              src={gallery[galleryIndex]}
              alt={product.name}
              className="w-full h-90 sm:h-130 object-cover rounded-xl"
            />
            {gallery.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto">
                {gallery.map((src, i) => (
                  <button
                    key={src + i}
                    type="button"
                    onClick={() => setGalleryIndex(i)}
                    className={`shrink-0 rounded-lg overflow-hidden border ${
                      galleryIndex === i ? 'border-nep-green' : 'border-nep-line'
                    }`}
                  >
                    <img src={src} alt="" className="w-20 h-20 object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-6 space-y-5">
            {(product.badge || product.serves) && (
              <span className="inline-flex items-center bg-nep-blush text-nep-rose text-[11px] font-medium px-2.5 py-1 rounded-full">
                {[product.badge, product.serves].filter(Boolean).join(' · ')}
              </span>
            )}
            <h1 className="font-serif font-semibold text-[32px] sm:text-[42px] leading-[1.3] tracking-[-0.6px]">
              {product.name}
            </h1>
            <p className="text-[14px] leading-[1.6] text-nep-muted">{product.description || product.shortDesc}</p>

            <div className="flex items-end gap-3 flex-wrap">
              <p className="text-[28px] font-semibold text-nep-rose">{formatVnd(product.price)}</p>
              {product.originalPrice && (
                <p className="text-[14px] text-nep-muted line-through pb-1">{formatVnd(product.originalPrice)}</p>
              )}
            </div>
            {savings > 0 && (
              <p className="text-[13px] font-medium text-nep-green">
                Tiết kiệm {formatVnd(savings)} so với mua lẻ
              </p>
            )}

            <div className="space-y-2">
              <p className="text-[13px] font-semibold text-nep-ink">Trong combo có gì?</p>
              {(product.itemsIncluded || comboItems.map((i) => i.qtyLabel || i.name)).map((line) => (
                <p key={line} className="text-[13px] leading-[1.7] flex gap-2">
                  <span className="text-nep-green">•</span>
                  {line}
                </p>
              ))}
            </div>

            <p className="text-[13px] text-nep-green flex items-center gap-1.5">
              Chọn gia vị riêng cho từng món ngay bên dưới
              <span className="text-[15px] leading-none">↓</span>
            </p>
          </div>
        </div>

        {/* ===== Chọn gia vị từng món ===== */}
        <div className="space-y-8">
          <div className="max-w-2xl space-y-2.5">
            <Eyebrow>Không chọn chung cho cả combo</Eyebrow>
            <h2 className="font-serif font-semibold text-[26px] sm:text-[32px] leading-[1.25] text-nep-ink">
              Mỗi món, đúng vị bạn thích.
            </h2>
            <p className="text-[13px] leading-[1.6] text-nep-muted">
              Có hai món đều cần chọn riêng Tỏi, Ớt, Đinh lăng. Gia vị áp dụng cho toàn bộ phần của món đó trong mỗi
              combo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {comboItems.map((item, idx) => (
              <div
                key={item.productSlug || item.name}
                className="bg-nep-paper border border-nep-line rounded-xl p-6 space-y-6"
              >
                <div className="flex gap-4 items-center">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-24 h-24 rounded-xl object-cover shrink-0" />
                  )}
                  <div>
                    <p className="font-serif font-semibold text-[20px] sm:text-[24px] leading-[1.3] text-nep-green">
                      {item.name}
                    </p>
                    {item.qtyLabel && <p className="text-[12px] text-nep-muted mt-0.5">{item.qtyLabel}</p>}
                  </div>
                </div>
                <div className="space-y-3">
                  <SpiceChoice
                    label="Tỏi"
                    value={itemSpices[idx]?.spices?.garlic || 'Ít'}
                    onChange={(v) =>
                      setItemSpices((list) =>
                        list.map((row, i) => (i === idx ? { ...row, spices: { ...row.spices, garlic: v } } : row))
                      )
                    }
                  />
                  <SpiceChoice
                    label="Ớt"
                    value={itemSpices[idx]?.spices?.chili || 'Ít'}
                    onChange={(v) =>
                      setItemSpices((list) =>
                        list.map((row, i) => (i === idx ? { ...row, spices: { ...row.spices, chili: v } } : row))
                      )
                    }
                  />
                  <SpiceChoice
                    label="Đinh lăng"
                    value={itemSpices[idx]?.spices?.polyscias || 'Nhiều'}
                    onChange={(v) =>
                      setItemSpices((list) =>
                        list.map((row, i) => (i === idx ? { ...row, spices: { ...row.spices, polyscias: v } } : row))
                      )
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-nep-mint rounded-2xl px-5 sm:px-8 py-6 sm:py-7 flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">
            <div className="flex-1 space-y-2">
              <p className="text-[13px] font-semibold text-nep-ink">
                Đã chọn gia vị cho cả {comboItems.length} món
              </p>
              <p className="text-[12px] leading-[1.5] text-nep-muted">
                Bạn có thể kiểm tra và chỉnh lại từng món trong giỏ hàng.
              </p>
            </div>
            <div className="flex items-center flex-wrap gap-6">
              <span className="text-[13px] font-medium text-nep-green">Số combo</span>
              <QtyControl
                frame={false}
                value={quantity}
                onMinus={() => setQuantity((n) => Math.max(1, n - 1))}
                onPlus={() => setQuantity((n) => n + 1)}
              />
              <button
                type="button"
                onClick={() => handleAdd(false)}
                className="min-h-12 px-8 rounded-lg bg-nep-rose border border-nep-rose text-white text-[14px] font-semibold whitespace-nowrap"
              >
                Thêm combo — {formatVnd(product.price)}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-14">
          <div className="space-y-3">
            <h2 className="font-serif font-semibold text-[20px] leading-[1.3] text-nep-ink">
              Hai món, cùng nếp chắc chắn chu đáo
            </h2>
            <p className="text-[13px] leading-[1.6] text-nep-muted">
              Nem truyền thống: thịt heo, bì heo, thính gạo, gia vị, tỏi, ớt, đinh lăng. Nem lá ổi có thêm lá ổi tươi,
              đậm hương thơm. Lượng gia vị theo lựa chọn riêng của từng món.
            </p>
          </div>
          <div className="space-y-3">
            <h2 className="font-serif font-semibold text-[20px] leading-[1.3] text-nep-ink">Đúng món đúng dịp</h2>
            <p className="text-[13px] leading-[1.6] text-nep-muted">
              Giao lạnh ở 0–4°C khi nem đạt độ chua phù hợp; xem hạn dùng trên nhãn. Nhập ngay, giao sát giờ dùng khi
              thanh toán để Nếp tư vấn lịch giao — không phải giao quá sớm được bảo đảm.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ===== TRANG CHI TIẾT SẢN PHẨM LẺ =====
  return (
    <div className="bg-nep-cream pb-16 pt-9 px-4 sm:px-8 lg:px-18 space-y-12">
      <p className="text-[12px] text-nep-muted">
        <Link to="/home">Trang chủ</Link>
        {'  /  '}
        <Link to="/products">Sản phẩm</Link>
        {'  /  '}
        {product.name}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        <div className="lg:col-span-6 space-y-3">
          <img
            src={gallery[galleryIndex]}
            alt={product.name}
            className="w-full h-90 sm:h-130 object-cover rounded-xl"
          />
          {gallery.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto">
              {gallery.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={() => setGalleryIndex(i)}
                  className={`shrink-0 rounded-lg overflow-hidden border ${
                    galleryIndex === i ? 'border-nep-green' : 'border-nep-line'
                  }`}
                >
                  <img src={src} alt="" className="w-20 h-20 object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-6 space-y-5">
          {product.badge && (
            <span className="inline-block bg-nep-mint text-nep-green text-[11px] font-medium px-2.5 py-1 rounded-full">
              {product.badge}
            </span>
          )}
          <h1 className="font-serif font-semibold text-[32px] sm:text-[42px] leading-[1.3] tracking-[-0.6px]">
            {product.name}
          </h1>
          <p className="text-[14px] leading-[1.6] text-nep-muted">{product.description || product.shortDesc}</p>

          <div className="flex items-end gap-3">
            <p className="text-[28px] font-semibold text-nep-rose">{formatVnd(product.price)}</p>
            {product.originalPrice && (
              <p className="text-[14px] text-nep-muted line-through pb-1">{formatVnd(product.originalPrice)}</p>
            )}
          </div>
          <p className="text-[12px] text-nep-muted">{product.pack || product.unit}</p>

          {product.itemsIncluded && (
            <div className="bg-nep-paper border border-nep-line rounded-xl p-5 space-y-2">
              <Eyebrow>Trong combo có</Eyebrow>
              {product.itemsIncluded.map((item) => (
                <p key={item} className="text-[13px] leading-[1.6]">
                  · {item}
                </p>
              ))}
            </div>
          )}

          <div className="bg-nep-paper border border-nep-line rounded-xl p-5 space-y-4">
            <Eyebrow>Khẩu vị riêng, niềm vui chung</Eyebrow>
            <p className="font-serif font-semibold text-[20px] text-nep-green">Chọn Tỏi, Ớt, Đinh lăng</p>

            <div className="space-y-3">
              <SpiceChoice label="Tỏi" value={spices.garlic} onChange={(v) => setSpices((s) => ({ ...s, garlic: v }))} />
              <SpiceChoice label="Ớt" value={spices.chili} onChange={(v) => setSpices((s) => ({ ...s, chili: v }))} />
              <SpiceChoice label="Đinh lăng" value={spices.polyscias} onChange={(v) => setSpices((s) => ({ ...s, polyscias: v }))} />
            </div>
            <p className="text-[11px] leading-[1.6] text-nep-muted">Mỗi loại chỉ có hai mức Ít / Nhiều. Ngày dùng bạn chọn lúc thanh toán.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <QtyControl
              value={quantity}
              onMinus={() => setQuantity((n) => Math.max(1, n - 1))}
              onPlus={() => setQuantity((n) => n + 1)}
            />
            <button
              type="button"
              onClick={() => handleAdd(false)}
              className="flex-1 min-w-40 min-h-12 rounded-lg border border-nep-line bg-nep-paper text-nep-green text-[14px] font-semibold"
            >
              Thêm vào giỏ
            </button>
            <button
              type="button"
              onClick={() => handleAdd(true)}
              className="flex-1 min-w-40 min-h-12 rounded-lg bg-nep-rose border border-nep-rose text-white text-[14px] font-semibold"
            >
              Mua ngay →
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { t: 'Câu chuyện món này', d: product.longDesc || product.description },
          { t: 'Thành phần', d: product.ingredients || 'Thịt heo nạc, bì heo giòn, gia vị gia truyền, tỏi ớt đinh lăng.' },
          { t: 'Thưởng thức cùng Nếp', d: 'Bóc lá, ăn kèm tỏi ớt đinh lăng theo khẩu vị đã chọn. Bảo quản lạnh khi đã đạt độ chua mong muốn. Nem rán cần làm chín trước khi ăn.' },
        ].map((block) => (
          <div key={block.t} className="bg-nep-paper border border-nep-line rounded-xl p-6 space-y-3">
            <h2 className="font-serif font-semibold text-[22px] leading-[1.3]">{block.t}</h2>
            <p className="text-[13px] leading-[1.6] text-nep-muted">{block.d}</p>
          </div>
        ))}
      </div>

      <div className="space-y-7">
        <div className="flex items-end justify-between gap-3">
          <div className="space-y-2">
            <Eyebrow>Món quen, vị nhớ</Eyebrow>
            <h2 className="font-serif font-semibold text-[32px] leading-[1.3] tracking-[-0.6px]">Bạn cũng có thể thích</h2>
          </div>
          <Link to="/products" className="text-[13px] text-nep-green">
            Xem tất cả sản phẩm →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {related.map((p) => (
            <ProductCard key={p.id || p._id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
