import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';

export default function Contacto() {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    mensaje: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Gracias por tu mensaje. Nos pondremos en contacto contigo pronto.');
    setFormData({ nombre: '', telefono: '', email: '', mensaje: '' });
  };

  const handleWhatsApp = () => {
    const message = 'Hola, me gustaría obtener más información sobre sus productos.';
    const whatsappUrl = `https://wa.me/595981234567?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen pt-[128px]"
    >
      <div className="bg-dark-gray text-white py-12">
        <div className="container mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Contáctanos
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-gray-300 text-lg"
          >
            Estamos aquí para ayudarte con tus necesidades de repuestos
          </motion.p>
        </div>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.5 }}
        className="py-20 bg-light-gray"
      >
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Envíanos un Mensaje</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="nombre" className="block text-gray-700 font-semibold mb-2">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="telefono" className="block text-gray-700 font-semibold mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="mensaje" className="block text-gray-700 font-semibold mb-2">
                    Mensaje
                  </label>
                  <textarea
                    id="mensaje"
                    value={formData.mensaje}
                    onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary resize-none"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-[#D9A504] text-black font-bold px-8 py-4 rounded-lg text-lg transition-colors duration-300"
                >
                  Enviar Mensaje
                </button>
              </form>

              <div className="mt-8">
                <button
                  onClick={handleWhatsApp}
                  className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold px-8 py-4 rounded-lg text-lg transition-colors duration-300 flex items-center justify-center gap-3"
                >
                  <MessageCircle size={24} />
                  Contactar por WhatsApp
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Información de Contacto</h2>

              <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary p-3 rounded-full flex-shrink-0">
                    <MapPin className="text-black" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Dirección</h3>
                    <p className="text-gray-700">
                      Av. Eusebio Ayala 1234<br />
                      Asunción, Paraguay
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary p-3 rounded-full flex-shrink-0">
                    <Phone className="text-black" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Teléfonos</h3>
                    <p className="text-gray-700">
                      <a href="tel:+595211234567" className="hover:text-primary transition-colors">
                        +595 21 123 4567
                      </a>
                      <br />
                      <a href="tel:+595981234567" className="hover:text-primary transition-colors">
                        +595 981 234 567
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary p-3 rounded-full flex-shrink-0">
                    <Mail className="text-black" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-700">
                      <a href="mailto:info@logisparts.com" className="hover:text-primary transition-colors">
                        info@logisparts.com
                      </a>
                      <br />
                      <a href="mailto:ventas@logisparts.com" className="hover:text-primary transition-colors">
                        ventas@logisparts.com
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary p-3 rounded-full flex-shrink-0">
                    <Clock className="text-black" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Horario de Atención</h3>
                    <p className="text-gray-700">
                      Lunes a Viernes: 8:00 - 18:00<br />
                      Sábados: 8:00 - 13:00<br />
                      Domingos: Cerrado
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden h-80">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115106.13533398158!2d-57.64038084650878!3d-25.30353793886241!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x945da5e05cb6e4f9%3A0x3bfe00c455da3fce!2sAsunci%C3%B3n%2C%20Paraguay!5e0!3m2!1ses!2sus!4v1677123456789!5m2!1ses!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación de Logisparts"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
