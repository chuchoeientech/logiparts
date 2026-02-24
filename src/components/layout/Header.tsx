import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full fixed top-0 z-50">


      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center">
              <motion.span
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                className="text-3xl font-bold text-primary"
              >
                LOGISPARTS
              </motion.span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-gray-800 hover:text-primary font-medium transition-colors">
                Inicio
              </Link>
              <Link to="/productos" className="text-gray-800 hover:text-primary font-medium transition-colors">
                Productos
              </Link>
              <Link to="/nosotros" className="text-gray-800 hover:text-primary font-medium transition-colors">
                Nosotros
              </Link>
              <Link to="/contacto" className="text-gray-800 hover:text-primary font-medium transition-colors">
                Contacto
              </Link>
            </div>

            <button
              className="md:hidden text-gray-800"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col gap-4">
                <Link
                  to="/"
                  className="text-gray-800 hover:text-primary font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Inicio
                </Link>
                <Link
                  to="/productos"
                  className="text-gray-800 hover:text-primary font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Productos
                </Link>
                <Link
                  to="/nosotros"
                  className="text-gray-800 hover:text-primary font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Nosotros
                </Link>
                <Link
                  to="/contacto"
                  className="text-gray-800 hover:text-primary font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contacto
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
