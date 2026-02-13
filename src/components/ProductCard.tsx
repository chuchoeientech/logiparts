import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PY').format(price);
  };

  const handleConsultar = () => {
    const message = `Hola, estoy interesado en este producto: ${product.name}`;
    const whatsappUrl = `https://wa.me/595981234567?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden group">
      <div className="relative h-56 overflow-hidden bg-gray-100">
        <img
          src={product.image_url || 'https://images.pexels.com/photos/3806248/pexels-photo-3806248.jpeg?auto=compress&cs=tinysrgb&w=600'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">{formatPrice(product.price)} Gs</span>
          <button
            onClick={handleConsultar}
            className="bg-primary hover:bg-[#D9A504] text-black font-semibold px-6 py-2 rounded-lg transition-colors duration-300"
          >
            Consultar
          </button>
        </div>
      </div>
    </div>
  );
}
