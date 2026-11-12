import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllCategoriesAdmin,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../redux/category/CategoryApi';
import { fetchProducts } from '../../redux/product/ProductApi';
import { fetchCombos } from '../../redux/combo/ComboApi';
import { useCart } from '../../context/CartContext';
import {
  Card,
  FieldLabel,
  Input,
  PageTitle,
  PrimaryButton,
  SearchInput,
  Textarea,
} from './adminUi';

const blankCategory = {
  name: '',
  slug: '',
  description: '',
  order: 1,
  visible: true,
};

const AdminCategories = () => {
  const dispatch = useDispatch();
  const { showToast } = useCart();
  const list = useSelector((state) => state.categories.items);
  const products = useSelector((state) => state.products.items);
  const combos = useSelector((state) => state.combos.items);

  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [form, setForm] = useState(blankCategory);
  const [creating, setCreating] = useState(false);
  // Thông báo lỗi trùng thứ tự hiển thị
  const [orderError, setOrderError] = useState('');

  useEffect(() => {
    dispatch(fetchAllCategoriesAdmin());
    dispatch(fetchProducts());
    dispatch(fetchCombos());
  }, [dispatch]);

  useEffect(() => {
    if (list.length > 0 && !selectedId && !creating) {
      const first = list[0];
      setSelectedId(first.slug || first.id || first._id);
      setForm({ ...first });
    }
  }, [list, selectedId, creating]);

  const selected = useMemo(() => {
    return list.find((c) => (c.slug || c.id || c._id) === selectedId) || list[0] || null;
  }, [list, selectedId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((c) => c.name.toLowerCase().includes(q));
  }, [list, query]);

  const itemCount = (cat) => {
    const catId = cat.slug || cat.id;
    if (catId === 'combo') return combos.length;
    return products.filter((p) => p.category === catId).length;
  };

  const selectCat = (c) => {
    setCreating(false);
    setSelectedId(c.slug || c.id || c._id);
    setForm({ ...c });
    setOrderError('');
  };

  const startCreate = () => {
    setCreating(true);
    setSelectedId('');
    setOrderError('');
    setForm({
      ...blankCategory,
      order: list.length + 1,
    });
  };

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    if (!form.name.trim()) {
      showToast('Vui lòng nhập tên danh mục!');
      return;
    }

    // Kiểm tra client: thứ tự hiển thị đã có danh mục khác dùng chưa
    const targetId = form.slug || form.id || form._id || selectedId;
    const orderClash = list.find(
      (c) => Number(c.order) === Number(form.order) && (c.slug || c.id || c._id) !== targetId
    );
    if (orderClash) {
      setOrderError(
        `Thứ tự ${form.order} đã được dùng bởi danh mục "${orderClash.name}". Vui lòng chọn số khác!`
      );
      showToast(`Trùng thứ tự với danh mục "${orderClash.name}"!`);
      return;
    }
    setOrderError('');

    if (creating) {
      const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, '-');
      const payload = {
        ...form,
        slug,
        order: Number(form.order) || 1,
      };
      const res = await dispatch(createCategory(payload));
      if (createCategory.fulfilled.match(res)) {
        showToast(`Đã thêm danh mục "${form.name}"!`);
        setCreating(false);
        setSelectedId(res.payload.slug || res.payload.id || res.payload._id);
        setForm(res.payload);
      } else {
        // Hiển thị thông báo trùng thứ tự từ backend nếu có
        const msg = typeof res.payload === 'string' ? res.payload : 'Lỗi khi thêm danh mục!';
        setOrderError(msg.includes('Thứ tự') ? msg : '');
        showToast(msg);
      }
      return;
    }

    const res = await dispatch(updateCategory({ id: targetId, data: form }));
    if (updateCategory.fulfilled.match(res)) {
      showToast(`Đã lưu danh mục "${form.name}"!`);
    } else {
      const msg = typeof res.payload === 'string' ? res.payload : 'Lỗi khi cập nhật danh mục!';
      setOrderError(msg.includes('Thứ tự') ? msg : '');
      showToast(msg);
    }
  };

  const handleDelete = async (idOrSlug, name) => {
    if (window.confirm(`Bạn có chắc muốn xóa danh mục "${name}"?`)) {
      const res = await dispatch(deleteCategory(idOrSlug));
      if (deleteCategory.fulfilled.match(res)) {
        showToast(`Đã xóa danh mục "${name}"!`);
        if (list.length > 1) {
          const next = list.find((c) => (c.slug || c.id || c._id) !== idOrSlug);
          if (next) selectCat(next);
        } else {
          startCreate();
        }
      }
    }
  };

  return (
    <div>
      <PageTitle title="Danh mục sản phẩm" subtitle="Sắp xếp lối vào cửa hàng để khách tìm món thật dễ." />

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <SearchInput value={query} onChange={setQuery} placeholder="Tìm danh mục..." />
        <PrimaryButton className="shrink-0" onClick={startCreate}>
          + Thêm danh mục
        </PrimaryButton>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5">
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <div className="px-5 py-4 text-[13px] text-nep-muted">
              {list.filter((c) => c.visible).length} danh mục đang hiển thị
            </div>
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="bg-[#eef2e8] text-nep-green">
                  <th className="font-medium px-5 py-3">Tên danh mục</th>
                  <th className="font-medium px-5 py-3">Số món</th>
                  <th className="font-medium px-5 py-3">Thứ tự</th>
                  <th className="font-medium px-5 py-3">Trạng thái</th>
                  <th className="font-medium px-5 py-3">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => {
                  const cId = c.slug || c.id || c._id;
                  const active = !creating && cId === selectedId;
                  return (
                    <tr key={cId} className={`border-t border-nep-line ${active ? 'bg-[#f7faf3]' : ''}`}>
                      <td className="px-5 py-3.5 font-medium">{c.name}</td>
                      <td className="px-5 py-3.5">{itemCount(c)}</td>
                      <td className="px-5 py-3.5">{c.order}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex rounded-full text-[11px] px-2.5 py-1 ${c.visible ? 'bg-nep-mint text-nep-green' : 'bg-stone-200 text-stone-600'}`}>
                          {c.visible ? 'Hiển thị' : 'Ẩn'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 flex items-center gap-3">
                        <button
                          type="button"
                          className="text-nep-green hover:underline cursor-pointer"
                          onClick={() => selectCat(c)}
                        >
                          ✎ Sửa
                        </button>
                        <button
                          type="button"
                          className="text-nep-rose hover:underline cursor-pointer"
                          onClick={() => handleDelete(cId, c.name)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="px-5 py-3 text-[12px] text-nep-muted">Thứ tự này được dùng trong thanh danh mục và trang sản phẩm.</p>
          </Card>

          <Card className="p-5">
            <p className="font-medium text-[14px] text-nep-ink mb-3">Xem trước trên cửa hàng</p>
            <div className="flex flex-wrap gap-2">
              {list.filter((c) => c.visible).map((c) => (
                <span
                  key={c.slug || c.id || c._id}
                  className={`rounded-full px-3 py-1.5 text-[12px] ${
                    (c.slug || c.id) === (selected?.slug || selected?.id)
                      ? 'bg-nep-green text-nep-cream'
                      : 'bg-nep-mint text-nep-green'
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

        <Card className="p-5 h-fit">
          <p className="font-medium text-[15px] text-nep-ink mb-4">
            {creating ? 'Thêm danh mục mới' : `Chỉnh sửa · ${form.name || 'Danh mục'}`}
          </p>
          <div className="space-y-3">
            <div>
              <FieldLabel required>Tên danh mục</FieldLabel>
              <Input value={form.name} onChange={(e) => setField('name', e.target.value)} />
            </div>
            <div>
              <FieldLabel>Đường dẫn (Slug)</FieldLabel>
              <Input value={form.slug || ''} onChange={(e) => setField('slug', e.target.value)} />
            </div>
            <div>
              <FieldLabel>Mô tả ngắn</FieldLabel>
              <Textarea rows={3} value={form.description || ''} onChange={(e) => setField('description', e.target.value)} />
            </div>
            <div>
              <FieldLabel>Thứ tự hiển thị</FieldLabel>
              <Input
                type="number"
                value={form.order}
                onChange={(e) => {
                  setField('order', Number(e.target.value));
                  if (orderError) setOrderError('');
                }}
                className={orderError ? 'border-[#e06666] focus:border-[#e06666]' : ''}
              />
              {orderError && (
                <div className="mt-1.5 flex items-start gap-1.5 text-[12px] text-[#b91c1c]">
                  <svg className="w-4 h-4 shrink-0 mt-px" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  <span>{orderError}</span>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-[13px] text-nep-ink">Hiển thị trên cửa hàng</span>
              <button
                type="button"
                onClick={() => setField('visible', !form.visible)}
                className={`w-11 h-6 rounded-full relative transition-colors ${form.visible ? 'bg-nep-green' : 'bg-nep-line'}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${form.visible ? 'right-0.5' : 'left-0.5'}`} />
              </button>
            </div>
            <p className="text-[11px] text-nep-muted">
              Ẩn danh mục không xóa các sản phẩm bên trong. Sản phẩm vẫn có thể tìm thấy ở Tất cả.
            </p>
            <PrimaryButton className="w-full cursor-pointer" onClick={handleSave}>
              {creating ? 'Tạo danh mục mới' : 'Lưu danh mục'}
            </PrimaryButton>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminCategories;
