import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PRODUCTS, COMBOS, CATEGORIES } from '../data/mockData';
import ProductCard from '../components/ProductCard';
import { Eyebrow } from '../components/NepUI';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || 'all';
  const urlSearch = searchParams.get('search') || '';
  const [sortBy, setSortBy] = useState('popular');
  const [priceRange, setPriceRange] = useState('all');
  const [packFilter, setPackFilter] = useState('all');

  const allItems = useMemo(() => [...PRODUCTS, ...COMBOS], []);

  const handleCategorySelect = (catId) => {
    const nextParams = new URLSearchParams(searchParams);
    if (catId === 'all') nextParams.delete('category');
    else nextParams.set('category', catId);
    setSearchParams(nextParams);
  };

  const filteredItems = useMemo(() => {
    return allItems
      .filter((item) => {
        if (currentCategory !== 'all' && item.category !== currentCategory) return false;
        const q = urlSearch.toLowerCase().trim();
        if (q) {
          const hay = `${item.name} ${item.description || ''} ${item.shortDesc || ''}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        if (priceRange === 'under100' && item.price >= 100000) return false;
        if (priceRange === '100to200' && (item.price < 100000 || item.price > 200000)) return false;
        if (priceRange === 'over200' && item.price <= 200000) return false;
        if (packFilter === '200' && !String(item.pack || '').includes('200')) return false;
        if (packFilter === '500' && !String(item.pack || '').includes('500')) return false;
        if (packFilter === 'combo' && item.category !== 'combo') return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return (b.soldCount || 0) - (a.soldCount || 0);
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return 0;
      });
  }, [allItems, currentCategory, urlSearch, priceRange, packFilter, sortBy]);

  return (
    <div className="bg-nep-cream pb-16 pt-9 px-4 sm:px-8 lg:px-[72px] space-y-8">
      <p className="text-[12px] text-nep-muted">
        <Link to="/home">Trang chủ</Link>
        {'  /  '}
        Sản phẩm
      </p>

      <div className="space-y-3.5">
        <Eyebrow>Bếp Nếp có gì ngon?</Eyebrow>
        <h1 className="font-serif font-semibold text-[36px] sm:text-[48px] leading-[1.3] tracking-[-0.6px]">
          Chọn món, chọn vị thương.
        </h1>
        <p className="text-[14px] leading-[1.6] text-nep-muted">
          Từ gói nem quen đến mâm sum vầy. Mỗi món đều có gia vị dành riêng cho bạn.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="w-full lg:w-[210px] lg:pr-6 space-y-5 shrink-0">
          <p className="font-semibold text-[11px] tracking-[1.5px] uppercase text-nep-green">Danh mục</p>
          {CATEGORIES.map((cat) => {
            const active = currentCategory === cat.id;
            const count = cat.id === 'all'
              ? allItems.length
              : allItems.filter((i) => i.category === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySelect(cat.id)}
                className={`block w-full text-left text-[13px] ${
                  active ? 'font-semibold text-nep-rose' : 'text-nep-ink'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}

          <p className="font-semibold text-[11px] tracking-[1.5px] uppercase text-nep-green pt-2">Khoảng giá</p>
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'under100', label: 'Dưới 100.000 ₫' },
            { id: '100to200', label: '100.000–200.000 ₫' },
            { id: 'over200', label: 'Trên 200.000 ₫' },
          ].map((opt) => (
            <label key={opt.id} className="flex items-center gap-2 text-[12px] text-nep-ink cursor-pointer">
              <input
                type="radio"
                name="price"
                checked={priceRange === opt.id}
                onChange={() => setPriceRange(opt.id)}
                className="accent-nep-green"
              />
              {opt.label}
            </label>
          ))}

          <p className="font-semibold text-[11px] tracking-[1.5px] uppercase text-nep-green pt-2">Quy cách</p>
          {[
            { id: 'all', label: 'Tất cả' },
            { id: '200', label: 'Gói 200 g' },
            { id: '500', label: 'Gói 500 g' },
            { id: 'combo', label: 'Combo nhiều món' },
          ].map((opt) => (
            <label key={opt.id} className="flex items-center gap-2 text-[12px] text-nep-ink cursor-pointer">
              <input
                type="radio"
                name="pack"
                checked={packFilter === opt.id}
                onChange={() => setPackFilter(opt.id)}
                className="accent-nep-green"
              />
              {opt.label}
            </label>
          ))}

          <div className="bg-nep-mint rounded-lg p-4 space-y-2">
            <img src="/assets/leaf-small.svg" alt="" width={20} height={20} />
            <p className="text-[12px] leading-[1.6] text-nep-ink">
              Chọn Tỏi, Ớt, Đinh lăng ở trang chi tiết trước khi thêm giỏ.
            </p>
          </div>
        </aside>

        <div className="flex-1 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-[12px] text-nep-muted">Hiển thị {filteredItems.length} sản phẩm & combo</p>
            <div className="border border-nep-line rounded-lg p-3 flex items-center gap-3 self-start">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-[12px] text-nep-ink outline-none"
              >
                <option value="popular">Sắp xếp: Phổ biến nhất</option>
                <option value="price-asc">Giá thấp đến cao</option>
                <option value="price-desc">Giá cao đến thấp</option>
              </select>
              <img src="/assets/chevron.svg" alt="" width={16} height={16} />
            </div>
          </div>

          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-9">
              {filteredItems.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          ) : (
            <p className="text-[13px] text-nep-muted">Không tìm thấy món phù hợp.</p>
          )}

          <div className="flex items-center justify-center gap-3 pt-4">
            <span className="size-10 rounded-lg bg-nep-green text-nep-cream text-[13px] flex items-center justify-center">
              1
            </span>
            <p className="text-[12px] text-nep-muted">Bạn đã xem tất cả {filteredItems.length} món.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
