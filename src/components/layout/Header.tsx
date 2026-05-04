import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const menuLinks = [
  { to: '/', label: 'Inicio' },
  { to: '/productos', label: 'Productos' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/contacto', label: 'Contacto' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full fixed top-0 z-50">


      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center">
              <motion.img
                src="/logo.jpg"
                alt="Logisparts - Compañía de Servicios Integrados S.A."
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                className="h-14 w-auto object-contain"
              />
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

            <motion.button
              className="md:hidden text-gray-800 p-1"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileTap={{ scale: 0.85 }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={isMenuOpen ? 'close' : 'open'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  style={{ display: 'block' }}
                >
                  {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>

          <AnimatePresence initial={false}>
            {isMenuOpen && (
              <motion.div
                key="mobile-menu"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="md:hidden overflow-hidden border-t"
              >
                <div className="flex flex-col py-4 gap-1">
                  {menuLinks.map((link, i) => (
                    <motion.div
                      key={link.to}
                      initial={{ x: -16, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.06, duration: 0.2 }}
                    >
                      <Link
                        to={link.to}
                        className="block px-2 py-2 text-gray-800 hover:text-primary font-medium transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </header>
  );
}
