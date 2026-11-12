import React, { useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, createProduct, updateProduct, deleteProduct, uploadProductImage } from '../../redux/product/ProductApi';
import { fetchCategories, createCategory } from '../../redux/category/CategoryApi';
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

// Giá trị option "Khác" trong danh sách danh mục
const NEW_CATEGORY = '__new__';

// Tạo slug không dấu từ tên tiếng Việt
const slugify = (text) =>
  String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

// Đổi sản phẩm thành danh sách ảnh cho form: dùng gallery nếu có,
// ngược lại chỉ có ảnh đại diện. Nếu image (ảnh đại diện) chưa nằm trong
// gallery (sản phẩm lưu từ phiên bản cũ) thì đưa lên đầu để không bị mất
const imagesFromProduct = (p) => {
  const image = p?.image || '';
  const gallery = Array.isArray(p?.gallery) ? p.gallery.filter(Boolean) : [];
  let urls;
  if (gallery.length) {
    urls = image && !gallery.includes(image) ? [image, ...gallery] : gallery;
  } else {
    urls = image ? [image] : [];
  }
  return urls.map((url) => ({ url, preview: url }));
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
  const [newCategoryName, setNewCategoryName] = useState('');
  // Danh sách ảnh của sản phẩm: mỗi phần tử là { url } (ảnh đã có trên server)
  // hoặc { file, preview } (ảnh vừa chọn, sẽ được tải lên khi lưu)
  const [imageItems, setImageItems] = useState([]);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (list.length > 0 && !selectedId && !creating) {
      setSelectedId(list[0].id || list[0]._id);
      setForm({ ...list[0] });
      applyImageItems(imagesFromProduct(list[0]));
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
    setNewCategoryName('');
    applyImageItems(imagesFromProduct(p));
  };

  const startCreate = () => {
    setCreating(true);
    setSelectedId('');
    setForm({ ...blank });
    setNewCategoryName('');
    applyImageItems([]);
  };

  // Đặt lại danh sách ảnh trong form (giải phóng blob preview cũ nếu có)
  const applyImageItems = (items) => {
    setImageItems((prev) => {
      prev.forEach((it) => {
        if (it.preview && it.preview.startsWith('blob:')) URL.revokeObjectURL(it.preview);
      });
      return items;
    });
  };

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  // Cho phép chọn 1 hoặc nhiều ảnh cùng lúc — nối vào cuối danh sách
  const handleImagesChange = (e) => {
    const files = [...(e.target.files || [])];
    if (!files.length) return;
    setImageItems((prev) => [
      ...prev,
      ...files.map((file) => ({ file, preview: URL.createObjectURL(file) })),
    ]);
    e.target.value = '';
  };

  const removeImage = (index) => {
    setImageItems((prev) => {
      const removed = prev[index];
      if (removed?.preview?.startsWith('blob:')) URL.revokeObjectURL(removed.preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Option đang chọn của Select Danh mục: nếu danh mục của sản phẩm không còn
  // trong danh sách (đã bị xóa / ẩn) thì hiển thị "Khác" cho dễ nhận biết
  const selectValue =
    form.category !== NEW_CATEGORY && cats.some((c) => (c.slug || c.id) === form.category)
      ? form.category
      : NEW_CATEGORY;

  const save = async () => {
    if (!form.name || !form.price) {
      showToast('Vui lòng nhập tên và giá sản phẩm!');
      return;
    }

    // 1. Nếu chọn "Khác" — tạo danh mục mới trước khi lưu sản phẩm
    //    (nếu tên trùng slug danh mục đã có thì dùng lại danh mục đó)
    let category = form.category;
    let categoryName = form.categoryName || '';
    if (form.category === NEW_CATEGORY) {
      const name = newCategoryName.trim();
      if (!name) {
        showToast('Vui lòng nhập tên danh mục mới!');
        return;
      }
      const slug = slugify(name) || `danh-muc-${Date.now().toString().slice(-6)}`;
      const existing = rawCats.find((c) => (c.slug || c.id) === slug);
      if (existing) {
        category = existing.slug || existing.id;
        categoryName = existing.name;
      } else {
        const order = Math.max(0, ...rawCats.map((c) => Number(c.order) || 0)) + 1;
        const res = await dispatch(createCategory({ name, slug, order }));
        if (createCategory.fulfilled.match(res)) {
          category = res.payload.slug || slug;
          categoryName = res.payload.name || name;
        } else {
          showToast(res.payload || 'Tạo danh mục thất bại!');
          return;
        }
      }
    } else {
      categoryName = cats.find((c) => (c.slug || c.id) === category)?.name || categoryName;
    }

    // 2. Tải các ảnh vừa chọn lên server (giữ đúng thứ tự đã sắp xếp)
    const imageUrls = [];
    for (const it of imageItems) {
      if (it.url) {
        imageUrls.push(it.url);
        continue;
      }
      const up = await dispatch(uploadProductImage(it.file));
      if (uploadProductImage.fulfilled.match(up)) {
        imageUrls.push(up.payload);
      } else {
        showToast(up.payload || 'Tải ảnh thất bại!');
        return;
      }
    }
    // Ảnh đầu tiên là ảnh đại diện (dùng ở danh sách/giỏ hàng),
    // gallery chứa tất cả ảnh để trang chi tiết hiển thị
    const image = imageUrls[0] || blank.image;
    const gallery = imageUrls;

    if (creating) {
      const slug = `nem-${Date.now().toString().slice(-4)}`;
      const item = {
        ...form,
        slug,
        category,
        categoryName,
        image,
        gallery,
        sku: form.sku || `NN-${Date.now().toString().slice(-3)}`,
        price: Number(form.price),
        stock: Number(form.stock) || 0,
      };

      const res = await dispatch(createProduct(item));
      if (createProduct.fulfilled.match(res)) {
        showToast(`Đã thêm sản phẩm "${item.name}"!`);
        setCreating(false);
        setSelectedId(res.payload.id || res.payload._id);
        setForm(res.payload);
        setNewCategoryName('');
        applyImageItems(imagesFromProduct(res.payload));
      } else {
        showToast(res.payload || 'Lỗi khi thêm sản phẩm!');
      }
      return;
    }

    // Bỏ các trường tự sinh của Mongo để không ghi đè khi cập nhật
    const { _id, id, createdAt, updatedAt, __v, ...rest } = form;
    const updated = {
      ...rest,
      category,
      categoryName,
      image,
      gallery,
      price: Number(form.price),
      stock: Number(form.stock) || 0,
    };

    const targetId = form.slug || form.id || form._id || selectedId;
    const res = await dispatch(updateProduct({ id: targetId, data: updated }));
    if (updateProduct.fulfilled.match(res)) {
      showToast(`Đã cập nhật sản phẩm "${form.name}"!`);
      setForm(res.payload);
      applyImageItems(imagesFromProduct(res.payload));
    } else {
      showToast(res.payload || 'Lỗi khi cập nhật sản phẩm!');
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
            <span className="inline-flex items-center rounded-full bg-nep-mint text-nep-green text-[11px] px-2.5 py-1 mb-3">Đang bán</span>
          )}

          <div className="mb-4">
            <FieldLabel>Hình ảnh</FieldLabel>
            <div className="grid grid-cols-3 gap-2">
              {imageItems.map((it, i) => (
                <div key={it.preview} className="relative">
                  <img
                    src={it.preview}
                    alt=""
                    className="w-full h-20 rounded-xl object-cover border border-nep-line bg-white"
                  />
                  {i === 0 && (
                    <span className="absolute left-1 top-1 rounded-full bg-nep-green text-white text-[9px] font-medium px-1.5 py-0.5">
                      Ảnh đại diện
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    title="Xóa ảnh này"
                    className="absolute right-1 top-1 w-5 h-5 rounded-full bg-black/45 text-white text-[11px] leading-none flex items-center justify-center hover:bg-nep-rose"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <label className="h-20 rounded-xl border border-dashed border-nep-line bg-nep-paper text-nep-green text-[12px] font-medium hover:bg-nep-mint cursor-pointer flex items-center justify-center gap-1">
                + Thêm ảnh
                <input
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/gif,image/webp,image/avif"
                  className="hidden"
                  onChange={handleImagesChange}
                />
              </label>
            </div>
            <p className="mt-2 text-[11px] text-nep-muted">
              Chọn 1 hoặc nhiều ảnh · ảnh đầu tiên là ảnh đại diện · PNG, JPG, GIF, WEBP · tối đa 5MB mỗi ảnh
            </p>
          </div>

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
              <Select value={selectValue} onChange={(e) => setField('category', e.target.value)}>
                {cats.map((c) => (
                  <option key={c.slug || c.id} value={c.slug || c.id}>
                    {c.name}
                  </option>
                ))}
                <option value={NEW_CATEGORY}>Khác (danh mục mới)</option>
              </Select>
            </div>
            {selectValue === NEW_CATEGORY && (
              <div>
                <FieldLabel required>Tên danh mục mới</FieldLabel>
                <Input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="VD: Nem chua cá basa"
                />
                <p className="mt-1.5 text-[11px] text-nep-muted">
                  Danh mục sẽ được tạo mới khi bạn lưu sản phẩm.
                </p>
              </div>
            )}
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
