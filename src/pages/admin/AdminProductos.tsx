import { useState, useEffect } from 'react';
import {
  productsApi,
  productImageUrl,
  type ProductApi,
  type CreateProductBody,
} from '../../api/products';
import { categoriesApi, type CategoryApi } from '../../api/categories';
import { Plus, Pencil, Trash2, X, Star } from 'lucide-react';

export default function AdminProductos() {
  const [products, setProducts] = useState<ProductApi[]>([]);
  const [categories, setCategories] = useState<CategoryApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CreateProductBody & { imageFile: File | null }>({
    title: '',
    description: '',
    price: 0,
    categoryId: null,
    isFeatured: false,
    imageFile: null,
  });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [prods, cats] = await Promise.all([
        productsApi.getAll(),
        categoriesApi.getAll(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({
      title: '',
      description: '',
      price: 0,
      categoryId: null,
      isFeatured: false,
      imageFile: null,
    });
    setModalOpen(true);
  };

  const openEdit = (p: ProductApi) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      description: p.description ?? '',
      price: Number(p.price),
      categoryId: p.categoryId ?? null,
      isFeatured: p.isFeatured,
      imageFile: null,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('price', String(form.price));
      formData.append('isFeatured', form.isFeatured ? 'true' : 'false');
      if (form.description) formData.append('description', form.description);
      if (form.categoryId) formData.append('categoryId', form.categoryId);
      if (form.imageFile) formData.append('image', form.imageFile);
      if (editingId) {
        await productsApi.updateWithImage(editingId, formData);
      } else {
        await productsApi.createWithImage(formData);
      }
      setModalOpen(false);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setError('');
    try {
      await productsApi.delete(id);
      setDeleteConfirm(null);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al eliminar');
    }
  };

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return '—';
    const c = categories.find((x) => x.id === categoryId);
    return c?.name ?? categoryId;
  };

  const formatPrice = (n: number) =>
    new Intl.NumberFormat('es-PY', { style: 'decimal' }).format(n) + ' Gs';

  const imageUrl = form.imageFile
    ? URL.createObjectURL(form.imageFile)
    : editingId
      ? productImageUrl(products.find((p) => p.id === editingId) ?? null)
      : null;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-dark-gray font-semibold rounded-lg hover:opacity-90"
        >
          <Plus size={20} />
          Nuevo producto
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-700 font-semibold">Producto</th>
                  <th className="text-left px-4 py-3 text-gray-700 font-semibold">Precio</th>
                  <th className="text-left px-4 py-3 text-gray-700 font-semibold">Categoría</th>
                  <th className="text-left px-4 py-3 text-gray-700 font-semibold">Destacado</th>
                  <th className="w-28 px-4 py-3 text-gray-700 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t border-gray-100">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {productImageUrl(p) ? (
                          <img
                            src={productImageUrl(p)!}
                            alt=""
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                            Sin img
                          </div>
                        )}
                        <span className="text-gray-900 font-medium">{p.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{formatPrice(Number(p.price))}</td>
                    <td className="px-4 py-3 text-gray-600">{getCategoryName(p.categoryId)}</td>
                    <td className="px-4 py-3">
                      {p.isFeatured ? (
                        <Star className="text-primary" size={18} fill="currentColor" />
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => openEdit(p)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        title="Editar"
                      >
                        <Pencil size={18} />
                      </button>
                      {deleteConfirm === p.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="text-red-600 text-sm font-medium"
                          >
                            Sí
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="text-gray-600 text-sm"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(p.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {products.length === 0 && (
            <p className="text-center py-12 text-gray-500">
              No hay productos. Creá uno para empezar.
            </p>
          )}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
              <h2 className="text-lg font-bold">
                {editingId ? 'Editar producto' : 'Nuevo producto'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio (Gs)</label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={form.price || ''}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, price: parseInt(e.target.value, 10) || 0 }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select
                  value={form.categoryId ?? ''}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      categoryId: e.target.value || null,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                >
                  <option value="">Sin categoría</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción (opcional)
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Imagen (opcional, JPEG/PNG/WebP/GIF, máx. 5 MB)
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={(e) => setForm((f) => ({ ...f, imageFile: e.target.files?.[0] ?? null }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-sm"
                />
                {imageUrl && (
                  <img src={imageUrl} alt="" className="mt-2 w-24 h-24 object-cover rounded" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={form.isFeatured}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, isFeatured: e.target.checked }))
                  }
                  className="w-4 h-4 accent-primary"
                />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                  Producto destacado
                </label>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2 bg-primary text-dark-gray font-semibold rounded-lg hover:opacity-90 disabled:opacity-50"
                >
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
