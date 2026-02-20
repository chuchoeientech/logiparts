import { useState, useEffect } from 'react';
import {
  categoriesApi,
  categoryImageUrl,
  type CategoryApi,
  type CreateCategoryBody,
} from '../../api/categories';
import { Plus, Pencil, Trash2, X, FolderOpen, Search } from 'lucide-react';

export default function AdminCategorias() {
  const [list, setList] = useState<CategoryApi[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CreateCategoryBody & { imageFile: File | null }>({
    name: '',
    slug: '',
    description: '',
    codLinea: undefined,
    imageFile: null,
  });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await categoriesApi.getAll();
      setList(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  const filteredList = list.filter(c => {
    const search = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(search) ||
      (c.codLinea?.toString().includes(search)) ||
      c.slug.toLowerCase().includes(search)
    );
  });

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ name: '', slug: '', description: '', codLinea: undefined, imageFile: null });
    setModalOpen(true);
  };

  const openEdit = (c: CategoryApi) => {
    setEditingId(c.id);
    setForm({
      name: c.name,
      slug: c.slug,
      description: c.description ?? '',
      codLinea: c.codLinea ?? undefined,
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
      formData.append('name', form.name);
      formData.append('slug', form.slug);
      if (form.description) formData.append('description', form.description);
      if (form.codLinea !== undefined) formData.append('codLinea', String(form.codLinea));
      if (form.imageFile) formData.append('image', form.imageFile);
      if (editingId) {
        await categoriesApi.updateWithImage(editingId, formData);
      } else {
        await categoriesApi.createWithImage(formData);
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
      await categoriesApi.delete(id);
      setDeleteConfirm(null);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al eliminar');
    }
  };

  const slugFromName = (name: string) =>
    name
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

  const imageUrl = form.imageFile
    ? URL.createObjectURL(form.imageFile)
    : editingId
      ? categoryImageUrl(list.find((c) => c.id === editingId)!)
      : null;

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categorías</h1>
          <p className="text-sm text-gray-500">Gestioná las líneas de productos</p>
        </div>
        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar categoría..."
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
            Nueva categoría
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
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-gray-700 font-semibold">Nombre</th>
                <th className="text-left px-4 py-3 text-gray-700 font-semibold">Cód. Línea</th>
                <th className="text-left px-4 py-3 text-gray-700 font-semibold">Slug</th>
                <th className="text-left px-4 py-3 text-gray-700 font-semibold">Imagen</th>
                <th className="w-28 px-4 py-3 text-gray-700 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((c) => (
                <tr key={c.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 text-gray-900">{c.name}</td>
                  <td className="px-4 py-3 text-gray-600 font-bold">{c.codLinea ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600 font-mono text-sm">{c.slug}</td>
                  <td className="px-4 py-3">
                    {categoryImageUrl(c) ? (
                      <img
                        src={categoryImageUrl(c)!}
                        alt=""
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                        <FolderOpen size={20} />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button
                      onClick={() => openEdit(c)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                      title="Editar"
                    >
                      <Pencil size={18} />
                    </button>
                    {deleteConfirm === c.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(c.id)}
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
                        onClick={() => setDeleteConfirm(c.id)}
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
          {filteredList.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                <Search size={32} />
              </div>
              <p className="text-gray-500 font-medium">No se encontraron categorías</p>
              <p className="text-gray-400 text-sm mt-1">
                {searchTerm ? `No hay resultados para "${searchTerm}"` : 'Creá una categoría para empezar.'}
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-bold">
                {editingId ? 'Editar categoría' : 'Nueva categoría'}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => {
                    setForm((f) => ({
                      ...f,
                      name: e.target.value,
                      slug: editingId ? f.slug : slugFromName(e.target.value),
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary font-mono text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código de Línea (Excel)</label>
                <input
                  type="number"
                  value={form.codLinea ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, codLinea: parseInt(e.target.value, 10) || undefined }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="Ej: 101"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción (opcional)</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Imagen (opcional, JPEG/PNG/WebP/GIF, máx. 5 MB)</label>
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
