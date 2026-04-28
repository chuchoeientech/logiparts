import { useState } from 'react';
import { bulkApi, type BulkUploadResult, type BulkImagesResult, type BulkImageDetail } from '../../api/bulk';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Download, Images, ImageOff } from 'lucide-react';

export default function AdminBulkUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState<BulkUploadResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [imageResult, setImageResult] = useState<BulkImagesResult | null>(null);
    const [imageError, setImageError] = useState<string | null>(null);

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

    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImageFiles(Array.from(e.target.files));
            setImageResult(null);
            setImageError(null);
        }
    };

    const onUploadImages = async () => {
        if (imageFiles.length === 0) return;
        setUploadingImages(true);
        setImageError(null);
        try {
            const res = await bulkApi.uploadImages(imageFiles);
            setImageResult(res);
        } catch (e) {
            setImageError(e instanceof Error ? e.message : 'Error al subir las imágenes');
        } finally {
            setUploadingImages(false);
        }
    };

    const statusColor = (status: BulkImageDetail['status']) => {
        if (status === 'matched') return 'text-green-700 bg-green-50';
        if (status === 'unmatched') return 'text-yellow-700 bg-yellow-50';
        return 'text-red-700 bg-red-50';
    };

    const statusLabel = (status: BulkImageDetail['status']) => {
        if (status === 'matched') return 'Ligada';
        if (status === 'unmatched') return 'Sin producto';
        return 'Error';
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12">

            {/* ── Sección 1: Excel ── */}
            <div>
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Carga Masiva de Productos (Excel / CSV)</h1>
                        <p className="text-gray-600">Actualiza o crea productos masivamente usando un archivo de Excel o CSV.</p>
                    </div>
                    <a
                        href="#formato"
                        className="flex items-center gap-2 text-primary hover:underline font-semibold text-sm"
                        onClick={(e) => { e.preventDefault(); document.getElementById('formato')?.scrollIntoView({ behavior: 'smooth' }); }}
                    >
                        <Download size={18} />
                        Ver Formato Requerido
                    </a>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                    {!result ? (
                        <div className="space-y-6">
                            <div className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center transition-colors ${file ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'}`}>
                                <input type="file" id="excel-upload" className="hidden" accept=".xlsx, .xls, .csv" onChange={handleFileChange} />
                                <label htmlFor="excel-upload" className="cursor-pointer flex flex-col items-center">
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

                            <button onClick={onUpload} disabled={!file || uploading} className="w-full py-4 bg-primary text-black font-bold rounded-xl shadow-lg hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg">
                                {uploading ? (<><Loader2 size={24} className="animate-spin" />Procesando archivo...</>) : ('Comenzar Carga')}
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
                                                <tr><th className="px-4 py-2 border-b">Descripción / Error</th></tr>
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

                            <button onClick={() => { setResult(null); setFile(null); }} className="w-full py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors">
                                Cargar otro archivo
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Formato Excel ── */}
            <div id="formato" className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-gray-900 font-bold mb-4 flex items-center gap-2">
                        <FileText size={18} className="text-primary" />
                        Formato requerido del Excel
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="text-left px-4 py-2 font-bold text-gray-700">Columna</th>
                                    <th className="text-left px-4 py-2 font-bold text-gray-700">Requerida</th>
                                    <th className="text-left px-4 py-2 font-bold text-gray-700">Descripción</th>
                                    <th className="text-left px-4 py-2 font-bold text-gray-700">Ejemplo</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {[
                                    { col: 'DESCRIPCIÓN', req: true, desc: 'Nombre del repuesto', ej: 'FARO DEL RH TY HILUX 08-11 FP 08/19' },
                                    { col: 'PRECIO', req: true, desc: 'Precio de venta en Gs', ej: '420000' },
                                    { col: 'STOCK', req: true, desc: 'Cantidad disponible', ej: '3' },
                                    { col: 'CODIGO DE BARRA', req: false, desc: 'Código de barras del producto', ej: '17306176201096' },
                                    { col: 'MARCA', req: false, desc: 'Marca del vehículo compatible', ej: 'TOYOTA' },
                                    { col: 'MODELO', req: false, desc: 'Modelo del vehículo compatible', ej: 'HILUX' },
                                ].map(({ col, req, desc, ej }) => (
                                    <tr key={col} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-mono font-bold text-gray-900">{col}</td>
                                        <td className="px-4 py-3">
                                            {req
                                                ? <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">Sí</span>
                                                : <span className="bg-gray-100 text-gray-500 text-xs font-bold px-2 py-0.5 rounded-full">No</span>
                                            }
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{desc}</td>
                                        <td className="px-4 py-3 font-mono text-gray-500 text-xs">{ej}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6">
                    <h3 className="text-blue-900 font-bold mb-2">Reglas de actualización</h3>
                    <ul className="text-blue-800 text-sm space-y-2 list-disc list-inside">
                        <li>Si ya existe un producto con el mismo <strong>Código de Barra</strong>, se actualiza.</li>
                        <li>Si no hay código de barra pero coincide la <strong>Descripción</strong>, también se actualiza.</li>
                        <li>Si no existe ninguna coincidencia, se crea un producto nuevo.</li>
                        <li>Los vehículos (Marca + Modelo) se crean automáticamente si no existen.</li>
                    </ul>
                </div>
            </div>

            {/* ── Sección 2: Imágenes ── */}
            <div>
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Carga Masiva de Imágenes</h2>
                    <p className="text-gray-600">Subí múltiples imágenes a la vez. El nombre del archivo debe coincidir con el <strong>código de barras</strong> del producto.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                    {!imageResult ? (
                        <div className="space-y-6">
                            <div className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center transition-colors ${imageFiles.length > 0 ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'}`}>
                                <input type="file" id="images-upload" className="hidden" accept="image/jpeg,image/png,image/webp,image/gif" multiple onChange={handleImagesChange} />
                                <label htmlFor="images-upload" className="cursor-pointer flex flex-col items-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                                        {imageFiles.length > 0 ? <Images size={32} className="text-primary" /> : <Upload size={32} />}
                                    </div>
                                    <span className="text-lg font-semibold text-gray-900">
                                        {imageFiles.length > 0
                                            ? `${imageFiles.length} imagen${imageFiles.length !== 1 ? 'es' : ''} seleccionada${imageFiles.length !== 1 ? 's' : ''}`
                                            : 'Haz clic o arrastra las imágenes'}
                                    </span>
                                    <span className="text-sm text-gray-500 mt-1">JPEG, PNG, WebP o GIF · Máx. 5 MB por imagen</span>
                                </label>
                            </div>

                            {imageFiles.length > 0 && (
                                <div className="border border-gray-100 rounded-xl overflow-hidden">
                                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-100">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Archivos seleccionados</p>
                                    </div>
                                    <div className="max-h-48 overflow-y-auto divide-y divide-gray-50">
                                        {imageFiles.map((f, i) => (
                                            <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                                                <img src={URL.createObjectURL(f)} alt="" className="w-10 h-10 object-cover rounded-lg border border-gray-100 shrink-0" />
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-gray-800 truncate">{f.name}</p>
                                                    <p className="text-xs text-gray-400">Código: <span className="font-mono font-bold">{f.name.replace(/\.[^.]+$/, '')}</span></p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {imageError && (
                                <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 text-red-700">
                                    <AlertCircle size={20} className="shrink-0 mt-0.5" />
                                    <p className="text-sm">{imageError}</p>
                                </div>
                            )}

                            <button onClick={onUploadImages} disabled={imageFiles.length === 0 || uploadingImages} className="w-full py-4 bg-primary text-black font-bold rounded-xl shadow-lg hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg">
                                {uploadingImages ? (<><Loader2 size={24} className="animate-spin" />Procesando imágenes...</>) : ('Subir Imágenes')}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle size={32} />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Proceso Completado</h2>
                                <p className="text-gray-600 mt-1">Se procesaron {imageResult.total} imagen{imageResult.total !== 1 ? 'es' : ''}.</p>

                                <div className="grid grid-cols-3 gap-4 w-full mt-6">
                                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                        <p className="text-3xl font-bold text-green-600">{imageResult.matched}</p>
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Ligadas</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                        <p className="text-3xl font-bold text-yellow-500">{imageResult.unmatched}</p>
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Sin producto</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                        <p className="text-3xl font-bold text-red-600">{imageResult.errors}</p>
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Errores</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="font-bold text-gray-900">Detalle por imagen</h3>
                                <div className="max-h-80 overflow-y-auto border border-gray-100 rounded-xl bg-white divide-y divide-gray-50">
                                    {imageResult.details.map((d, i) => (
                                        <div key={i} className="flex items-center gap-3 px-4 py-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${d.status === 'matched' ? 'bg-green-100' : d.status === 'unmatched' ? 'bg-yellow-100' : 'bg-red-100'}`}>
                                                {d.status === 'matched'
                                                    ? <CheckCircle size={16} className="text-green-600" />
                                                    : <ImageOff size={16} className={d.status === 'unmatched' ? 'text-yellow-600' : 'text-red-600'} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-mono font-bold text-gray-700 truncate">{d.filename}</p>
                                                {d.descripcion && <p className="text-xs text-gray-400 truncate">{d.descripcion}</p>}
                                                {d.message && <p className="text-xs text-red-500">{d.message}</p>}
                                            </div>
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full shrink-0 ${statusColor(d.status)}`}>
                                                {statusLabel(d.status)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button onClick={() => { setImageResult(null); setImageFiles([]); }} className="w-full py-3 border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors">
                                Cargar otras imágenes
                            </button>
                        </div>
                    )}
                </div>

                <div className="mt-6 bg-blue-50 border border-blue-100 rounded-2xl p-6">
                    <h3 className="text-blue-900 font-bold mb-2">Como funciona</h3>
                    <ul className="text-blue-800 text-sm space-y-2 list-disc list-inside">
                        <li>El nombre del archivo (sin extensión) debe ser igual al <strong>Código de Barras</strong> del producto.</li>
                        <li>Ejemplo: si el código de barras es <code className="font-mono bg-blue-100 px-1 rounded">123456</code>, el archivo debe llamarse <code className="font-mono bg-blue-100 px-1 rounded">123456.jpg</code></li>
                        <li>Si el producto ya tenía imagen, será reemplazada.</li>
                        <li>Las imágenes sin producto coincidente quedan marcadas como <strong>Sin producto</strong>.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
