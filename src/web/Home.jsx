import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/product/ProductApi';
import { fetchCombos } from '../redux/combo/ComboApi';
import { fetchCategories } from '../redux/category/CategoryApi';
import { FAQS } from '../data/siteContent';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { Eyebrow, formatVnd, SpiceChoice } from '../components/NepUI';

const Home = () => {
  const dispatch = useDispatch();
  const { openSpiceModal } = useCart();
  const productList = useSelector((state) => state.products.items);
  const comboList = useSelector((state) => state.combos.items);
  const categoryList = useSelector((state) => state.categories.items);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCombos());
    dispatch(fetchCategories());
  }, [dispatch]);

  const featured = productList.slice(0, 4);
  // Lấy sản phẩm thật từ backend để minh họa chọn gia vị — không dùng dữ liệu mẫu
  const sample = productList[0] || null;

  const [demoSpices, setDemoSpices] = useState({ garlic: 'Nhiều', chili: 'Ít', polyscias: 'Nhiều' });
  const [openFaq, setOpenFaq] = useState(0);

  const displayCategories = categoryList.length > 0
    ? categoryList
        .filter((cat) => (cat.slug || cat.id) !== 'all')
        .map((cat, idx) => ({
          name: cat.name,
          to: `/products?category=${cat.slug || cat.id}`,
          active: idx === 0,
        }))
    : [
        { name: 'Nem truyền thống', to: '/products?category=nem-truyen-thong', active: true },
        { name: 'Nem hương lá', to: '/products?category=nem-huong-la' },
        { name: 'Nem cối & nem rán', to: '/products?category=nem-coi-ran' },
        { name: 'Combo & quà tặng', to: '/combos' },
      ];

  return (
    <div className="bg-nep-cream text-nep-ink">
      <section className="flex flex-col lg:flex-row gap-12 items-center px-4 sm:px-8 lg:px-[72px] pt-14 pb-16">
        <div className="w-full lg:w-[510px] space-y-[22px]">
          <Eyebrow>Nếp nhà trong từng gói nhỏ</Eyebrow>
          <h1 className="font-serif font-semibold text-[42px] sm:text-[62px] leading-[1.3] tracking-[-0.6px] text-nep-ink">
            Gói vị quê.<br />Mở sum vầy.
          </h1>
          <p className="text-[16px] leading-[1.6] text-nep-muted">
            Nem chua thơm lá, chua dịu vừa miệng. Chọn chút tỏi, chút ớt theo ý — để mỗi cuộc gặp đều thêm đậm đà.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/products"
              className="inline-flex items-center justify-center min-h-12 px-[22px] rounded-lg bg-nep-rose border border-nep-rose text-white text-[14px] font-semibold"
            >
              Chọn món ngon →
            </Link>
            <Link to="/combos" className="text-[13px] font-medium text-nep-green">
              Khám phá combo
            </Link>
          </div>
          <div className="flex items-center gap-2.5">
            <img src="/assets/leaf-small.svg" alt="" width={16} height={16} />
            <p className="text-[11px] text-nep-green">Gói bằng lá · Chọn vị riêng · Thưởng thức cùng nhau</p>
          </div>
        </div>

        <div className="relative flex-1 w-full">
          <img src="/assets/hero.png" alt="Mâm nem sum vầy" className="w-full h-[320px] sm:h-[500px] object-cover rounded-xl" />
          <div className="absolute bottom-5 left-6 bg-nep-cream rounded-lg px-4 py-3 flex items-center gap-2.5">
            <img src="/assets/utensils.svg" alt="" width={20} height={20} />
            <div>
              <p className="text-[12px] font-semibold text-nep-green">Một mâm, nhiều vị thương</p>
              <p className="text-[10px] text-nep-muted">Nem truyền thống · Lá ổi · Đinh lăng</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-nep-mint px-4 sm:px-8 lg:px-[72px] py-7 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: '/assets/package-check.svg', title: 'Gói kỹ từng phần', desc: 'Quy cách, thành phần luôn rõ ràng' },
          { icon: '/assets/sliders.svg', title: 'Vừa khẩu vị bạn', desc: 'Tỏi, Ớt, Đinh lăng: Ít hoặc Nhiều' },
          { icon: '/assets/calendar-heart.svg', title: 'Đúng dịp sum vầy', desc: 'Báo ngày dùng, Nếp tư vấn giao phù hợp' },
        ].map((item) => (
          <div key={item.title} className="flex items-center gap-3.5">
            <img src={item.icon} alt="" width={28} height={28} />
            <div>
              <p className="text-[13px] font-semibold text-nep-green">{item.title}</p>
              <p className="text-[11px] leading-[1.6] text-nep-muted">{item.desc}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="px-4 sm:px-8 lg:px-[72px] py-16 space-y-16">
        <div className="space-y-6">
          <div className="space-y-2.5">
            <Eyebrow>Một chút chua, thật nhiều thương</Eyebrow>
            <h2 className="font-serif font-semibold text-[32px] sm:text-[36px] leading-[1.3] tracking-[-0.6px]">
              Hôm nay, bạn thích vị nào?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {displayCategories.map((cat) => (
              <Link
                key={cat.name}
                to={cat.to}
                className={`flex items-center justify-between min-h-[76px] p-4 rounded-lg ${
                  cat.active
                    ? 'bg-nep-green text-nep-cream'
                    : 'bg-nep-paper border border-nep-line text-nep-green'
                }`}
              >
                <span className="text-[14px] font-medium">{cat.name}</span>
                <span className="text-[18px]">↗</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-7">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div className="space-y-2">
              <Eyebrow>Món quen, vị nhớ</Eyebrow>
              <h2 className="font-serif font-semibold text-[32px] sm:text-[36px] leading-[1.3] tracking-[-0.6px]">
                Nem ngon nhà Nếp
              </h2>
            </div>
            <Link to="/products" className="text-[13px] text-nep-green">
              Xem tất cả sản phẩm →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((p) => (
              <ProductCard key={p.id || p._id} product={p} />
            ))}
          </div>
        </div>

        <div className="space-y-7">
          <div className="space-y-2.5">
            <Eyebrow className="text-nep-rose">Thêm người, thêm ngon</Eyebrow>
            <h2 className="font-serif font-semibold text-[32px] sm:text-[36px] leading-[1.3] tracking-[-0.6px]">
              Chọn một combo. Đủ một bàn vui.
            </h2>
            <p className="text-[14px] leading-[1.6] text-nep-muted">
              Mỗi món trong combo đều được chọn gia vị riêng theo khẩu vị của bạn.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {comboList.map((combo) => (
              <div key={combo.id || combo._id} className="bg-nep-paper border border-nep-line rounded-xl p-6 flex flex-col gap-[18px]">
                <img src={combo.image} alt={combo.name} className="w-full h-[310px] object-cover rounded-xl" />
                <span className="self-start bg-nep-blush text-nep-rose text-[11px] font-medium px-2.5 py-1 rounded-full">
                  {combo.badge || 'Combo sum vầy'}
                </span>
                <h3 className="font-serif font-semibold text-[28px] tracking-[-0.6px] leading-[1.3]">
                  <Link to={`/product/${combo.id || combo.slug}`}>{combo.name}</Link>
                </h3>
                <p className="text-[12px] leading-[1.6] text-nep-muted">{combo.pack}</p>
                <p className="text-[13px] leading-[1.6]">{combo.shortDesc || combo.description}</p>
                <div className="flex items-center gap-3">
                  <span className="text-[24px] font-semibold text-nep-rose">{formatVnd(combo.price)}</span>
                  {combo.originalPrice && (
                    <span className="text-[13px] text-nep-muted line-through">{formatVnd(combo.originalPrice)}</span>
                  )}
                </div>
                <Link
                  to={`/product/${combo.id || combo.slug}`}
                  className="w-full min-h-12 rounded-lg border border-nep-line bg-nep-paper text-nep-green text-[14px] font-semibold flex items-center justify-center"
                >
                  Chọn gia vị & thêm combo →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-nep-green text-nep-cream px-4 sm:px-8 lg:px-[72px] py-14 flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
        <div className="flex-1 space-y-[18px]">
          <Eyebrow className="text-nep-cream">Khẩu vị riêng, niềm vui chung</Eyebrow>
          <h2 className="font-serif font-semibold text-[32px] sm:text-[38px] leading-[1.3] tracking-[-0.6px]">
            Ít cay một chút.<br />Nhiều thương một chút.
          </h2>
          <p className="text-[14px] leading-[1.6]">
            Bạn thích thơm tỏi, nhẹ ớt hay nhiều đinh lăng? Chọn Ít / Nhiều cho từng loại gia vị trên mỗi món. Nếp ghi rõ đến tận từng phần hàng.
          </p>
          <button
            type="button"
            onClick={() => sample && openSpiceModal(sample)}
            disabled={!sample}
            className="inline-flex items-center justify-center min-h-12 px-[22px] rounded-lg bg-nep-rose border border-nep-rose text-white text-[14px] font-semibold disabled:opacity-50"
          >
            Chọn vị của bạn →
          </button>
        </div>
        {sample && (
          <div className="bg-nep-cream text-nep-ink w-full lg:w-[430px] rounded-xl p-6 space-y-[18px]">
            <p className="font-serif font-semibold text-[23px] text-nep-green">{sample.name}</p>
            <div className="space-y-3">
              <SpiceChoice label="Tỏi" value={demoSpices.garlic} onChange={(v) => setDemoSpices((s) => ({ ...s, garlic: v }))} />
              <SpiceChoice label="Ớt" value={demoSpices.chili} onChange={(v) => setDemoSpices((s) => ({ ...s, chili: v }))} />
              <SpiceChoice label="Đinh lăng" value={demoSpices.polyscias} onChange={(v) => setDemoSpices((s) => ({ ...s, polyscias: v }))} />
            </div>
            <p className="text-[11px] leading-[1.6] text-nep-muted">Tùy chọn mẫu · Mỗi loại chỉ có hai mức Ít / Nhiều.</p>
          </div>
        )}
      </section>

      <section className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-center p-4 sm:p-8 lg:p-[72px]">
        <div className="flex-1 w-full">
          <img src="/assets/story.png" alt="Nếp gói thủ công" className="w-full h-[280px] sm:h-[440px] object-cover rounded-xl" />
        </div>
        <div className="flex-1 space-y-5">
          <Eyebrow>Chuyện nhà Nếp</Eyebrow>
          <h2 className="font-serif font-semibold text-[32px] sm:text-[38px] leading-[1.3] tracking-[-0.6px]">
            Giữ nếp gói.<br />Gửi vị thân quen.
          </h2>
          <p className="text-[14px] leading-[1.6] text-nep-muted">
            Với Nếp, nem ngon không chỉ ở vị chua dịu hay lớp lá thơm. Đó còn là sự chỉn chu trong từng phần nhỏ, để món ăn quen thuộc trở thành một lời mời ngồi lại bên nhau.
          </p>
          <p className="text-[14px] leading-[1.6] text-nep-muted">
            Chúng tôi chọn cách kể chuyện bằng món ăn: thành phần rõ ràng, gia vị theo ý và hướng dẫn thưởng thức dễ hiểu.
          </p>
          <Link to="/about" className="inline-block text-[13px] font-medium text-nep-green">
            Đọc câu chuyện Nếp Nem ↗
          </Link>
        </div>
      </section>

      <section className="bg-nep-blush px-4 sm:px-8 lg:px-[72px] py-14 space-y-8">
        <div className="space-y-2.5">
          <Eyebrow className="text-nep-rose">Ngon đúng lúc, vui đúng dịp</Eyebrow>
          <h2 className="font-serif font-semibold text-[32px] sm:text-[36px] leading-[1.3] tracking-[-0.6px]">
            Hẹn ngày dùng, Nếp lo cùng bạn.
          </h2>
          <p className="text-[14px] leading-[1.6] text-nep-muted max-w-3xl">
            Cho Nếp biết ngày và giờ bạn mong muốn thưởng thức. Đây không phải cam kết giờ giao; cửa hàng sẽ liên hệ để thống nhất lịch phù hợp.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { n: '01', t: 'Chọn món & gia vị', d: 'Chọn Ít / Nhiều cho Tỏi, Ớt và Đinh lăng ở từng sản phẩm.' },
            { n: '02', t: 'Báo ngày, giờ sử dụng', d: 'Nhập riêng ngày dùng và giờ dùng ở bước thanh toán.' },
            { n: '03', t: 'Cùng Nếp xác nhận', d: 'Nếp liên hệ lịch giao, hướng dẫn bảo quản trước khi dùng.' },
          ].map((s) => (
            <div key={s.n} className="space-y-3">
              <p className="font-serif text-[32px] text-nep-rose">{s.n}</p>
              <p className="text-[14px] font-semibold leading-[1.6]">{s.t}</p>
              <p className="text-[12px] leading-[1.6] text-nep-muted">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start p-4 sm:p-8 lg:p-[72px]">
        <div className="w-full lg:w-[370px] space-y-4">
          <Eyebrow>Nếp giải đáp</Eyebrow>
          <h2 className="font-serif font-semibold text-[32px] sm:text-[38px] leading-[1.3] tracking-[-0.6px]">
            Một vài điều<br />bạn muốn biết.
          </h2>
          <p className="text-[13px] leading-[1.6] text-nep-muted">
            Để bạn yên tâm chọn món và thưởng thức trọn vị.
          </p>
        </div>
        <div className="flex-1 w-full space-y-5">
          {FAQS.map((faq, i) => (
            <div key={faq.q} className="space-y-2.5">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                className="w-full flex items-start gap-3 text-left"
              >
                <p className="flex-1 text-[14px] font-semibold text-nep-green">{faq.q}</p>
                <img src={openFaq === i ? '/assets/minus.svg' : '/assets/plus.svg'} alt="" width={16} height={16} />
              </button>
              {openFaq === i && (
                <p className="text-[12px] leading-[1.6] text-nep-muted">{faq.a}</p>
              )}
              <div className="h-px bg-nep-line" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
