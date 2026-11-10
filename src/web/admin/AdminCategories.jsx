import React, { useState } from 'react';
import { CATEGORIES, PRODUCTS, COMBOS } from '../../data/mockData';
import { Card, FieldLabel, Input, PageTitle, PrimaryButton, SearchInput, Textarea } from './adminUi';

const seed = CATEGORIES.filter((c) => c.id !== 'all').map((c) => ({ ...c }));

const AdminCategories = () => {
  const [list, setList] = useState(seed);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(seed[0]?.id);
  const selected = list.find((c) => c.id === selectedId) || list[0];
  const filtered = list.filter((c) => c.name.toLowerCase().includes(query.trim().toLowerCase()));

  const itemCount = (id) => {
    if (id === 'combo') return COMBOS.length;
    return PRODUCTS.filter((p) => p.category === id).length;
  };

  const patch = (partial) => {
    setList((prev) => prev.map((c) => (c.id === selected.id ? { ...c, ...partial } : c)));
  };

  return (
    <div>
      <PageTitle title="Danh mục sản phẩm" subtitle="Sắp xếp lối vào cửa hàng để khách tìm món thật dễ." />

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <SearchInput value={query} onChange={setQuery} placeholder="Tìm danh mục..." />
        <PrimaryButton className="shrink-0">+ Thêm danh mục</PrimaryButton>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5">
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <div className="px-5 py-4 text-[13px] text-nep-muted">{list.filter((c) => c.visible).length} danh mục đang hiển thị</div>
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="bg-[#eef2e8] text-nep-green">
                  <th className="font-medium px-5 py-3">Tên danh mục</th>
                  <th className="font-medium px-5 py-3">Số món</th>
                  <th className="font-medium px-5 py-3">Thứ tự</th>
                  <th className="font-medium px-5 py-3">Trạng thái</th>
                  <th className="font-medium px-5 py-3">Sửa</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className={`border-t border-nep-line ${c.id === selected?.id ? 'bg-[#f7faf3]' : ''}`}>
                    <td className="px-5 py-3.5">{c.name}</td>
                    <td className="px-5 py-3.5">{itemCount(c.id)}</td>
                    <td className="px-5 py-3.5">{c.order}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex rounded-full bg-nep-mint text-nep-green text-[11px] px-2.5 py-1">
                        {c.visible ? 'Hiển thị' : 'Ẩn'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button type="button" className="text-nep-green" onClick={() => setSelectedId(c.id)} aria-label="Sửa">
                        ✎
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="px-5 py-3 text-[12px] text-nep-muted">Thứ tự này được dùng trong thanh danh mục và trang sản phẩm.</p>
          </Card>

          <Card className="p-5">
            <p className="font-medium text-[14px] text-nep-ink mb-3">Xem trước trên cửa hàng</p>
            <div className="flex flex-wrap gap-2">
              {list.filter((c) => c.visible).map((c) => (
                <span
                  key={c.id}
                  className={`rounded-full px-3 py-1.5 text-[12px] ${
                    c.id === selected?.id ? 'bg-nep-green text-nep-cream' : 'bg-nep-mint text-nep-green'
                  }`}
                >
                  {c.name}
                </span>
              ))}
            </div>
            <p className="mt-3 text-[12px] text-nep-muted">
              Giữ tên ngắn gọn, dễ hiểu và nhất quán giữa máy tính, máy tính bảng, điện thoại.
            </p>
          </Card>
        </div>

        {selected && (
          <Card className="p-5 h-fit">
            <p className="font-medium text-[15px] text-nep-ink mb-4">Chỉnh sửa danh mục</p>
            <div className="space-y-3">
              <div>
                <FieldLabel required>Tên danh mục</FieldLabel>
                <Input value={selected.name} onChange={(e) => patch({ name: e.target.value })} />
              </div>
              <div>
                <FieldLabel>Đường dẫn</FieldLabel>
                <Input value={selected.slug || selected.id} onChange={(e) => patch({ slug: e.target.value })} />
              </div>
              <div>
                <FieldLabel>Mô tả ngắn</FieldLabel>
                <Textarea rows={3} value={selected.description || ''} onChange={(e) => patch({ description: e.target.value })} />
              </div>
              <div>
                <FieldLabel>Thứ tự hiển thị</FieldLabel>
                <Input type="number" value={selected.order} onChange={(e) => patch({ order: Number(e.target.value) })} />
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-[13px] text-nep-ink">Hiển thị trên cửa hàng</span>
                <button
                  type="button"
                  onClick={() => patch({ visible: !selected.visible })}
                  className={`w-11 h-6 rounded-full relative ${selected.visible ? 'bg-nep-green' : 'bg-nep-line'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${selected.visible ? 'right-0.5' : 'left-0.5'}`} />
                </button>
              </div>
              <p className="text-[11px] text-nep-muted">
                Ẩn danh mục không xóa các sản phẩm bên trong. Sản phẩm vẫn có thể tìm thấy ở Tất cả.
              </p>
              <PrimaryButton className="w-full">Lưu danh mục</PrimaryButton>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminCategories;
