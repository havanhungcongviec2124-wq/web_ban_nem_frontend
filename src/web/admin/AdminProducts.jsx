import React, { useState } from 'react';
import { PRODUCTS, COMBOS, CATEGORIES } from '../../data/mockData';
import { IconPlus, IconTrash, IconCheck } from '../../components/Icons';

const AdminProducts = () => {
  const [productList, setProductList] = useState([...PRODUCTS, ...COMBOS]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'nem-dai',
    price: '',
    originalPrice: '',
    unit: 'Bó 10 chiếc',
    shortDesc: '',
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
    isBestSeller: false,
    defaultSpices: { garlic: 'Nhiều', chili: 'Ít', polyscias: 'Nhiều' }
  });

  const handleDelete = (id) => {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này khỏi danh sách quản lý?')) {
      setProductList(prev => prev.filter(p => p.id !== id));
    }
  };

  const handlePriceChange = (id, newPrice) => {
    setProductList(prev => prev.map(p => p.id === id ? { ...p, price: Number(newPrice) || 0 } : p));
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;

    const itemToAdd = {
      id: `nem-${Date.now().toString().slice(-4)}`,
      name: newProduct.name,
      category: newProduct.category,
      categoryName: CATEGORIES.find(c => c.id === newProduct.category)?.name || 'Nem chua',
      price: Number(newProduct.price),
      originalPrice: newProduct.originalPrice ? Number(newProduct.originalPrice) : null,
      unit: newProduct.unit,
      shortDesc: newProduct.shortDesc || 'Đặc sản nem chua Thanh Hóa thơm ngon chuẩn vị.',
      description: newProduct.shortDesc || 'Đặc sản nem chua Thanh Hóa thơm ngon chuẩn vị.',
      image: newProduct.image,
      rating: 5.0,
      soldCount: 0,
      isBestSeller: newProduct.isBestSeller,
      defaultSpices: newProduct.defaultSpices
    };

    setProductList(prev => [itemToAdd, ...prev]);
    setShowAddModal(false);
    setNewProduct({
      name: '',
      category: 'nem-dai',
      price: '',
      originalPrice: '',
      unit: 'Bó 10 chiếc',
      shortDesc: '',
      image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=800&q=80',
      isBestSeller: false,
      defaultSpices: { garlic: 'Nhiều', chili: 'Ít', polyscias: 'Nhiều' }
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Add Button */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-stone-900">Quản Lý Sản Phẩm & Combo ({productList.length})</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Điều chỉnh giá bán, bật/tắt bán chạy và cập nhật thông tin sản phẩm
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <IconPlus className="w-4 h-4" />
          <span>Thêm Sản Phẩm Mới</span>
        </button>
      </div>

      {/* Table list */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase text-3xs tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Ảnh</th>
                <th className="py-3.5 px-4">Tên Sản Phẩm / Combo</th>
                <th className="py-3.5 px-4">Danh Mục</th>
                <th className="py-3.5 px-4">Giá Bán (VNĐ)</th>
                <th className="py-3.5 px-4">Đơn Vị</th>
                <th className="py-3.5 px-4">Gia Vị Mặc Định</th>
                <th className="py-3.5 px-4 text-center">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {productList.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-12 h-12 rounded-lg object-cover border border-stone-200"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-stone-900 text-sm leading-snug">{item.name}</div>
                    <div className="text-2xs text-stone-500 line-clamp-1">{item.shortDesc}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-3xs font-semibold">
                      {item.categoryName || item.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <input 
                      type="number"
                      value={item.price}
                      onChange={(e) => handlePriceChange(item.id, e.target.value)}
                      className="w-28 px-2 py-1 rounded-lg border border-stone-300 font-bold text-red-700 text-xs focus:ring-1 focus:ring-red-600 focus:outline-none"
                    />
                  </td>
                  <td className="py-3 px-4 text-stone-600 font-medium">
                    {item.unit || 'Phần'}
                  </td>
                  <td className="py-3 px-4 text-3xs text-stone-500">
                    <div>Tỏi: <strong>{item.defaultSpices?.garlic || 'Nhiều'}</strong></div>
                    <div>Ớt: <strong>{item.defaultSpices?.chili || 'Ít'}</strong></div>
                    <div>Lá: <strong>{item.defaultSpices?.polyscias || 'Nhiều'}</strong></div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-stone-400 hover:text-red-700 transition-colors"
                      title="Xóa"
                    >
                      <IconTrash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-black text-stone-900 pb-2 border-b border-stone-100">
              Thêm Món Nem / Combo Mới
            </h3>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Tên món nem *</label>
                <input 
                  type="text" 
                  required
                  placeholder="VD: Nem Chua Phên Lá Chuối..."
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Danh mục</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl bg-white"
                  >
                    <option value="nem-dai">Nem chua dài</option>
                    <option value="nem-vuong">Nem chua vuông</option>
                    <option value="nem-nuong">Nem nướng Thọ Xuân</option>
                    <option value="nem-coi">Nem cối 500g</option>
                    <option value="nem-thinh">Nem thính</option>
                    <option value="combo">Combo Tiết Kiệm</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Đơn vị đóng gói</label>
                  <input 
                    type="text" 
                    placeholder="Bó 10 chiếc / Hộp 300g..."
                    value={newProduct.unit}
                    onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Giá bán (VNĐ) *</label>
                  <input 
                    type="number" 
                    required
                    placeholder="65000"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Giá gốc (nếu có)</label>
                  <input 
                    type="number" 
                    placeholder="80000"
                    value={newProduct.originalPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Mô tả ngắn</label>
                <textarea 
                  rows="2"
                  placeholder="Mô tả hương vị, nguyên liệu..."
                  value={newProduct.shortDesc}
                  onChange={(e) => setNewProduct({ ...newProduct, shortDesc: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-xl"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl shadow-xs"
                >
                  Lưu Sản Phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminProducts;

