import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PRODUCTS, COMBOS } from '../data/mockData';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { 
  IconStar, 
  IconShieldCheck, 
  IconTruck, 
  IconClock, 
  IconCheck, 
  IconPlus, 
  IconMinus, 
  IconCart,
  IconGarlic,
  IconChili,
  IconHerb,
  IconArrowRight
} from '../components/Icons';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Find product from PRODUCTS or COMBOS
  const product = useMemo(() => {
    return [...PRODUCTS, ...COMBOS].find(item => item.id === id) || PRODUCTS[0];
  }, [id]);

  // Spice customization states
  const [quantity, setQuantity] = useState(1);
  const [spices, setSpices] = useState({
    garlic: product.defaultSpices?.garlic || "Nhiều",
    chili: product.defaultSpices?.chili || "Ít",
    polyscias: product.defaultSpices?.polyscias || "Nhiều"
  });
  const [eatTime, setEatTime] = useState("Ăn ngay trong ngày (chín tới)");
  const [note, setNote] = useState("");
  const [activeTab, setActiveTab] = useState("desc"); // 'desc', 'ingredients', 'guide'

  // Update spice defaults when product changes
  React.useEffect(() => {
    if (product) {
      setQuantity(1);
      setSpices(product.defaultSpices || {
        garlic: "Nhiều",
        chili: "Ít",
        polyscias: "Nhiều"
      });
      setEatTime("Ăn ngay trong ngày (chín tới)");
      setNote("");
    }
  }, [product]);

  const handleSpiceChange = (type, val) => {
    setSpices(prev => ({ ...prev, [type]: val }));
  };

  const handleAdd = (isBuyNow = false) => {
    addToCart(product, quantity, spices, eatTime, note);
    if (isBuyNow) {
      navigate('/cart');
    }
  };

  const relatedProducts = useMemo(() => {
    return [...PRODUCTS, ...COMBOS]
      .filter(p => p.id !== product.id)
      .slice(0, 4);
  }, [product.id]);

  const eatTimeOptions = [
    { 
      value: "Ăn ngay trong ngày (chín tới)", 
      label: "Ăn ngay trong ngày (chín tới)", 
      desc: "Xưởng chọn mẻ nem ủ đủ ngày, nem lên men vừa độ chín, chua thanh thơm bùi ăn liền cực đỉnh." 
    },
    { 
      value: "1 - 2 ngày tới mới ăn", 
      label: "1 - 2 ngày tới mới ăn (Đang lên men)", 
      desc: "Xưởng chọn mẻ nem mới gói sáng nay, để nem chín dần tự nhiên đúng dịp bạn liên hoan." 
    },
    { 
      value: "Cuối tuần / Làm quà biếu", 
      label: "Cuối tuần / Làm quà biếu (Giữ tươi lâu)", 
      desc: "Gói mới nhất, bảo quản mát dễ dàng, thích hợp xách tay đi xa làm quà tặng." 
    }
  ];

  return (
    <div className="bg-stone-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center text-xs text-stone-500 mb-6 space-x-2">
          <Link to="/home" className="hover:text-red-700">Trang chủ</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-red-700">Sản phẩm</Link>
          <span>/</span>
          <span className="text-stone-800 font-bold truncate">{product.name}</span>
        </nav>

        {/* Main Product Layout */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden p-6 sm:p-10 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left: Product Images */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative aspect-4/3 w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-inner">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
                {product.isBestSeller && (
                  <span className="absolute top-3 left-3 bg-red-700 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                    Bán chạy nhất
                  </span>
                )}
                {product.badge && (
                  <span className="absolute top-3 right-3 bg-amber-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Trust badges below image */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl flex items-center gap-2.5">
                  <IconShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                  <span className="text-2xs font-semibold text-emerald-950 leading-tight">
                    100% Thịt lợn sạch tiêu chuẩn
                  </span>
                </div>
                <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-xl flex items-center gap-2.5">
                  <IconTruck className="w-5 h-5 text-amber-700 shrink-0" />
                  <span className="text-2xs font-semibold text-amber-950 leading-tight">
                    Hỏa tốc giao đúng độ chín
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Product Info & Spice Customization */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex items-center gap-3 text-xs text-stone-500 mb-2">
                  <span className="px-2.5 py-1 bg-red-50 text-red-700 font-extrabold rounded-md uppercase tracking-wider text-2xs">
                    {product.categoryName || 'Đặc Sản Xứ Thanh'}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <IconStar className="w-4 h-4" />
                    <span>{product.rating || 4.9}</span>
                    <span className="text-stone-400 font-normal">({product.soldCount || 100}+ đã mua)</span>
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-stone-900 leading-snug">
                  {product.name}
                </h1>

                <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                  {product.shortDesc}
                </p>
              </div>

              {/* Price section */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 flex items-baseline justify-between">
                <div>
                  <span className="text-3xl sm:text-4xl font-black text-red-700">
                    {product.price.toLocaleString('vi-VN')}đ
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-stone-400 line-through ml-3 font-medium">
                      {product.originalPrice.toLocaleString('vi-VN')}đ
                    </span>
                  )}
                </div>
                <span className="text-xs text-stone-600 font-semibold bg-white px-3 py-1.5 rounded-lg border border-stone-200">
                  Đơn vị: {product.unit || 'Phần'}
                </span>
              </div>

              {/* Items in Combo if Combo */}
              {product.itemsIncluded && (
                <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-2">
                  <span className="text-xs font-black uppercase text-amber-900 block tracking-wider">
                    Thành phần set combo bao gồm:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700">
                    {product.itemsIncluded.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-white/80 p-2 rounded-lg border border-amber-100">
                        <IconCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SPICE CUSTOMIZATION INTERACTION (CORE FEATURE) */}
              <div className="p-5 bg-stone-50 rounded-2xl border-2 border-dashed border-red-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-stone-900 uppercase tracking-wide flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
                    Tùy Chỉnh Gia Vị Theo Khẩu Vị Của Bạn
                  </h3>
                  <span className="text-2xs text-stone-500 font-medium italic">Chọn độc lập</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {/* Garlic */}
                  <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900 mb-2">
                      <IconGarlic className="text-base" /> Tỏi Ta Thái Lát
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {['Ít', 'Nhiều'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleSpiceChange('garlic', opt)}
                          className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                            spices.garlic === opt
                              ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                              : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          {opt} tỏi
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Chili */}
                  <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900 mb-2">
                      <IconChili className="text-base" /> Ớt Chỉ Thiên
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {['Ít', 'Nhiều'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleSpiceChange('chili', opt)}
                          className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                            spices.chili === opt
                              ? 'bg-red-600 text-white border-red-600 shadow-2xs'
                              : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          {opt} ớt
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Polyscias */}
                  <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900 mb-2">
                      <IconHerb className="text-base" /> Lá Đinh Lăng
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {['Ít', 'Nhiều'].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleSpiceChange('polyscias', opt)}
                          className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                            spices.polyscias === opt
                              ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                              : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          {opt} lá
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Eating time preference */}
                <div className="pt-2">
                  <label className="text-xs font-bold text-stone-900 block mb-1.5">
                    Thời gian bạn mong muốn ăn nem:
                  </label>
                  <div className="space-y-1.5">
                    {eatTimeOptions.map((opt) => (
                      <label 
                        key={opt.value}
                        className={`flex items-start gap-2.5 p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                          eatTime === opt.value
                            ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-medium'
                            : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="eatTimeOptionDetail" 
                          value={opt.value}
                          checked={eatTime === opt.value}
                          onChange={(e) => setEatTime(e.target.value)}
                          className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                        />
                        <div>
                          <span className="font-bold block">{opt.label}</span>
                          <span className="text-2xs text-stone-500">{opt.desc}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Optional note */}
                <div>
                  <input 
                    type="text"
                    placeholder="Ghi chú thêm (VD: gửi thêm tương ớt, bó chặt tay...)"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>

              {/* Quantity & Buy actions */}
              <div className="pt-2 space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-stone-800">Số lượng:</span>
                  <div className="flex items-center border border-stone-300 rounded-xl overflow-hidden bg-white">
                    <button 
                      type="button" 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2.5 text-stone-600 hover:bg-stone-100 transition-colors"
                    >
                      <IconMinus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-black text-stone-900 text-sm">{quantity}</span>
                    <button 
                      type="button" 
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2.5 text-stone-600 hover:bg-stone-100 transition-colors"
                    >
                      <IconPlus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-xs text-stone-500">
                    Tạm tính: <strong className="text-red-700 text-sm font-black">{(product.price * quantity).toLocaleString('vi-VN')}đ</strong>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => handleAdd(false)}
                    className="flex-1 py-3.5 px-6 rounded-xl border-2 border-red-700 text-red-700 font-extrabold text-sm hover:bg-red-50 flex items-center justify-center gap-2 transition-all shadow-xs"
                  >
                    <IconCart className="w-5 h-5" />
                    <span>Thêm Vào Giỏ Hàng</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAdd(true)}
                    className="flex-1 py-3.5 px-6 rounded-xl bg-linear-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl transform active:scale-98"
                  >
                    <span>Mua Ngay (Thanh Toán)</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Tabbed Info: Description / Ingredients / Guide */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 sm:p-10 mb-12">
          <div className="flex border-b border-stone-200 gap-6 mb-6">
            <button
              onClick={() => setActiveTab('desc')}
              className={`pb-3 text-sm font-bold border-b-2 transition-all ${
                activeTab === 'desc'
                  ? 'border-red-700 text-red-700'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Mô Tả Chi Tiết
            </button>
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`pb-3 text-sm font-bold border-b-2 transition-all ${
                activeTab === 'ingredients'
                  ? 'border-red-700 text-red-700'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Thành Phần & Quy Cách
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`pb-3 text-sm font-bold border-b-2 transition-all ${
                activeTab === 'guide'
                  ? 'border-red-700 text-red-700'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Cách Thưởng Thức & Bảo Quản
            </button>
          </div>

          <div className="text-stone-700 text-sm leading-relaxed space-y-4">
            {activeTab === 'desc' && (
              <div>
                <p>{product.description}</p>
                <div className="mt-4 p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-xs">
                  <p><strong>Thời gian lên men chuẩn:</strong> {product.fermentDays || '2-3 ngày tự nhiên trong lá chuối'}</p>
                  <p><strong>Hạn sử dụng:</strong> {product.shelfLife || '7 ngày trong ngăn mát tủ lạnh'}</p>
                  <p><strong>Tiêu chuẩn sản xuất:</strong> Tuân thủ nghiêm ngặt quy trình An Toàn Vệ Sinh Thực Phẩm, không pha trộn bột ngọt hóa chất hay hàn the.</p>
                </div>
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div className="space-y-3">
                <h4 className="font-bold text-stone-900">Thành phần nguyên liệu chọn lọc:</h4>
                <p>{product.ingredients || 'Thịt lợn nạc mông tươi tuyển chọn, da lợn sạch thái sợi chỉ mỏng, thính gạo tám rang thơm, tỏi tía, ớt chỉ thiên, lá đinh lăng tươi, tiêu đập dập, muối, đường phèn.'}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                    <strong className="block text-stone-900 mb-1">Thịt nạc tươi nóng:</strong>
                    Từ lợn vừa mổ sáng sớm dẻo quánh, giúp nem có màu hồng đào tự nhiên.
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                    <strong className="block text-stone-900 mb-1">Bì lợn cạo sạch:</strong>
                    Luộc chín tới, thái chỉ tinh xảo bằng máy chuyên dụng, tạo độ giòn sần sật.
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                    <strong className="block text-stone-900 mb-1">Thính gạo tự rang:</strong>
                    Gạo tám thơm rang vừa vàng óng, xay mịn, tạo môi trường lên men lactic tự nhiên.
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'guide' && (
              <div className="space-y-3">
                <h4 className="font-bold text-stone-900">Hướng dẫn ăn nem ngon đúng điệu:</h4>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-stone-600">
                  <li>Bóc từng lớp lá chuối xanh, giữ lại nhánh lá đinh lăng và lát tỏi ớt kẹp theo nem.</li>
                  <li>Chấm trực tiếp với tương ớt cay ngọt Chin-su hoặc tương ớt Mường Khương truyền thống.</li>
                  <li>Nếu nem đã đạt độ chua vừa miệng mà chưa ăn hết, vui lòng bảo quản ngay trong ngăn mát tủ lạnh (2-5°C) để hãm độ chua lại.</li>
                  <li>Với nem nướng: làm nóng lại trên than hoa hoặc nồi chiên không dầu (180°C trong 8-10 phút) trước khi ăn để nem xèo xèo dậy mùi thơm lừng.</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl sm:text-2xl font-black text-stone-900">
              Sản Phẩm Nem Cùng Loại Gợi Ý
            </h3>
            <Link to="/products" className="text-xs font-bold text-red-700 flex items-center gap-1">
              Xem tất cả <IconArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;

