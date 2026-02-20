import { Link } from 'react-router-dom';
import { ArrowRight, FolderOpen } from 'lucide-react';
import { motion } from 'framer-motion';

interface CategoryCardProps {
  name: string;
  slug: string;
  imageUrl?: string | null;
}

export default function CategoryCard({ name, slug, imageUrl }: CategoryCardProps) {
  return (
    <Link to={`/productos?categoria=${slug}`} className="block group h-full">
      <motion.div
        whileHover={{ y: -8 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-2xl"
      >
        <div className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-300 group-hover:text-primary transition-colors duration-500">
              <FolderOpen size={80} strokeWidth={1} />
            </div>
          )}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <div className="p-6 flex flex-col justify-between items-center text-center flex-1">
          <div>
            <h3 className="text-2xl font-black text-dark-gray mb-2 group-hover:text-primary transition-colors duration-300 uppercase tracking-tight">
              {name}
            </h3>
            <div className="w-12 h-1 bg-primary mx-auto rounded-full mb-6 group-hover:w-24 transition-all duration-500"></div>
          </div>

          <div className="flex items-center gap-2 bg-dark-gray text-white group-hover:bg-primary group-hover:text-black font-bold px-6 py-3 rounded-xl transition-all duration-300 w-fit text-sm uppercase tracking-widest shadow-lg">
            Explorar
            <ArrowRight size={18} />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
