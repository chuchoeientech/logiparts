import { Link } from 'react-router-dom';
import { products } from '../data/mockData';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';

export default function Home() {
  const featuredProducts = products.filter(p => p.is_featured).slice(0, 6);

  const categories = [
    {
      name: 'Faros, Parrillas y Paragolpes',
      slug: 'faros-parrillas',
      imageUrl: 'https://images.pexels.com/photos/3806248/pexels-photo-3806248.jpeg?auto=compress&cs=tinysrgb&w=1200',
    },
    {
      name: 'Guardabarros, Capots y Tapas',
      slug: 'guardabarros-capots',
      imageUrl: 'https://images.pexels.com/photos/4488662/pexels-photo-4488662.jpeg?auto=compress&cs=tinysrgb&w=1200',
    },
    {
      name: 'Otras Partes',
      slug: 'otras-partes',
      imageUrl: 'https://images.pexels.com/photos/3806249/pexels-photo-3806249.jpeg?auto=compress&cs=tinysrgb&w=1200',
    },
  ];

  return (
    <div>
      <section
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
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Repuestos Originales y Alternativos<br />para tu Vehículo
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-gray-300">
            Calidad, confianza y los mejores precios del mercado
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Productos Destacados</h2>
            <p className="text-gray-600 text-lg">Los repuestos más buscados por nuestros clientes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {featuredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No hay productos destacados disponibles en este momento.</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/productos"
              className="inline-block bg-[#111111] hover:bg-primary text-white hover:text-black font-bold px-8 py-4 rounded-lg text-lg transition-all duration-300"
            >
              Ver Todos los Productos
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-light-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nuestras Categorías</h2>
            <p className="text-gray-600 text-lg">Encuentra el repuesto que necesitas</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <CategoryCard
                key={category.slug}
                name={category.name}
                slug={category.slug}
                imageUrl={category.imageUrl}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
