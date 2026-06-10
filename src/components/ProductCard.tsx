import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Product } from '../types';
import { Package, ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const formatPrice = (price: number) => new Intl.NumberFormat('es-PY').format(price);
  const { addItem, items } = useCart();

  const cartQty = items.find((i) => i.product.id === product.id)?.quantity ?? 0;
  const outOfStock = product.cantDisponible != null && product.cantDisponible <= 0;
  const atMax = product.cantDisponible != null && cartQty >= product.cantDisponible;
  const cartDisabled = outOfStock || atMax;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!cartDisabled) addItem(product);
  };

  const firstVehicle = product.vehicles?.[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="h-full"
    >
      <Link to={`/productos/${product.id}`} className="block group h-full">
        <motion.div
          whileHover={{ y: -6, transition: { duration: 0.2 } }}
          className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 overflow-hidden h-full flex flex-col"
        >
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-slate-50 flex items-center justify-center border-b border-slate-100">
            {product.image_url ? (
              <motion.img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-300">
                <Package className="w-10 h-10 sm:w-16 sm:h-16" strokeWidth={1} />
                <span className="text-[10px] uppercase tracking-[0.2em] mt-3 font-bold opacity-60">Sin imágen</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <div className="p-3 sm:p-5 flex-1 flex flex-col gap-2 sm:gap-3">
            {/* Título */}
            <h3 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
              {product.name}
            </h3>

            {/* Marca / Modelo */}
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

            {/* Stock / Código de barras */}
            <div className="flex flex-col gap-1 text-xs text-slate-500">
              {product.cantDisponible != null && (
                <span>Stock: <span className="font-semibold text-slate-700">{product.cantDisponible} uds.</span></span>
              )}
              {product.codigoBarra && (
                <span>Cód. barras: <span className="font-semibold text-slate-700">{product.codigoBarra}</span></span>
              )}
            </div>

            <div className="flex flex-col gap-2 sm:gap-3 mt-auto pt-1">
              {/* Precio */}
              <div className="flex items-baseline gap-1">
                <span className="text-lg sm:text-2xl font-black text-primary tracking-tight">
                  {formatPrice(product.price)}
                </span>
                <span className="text-xs sm:text-sm font-bold text-primary">Gs</span>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={cartDisabled}
                className={`w-full font-bold py-2.5 sm:py-3 rounded-xl transition-all duration-300 text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 ${cartDisabled ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-brand hover:bg-primary hover:text-black text-white'}`}
              >
                <ShoppingCart size={16} />
                {outOfStock ? 'Sin stock' : atMax ? 'Límite de stock' : 'Agregar al carrito'}
              </button>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
