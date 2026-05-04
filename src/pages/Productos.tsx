import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { categoriesApi, type CategoryApi } from '../api/categories';
import { productsApi, productImageUrl, type ProductApi } from '../api/products';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { ChevronLeft, ChevronRight, Car, Filter, X, Package, Search, Layers } from 'lucide-react';
import { vehiclesApi, type VehicleApi } from '../api/vehicles';

function mapProduct(p: ProductApi): Product {
  return {
    ...p,
    name: p.descripcion || 'Sin nombre',
    price: Number(p.costoFinal),
    image_url: productImageUrl(p),
    description: p.description || '',
    category_id: p.categoryId,
    created_at: p.createdAt,
  };
}

export default function Productos() {
  const [searchParams] = useSearchParams();
  const categoriaSlug = searchParams.get('categoria');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryApi[]>([]);
  const [vehicles, setVehicles] = useState<VehicleApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const productsPerPage = 12;

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [categoriesRes, productsRes, vehiclesRes] = await Promise.all([
          categoriesApi.getAll(),
          productsApi.getAll(),
          vehiclesApi.getAll(),
        ]);
        if (!cancelled) {
          setCategories(categoriesRes.sort((a, b) => a.name.localeCompare(b.name)));
          setVehicles(vehiclesRes);
          setProducts(
            productsRes
              .map(mapProduct)
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          );
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Error al cargar productos');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const categoryIdFromSlug = useMemo(() => {
    if (!categoriaSlug) return null;
    const cat = categories.find((c) => c.slug === categoriaSlug);
    return cat?.id ?? null;
  }, [categoriaSlug, categories]);

  useEffect(() => {
    if (categoryIdFromSlug) setSelectedCategoryId(categoryIdFromSlug);
  }, [categoryIdFromSlug]);

  const priceStats = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 0, bins: [], maxDensity: 0 };
    const prices = products.map(p => p.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    const binCount = 20;
    const range = max - min;
    const binSize = range / binCount || 1;
    const bins = Array(binCount).fill(0);

    products.forEach(p => {
      const binIndex = Math.min(Math.floor((p.price - min) / binSize), binCount - 1);
      if (binIndex >= 0) bins[binIndex]++;
    });

    const maxDensity = Math.max(...bins);
    return { min, max, bins, maxDensity };
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = searchQuery.toLowerCase();
      const matchSearch = !searchQuery ||
        p.name.toLowerCase().includes(q) ||
        (p.codigoBarra?.toLowerCase().includes(q) ?? false) ||
        (p.vehicles?.some(
          v => v.nombreMarca.toLowerCase().includes(q) || v.nombreModelo.toLowerCase().includes(q)
        ) ?? false);

      const matchCategory = selectedCategoryId === 'all' || p.categoryId === selectedCategoryId;
      const matchVehicle = selectedVehicleId === 'all' || p.vehicles?.some(v => v.id === selectedVehicleId);

      const price = Number(p.price);
      const matchMinPrice = !minPrice || price >= Number(minPrice);
      const matchMaxPrice = !maxPrice || price <= Number(maxPrice);

      return matchSearch && matchCategory && matchVehicle && matchMinPrice && matchMaxPrice;
    });
  }, [products, searchQuery, selectedCategoryId, selectedVehicleId, minPrice, maxPrice]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const FiltersContent = () => (
    <div className="flex flex-col gap-10">
      {/* Search Filter (Inside Mobile Drawer or Desktop Sidebar) */}
      <div className="lg:hidden">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Buscar</h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Nombre, código, marca o modelo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/50"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        </div>
      </div>

      <div>
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Categoría</h3>
        <div className="relative group">
          <select
            value={selectedCategoryId}
            onChange={(e) => {
              setSelectedCategoryId(e.target.value);
              setCurrentPage(1);
              if (window.innerWidth < 1024) setIsFilterOpen(false);
            }}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none cursor-pointer transition-all"
          >
            <option value="all">Todas las categorías</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Vehículo</h3>
        <div className="relative group">
          <select
            value={selectedVehicleId}
            onChange={(e) => {
              setSelectedVehicleId(e.target.value);
              setCurrentPage(1);
              if (window.innerWidth < 1024) setIsFilterOpen(false);
            }}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none cursor-pointer transition-all"
          >
            <option value="all">Todos los vehículos</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.nombreMarca} {v.nombreModelo} ({v.anio})
              </option>
            ))}
          </select>
          <Car className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Rango de Precio</h3>

        <div className="relative mb-8 pt-2 select-none">
          {/* Price Distribution (Histogram) */}
          <div className="flex items-end gap-[2px] h-10 mb-5 px-1">
            {priceStats.bins.map((count, i) => {
              const binMin = priceStats.min + (i * (priceStats.max - priceStats.min) / 20);
              const binMax = priceStats.min + ((i + 1) * (priceStats.max - priceStats.min) / 20);
              const isInRange = (!minPrice || binMax >= Number(minPrice)) && (!maxPrice || binMin <= Number(maxPrice));

              return (
                <div
                  key={i}
                  className={`flex-1 rounded-t-sm transition-all duration-300 ${isInRange ? 'bg-primary' : 'bg-slate-100'
                    }`}
                  style={{
                    height: `${count === 0 ? 2 : (count / priceStats.maxDensity) * 100}%`,
                    opacity: isInRange ? 1 : 0.3
                  }}
                />
              );
            })}
          </div>

          {/* Custom Interactive Slider Track */}
          <div className="relative h-1.5 bg-slate-100 rounded-full mx-1" id="price-rail">
            {/* Active Range Fill */}
            <div
              className="absolute h-full bg-primary rounded-full transition-all duration-75"
              style={{
                left: `${((Number(minPrice) || priceStats.min) - priceStats.min) / (priceStats.max - priceStats.min || 1) * 100}%`,
                right: `${100 - ((Number(maxPrice) || priceStats.max) - priceStats.min) / (priceStats.max - priceStats.min || 1) * 100}%`
              }}
            />

            {/* Range Handles using Framer Motion */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-8">
              {/* Min Handle */}
              <motion.div
                drag="x"
                dragMomentum={false}
                dragElastic={0}
                onDrag={(_, info) => {
                  const rail = document.getElementById('price-rail');
                  if (!rail) return;
                  const rect = rail.getBoundingClientRect();
                  const percent = Math.max(0, Math.min(100, ((info.point.x - rect.left) / rect.width) * 100));
                  const newValue = Math.round(priceStats.min + (percent * (priceStats.max - priceStats.min)) / 100);
                  const currentMax = Number(maxPrice) || priceStats.max;
                  if (newValue < currentMax) setMinPrice(newValue.toString());
                }}
                className="absolute w-6 h-6 bg-white border-2 border-primary rounded-full shadow-lg z-30 cursor-grab active:cursor-grabbing flex items-center justify-center -ml-3"
                style={{
                  left: `${((Number(minPrice) || priceStats.min) - priceStats.min) / (priceStats.max - priceStats.min || 1) * 100}%`,
                  x: 0 // Reset motion x to use absolute left positioning with state
                }}
              >
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              </motion.div>

              {/* Max Handle */}
              <motion.div
                drag="x"
                dragMomentum={false}
                dragElastic={0}
                onDrag={(_, info) => {
                  const rail = document.getElementById('price-rail');
                  if (!rail) return;
                  const rect = rail.getBoundingClientRect();
                  const percent = Math.max(0, Math.min(100, ((info.point.x - rect.left) / rect.width) * 100));
                  const newValue = Math.round(priceStats.min + (percent * (priceStats.max - priceStats.min)) / 100);
                  const currentMin = Number(minPrice) || priceStats.min;
                  if (newValue > currentMin) setMaxPrice(newValue.toString());
                }}
                className="absolute w-6 h-6 bg-white border-2 border-primary rounded-full shadow-lg z-30 cursor-grab active:cursor-grabbing flex items-center justify-center -ml-3"
                style={{
                  left: `${((Number(maxPrice) || priceStats.max) - priceStats.min) / (priceStats.max - priceStats.min || 1) * 100}%`,
                  x: 0 // Reset motion x to use absolute left positioning with state
                }}
              >
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              </motion.div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">$</span>
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => {
                setMinPrice(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-7 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          <span className="text-slate-300">-</span>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">$</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-7 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          setSearchQuery('');
          setSelectedCategoryId('all');
          setSelectedVehicleId('all');
          setMinPrice('');
          setMaxPrice('');
        }}
        className="text-xs font-bold text-slate-400 hover:text-primary transition-colors text-left"
      >
        Limpiar todos los filtros
      </button>
    </div>
  );

  return (
    <div
      className="bg-[#F8FAFC] overflow-x-hidden"
      style={{ marginTop: '80px', minHeight: 'calc(100vh - 80px)' }}
    >
      <div className="bg-slate-900 overflow-hidden relative border-b border-primary/20">
        <div className="absolute inset-0 bg-primary/5 pattern-grid-lg" />
        <div className="container mx-auto px-4 py-16 md:py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              Catálogo de <span className="text-primary italic">Repuestos</span>
            </h1>

            {/* Desktop Search Bar */}
            <div className="hidden lg:flex items-center gap-4 max-w-2xl bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Nombre, código, marca o modelo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent pl-12 pr-4 py-3 text-white placeholder-slate-400 font-bold outline-none"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={24} />
              </div>
              <button className="bg-primary text-black font-black px-8 py-3 rounded-xl hover:scale-105 transition-transform active:scale-95">
                Buscar
              </button>
            </div>

            <p className="text-slate-400 text-sm mt-4 lg:hidden">
              Usa el botón de filtrar para buscar por nombre o categoría.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:w-72 flex-shrink-0">
            <div className="sticky top-28 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <FiltersContent />
            </div>
          </aside>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex items-center justify-between mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <p className="text-slate-500 font-bold text-sm">
              {filteredProducts.length} productos
            </p>
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm active:scale-95 transition-all"
            >
              <Filter size={18} />
              Filtrar
            </button>
          </div>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="hidden lg:flex justify-between items-center mb-8 pb-6 border-b border-slate-200">
              <h2 className="text-slate-400 font-bold text-sm tracking-widest uppercase">
                Mostrando <span className="text-slate-900">{indexOfFirstProduct + 1}–{Math.min(indexOfLastProduct, filteredProducts.length)}</span> de {filteredProducts.length} resultados
              </h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl h-[450px] animate-pulse border border-slate-100" />
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-8 rounded-2xl text-center font-bold">
                {error}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 items-stretch">
                  {currentProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>

                {currentProducts.length === 0 && (
                  <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package size={32} className="text-slate-300" />
                    </div>
                    <p className="text-slate-400 font-bold text-lg">No encontramos productos con esos filtros.</p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategoryId('all');
                        setSelectedVehicleId('all');
                        setMinPrice('');
                        setMaxPrice('');
                      }}
                      className="mt-4 text-primary font-bold hover:underline"
                    >
                      Limpiar filtros
                    </button>
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="w-12 h-12 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft size={20} />
                    </button>

                    <div className="flex items-center gap-2 bg-white px-2 py-2 rounded-2xl border border-slate-200 shadow-sm">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-10 h-10 rounded-xl font-black text-sm transition-all ${currentPage === page
                            ? 'bg-primary text-black'
                            : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
                            }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="w-12 h-12 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white z-[101] shadow-2xl p-6 lg:hidden"
            >
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                <h2 className="text-xl font-black text-slate-900">Filtros</h2>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X size={24} className="text-slate-400" />
                </button>
              </div>
              <FiltersContent />
              <button
                onClick={() => setIsFilterOpen(false)}
                className="w-full mt-12 bg-slate-900 text-white font-black py-4 rounded-2xl shadow-lg"
              >
                Ver Resultados
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
