import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PY').format(price);
  };

  const handleConsultar = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const message = `Hola, estoy interesado en este producto: ${product.name}`;
    const whatsappUrl = `https://wa.me/595981234567?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link to={`/productos/${product.id}`} className="block group">
        <motion.div
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full flex flex-col"
        >
          <div className="relative h-56 overflow-hidden bg-gray-100">
            <motion.img
              src={product.image_url || 'https://images.pexels.com/photos/3806248/pexels-photo-3806248.jpeg?auto=compress&cs=tinysrgb&w=600'}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>

          <div className="p-5 flex-1 flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">{product.description}</p>

            <div className="flex items-center justify-between gap-2">
              <span className="text-2xl font-bold text-primary">{formatPrice(product.price)} Gs</span>
              <button
                onClick={handleConsultar}
                className="bg-primary hover:bg-[#D9A504] text-black font-semibold px-6 py-2 rounded-lg transition-colors duration-300 shrink-0"
              >
                Consultar
              </button>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
