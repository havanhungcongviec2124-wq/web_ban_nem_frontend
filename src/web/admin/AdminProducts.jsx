import React, { useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../../redux/product/ProductApi';
import { fetchCategories } from '../../redux/category/CategoryApi';
import { useCart } from '../../context/CartContext';
import {
  Card,
  FieldLabel,
  GhostButton,
  Input,
  PageTitle,
  PrimaryButton,
  SearchInput,
  Select,
  SpiceToggle,
  Textarea,
  formatVnd,
} from './adminUi';

const blank = {
  id: '',
  name: '',
  sku: '',
  price: '',
  category: 'nem-truyen-thong',
  pack: '',
  stock: '',
  ingredients: '',
  storage: '',
  image: '/assets/nem-truyen-thong.png',
  defaultSpices: { garlic: 'Nhiều', chili: 'Ít', polyscias: 'Nhiều' },
};

const AdminProducts = () => {
  const dispatch = useDispatch();
  const { showToast } = useCart();
  const list = useSelector((state) => state.products.items);
  const rawCats = useSelector((state) => state.categories.items);

  const cats = useMemo(() => {
    if (rawCats.length > 0) {
      return rawCats.filter((c) => (c.slug || c.id) !== 'all' && (c.slug || c.id) !== 'combo');
    }
    return [
      { id: 'nem-truyen-thong', name: 'Nem truyền thống' },
      { id: 'nem-huong-la', name: 'Nem hương lá' },
      { id: 'nem-coi-ran', name: 'Nem cối & nem rán' },
    ];
  }, [rawCats]);

  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [form, setForm] = useState(blank);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (list.length > 0 && !selectedId && !creating) {
      setSelectedId(list[0].id || list[0]._id);
      setForm({ ...list[0] });
    }
  }, [list, selectedId, creating]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((p) => `${p.name} ${p.sku || ''}`.toLowerCase().includes(q));
  }, [list, query]);

  const sellingCount = list.length;

  const selectProduct = (p) => {
    setCreating(false);
    setSelectedId(p.id || p._id);
    setForm({ ...p });
  };

  const startCreate = () => {
    setCreating(true);
    setSelectedId('');
    setForm({ ...blank });
  };

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const save = async () => {
    if (!form.name || !form.price) {
      showToast('Vui lòng nhập tên và giá sản phẩm!');
      return;
    }

    if (creating) {
      const slug = `nem-${Date.now().toString().slice(-4)}`;
      const item = {
        ...form,
        slug,
        sku: form.sku || `NN-${Date.now().toString().slice(-3)}`,
        price: Number(form.price),
        stock: Number(form.stock) || 0,
        categoryName: cats.find((c) => (c.slug || c.id) === form.category)?.name || 'Nem truyền thống',
      };

      const res = await dispatch(createProduct(item));
      if (createProduct.fulfilled.match(res)) {
        showToast(`Đã thêm sản phẩm "${item.name}"!`);
        setCreating(false);
        setSelectedId(res.payload.id || res.payload._id);
        setForm(res.payload);
      } else {
        showToast('Lỗi khi thêm sản phẩm!');
      }
      return;
    }

    const updated = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock) || 0,
    };

    const targetId = form.slug || form.id || form._id || selectedId;
    const res = await dispatch(updateProduct({ id: targetId, data: updated }));
    if (updateProduct.fulfilled.match(res)) {
      showToast(`Đã cập nhật sản phẩm "${form.name}"!`);
    } else {
      showToast('Lỗi khi cập nhật sản phẩm!');
    }
  };

  const handleDelete = async (idOrSlug) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      const res = await dispatch(deleteProduct(idOrSlug));
      if (deleteProduct.fulfilled.match(res)) {
        showToast('Đã xóa sản phẩm thành công!');
        if (list.length > 1) {
          const next = list.find((p) => (p.slug || p.id || p._id) !== idOrSlug);
          if (next) selectProduct(next);
        } else {
          startCreate();
        }
      }
    }
  };

  return (
    <div>
      <PageTitle title="Sản phẩm" subtitle="Quy cách rõ ràng, gia vị nhất quán trên từng món." />

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <SearchInput value={query} onChange={setQuery} placeholder="Tìm theo tên món hoặc mã sản phẩm..." />
        <PrimaryButton className="shrink-0" onClick={startCreate}>
          + Thêm sản phẩm
        </PrimaryButton>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-5">
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <div className="px-5 py-4 text-[13px] text-nep-muted">
              {list.length} sản phẩm · {sellingCount} đang bán
            </div>
            <div className="divide-y divide-nep-line">
              {filtered.map((p) => {
                const pId = p.id || p._id || p.slug;
                const active = !creating && pId === selectedId;
                return (
                  <button
                    type="button"
                    key={pId}
                    onClick={() => selectProduct(p)}
                    className={`w-full text-left px-5 py-4 flex items-center gap-4 ${active ? 'bg-[#eef3e8]' : 'hover:bg-nep-cream'}`}
                  >
                    <img src={p.image} alt="" className="w-14 h-14 rounded-xl object-cover border border-nep-line" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[14px] text-nep-green">{p.name}</p>
                      <p className="text-[12px] text-nep-muted mt-0.5">
                        {p.sku} · {p.pack || p.shortDesc}
                      </p>
                      <p className="text-[12px] text-nep-muted mt-0.5">Tồn kho: {p.stock ?? 0} phần</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[14px] font-semibold text-nep-rose">{formatVnd(p.price)}</p>
                      <p className="text-[12px] text-nep-green mt-1">{active ? 'Đang chỉnh sửa' : 'Chỉnh sửa'}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="p-5">
            <p className="font-medium text-[14px] text-nep-ink">Quy tắc tùy chọn gia vị</p>
            <p className="mt-2 text-[13px] text-nep-muted">
              Tất cả các sản phẩm đều có Tỏi, Ớt và Đinh lăng. Mỗi loại chỉ có hai mức: Ít / Nhiều; không tự thêm mức khác.
            </p>
            <p className="mt-2 text-[12px] text-nep-muted">
              Với nem chua rán, phần gia vị tùy chọn được đóng kèm riêng. Khách cần làm chín nem trước khi dùng.
            </p>
          </Card>
        </div>

        <Card className="p-5 h-fit">
          <div className="flex items-center justify-between mb-4">
            <p className="font-medium text-[15px] text-nep-ink">
              {creating ? 'Thêm sản phẩm mới' : `Chỉnh sửa · ${form.name || 'Sản phẩm'}`}
            </p>
            {!creating && (
              <button
                type="button"
                onClick={() => handleDelete(form.slug || form.id || form._id)}
                className="text-[12px] text-nep-rose hover:underline font-medium"
              >
                Xóa món
              </button>
            )}
          </div>
          {!creating && (
            <div className="mb-4">
              <span className="inline-flex items-center rounded-full bg-nep-mint text-nep-green text-[11px] px-2.5 py-1">Đang bán</span>
              <img src={form.image} alt="" className="mt-3 w-full h-40 object-cover rounded-xl border border-nep-line" />
            </div>
          )}

          <div className="space-y-3">
            <div>
              <FieldLabel required>Tên sản phẩm</FieldLabel>
              <Input value={form.name} onChange={(e) => setField('name', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel>Mã sản phẩm</FieldLabel>
                <Input value={form.sku || ''} onChange={(e) => setField('sku', e.target.value)} />
              </div>
              <div>
                <FieldLabel required>Giá bán (VNĐ)</FieldLabel>
                <Input type="number" value={form.price} onChange={(e) => setField('price', e.target.value)} />
              </div>
            </div>
            <div>
              <FieldLabel required>Danh mục</FieldLabel>
              <Select value={form.category} onChange={(e) => setField('category', e.target.value)}>
                {cats.map((c) => (
                  <option key={c.slug || c.id} value={c.slug || c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <FieldLabel>Quy cách</FieldLabel>
              <Input value={form.pack || ''} onChange={(e) => setField('pack', e.target.value)} />
            </div>
            <div>
              <FieldLabel>Số lượng tồn</FieldLabel>
              <Input type="number" value={form.stock ?? ''} onChange={(e) => setField('stock', e.target.value)} />
            </div>
            <div>
              <FieldLabel>Thành phần</FieldLabel>
              <Textarea rows={3} value={form.ingredients || ''} onChange={(e) => setField('ingredients', e.target.value)} />
            </div>
            <div>
              <FieldLabel>Bảo quản</FieldLabel>
              <Textarea rows={2} value={form.storage || ''} onChange={(e) => setField('storage', e.target.value)} />
            </div>
            <div>
              <p className="text-[13px] font-medium text-nep-ink mb-2">Gia vị mặc định khi chọn món</p>
              <div className="space-y-2">
                <SpiceToggle
                  label="Tỏi"
                  value={form.defaultSpices?.garlic || 'Nhiều'}
                  onChange={(v) => setField('defaultSpices', { ...form.defaultSpices, garlic: v })}
                />
                <SpiceToggle
                  label="Ớt"
                  value={form.defaultSpices?.chili || 'Ít'}
                  onChange={(v) => setField('defaultSpices', { ...form.defaultSpices, chili: v })}
                />
                <SpiceToggle
                  label="Đinh lăng"
                  value={form.defaultSpices?.polyscias || 'Nhiều'}
                  onChange={(v) => setField('defaultSpices', { ...form.defaultSpices, polyscias: v })}
                />
              </div>
              <p className="mt-2 text-[11px] text-nep-muted">
                Khách có thể đổi Ít / Nhiều trước khi thêm giỏ. Không thay gia vị của đơn đã đặt.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <GhostButton className="flex-1" onClick={() => (creating ? startCreate() : selectProduct(list.find((p) => (p.slug || p.id || p._id) === selectedId) || list[0]))}>
                Hủy
              </GhostButton>
              <PrimaryButton className="flex-1" onClick={save}>
                {creating ? 'Lưu sản phẩm' : 'Lưu thay đổi'}
              </PrimaryButton>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminProducts;
