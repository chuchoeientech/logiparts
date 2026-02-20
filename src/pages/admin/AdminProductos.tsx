import { useState, useEffect } from 'react';
import {
  productsApi,
  productImageUrl,
  type ProductApi,
  type CreateProductBody,
} from '../../api/products';
import { categoriesApi, type CategoryApi } from '../../api/categories';
import { Plus, Pencil, Trash2, X, Star, Package, Search } from 'lucide-react';
import { vehiclesApi, type VehicleApi } from '../../api/vehicles';

export default function AdminProductos() {
  const [products, setProducts] = useState<ProductApi[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState<CategoryApi[]>([]);
  const [vehicles, setVehicles] = useState<VehicleApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CreateProductBody & { imageFile: File | null }>({
    descripcion: '',
    description: '',
    costoFinal: 0,
    costoEstimado: 0,
    costoReparacion: 0,
    cantDisponible: 0,
    cantMaxima: 0,
    cantMinima: 0,
    cantPend: 0,
    codDeposito: undefined,
    nombreDeposito: '',
    codigoBarra: '',
    codigoImportacion: '',
    codMarca: undefined,
    codOrigen: undefined,
    estadoRepuesto: undefined,
    categoryId: null,
    vehicleIds: [],
    isFeatured: false,
    imageFile: null,
  });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [prods, cats, vehs] = await Promise.all([
        productsApi.getAll(),
        categoriesApi.getAll(),
        vehiclesApi.getAll(),
      ]);
      setProducts(prods);
      setCategories(cats);
      setVehicles(vehs);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const search = searchTerm.toLowerCase();
    return (
      (p.descripcion?.toLowerCase().includes(search)) ||
      (p.codigoBarra?.toLowerCase().includes(search)) ||
      (p.codigoImportacion?.toLowerCase().includes(search)) ||
      (p.id.toLowerCase().includes(search))
    );
  });

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({
      descripcion: '',
      description: '',
      costoFinal: 0,
      costoEstimado: 0,
      costoReparacion: 0,
      cantDisponible: 0,
      cantMaxima: 0,
      cantMinima: 0,
      cantPend: 0,
      codDeposito: undefined,
      nombreDeposito: '',
      codigoBarra: '',
      codigoImportacion: '',
      codMarca: undefined,
      codOrigen: undefined,
      estadoRepuesto: undefined,
      categoryId: null,
      vehicleIds: [],
      isFeatured: false,
      imageFile: null,
    });
    setModalOpen(true);
  };

  const openEdit = (p: ProductApi) => {
    setEditingId(p.id);
    setForm({
      descripcion: p.descripcion ?? '',
      description: p.description ?? '',
      costoFinal: Number(p.costoFinal),
      costoEstimado: Number(p.costoEstimado),
      costoReparacion: Number(p.costoReparacion),
      cantDisponible: p.cantDisponible,
      cantMaxima: p.cantMaxima,
      cantMinima: p.cantMinima,
      cantPend: p.cantPend,
      codDeposito: p.codDeposito ?? undefined,
      nombreDeposito: p.nombreDeposito ?? '',
      codigoBarra: p.codigoBarra ?? '',
      codigoImportacion: p.codigoImportacion ?? '',
      codMarca: p.codMarca ?? undefined,
      codOrigen: p.codOrigen ?? undefined,
      estadoRepuesto: p.estadoRepuesto ?? undefined,
      categoryId: p.categoryId ?? null,
      vehicleIds: p.vehicles?.map(v => v.id) ?? [],
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
      formData.append('descripcion', form.descripcion ?? '');
      formData.append('costoFinal', String(form.costoFinal));
      formData.append('costoEstimado', String(form.costoEstimado));
      formData.append('costoReparacion', String(form.costoReparacion));
      formData.append('cantDisponible', String(form.cantDisponible));
      formData.append('cantMaxima', String(form.cantMaxima));
      formData.append('cantMinima', String(form.cantMinima));
      formData.append('cantPend', String(form.cantPend));
      formData.append('isFeatured', form.isFeatured ? 'true' : 'false');

      if (form.description) formData.append('description', form.description);
      if (form.categoryId) formData.append('categoryId', form.categoryId);
      if (form.codDeposito !== undefined) formData.append('codDeposito', String(form.codDeposito));
      if (form.nombreDeposito) formData.append('nombreDeposito', form.nombreDeposito);
      if (form.codigoBarra) formData.append('codigoBarra', form.codigoBarra);
      if (form.codigoImportacion) formData.append('codigoImportacion', form.codigoImportacion);
      if (form.codMarca !== undefined) formData.append('codMarca', String(form.codMarca));
      if (form.codOrigen !== undefined) formData.append('codOrigen', String(form.codOrigen));
      if (form.estadoRepuesto !== undefined) formData.append('estadoRepuesto', String(form.estadoRepuesto));

      if (form.vehicleIds?.length) {
        form.vehicleIds.forEach(vid => formData.append('vehicleIds[]', vid));
      }

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
      ? productImageUrl(products.find((p) => p.id === editingId)!)
      : null;

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
          <p className="text-sm text-gray-500">Gestioná el catálogo de repuestos y stock</p>
        </div>
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por nombre, código o barra..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>
          <button
            onClick={openCreate}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-dark-gray font-semibold rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap shadow-sm"
          >
            <Plus size={20} />
            Nuevo producto
          </button>
        </div>
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
                {filteredProducts.map((p) => (
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
                          <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                            <Package size={20} />
                          </div>
                        )}
                        <span className="text-gray-900 font-medium">{p.descripcion || p.id}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{formatPrice(Number(p.costoFinal))}</td>
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
          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                <Search size={32} />
              </div>
              <p className="text-gray-500 font-medium">No se encontraron productos</p>
              <p className="text-gray-400 text-sm mt-1">
                {searchTerm ? `No hay resultados para "${searchTerm}"` : 'Creá un producto para empezar.'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="mt-4 text-primary font-semibold hover:underline"
                >
                  Limpiar búsqueda
                </button>
              )}
            </div>
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
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título / Descripción</label>
                  <input
                    type="text"
                    value={form.descripcion ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Costo Final (Gs)</label>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={form.costoFinal || ''}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, costoFinal: parseInt(e.target.value, 10) || 0 }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock Disponible</label>
                  <input
                    type="number"
                    min={0}
                    value={form.cantDisponible || ''}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, cantDisponible: parseInt(e.target.value, 10) || 0 }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Costo Estimado</label>
                  <input
                    type="number"
                    value={form.costoEstimado || ''}
                    onChange={(e) => setForm((f) => ({ ...f, costoEstimado: parseInt(e.target.value, 10) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Código de Barra</label>
                  <input
                    type="text"
                    value={form.codigoBarra ?? ''}
                    onChange={(e) => setForm((f) => ({ ...f, codigoBarra: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehículos Compatibles</label>
                <div className="grid grid-cols-1 gap-2 border border-gray-300 rounded-lg p-3 max-h-40 overflow-y-auto bg-gray-50">
                  {vehicles.map((v) => (
                    <label key={v.id} className="flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-100 p-1 cursor-pointer rounded">
                      <input
                        type="checkbox"
                        checked={form.vehicleIds?.includes(v.id)}
                        onChange={(e) => {
                          const ids = form.vehicleIds || [];
                          if (e.target.checked) {
                            setForm(f => ({ ...f, vehicleIds: [...ids, v.id] }));
                          } else {
                            setForm(f => ({ ...f, vehicleIds: ids.filter(id => id !== v.id) }));
                          }
                        }}
                        className="w-4 h-4 accent-primary"
                      />
                      <span>{v.nombreMarca} {v.nombreModelo} ({v.anio})</span>
                    </label>
                  ))}
                  {vehicles.length === 0 && <p className="text-xs text-gray-500 italic">No hay vehículos registrados</p>}
                </div>
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
