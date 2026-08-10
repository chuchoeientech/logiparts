import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';

function TikTokIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.17 8.17 0 0 0 4.78 1.52V6.77a4.85 4.85 0 0 1-1.01-.08z" />
    </svg>
  );
}

function WhatsAppIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <img
              src="/logo.jpg"
              alt="Logisparts - Compañía de Servicios Integrados S.A."
              className="h-16 w-auto object-contain mb-4"
            />
            <p className="text-gray-400 mb-4">
              Repuestos originales y alternativos para tu vehículo. Calidad, confianza y los mejores precios del mercado.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/greisinger86/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <Facebook size={24} />
              </a>
              <a href="https://www.instagram.com/logispartspy" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <Instagram size={24} />
              </a>
              <a href="https://www.tiktok.com/@logispartspy" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <TikTokIcon size={24} />
              </a>
              <a href="https://wa.me/595971191016" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                <WhatsAppIcon size={24} />
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
                <div className="text-gray-400 text-sm space-y-1">
                  <p>Avda. Eusebio Ayala 1715 casi Kubitschek, Asunción</p>
                  <p>Juan Maria Vianney 1748 casi Avda. Bruno Guggiari, Lambaré</p>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={20} className="text-primary flex-shrink-0" />
                <a href="tel:+595974420367" className="text-gray-400 hover:text-primary transition-colors">
                  0974-420367
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={20} className="text-primary flex-shrink-0" />
                <a href="mailto:info@logisparts.com" className="text-gray-400 hover:text-primary transition-colors">
                  administracion@logisparts.com.py
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Logisparts. Todos los derechos reservados.</p>
          <p>
            Desarrollado por{' '}
            <a href="https://eientech.io" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors font-medium">
              eien
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
