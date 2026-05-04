import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle, Package, Barcode, Tag, Car } from 'lucide-react';
import { productsApi, productImageUrl, type ProductApi } from '../api/products';

function Producto() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const p = await productsApi.getOne(id!);
        if (!cancelled) setProduct(p);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Error al cargar el producto');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [id]);

  const formatPrice = (price: number) => new Intl.NumberFormat('es-PY').format(price);

  const handleConsultar = () => {
    if (!product) return;

    const lines: string[] = [
      `Hola! Estoy interesado en el siguiente repuesto:`,
      ``,
      `📦 *Producto:* ${product.descripcion || product.name}`,
      `💰 *Precio:* Gs. ${formatPrice(Number(product.costoFinal || product.price || 0))}`,
      `📊 *Stock disponible:* ${product.cantDisponible != null ? `${product.cantDisponible} uds.` : 'N/A'}`,
    ];

    if (product.codigoBarra) {
      lines.push(`🔢 *Código de barras:* ${product.codigoBarra}`);
    }
    if (product.category?.name) {
      lines.push(`🏷️ *Categoría:* ${product.category.name}`);
    }
    if (product.vehicles && product.vehicles.length > 0) {
      const vehicleList = product.vehicles
        .map(v => `${v.nombreMarca} ${v.nombreModelo}${v.anio ? ` (${v.anio})` : ''}`)
        .join(', ');
      lines.push(`🚗 *Vehículos compatibles:* ${vehicleList}`);
    }

    lines.push(``, `¿Está disponible para la venta?`);

    const whatsappUrl = `https://wa.me/595981234567?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center" style={{ marginTop: '80px' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-500 text-lg">
          Cargando producto...
        </motion.div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-20 text-center"
        style={{ marginTop: '80px' }}
      >
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{error ?? 'Producto no encontrado'}</h1>
        <Link to="/productos" className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">
          <ArrowLeft size={20} />
          Volver a productos
        </Link>
      </motion.div>
    );
  }

  const imageUrl = productImageUrl(product);
  const firstVehicle = product.vehicles?.[0];
  const marca = firstVehicle?.nombreMarca ?? null;
  const modelo = firstVehicle?.nombreModelo ?? null;

  const tiles = [
    { label: 'Stock', value: product.cantDisponible != null ? `${product.cantDisponible} uds.` : 'N/A', icon: <Package size={20} /> },
    { label: 'Código de Barras', value: product.codigoBarra || 'N/A', icon: <Barcode size={20} /> },
    { label: 'Marca', value: marca || 'N/A', icon: <Tag size={20} /> },
    { label: 'Modelo', value: modelo || 'N/A', icon: <Car size={20} /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-[#F8FAFC]"
      style={{ marginTop: '80px', minHeight: 'calc(100vh - 80px)' }}
    >
      <div className="container mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Link
            to="/productos"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-primary font-medium transition-all group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Volver a productos
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 max-w-7xl mx-auto">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="relative group"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden aspect-square sticky top-28">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={product.descripcion || product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full bg-slate-50 text-slate-300">
                  <Package size={80} strokeWidth={1} />
                  <span className="text-xs uppercase tracking-[0.2em] mt-4 font-bold opacity-60">Sin imágen</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="flex flex-col lg:py-4"
          >
            <div className="flex flex-col gap-4 mb-8">
              <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-[1.15]">
                {product.descripcion || product.name}
              </h1>
              <div className="flex items-center gap-3">
                <div className="text-4xl md:text-5xl font-black text-primary tracking-tight">
                  {formatPrice(Number(product.costoFinal || product.price || 0))}
                  <span className="text-xl md:text-2xl ml-1 font-bold">Gs</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-10">
              {tiles.map(({ label, value, icon }) => (
                <div key={label} className="bg-white border border-slate-200 p-4 rounded-xl flex items-center gap-4 shadow-sm">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                    {icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none mb-1">{label}</p>
                    <p className="text-slate-900 font-bold text-base leading-none truncate">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.01, translateY: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleConsultar}
                className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-extrabold px-8 py-5 rounded-2xl text-lg transition-all flex items-center justify-center gap-4 shadow-xl shadow-green-500/20"
              >
                <MessageCircle size={24} />
                Consultar Disponibilidad
              </motion.button>
              <p className="text-slate-400 text-sm mt-4 text-center font-medium">
                Respondemos de inmediato por <span className="text-green-600 font-bold">WhatsApp</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default Producto;
