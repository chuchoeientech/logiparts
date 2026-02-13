import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  name: string;
  slug: string;
  imageUrl: string;
}

export default function CategoryCard({ name, slug, imageUrl }: CategoryCardProps) {
  return (
    <Link
      to={`/productos?categoria=${slug}`}
      className="relative h-80 rounded-lg overflow-hidden group cursor-pointer"
    >
      <div className="absolute inset-0">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      </div>

      <div className="relative h-full flex flex-col justify-end p-8">
        <h3 className="text-primary text-3xl font-bold mb-4">{name}</h3>
        <button className="flex items-center gap-2 bg-primary hover:bg-[#D9A504] text-black font-semibold px-6 py-3 rounded-lg transition-colors duration-300 w-fit">
          Explorar
          <ArrowRight size={20} />
        </button>
      </div>
    </Link>
  );
}
