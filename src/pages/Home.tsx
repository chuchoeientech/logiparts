import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { productsApi, productImageUrl, type ProductApi } from '../api/products';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import Seo from '../components/Seo';
import { Package, ShoppingCart, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const fadeInUp = { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } };
const stagger = { animate: { transition: { staggerChildren: 0.08 } } };

function mapProduct(p: ProductApi): Product {
  return {
    ...p,
    name: p.descripcion || 'Sin nombre',
    description: p.description ?? '',
    price: Number(p.costoFinal),
    image_url: productImageUrl(p),
    category_id: p.categoryId,
    created_at: p.createdAt,
  };
}

function FeaturedProductCard({ product, index }: { product: Product; index: number }) {
  const formatPrice = (price: number) => new Intl.NumberFormat('es-PY').format(price);
  const { addItem } = useCart();
  const firstVehicle = product.vehicles?.[0];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="h-full"
    >
      <Link to={`/productos/${product.id}`} className="block group h-full">
        <motion.div
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden flex flex-col sm:flex-row h-full"
        >
          {/* Image */}
          <div className="relative w-full sm:w-52 shrink-0 aspect-[4/3] sm:aspect-auto bg-slate-50 flex items-center justify-center border-b sm:border-b-0 sm:border-r border-slate-100 overflow-hidden">
            <span className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-primary text-black text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow">
              <Tag size={10} />
              Oferta
            </span>
            {product.image_url ? (
              <motion.img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-300 p-8">
                <Package size={56} strokeWidth={1} />
                <span className="text-[10px] uppercase tracking-[0.2em] mt-3 font-bold opacity-60">Sin imágen</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Text */}
          <div className="flex-1 p-4 sm:p-6 flex flex-col gap-3 justify-between">
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold text-slate-900 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                {product.name}
              </h3>

              {firstVehicle && (
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2 py-1 rounded-lg">
                    {firstVehicle.nombreMarca}
                  </span>
                  <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2 py-1 rounded-lg">
                    {firstVehicle.nombreModelo}
                  </span>
                </div>
              )}

              <div className="flex flex-col gap-1 text-xs text-slate-500">
                {product.cantDisponible != null && (
                  <span>Stock: <span className="font-semibold text-slate-700">{product.cantDisponible} uds.</span></span>
                )}
                {product.codigoBarra && (
                  <span>Cód. barras: <span className="font-semibold text-slate-700">{product.codigoBarra}</span></span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-auto">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
                  {formatPrice(product.price)}
                </span>
                <span className="text-sm font-bold text-primary">Gs</span>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-brand hover:bg-primary hover:text-black text-white font-bold py-3 rounded-xl transition-all duration-300 text-sm flex items-center justify-center gap-2"
              >
                <ShoppingCart size={16} />
                Agregar al carrito
              </button>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
};

function OfertasCarousel({ products }: { products: Product[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const total = products.length;

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrent(c => (c + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrent(c => (c - 1 + total) % total);
  }, [total]);

  const goTo = useCallback((i: number, cur: number) => {
    setDirection(i > cur ? 1 : -1);
    setCurrent(i);
  }, []);

  useEffect(() => {
    if (paused || total <= 1) return;
    const id = setInterval(goNext, 4000);
    return () => clearInterval(id);
  }, [paused, total, goNext]);

  if (total === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No hay productos en oferta disponibles en este momento.</p>
      </div>
    );
  }

  const next = (current + 1) % total;

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      <div className="overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'tween', ease: 'easeInOut', duration: 0.35 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch"
          >
            <FeaturedProductCard product={products[current]} index={0} />
            {total > 1 && (
              <div className="hidden lg:block">
                <FeaturedProductCard product={products[next]} index={1} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      {total > 1 && (
        <div className="flex items-center justify-between mt-8">
          {/* Dots */}
          <div className="flex gap-2 items-center">
            {products.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, current)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? 'bg-primary w-8' : 'bg-slate-300 hover:bg-slate-400 w-2'
                }`}
              />
            ))}
          </div>
          {/* Arrows */}
          <div className="flex gap-2">
            <button
              onClick={goPrev}
              className="p-2.5 rounded-full border border-slate-200 hover:bg-primary hover:border-primary hover:text-black transition-all duration-200"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={goNext}
              className="p-2.5 rounded-full border border-slate-200 hover:bg-primary hover:border-primary hover:text-black transition-all duration-200"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const productsRes = await productsApi.getAll();
          if (!cancelled) {
            const all = productsRes.map(mapProduct);
            setFeaturedProducts(all.filter(p => p.isFeatured).slice(0, 6));
            setRecentProducts(all.slice(0, 6));
          }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Error al cargar');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <div style={{ marginTop: '80px' }}>
      <Seo
        title="Logisparts | Repuestos Automotrices en Paraguay"
        description="Distribuidor de repuestos automotrices originales y alternativos en Paraguay. Faros, parrillas, paragolpes, guardabarros y más, con los mejores precios del mercado."
        path="/"
      />
      {/* 1° — Productos en Oferta */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary font-bold text-sm uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              <Tag size={14} />
              Ofertas especiales
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Productos en Oferta</h2>
            <p className="text-gray-600 text-lg">Los repuestos más buscados por nuestros clientes</p>
          </motion.div>

          {loading && (
            <div className="text-center py-12 text-gray-500">Cargando...</div>
          )}
          {error && (
            <div className="text-center py-12 text-red-600">{error}</div>
          )}
          {!loading && !error && (
            <>
              <OfertasCarousel products={featuredProducts} />
              <div className="text-center mt-12">
                <Link
                  to="/productos"
                  className="inline-block bg-brand hover:bg-primary text-white hover:text-black font-bold px-8 py-4 rounded-lg text-lg transition-all duration-300"
                >
                  Ver Todos los Productos
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 2° — Banner */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative flex items-center justify-center bg-black py-16"
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1409999/pexels-photo-1409999.jpeg?auto=compress&cs=tinysrgb&w=1920)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-3 leading-tight"
          >
            Repuestos Originales y Alternativos<br />para tu Vehículo
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="text-lg text-gray-300 mb-8"
          >
            Calidad, confianza y los mejores precios del mercado
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/productos"
              className="bg-primary hover:bg-primary-dark text-black font-bold px-7 py-3 rounded-lg text-base transition-colors duration-300"
            >
              Ver Productos
            </Link>
            <Link
              to="/contacto"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-black font-bold px-7 py-3 rounded-lg text-base transition-all duration-300"
            >
              Contactar
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* 3° — Resto de Productos */}
      <section className="py-20 bg-light-gray">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nuestros Productos</h2>
            <p className="text-gray-600 text-lg">Encontrá el repuesto que necesitas</p>
          </motion.div>

          {loading && (
            <div className="text-center py-12 text-gray-500">Cargando productos...</div>
          )}
          {error && (
            <div className="text-center py-12 text-red-600">{error}</div>
          )}
          {!loading && !error && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8 items-stretch">
                {recentProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>

              {recentProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No hay productos disponibles en este momento.</p>
                </div>
              )}

              <div className="text-center mt-12">
                <Link
                  to="/productos"
                  className="inline-block bg-brand hover:bg-primary text-white hover:text-black font-bold px-8 py-4 rounded-lg text-lg transition-all duration-300"
                >
                  Ver Más Productos
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
