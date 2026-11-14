import React, { useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCombos, updateCombo, createCombo, deleteCombo } from '../../redux/combo/ComboApi';
import { fetchProducts, uploadProductImage } from '../../redux/product/ProductApi';
import { useCart } from '../../context/CartContext';
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

const DEFAULT_COMBO_IMAGE = '/assets/combo-sum-vay.png';

const blankCombo = {
  name: '',
  sku: '',
  price: 250000,
  originalPrice: 280000,
  image: DEFAULT_COMBO_IMAGE,
  shortDesc: 'Sự kết hợp tinh túy của các món nem chua đặc sản xứ Thanh.',
  badge: 'Mới ra mắt',
  status: 'Đang bán',
  comboItems: [],
};

const AdminCombos = () => {
  const dispatch = useDispatch();
  const { showToast } = useCart();
  const list = useSelector((state) => state.combos.items);
  const products = useSelector((state) => state.products.items);

  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    dispatch(fetchCombos());
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (list.length > 0 && !selectedId) {
      setSelectedId(list[0].slug || list[0].id || list[0]._id);
    }
  }, [list, selectedId]);

  // Form state cho combo mới
  const [newCombo, setNewCombo] = useState({ ...blankCombo, comboItems: [] });

  // Ảnh đại diện combo mới: { url } nếu đang dùng ảnh có sẵn,
  // hoặc { file, preview } nếu người dùng vừa chọn ảnh mới (chưa tải lên)
  const [newImage, setNewImage] = useState({
    url: DEFAULT_COMBO_IMAGE,
    preview: DEFAULT_COMBO_IMAGE,
    file: null,
  });

  const resetNewCombo = () => {
    setNewImage((prev) => {
      if (prev.preview?.startsWith('blob:')) URL.revokeObjectURL(prev.preview);
      return { url: DEFAULT_COMBO_IMAGE, preview: DEFAULT_COMBO_IMAGE, file: null };
    });
    setNewCombo({ ...blankCombo, comboItems: [] });
  };

  const startCreateCombo = () => {
    resetNewCombo();
    setShowCreateModal(true);
  };

  const handleNewImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewImage((prev) => {
      if (prev.preview?.startsWith('blob:')) URL.revokeObjectURL(prev.preview);
      return { file, url: null, preview: URL.createObjectURL(file) };
    });
    e.target.value = '';
  };

  const selected = useMemo(() => {
    return list.find((c) => (c.slug || c.id || c._id) === selectedId) || list[0] || null;
  }, [list, selectedId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((c) => `${c.name} ${c.sku || ''}`.toLowerCase().includes(q));
  }, [list, query]);

  const retail = (selected?.comboItems || []).reduce((sum, item) => {
    const product = products.find((p) => (p.slug || p.id || p._id) === (item.productSlug || item.id));
    return sum + (product?.price || 85000) * (item.qty || 1);
  }, 0);
  const saveAmt = Math.max(0, retail - (selected?.price || 0));

  const [editState, setEditState] = useState(null);

  useEffect(() => {
    if (selected) {
      setEditState(JSON.parse(JSON.stringify(selected)));
    }
  }, [selected]);

  const patchEdit = (partial) => {
    setEditState((prev) => ({ ...prev, ...partial }));
  };

  const patchEditItem = (index, partial) => {
    if (!editState) return;
    const items = (editState.comboItems || []).map((item, i) =>
      i === index ? { ...item, ...partial } : item
    );
    patchEdit({ comboItems: items });
  };

  const addProductToEdit = (prodId) => {
    if (!editState) return;
    const p = products.find((prod) => (prod.slug || prod.id || prod._id) === prodId);
    if (!p) return;
    if ((editState.comboItems || []).some((i) => (i.productSlug || i.id) === (p.slug || p.id))) return;
    patchEdit({
      comboItems: [
        ...(editState.comboItems || []),
        {
          productSlug: p.slug || p.id,
          name: p.name,
          qty: 1,
          qtyLabel: '1 gói',
          image: p.image,
          defaultSpices: p.defaultSpices,
        },
      ],
    });
  };

  const addProductToNewCombo = (prodId) => {
    const p = products.find((prod) => (prod.slug || prod.id || prod._id) === prodId);
    if (!p) return;
    const slug = p.slug || p.id || p._id;
    setNewCombo((prev) => {
      if (prev.comboItems.some((i) => i.productSlug === slug)) return prev;
      return {
        ...prev,
        comboItems: [
          ...prev.comboItems,
          {
            productSlug: slug,
            name: p.name,
            qty: 1,
            qtyLabel: '1 gói',
            image: p.image,
            defaultSpices: p.defaultSpices,
          },
        ],
      };
    });
  };

  const patchNewComboItem = (index, partial) => {
    setNewCombo((prev) => ({
      ...prev,
      comboItems: prev.comboItems.map((item, i) => {
        if (i !== index) return item;
        const next = { ...item, ...partial };
        if (partial.qty !== undefined) next.qtyLabel = `${partial.qty} gói`;
        return next;
      }),
    }));
  };

  const removeNewComboItem = (index) => {
    setNewCombo((prev) => ({
      ...prev,
      comboItems: prev.comboItems.filter((_, i) => i !== index),
    }));
  };

  const handleSaveConfig = async () => {
    if (!editState) return;
    const targetId = editState.slug || editState.id || editState._id;
    const res = await dispatch(updateCombo({ id: targetId, data: editState }));
    if (updateCombo.fulfilled.match(res)) {
      showToast(`Đã lưu cấu hình combo "${editState.name}"!`);
    } else {
      showToast('Lỗi khi cập nhật combo!');
    }
  };

  const handleCreateCombo = async (e) => {
    e.preventDefault();
    if (!newCombo.name.trim()) {
      alert('Vui lòng nhập tên combo!');
      return;
    }
    if (newCombo.comboItems.length < 2) {
      alert('Combo cần chọn từ 2 sản phẩm trở lên!');
      return;
    }

    // Tải ảnh đại diện lên server nếu người dùng chọn file mới
    let image = newImage.url || DEFAULT_COMBO_IMAGE;
    if (newImage.file) {
      const up = await dispatch(uploadProductImage(newImage.file));
      if (uploadProductImage.fulfilled.match(up)) {
        image = up.payload;
      } else {
        showToast(up.payload || 'Tải ảnh thất bại!');
        return;
      }
    }

    const createdSlug = `combo-${Date.now()}`;
    const comboToAdd = {
      ...newCombo,
      slug: createdSlug,
      image,
      gallery: [image],
      sku: newCombo.sku || `CB-${Math.floor(1000 + Math.random() * 9000)}`,
      price: Number(newCombo.price) || 200000,
      originalPrice: Number(newCombo.originalPrice) || Number(newCombo.price) + 30000,
    };

    const res = await dispatch(createCombo(comboToAdd));
    if (createCombo.fulfilled.match(res)) {
      showToast(`Đã tạo thành công combo "${comboToAdd.name}"!`);
      setSelectedId(res.payload.slug || res.payload.id || res.payload._id);
      setShowCreateModal(false);
    } else {
      showToast(res.payload || 'Lỗi khi tạo combo!');
    }
  };

  const handleDeleteCombo = async (id, name) => {
    if (list.length <= 1) {
      alert('Phải giữ lại ít nhất 1 combo trong hệ thống!');
      return;
    }
    if (window.confirm(`Bạn có chắc chắn muốn xóa combo "${name}"?`)) {
      const res = await dispatch(deleteCombo(id));
      if (deleteCombo.fulfilled.match(res)) {
        showToast(`Đã xóa combo "${name}"!`);
        const remaining = list.filter((c) => (c.slug || c.id || c._id) !== id);
        if (remaining.length > 0) {
          setSelectedId(remaining[0].slug || remaining[0].id || remaining[0]._id);
        }
      } else {
        showToast('Lỗi khi xóa combo!');
      }
    }
  };

  const currentDisplay = editState || selected;

  return (
    <div>
      <PageTitle
        title="Combo & quà tặng"
        subtitle="Kết hợp món, điều chỉnh số lượng và giữ riêng khẩu vị từng thành phần."
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <SearchInput value={query} onChange={setQuery} placeholder="Tìm tên hoặc mã combo..." />
        <PrimaryButton onClick={startCreateCombo} className="shrink-0 cursor-pointer">
          + Tạo combo mới
        </PrimaryButton>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-5">
        <div className="space-y-4">
          {filtered.map((c) => {
            const cId = c.slug || c.id || c._id;
            const active = cId === selectedId;
            return (
              <Card key={cId} className={`overflow-hidden transition-all ${active ? 'ring-2 ring-nep-green/60 shadow-md' : 'hover:shadow-sm'}`}>
                <button type="button" className="w-full text-left" onClick={() => setSelectedId(cId)}>
                  <img src={c.image} alt="" className="w-full h-52 object-cover" />
                </button>
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-serif text-[20px] text-nep-ink">{c.name}</p>
                      <span className="mt-1.5 inline-flex rounded-full bg-nep-mint text-nep-green text-[11px] px-2.5 py-0.5">
                        {c.status || 'Đang bán'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteCombo(cId, c.name)}
                      className="text-stone-400 hover:text-nep-rose text-[12px] p-1"
                      title="Xóa combo này"
                    >
                      Xóa
                    </button>
                  </div>
                  <p className="mt-2.5 text-[13px] text-nep-muted line-clamp-2">{c.shortDesc || c.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-[18px] font-semibold text-nep-rose">{formatVnd(c.price)}</p>
                      {c.originalPrice > c.price && (
                        <p className="text-[12px] text-nep-muted line-through">{formatVnd(c.originalPrice)}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedId(cId)}
                      className={`text-[13px] font-medium px-3 py-1.5 rounded-lg transition-colors ${
                        active ? 'bg-nep-green text-white' : 'text-nep-green bg-[#eef3e8] hover:bg-nep-green hover:text-white'
                      }`}
                    >
                      {active ? 'Đang chỉnh sửa' : 'Chỉnh sửa →'}
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {currentDisplay && (
          <Card className="p-5 h-fit sticky top-24">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-nep-line">
              <p className="font-medium text-[15px] text-nep-ink truncate">Chỉnh sửa · {currentDisplay.name}</p>
              <span className="text-[11px] text-nep-muted bg-stone-100 px-2 py-0.5 rounded">
                Mã: {currentDisplay.slug || currentDisplay.id}
              </span>
            </div>
            <div className="space-y-3.5">
              <div>
                <FieldLabel required>Tên combo</FieldLabel>
                <Input value={currentDisplay.name} onChange={(e) => patchEdit({ name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Mã combo (SKU)</FieldLabel>
                  <Input value={currentDisplay.sku || ''} onChange={(e) => patchEdit({ sku: e.target.value })} />
                </div>
                <div>
                  <FieldLabel required>Giá combo (VNĐ)</FieldLabel>
                  <Input type="number" value={currentDisplay.price} onChange={(e) => patchEdit({ price: Number(e.target.value) })} />
                </div>
              </div>

              <div>
                <FieldLabel>Mô tả ngắn</FieldLabel>
                <Input value={currentDisplay.shortDesc || ''} onChange={(e) => patchEdit({ shortDesc: e.target.value })} />
              </div>

              <div>
                <p className="text-[13px] font-medium text-nep-ink mb-2">Thành phần & số lượng trong 1 combo</p>
                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {(currentDisplay.comboItems || []).map((item, idx) => (
                    <div key={`${item.id || item.productSlug}-${idx}`} className="rounded-xl bg-[#eef3e8] p-3">
                      <div className="flex items-start gap-3">
                        <img src={item.image || '/assets/nem-truyen-thong.png'} alt="" className="w-12 h-12 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-medium text-nep-green truncate">{item.name}</p>
                          <p className="text-[11px] text-nep-muted mt-0.5">{item.qtyLabel || `${item.qty} gói`}</p>
                        </div>
                        <button
                          type="button"
                          className="text-stone-400 hover:text-nep-rose p-1 text-base leading-none"
                          onClick={() => patchEdit({ comboItems: (currentDisplay.comboItems || []).filter((_, i) => i !== idx) })}
                          title="Xóa món này khỏi combo"
                        >
                          ×
                        </button>
                      </div>
                      <div className="mt-2.5 flex items-center justify-between">
                        <span className="text-[12px] text-nep-muted">Số gói / combo</span>
                        <div className="flex items-center gap-2 border border-nep-line rounded-lg bg-white h-8 px-2">
                          <button type="button" className="px-1 font-bold text-nep-ink hover:text-nep-rose" onClick={() => patchEditItem(idx, { qty: Math.max(1, (item.qty || 1) - 1) })}>
                            −
                          </button>
                          <span className="w-5 text-center text-[13px]">{item.qty || 1}</span>
                          <button type="button" className="px-1 font-bold text-nep-ink hover:text-nep-green" onClick={() => patchEditItem(idx, { qty: (item.qty || 1) + 1 })}>
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Select className="mt-2.5" defaultValue="" onChange={(e) => { addProductToEdit(e.target.value); e.target.value = ''; }}>
                  <option value="" disabled>
                    + Thêm sản phẩm vào combo
                  </option>
                  {products.map((p) => (
                    <option key={p.slug || p.id || p._id} value={p.slug || p.id || p._id}>
                      {p.name} ({formatVnd(p.price)})
                    </option>
                  ))}
                </Select>
              </div>

              <div className="pt-2 space-y-1 text-[13px] bg-stone-50 p-3 rounded-xl border border-stone-200">
                <div className="flex justify-between">
                  <span className="text-nep-muted">Tổng giá mua lẻ</span>
                  <span className="font-medium">{formatVnd(retail)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-nep-muted">Khách tiết kiệm</span>
                  <span className="text-nep-rose font-medium">{formatVnd(saveAmt)}</span>
                </div>
              </div>

              <PrimaryButton onClick={handleSaveConfig} className="w-full cursor-pointer py-2.5">
                💾 Lưu cấu hình combo
              </PrimaryButton>
            </div>
          </Card>
        )}
      </div>

      {/* Modal Tạo combo mới */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-nep-line">
              <h3 className="font-serif text-[20px] text-nep-ink">Tạo combo mới</h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-stone-400 hover:text-nep-ink text-xl font-bold leading-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateCombo} className="mt-4 space-y-4">
              <div>
                <FieldLabel required>Tên combo</FieldLabel>
                <Input
                  required
                  placeholder="Ví dụ: Combo Đoàn Viên"
                  value={newCombo.name}
                  onChange={(e) => setNewCombo({ ...newCombo, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Mã SKU</FieldLabel>
                  <Input
                    placeholder="CB-DV01"
                    value={newCombo.sku}
                    onChange={(e) => setNewCombo({ ...newCombo, sku: e.target.value })}
                  />
                </div>
                <div>
                  <FieldLabel required>Giá bán (VNĐ)</FieldLabel>
                  <Input
                    type="number"
                    required
                    value={newCombo.price}
                    onChange={(e) => setNewCombo({ ...newCombo, price: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <FieldLabel>Ảnh combo (ảnh đại diện)</FieldLabel>
                <div className="flex items-start gap-3">
                  <img
                    src={newImage.preview}
                    alt=""
                    className="w-24 h-24 shrink-0 rounded-xl object-cover border border-nep-line bg-white"
                  />
                  <div className="flex-1 min-w-0 space-y-2">
                    <label className="inline-flex items-center justify-center h-10 px-3.5 rounded-xl border border-nep-line bg-nep-paper text-nep-green text-[13px] font-medium hover:bg-nep-mint cursor-pointer">
                      Chọn ảnh
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/gif,image/webp,image/avif"
                        className="hidden"
                        onChange={handleNewImageChange}
                      />
                    </label>
                    <p className="text-[11px] text-nep-muted">PNG, JPG, GIF, WEBP · tối đa 5MB</p>
                  </div>
                </div>
              </div>

              <div>
                <FieldLabel>Mô tả ngắn</FieldLabel>
                <Input
                  value={newCombo.shortDesc}
                  onChange={(e) => setNewCombo({ ...newCombo, shortDesc: e.target.value })}
                />
              </div>

              <div>
                <FieldLabel required>Sản phẩm trong combo (từ 2 món trở lên)</FieldLabel>
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {newCombo.comboItems.map((item, idx) => (
                    <div key={`${item.productSlug}-${idx}`} className="rounded-xl bg-[#eef3e8] p-3">
                      <div className="flex items-start gap-3">
                        <img
                          src={item.image || '/assets/nem-truyen-thong.png'}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-medium text-nep-green truncate">{item.name}</p>
                          <p className="text-[11px] text-nep-muted mt-0.5">
                            {formatVnd(
                              products.find((p) => (p.slug || p.id || p._id) === item.productSlug)?.price || 0
                            )}{' '}
                            / gói
                          </p>
                        </div>
                        <button
                          type="button"
                          className="text-stone-400 hover:text-nep-rose p-1 text-base leading-none"
                          onClick={() => removeNewComboItem(idx)}
                          title="Xóa món này khỏi combo"
                        >
                          ×
                        </button>
                      </div>
                      <div className="mt-2.5 flex items-center justify-between">
                        <span className="text-[12px] text-nep-muted">Số gói / combo</span>
                        <div className="flex items-center gap-2 border border-nep-line rounded-lg bg-white h-8 px-2">
                          <button
                            type="button"
                            className="px-1 font-bold text-nep-ink hover:text-nep-rose"
                            onClick={() => patchNewComboItem(idx, { qty: Math.max(1, (item.qty || 1) - 1) })}
                          >
                            −
                          </button>
                          <span className="w-5 text-center text-[13px]">{item.qty || 1}</span>
                          <button
                            type="button"
                            className="px-1 font-bold text-nep-ink hover:text-nep-green"
                            onClick={() => patchNewComboItem(idx, { qty: (item.qty || 1) + 1 })}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {newCombo.comboItems.length < 2 && (
                    <p className="text-[12px] text-nep-muted">
                      {newCombo.comboItems.length === 0
                        ? 'Chưa chọn món nào.'
                        : 'Cần chọn thêm ít nhất 1 món nữa.'}{' '}
                      Combo phải có từ 2 sản phẩm trở lên.
                    </p>
                  )}
                </div>
                <Select
                  className="mt-2.5"
                  defaultValue=""
                  onChange={(e) => {
                    addProductToNewCombo(e.target.value);
                    e.target.value = '';
                  }}
                >
                  <option value="" disabled>
                    + Thêm sản phẩm vào combo
                  </option>
                  {products.map((p) => (
                    <option key={p.slug || p.id || p._id} value={p.slug || p.id || p._id}>
                      {p.name} ({formatVnd(p.price)})
                    </option>
                  ))}
                </Select>
              </div>

              <div className="pt-3 border-t border-nep-line flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl border border-nep-line text-[13px] hover:bg-stone-50"
                >
                  Hủy bỏ
                </button>
                <PrimaryButton type="submit" className="cursor-pointer">
                  Xác nhận tạo combo
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCombos;
