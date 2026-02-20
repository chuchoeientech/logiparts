import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle, Package, Shield, Settings, Car } from 'lucide-react';
import { productsApi, productImageUrl, type ProductApi } from '../api/products';
import { categoriesApi, type CategoryApi } from '../api/categories';

function Producto() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductApi | null>(null);
  const [category, setCategory] = useState<CategoryApi | null>(null);
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
        if (!cancelled) {
          setProduct(p);
          if (p.categoryId) {
            const categories = await categoriesApi.getAll();
            const cat = categories.find((c) => c.id === p.categoryId);
            setCategory(cat ?? null);
          } else {
            setCategory(null);
          }
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Error al cargar el producto');
        }
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
    const message = `Hola, estoy interesado en este producto: ${product.descripcion || product.name}`;
    const whatsappUrl = `https://wa.me/595981234567?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center" style={{ marginTop: '80px' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-500 text-lg"
        >
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
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {error ?? 'Producto no encontrado'}
        </h1>
        <Link
          to="/productos"
          className="inline-flex items-center gap-2 text-primary hover:underline font-semibold"
        >
          <ArrowLeft size={20} />
          Volver a productos
        </Link>
      </motion.div>
    );
  }

  const imageUrl = productImageUrl(product);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-light-gray"
      style={{ marginTop: '80px', minHeight: 'calc(100vh - 80px)' }}
    >
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Link
            to="/productos"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary font-medium transition-colors"
          >
            <ArrowLeft size={20} />
            Volver a productos
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="aspect-square bg-gray-100 flex items-center justify-center">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={product.descripcion || product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <Package size={120} strokeWidth={1} />
                  <span className="text-sm uppercase tracking-widest mt-4 font-bold opacity-50">Sin imágen</span>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="flex flex-col"
          >
            {category && (
              <Link
                to={`/productos?categoria=${category.slug}`}
                className="text-primary font-semibold text-sm mb-2 hover:underline w-fit"
              >
                {category.name}
              </Link>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {product.descripcion || product.name}
            </h1>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-bold text-primary">
                {formatPrice(Number(product.costoFinal || product.price || 0))}
              </span>
              <span className="text-primary font-bold">Gs</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-100 p-3 rounded-lg flex items-center gap-3">
                <Package className="text-primary" size={20} />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Stock</p>
                  <p className="text-gray-900 font-semibold">{product.cantDisponible} unidades</p>
                </div>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg flex items-center gap-3">
                <Shield className="text-primary" size={20} />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Código</p>
                  <p className="text-gray-900 font-semibold">{product.codigoImportacion || 'N/A'}</p>
                </div>
              </div>
            </div>
            {product.description && (
              <div className="text-gray-700 leading-relaxed mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Settings size={20} /> Descripción
                </h3>
                <p className="whitespace-pre-wrap">{product.description}</p>
              </div>
            )}

            {product.vehicles && product.vehicles.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Car size={20} /> Vehículos Compatibles
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.vehicles.map((v) => (
                    <span
                      key={v.id}
                      className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-700"
                    >
                      {v.nombreMarca} {v.nombreModelo} ({v.anio})
                    </span>
                  ))}
                </div>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleConsultar}
              className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold px-8 py-4 rounded-lg text-lg transition-colors flex items-center justify-center gap-3 shadow-lg"
            >
              <MessageCircle size={24} />
              Consultar por WhatsApp
            </motion.button>

            <p className="text-gray-500 text-sm mt-4 text-center">
              Respondemos a la brevedad con disponibilidad y detalles de entrega.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default Producto;
