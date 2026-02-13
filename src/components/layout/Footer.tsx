import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-primary mb-4">LOGISPARTS</h3>
            <p className="text-gray-400 mb-4">
              Repuestos originales y alternativos para tu vehículo. Calidad, confianza y los mejores precios del mercado.
            </p>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <Facebook size={24} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <Instagram size={24} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <Twitter size={24} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Categorías</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/productos?categoria=faros-parrillas" className="text-gray-400 hover:text-primary transition-colors">
                  Faros, Parrillas y Paragolpes
                </Link>
              </li>
              <li>
                <Link to="/productos?categoria=guardabarros-capots" className="text-gray-400 hover:text-primary transition-colors">
                  Guardabarros, Capots y Tapas
                </Link>
              </li>
              <li>
                <Link to="/productos?categoria=otras-partes" className="text-gray-400 hover:text-primary transition-colors">
                  Otras Partes
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Menú</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/productos" className="text-gray-400 hover:text-primary transition-colors">
                  Productos
                </Link>
              </li>
              <li>
                <Link to="/nosotros" className="text-gray-400 hover:text-primary transition-colors">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-gray-400 hover:text-primary transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin size={20} className="text-primary mt-1 flex-shrink-0" />
                <span className="text-gray-400">Asunción, Paraguay</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={20} className="text-primary flex-shrink-0" />
                <a href="tel:+595123456789" className="text-gray-400 hover:text-primary transition-colors">
                  +595 21 123 4567
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={20} className="text-primary flex-shrink-0" />
                <a href="mailto:info@logisparts.com" className="text-gray-400 hover:text-primary transition-colors">
                  info@logisparts.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Logisparts. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
