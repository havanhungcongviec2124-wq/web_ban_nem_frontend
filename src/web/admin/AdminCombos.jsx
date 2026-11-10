import React, { useMemo, useState } from 'react';
import { COMBOS, PRODUCTS } from '../../data/mockData';
import {
  Card,
  FieldLabel,
  Input,
  PageTitle,
  PrimaryButton,
  SearchInput,
  Select,
  formatVnd,
} from './adminUi';

const cloneCombos = () => COMBOS.map((c) => ({
  ...c,
  comboItems: (c.comboItems || []).map((i) => ({ ...i })),
}));

const AdminCombos = () => {
  const [list, setList] = useState(cloneCombos);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(COMBOS[0]?.id);
  const selected = list.find((c) => c.id === selectedId) || list[0];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((c) => `${c.name} ${c.sku || ''}`.toLowerCase().includes(q));
  }, [list, query]);

  const retail = (selected?.comboItems || []).reduce((sum, item) => {
    const product = PRODUCTS.find((p) => p.id === item.id);
    return sum + (product?.price || 0) * (item.qty || 1);
  }, 0);
  const saveAmt = Math.max(0, retail - (selected?.price || 0));

  const patch = (partial) => {
    setList((prev) => prev.map((c) => (c.id === selected.id ? { ...c, ...partial } : c)));
  };

  const patchItem = (index, partial) => {
    const comboItems = selected.comboItems.map((item, i) => (i === index ? { ...item, ...partial } : item));
    patch({ comboItems });
  };

  const addProduct = (id) => {
    const product = PRODUCTS.find((p) => p.id === id);
    if (!product) return;
    if (selected.comboItems.some((i) => i.id === id)) return;
    patch({
      comboItems: [
        ...selected.comboItems,
        {
          id: product.id,
          name: product.name,
          qty: 1,
          image: product.image,
          defaultSpices: product.defaultSpices,
        },
      ],
    });
  };

  return (
    <div>
      <PageTitle
        title="Combo & quà tặng"
        subtitle="Kết hợp món, điều chỉnh số lượng và giữ riêng khẩu vị từng thành phần."
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <SearchInput value={query} onChange={setQuery} placeholder="Tìm tên hoặc mã combo..." />
        <PrimaryButton className="shrink-0">+ Tạo combo</PrimaryButton>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-5">
        <div className="space-y-4">
          {filtered.map((c) => {
            const active = c.id === selected?.id;
            return (
              <Card key={c.id} className={`overflow-hidden ${active ? 'ring-1 ring-nep-green/30' : ''}`}>
                <button type="button" className="w-full text-left" onClick={() => setSelectedId(c.id)}>
                  <img src={c.image} alt="" className="w-full h-[220px] object-cover" />
                </button>
                <div className="p-5">
                  <p className="font-serif text-[20px] text-nep-ink">{c.name}</p>
                  <span className="mt-2 inline-flex rounded-full bg-nep-mint text-nep-green text-[11px] px-2.5 py-1">
                    {c.status || 'Đang bán'}
                  </span>
                  <p className="mt-3 text-[13px] text-nep-muted">{c.shortDesc}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-[18px] font-semibold text-nep-rose">{formatVnd(c.price)}</p>
                    <button
                      type="button"
                      onClick={() => setSelectedId(c.id)}
                      className="text-[13px] text-nep-green"
                    >
                      {active ? 'Đang chỉnh sửa' : 'Chỉnh sửa →'}
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {selected && (
          <Card className="p-5 h-fit">
            <p className="font-medium text-[15px] text-nep-ink mb-4">Chỉnh sửa · {selected.name}</p>
            <div className="space-y-3">
              <div>
                <FieldLabel required>Tên combo</FieldLabel>
                <Input value={selected.name} onChange={(e) => patch({ name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Mã combo</FieldLabel>
                  <Input value={selected.sku || ''} onChange={(e) => patch({ sku: e.target.value })} />
                </div>
                <div>
                  <FieldLabel required>Giá combo (VNĐ)</FieldLabel>
                  <Input type="number" value={selected.price} onChange={(e) => patch({ price: Number(e.target.value) })} />
                </div>
              </div>
              <div>
                <FieldLabel>Danh mục</FieldLabel>
                <Select value="combo" disabled>
                  <option value="combo">Combo & quà tặng</option>
                </Select>
              </div>

              <div>
                <p className="text-[13px] font-medium text-nep-ink mb-2">Thành phần & số lượng trong 1 combo</p>
                <div className="space-y-3">
                  {selected.comboItems.map((item, idx) => (
                    <div key={`${item.id}-${idx}`} className="rounded-xl bg-[#eef3e8] p-3">
                      <div className="flex items-start gap-3">
                        <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-medium text-nep-green">{item.name}</p>
                          <p className="text-[11px] text-nep-muted mt-0.5">{item.qtyLabel || `${item.qty} gói`}</p>
                        </div>
                        <button
                          type="button"
                          className="text-nep-muted hover:text-nep-rose"
                          onClick={() => patch({ comboItems: selected.comboItems.filter((_, i) => i !== idx) })}
                        >
                          ×
                        </button>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-[12px] text-nep-muted">Số gói / combo</span>
                        <div className="flex items-center gap-2 border border-nep-line rounded-lg bg-white h-9 px-2">
                          <button type="button" onClick={() => patchItem(idx, { qty: Math.max(1, (item.qty || 1) - 1) })}>
                            −
                          </button>
                          <span className="w-5 text-center text-[13px]">{item.qty || 1}</span>
                          <button type="button" onClick={() => patchItem(idx, { qty: (item.qty || 1) + 1 })}>
                            +
                          </button>
                        </div>
                      </div>
                      <p className="mt-2 text-[11px] text-nep-muted">
                        Khách chọn riêng Tỏi, Ớt, Đinh lăng (Ít / Nhiều) cho món này.
                      </p>
                    </div>
                  ))}
                </div>
                <Select className="mt-3" defaultValue="" onChange={(e) => { addProduct(e.target.value); e.target.value = ''; }}>
                  <option value="" disabled>
                    + Thêm sản phẩm vào combo
                  </option>
                  {PRODUCTS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="pt-2 space-y-1 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-nep-muted">Tổng giá mua lẻ</span>
                  <span>{formatVnd(retail)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-nep-muted">Khách tiết kiệm</span>
                  <span className="text-nep-rose font-medium">{formatVnd(saveAmt)}</span>
                </div>
              </div>
              <p className="text-[11px] text-nep-muted">
                Thay đổi cấu hình chỉ áp dụng cho đơn mới. Đơn đã đặt giữ nguyên thành phần và gia vị.
              </p>
              <PrimaryButton className="w-full">Lưu cấu hình combo</PrimaryButton>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminCombos;
