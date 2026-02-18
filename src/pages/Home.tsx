import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { categoriesApi, categoryImageUrl, type CategoryApi } from '../api/categories';
import { productsApi, productImageUrl, type ProductApi } from '../api/products';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';

const fadeInUp = { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } };
const stagger = { animate: { transition: { staggerChildren: 0.08 } } };

function mapProduct(p: ProductApi): Product {
  return {
    id: p.id,
    name: p.title,
    description: p.description ?? '',
    price: Number(p.price),
    image_url: productImageUrl(p) ?? 'https://images.pexels.com/photos/3806248/pexels-photo-3806248.jpeg?auto=compress&cs=tinysrgb&w=600',
    category_id: p.categoryId,
    is_featured: p.isFeatured,
    created_at: p.createdAt,
  };
}

export default function Home() {
  const [categories, setCategories] = useState<CategoryApi[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          categoriesApi.getAll(),
          productsApi.getAll({ featured: true }),
        ]);
        if (!cancelled) {
          setCategories(categoriesRes);
          setFeaturedProducts(productsRes.map(mapProduct).slice(0, 6));
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
    <div>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative flex items-center justify-center bg-gradient-to-r from-[#111111] to-[#1A1A1A]"
        style={{ marginTop: '80px', minHeight: 'calc(100vh - 80px)' }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1409999/pexels-photo-1409999.jpeg?auto=compress&cs=tinysrgb&w=1920)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></div>

        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold mb-6 leading-tight"
          >
            Repuestos Originales y Alternativos<br />para tu Vehículo
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="text-xl md:text-2xl mb-10 text-gray-300"
          >
            Calidad, confianza y los mejores precios del mercado
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/productos"
              className="bg-primary hover:bg-[#D9A504] text-black font-bold px-8 py-4 rounded-lg text-lg transition-colors duration-300"
            >
              Ver Productos
            </Link>
            <Link
              to="/contacto"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-black font-bold px-8 py-4 rounded-lg text-lg transition-all duration-300"
            >
              Contactar
            </Link>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-12" variants={fadeInUp}>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Productos Destacados</h2>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>

              {featuredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">No hay productos destacados disponibles en este momento.</p>
                </div>
              )}

              <motion.div className="text-center mt-12" variants={fadeInUp}>
                <Link
                  to="/productos"
                  className="inline-block bg-[#111111] hover:bg-primary text-white hover:text-black font-bold px-8 py-4 rounded-lg text-lg transition-all duration-300"
                >
                  Ver Todos los Productos
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </motion.section>

      <motion.section
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: '-80px' }}
        variants={stagger}
        className="py-20 bg-light-gray"
      >
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-12" variants={fadeInUp}>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nuestras Categorías</h2>
            <p className="text-gray-600 text-lg">Encuentra el repuesto que necesitas</p>
          </motion.div>

          {loading && (
            <div className="text-center py-12 text-gray-500">Cargando categorías...</div>
          )}
          {error && (
            <div className="text-center py-12 text-red-600">{error}</div>
          )}
          {!loading && !error && (
            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8" variants={stagger}>
              {categories.map((category, index) => (
                <motion.div key={category.id} variants={fadeInUp}>
                  <CategoryCard
                    name={category.name}
                    slug={category.slug}
                    imageUrl={categoryImageUrl(category) ?? 'https://images.pexels.com/photos/3806248/pexels-photo-3806248.jpeg?auto=compress&cs=tinysrgb&w=1200'}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
          {!loading && !error && categories.length === 0 && (
            <div className="text-center py-12 text-gray-600">No hay categorías cargadas.</div>
          )}
        </div>
      </motion.section>
    </div>
  );
}
