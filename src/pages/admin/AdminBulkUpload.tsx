import { useState } from 'react';
import { bulkApi, type BulkUploadResult } from '../../api/bulk';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Download } from 'lucide-react';

export default function AdminBulkUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState<BulkUploadResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
            setResult(null);
            setError(null);
        }
    };

    const onUpload = async () => {
        if (!file) return;
        setUploading(true);
        setError(null);
        try {
            const res = await bulkApi.uploadProducts(file);
            setResult(res);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Error al subir el archivo');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Carga Masiva (Excel / CSV)</h1>
                    <p className="text-gray-600">Actualiza o crea productos masivamente usando un archivo de Excel o CSV.</p>
                </div>
                <a
                    href="#"
                    className="flex items-center gap-2 text-primary hover:underline font-semibold text-sm"
                    onClick={(e) => {
                        e.preventDefault();
                        alert('Columnas requeridas:\n- descripcion\n- codigo_importacion\n- costo_final\n- cant_disponible\n- cod_linea\n- nombre_marca\n- nombre_modelo\n- anio\n\nEl sistema usará estas columnas para identificar y actualizar los productos, categorías y vehículos automáticamente.');
                    }}
                >
                    <Download size={18} />
                    Ver Formato Requerido
                </a>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                {!result ? (
                    <div className="space-y-6">
                        <div
                            className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center transition-colors ${file ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'
                                }`}
                        >
                            <input
                                type="file"
                                id="excel-upload"
                                className="hidden"
                                accept=".xlsx, .xls, .csv"
                                onChange={handleFileChange}
                            />
                            <label
                                htmlFor="excel-upload"
                                className="cursor-pointer flex flex-col items-center"
                            >
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                                    {file ? <FileText size={32} className="text-primary" /> : <Upload size={32} />}
                                </div>
                                <span className="text-lg font-semibold text-gray-900">
                                    {file ? file.name : 'Haz clic o arrastra un archivo Excel o CSV'}
                                </span>
                                <span className="text-sm text-gray-500 mt-1">Soporta .xlsx, .xls y .csv</span>
                            </label>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 text-red-700">
                                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                                <p className="text-sm">{error}</p>
                            </div>
                        )}

                        <button
                            onClick={onUpload}
                            disabled={!file || uploading}
                            className="w-full py-4 bg-primary text-black font-bold rounded-xl shadow-lg hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                        >
                            {uploading ? (
                                <>
                                    <Loader2 size={24} className="animate-spin" />
                                    Procesando archivo...
                                </>
                            ) : (
                                'Comenzar Carga'
                            )}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle size={32} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Proceso Completado</h2>
                            <p className="text-gray-600 mt-1">Se han procesado {result.total} filas del archivo.</p>

                            <div className="grid grid-cols-2 gap-4 w-full mt-6">
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                    <p className="text-3xl font-bold text-green-600">{result.success}</p>
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Exitosos</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                    <p className="text-3xl font-bold text-red-600">{result.errors.length}</p>
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Errores</p>
                                </div>
                            </div>
                        </div>

                        {result.errors.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                    <AlertCircle size={18} className="text-red-500" />
                                    Detalle de errores
                                </h3>
                                <div className="max-h-60 overflow-y-auto border border-gray-100 rounded-lg bg-white">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-50 sticky top-0">
                                            <tr>
                                                <th className="px-4 py-2 border-b">Descripción / Error</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {result.errors.map((err, i) => (
                                                <tr key={i} className="border-b last:border-0">
                                                    <td className="px-4 py-3 text-red-600 font-medium">{err}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => {
                                setResult(null);
                                setFile(null);
                            }}
                            className="w-full py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Cargar otro archivo
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-6">
                <h3 className="text-blue-900 font-bold mb-2 flex items-center gap-2">
                    💡 Recordatorio
                </h3>
                <ul className="text-blue-800 text-sm space-y-2 list-disc list-inside">
                    <li>El sistema busca productos existentes por <strong>Código de Importación</strong> o <strong>Descripción</strong>.</li>
                    <li>Si el producto existe, se actualizan sus precios y stock. Si no, se crea uno nuevo.</li>
                    <li>Las categorías se identifican por el <strong>Cód. Línea</strong>. Si no existen, se crean.</li>
                    <li>Los vehículos se identifican por Marca, Modelo y Año. Si no existen, se crean.</li>
                </ul>
            </div>
        </div>
    );
}
