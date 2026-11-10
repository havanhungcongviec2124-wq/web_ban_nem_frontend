import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, fetchProducts } from '../redux/product/ProductApi';
import { fetchComboById } from '../redux/combo/ComboApi';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { Eyebrow, formatVnd, QtyControl, SpiceChoice } from '../components/NepUI';
import ComboSumVay from './ComboSumVay';

const ProductDetail = () => {
  const { id } = useParams();
  if (id === 'combo-sum-vay') {
    return <ComboSumVay />;
  }

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const products = useSelector((state) => state.products.items);
  const selectedProduct = useSelector((state) => state.products.selectedProduct);
  const selectedCombo = useSelector((state) => state.combos.selectedCombo);

  useEffect(() => {
    if (!id) return;
    dispatch(fetchProductById(id));
    dispatch(fetchComboById(id));
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [id, dispatch, products.length]);

  const product = useMemo(() => {
    if (selectedProduct && (selectedProduct.slug === id || selectedProduct.id === id || selectedProduct._id === id)) {
      return selectedProduct;
    }
    if (selectedCombo && (selectedCombo.slug === id || selectedCombo.id === id || selectedCombo._id === id)) {
      return selectedCombo;
    }
    const found = products.find((p) => p.slug === id || p.id === id || p._id === id);
    if (found) return found;

    return {
      id: id || 'nem-chua-truyen-thong',
      name: 'Nem chua truyền thống',
      price: 85000,
      image: '/assets/nem-truyen-thong.png',
      pack: '10 chiếc · 200 g / gói',
      description: 'Nem chua gói lá chuối truyền thống, lên men tự nhiên, vị chua thanh giòn sần sật.',
      ingredients: 'Thịt heo nạc, bì heo, thính gạo rang, tỏi, ớt, tiêu, gia vị gia truyền.',
      defaultSpices: { garlic: 'Nhiều', chili: 'Ít', polyscias: 'Nhiều' },
    };
  }, [id, selectedProduct, selectedCombo, products]);

  const isCombo = product.category === 'combo' || Boolean(product.comboItems);
  const [quantity, setQuantity] = useState(1);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [spices, setSpices] = useState({ garlic: 'Nhiều', chili: 'Ít', polyscias: 'Nhiều' });
  const [itemSpices, setItemSpices] = useState([]);

  useEffect(() => {
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

  const gallery = product.gallery?.length ? product.gallery : [product.image];
  const related = useMemo(
    () => products.filter((p) => (p.slug || p.id) !== (product.slug || product.id)).slice(0, 4),
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
    addToCart(product, quantity, spices, 'Ăn ngay trong ngày', spiceNote);
    if (buyNow) navigate('/cart');
  };

  return (
    <div className="bg-nep-cream pb-16 pt-9 px-4 sm:px-8 lg:px-18 space-y-12">
      <p className="text-[12px] text-nep-muted">
        <Link to="/home">Trang chủ</Link>
        {'  /  '}
        <Link to={isCombo ? '/combos' : '/products'}>{isCombo ? 'Combo' : 'Sản phẩm'}</Link>
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
            <p className="font-serif font-semibold text-[20px] text-nep-green">
              {isCombo ? 'Chọn gia vị cho từng món' : 'Chọn Tỏi, Ớt, Đinh lăng'}
            </p>

            {isCombo && itemSpices.length > 0 ? (
              <div className="space-y-6">
                {itemSpices.map((item, idx) => (
                  <div key={item.id} className="space-y-3">
                    <p className="text-[13px] font-semibold">{item.name}</p>
                    <SpiceChoice
                      label="Tỏi"
                      value={item.spices?.garlic || 'Ít'}
                      onChange={(v) =>
                        setItemSpices((list) =>
                          list.map((row, i) => (i === idx ? { ...row, spices: { ...row.spices, garlic: v } } : row))
                        )
                      }
                    />
                    <SpiceChoice
                      label="Ớt"
                      value={item.spices?.chili || 'Ít'}
                      onChange={(v) =>
                        setItemSpices((list) =>
                          list.map((row, i) => (i === idx ? { ...row, spices: { ...row.spices, chili: v } } : row))
                        )
                      }
                    />
                    <SpiceChoice
                      label="Đinh lăng"
                      value={item.spices?.polyscias || 'Ít'}
                      onChange={(v) =>
                        setItemSpices((list) =>
                          list.map((row, i) => (i === idx ? { ...row, spices: { ...row.spices, polyscias: v } } : row))
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <SpiceChoice label="Tỏi" value={spices.garlic} onChange={(v) => setSpices((s) => ({ ...s, garlic: v }))} />
                <SpiceChoice label="Ớt" value={spices.chili} onChange={(v) => setSpices((s) => ({ ...s, chili: v }))} />
                <SpiceChoice label="Đinh lăng" value={spices.polyscias} onChange={(v) => setSpices((s) => ({ ...s, polyscias: v }))} />
              </div>
            )}
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
