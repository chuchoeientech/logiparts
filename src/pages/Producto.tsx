import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Package, Barcode, Tag, Car, ShoppingCart } from 'lucide-react';
import { productsApi, productImageUrl, type ProductApi } from '../api/products';
import { useCart } from '../contexts/CartContext';
import { Product } from '../types';
import CheckoutModal from '../components/CheckoutModal';
import Seo from '../components/Seo';

function Producto() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const { addItem, closeCart, items } = useCart();

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

  const mapProduct = (): Product => ({
    ...product!,
    name: product!.descripcion || product!.name || 'Sin nombre',
    price: Number(product!.costoFinal || product!.price || 0),
    image_url: productImageUrl(product!),
    description: product!.description ?? '',
    category_id: product!.categoryId,
    created_at: product!.createdAt,
  });

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

  const cartQty = items.find((i) => i.product.id === product.id)?.quantity ?? 0;
  const outOfStock = product.cantDisponible != null && product.cantDisponible <= 0;
  const atMax = product.cantDisponible != null && cartQty >= product.cantDisponible;
  const stockDisabled = outOfStock || atMax;

  const tiles = [
    { label: 'Stock', value: product.cantDisponible != null ? `${product.cantDisponible} uds.` : 'N/A', icon: <Package size={20} /> },
    { label: 'Código de Barras', value: product.codigoBarra || 'N/A', icon: <Barcode size={20} /> },
    { label: 'Marca', value: marca || 'N/A', icon: <Tag size={20} /> },
    { label: 'Modelo', value: modelo || 'N/A', icon: <Car size={20} /> },
  ];

  const productName = product.descripcion || product.name || 'Repuesto';
  const productPrice = Number(product.costoFinal || product.price || 0);
  const productDescription =
    product.description ||
    `${productName}${marca ? ` para ${marca}${modelo ? ` ${modelo}` : ''}` : ''}. Disponible en Logisparts, repuestos automotrices en Paraguay.`;
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productName,
    description: productDescription,
    ...(imageUrl ? { image: imageUrl } : {}),
    ...(product.codigoBarra ? { sku: product.codigoBarra, gtin: product.codigoBarra } : {}),
    ...(marca ? { brand: { '@type': 'Brand', name: marca } } : {}),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'PYG',
      price: productPrice,
      availability: outOfStock
        ? 'https://schema.org/OutOfStock'
        : 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'Logisparts' },
    },
  };

  return (
    <>
    <Seo
      title={productName}
      description={productDescription}
      path={`/productos/${product.id}`}
      image={imageUrl || undefined}
      type="product"
    />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
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

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 max-w-5xl mx-auto">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="relative group"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden aspect-square max-h-[400px] sticky top-28">
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
            <div className="flex flex-col gap-3 mb-5">
              <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 leading-[1.15]">
                {product.descripcion || product.name}
              </h1>
              <div className="flex items-center gap-3">
                <div className="text-2xl md:text-3xl font-black text-primary tracking-tight">
                  {formatPrice(Number(product.costoFinal || product.price || 0))}
                  <span className="text-sm md:text-base ml-1 font-bold">Gs</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {tiles.map(({ label, value, icon }) => (
                <div key={label} className="bg-white border border-slate-200 p-3 rounded-xl flex items-center gap-3 shadow-sm">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                    {icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none mb-1">{label}</p>
                    <p className="text-slate-900 font-bold text-base leading-none truncate">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <motion.button
                whileHover={!stockDisabled ? { scale: 1.01, translateY: -2 } : {}}
                whileTap={!stockDisabled ? { scale: 0.98 } : {}}
                onClick={() => { if (!stockDisabled) addItem(mapProduct()); }}
                disabled={stockDisabled}
                className={`w-full font-extrabold px-6 py-3 rounded-2xl text-base transition-all flex items-center justify-center gap-3 ${stockDisabled ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' : 'bg-primary hover:bg-primary-dark text-black shadow-xl shadow-yellow-500/20'}`}
              >
                <ShoppingCart size={20} />
                {outOfStock ? 'Sin stock' : atMax ? 'Límite de stock alcanzado' : 'Agregar al Carrito'}
              </motion.button>

              <motion.button
                whileHover={!stockDisabled ? { scale: 1.01, translateY: -2 } : {}}
                whileTap={!stockDisabled ? { scale: 0.98 } : {}}
                onClick={() => { if (!stockDisabled) { addItem(mapProduct()); closeCart(); setShowCheckout(true); } }}
                disabled={stockDisabled}
                className={`w-full font-extrabold px-6 py-3 rounded-2xl text-base transition-all flex items-center justify-center gap-3 ${stockDisabled ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' : 'text-white shadow-xl shadow-blue-900/20'}`}
                style={!stockDisabled ? { backgroundColor: '#1B2A6B' } : {}}
                onMouseEnter={e => { if (!stockDisabled) e.currentTarget.style.backgroundColor = '#16235a'; }}
                onMouseLeave={e => { if (!stockDisabled) e.currentTarget.style.backgroundColor = '#1B2A6B'; }}
              >
                <ShoppingBag size={20} />
                {outOfStock ? 'Sin stock' : atMax ? 'Límite de stock alcanzado' : 'Realizar Compra'}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>

    <AnimatePresence>
      {showCheckout && <CheckoutModal onClose={() => setShowCheckout(false)} />}
    </AnimatePresence>
  </>
  );
}

export default Producto;
