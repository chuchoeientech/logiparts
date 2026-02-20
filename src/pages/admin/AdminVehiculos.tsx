import { useState, useEffect } from 'react';
import { vehiclesApi, type VehicleApi, type CreateVehicleBody } from '../../api/vehicles';
import { Plus, Pencil, Trash2, X, Search } from 'lucide-react';

export default function AdminVehiculos() {
    const [list, setList] = useState<VehicleApi[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<CreateVehicleBody>({
        anio: new Date().getFullYear(),
        nombreTipo: '',
        nombreMarca: '',
        nombreModelo: '',
        codTipo: undefined,
        codModelo: undefined,
        codOrigen: undefined,
    });
    const [saving, setSaving] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const load = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await vehiclesApi.getAll();
            setList(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Error al cargar vehículos');
        } finally {
            setLoading(false);
        }
    };

    const filteredList = list.filter(v => {
        const search = searchTerm.toLowerCase();
        return (
            v.nombreMarca.toLowerCase().includes(search) ||
            v.nombreModelo.toLowerCase().includes(search) ||
            v.anio.toString().includes(search) ||
            v.nombreTipo.toLowerCase().includes(search)
        );
    });

    useEffect(() => {
        load();
    }, []);

    const openCreate = () => {
        setEditingId(null);
        setForm({
            anio: new Date().getFullYear(),
            nombreTipo: '',
            nombreMarca: '',
            nombreModelo: '',
            codTipo: undefined,
            codModelo: undefined,
            codOrigen: undefined,
        });
        setModalOpen(true);
    };

    const openEdit = (v: VehicleApi) => {
        setEditingId(v.id);
        setForm({
            anio: v.anio,
            nombreTipo: v.nombreTipo,
            nombreMarca: v.nombreMarca,
            nombreModelo: v.nombreModelo,
            codTipo: v.codTipo ?? undefined,
            codModelo: v.codModelo ?? undefined,
            codOrigen: v.codOrigen ?? undefined,
        });
        setModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        try {
            if (editingId) {
                await vehiclesApi.update(editingId, form);
            } else {
                await vehiclesApi.create(form);
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
            await vehiclesApi.delete(id);
            setDeleteConfirm(null);
            load();
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Error al eliminar');
        }
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Vehículos</h1>
                    <p className="text-sm text-gray-500">Gestioná la compatibilidad de los repuestos</p>
                </div>
                <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar vehículo..."
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
                        Nuevo vehículo
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
                                    <th className="text-left px-4 py-3 text-gray-700 font-semibold">Marca</th>
                                    <th className="text-left px-4 py-3 text-gray-700 font-semibold">Modelo</th>
                                    <th className="text-left px-4 py-3 text-gray-700 font-semibold">Año</th>
                                    <th className="text-left px-4 py-3 text-gray-700 font-semibold">Tipo</th>
                                    <th className="w-28 px-4 py-3 text-gray-700 font-semibold">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredList.map((v) => (
                                    <tr key={v.id} className="border-t border-gray-100">
                                        <td className="px-4 py-3 text-gray-900 font-medium">{v.nombreMarca}</td>
                                        <td className="px-4 py-3 text-gray-700">{v.nombreModelo}</td>
                                        <td className="px-4 py-3 text-gray-700 font-mono italic">{v.anio}</td>
                                        <td className="px-4 py-3 text-gray-600 text-sm italic">{v.nombreTipo}</td>
                                        <td className="px-4 py-3 flex gap-2">
                                            <button
                                                onClick={() => openEdit(v)}
                                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                                title="Editar"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            {deleteConfirm === v.id ? (
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => handleDelete(v.id)}
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
                                                    onClick={() => setDeleteConfirm(v.id)}
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
                    {filteredList.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 px-4">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                                <Search size={32} />
                            </div>
                            <p className="text-gray-500 font-medium">No se encontraron vehículos</p>
                            <p className="text-gray-400 text-sm mt-1">
                                {searchTerm ? `No hay resultados para "${searchTerm}"` : 'Creá un vehículo para empezar.'}
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
                                {editingId ? 'Editar vehículo' : 'Nuevo vehículo'}
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
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                                    <input
                                        type="text"
                                        value={form.nombreMarca}
                                        onChange={(e) => setForm((f) => ({ ...f, nombreMarca: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                                        placeholder="Ej: TOYOTA"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                                    <input
                                        type="text"
                                        value={form.nombreModelo}
                                        onChange={(e) => setForm((f) => ({ ...f, nombreModelo: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                                        placeholder="Ej: HILUX"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
                                    <input
                                        type="number"
                                        value={form.anio}
                                        onChange={(e) => setForm((f) => ({ ...f, anio: parseInt(e.target.value, 10) || 0 }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary font-mono"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Vehículo</label>
                                    <input
                                        type="text"
                                        value={form.nombreTipo}
                                        onChange={(e) => setForm((f) => ({ ...f, nombreTipo: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                                        placeholder="Ej: AUTOMOVIL"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <p className="text-xs text-gray-400 mb-3 uppercase tracking-wider font-bold">Datos de Referencia (Excel)</p>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase text-center">Cód. Tipo</label>
                                        <input
                                            type="number"
                                            value={form.codTipo ?? ''}
                                            onChange={(e) => setForm((f) => ({ ...f, codTipo: parseInt(e.target.value, 10) || undefined }))}
                                            className="w-full px-2 py-1 border border-gray-300 rounded bg-gray-50 text-center text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase text-center">Cód. Modelo</label>
                                        <input
                                            type="number"
                                            value={form.codModelo ?? ''}
                                            onChange={(e) => setForm((f) => ({ ...f, codModelo: parseInt(e.target.value, 10) || undefined }))}
                                            className="w-full px-2 py-1 border border-gray-300 rounded bg-gray-50 text-center text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase text-center">Cód. Origen</label>
                                        <input
                                            type="number"
                                            value={form.codOrigen ?? ''}
                                            onChange={(e) => setForm((f) => ({ ...f, codOrigen: parseInt(e.target.value, 10) || undefined }))}
                                            className="w-full px-2 py-1 border border-gray-300 rounded bg-gray-50 text-center text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-4">
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
