import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, Star } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const stagger = {
  initial: 'hidden',
  whileInView: 'visible',
  viewport: { once: true },
  variants: { visible: { transition: { staggerChildren: 0.12 } } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

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

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Dirección',
      content: (
        <p className="text-gray-500 leading-relaxed">
          Av. Eusebio Ayala 1234<br />
          Asunción, Paraguay
        </p>
      ),
    },
    {
      icon: Phone,
      title: 'Teléfonos',
      content: (
        <div className="space-y-1">
          <a href="tel:+595211234567" className="block text-gray-500 hover:text-primary transition-colors">
            +595 21 123 4567
          </a>
          <a href="tel:+595981234567" className="block text-gray-500 hover:text-primary transition-colors">
            +595 981 234 567
          </a>
        </div>
      ),
    },
    {
      icon: Mail,
      title: 'Email',
      content: (
        <div className="space-y-1">
          <a href="mailto:info@logisparts.com" className="block text-gray-500 hover:text-primary transition-colors">
            info@logisparts.com
          </a>
          <a href="mailto:ventas@logisparts.com" className="block text-gray-500 hover:text-primary transition-colors">
            ventas@logisparts.com
          </a>
        </div>
      ),
    },
    {
      icon: Clock,
      title: 'Horario de Atención',
      content: (
        <div className="space-y-1 text-gray-500">
          <p>Lunes a Viernes: <span className="text-gray-800 font-medium">8:00 – 18:00</span></p>
          <p>Sábados: <span className="text-gray-800 font-medium">8:00 – 13:00</span></p>
          <p>Domingos: <span className="text-gray-400">Cerrado</span></p>
        </div>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen"
    >
      {/* Hero */}
      <div className="relative h-[548px] pt-[128px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage:
              'url(https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=1920)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0d]/95 via-[#111111]/85 to-[#1A1A1A]/70" />

        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-primary/20 border border-primary/40 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-6 uppercase tracking-widest"
          >
            <Star size={14} />
            Estamos para ayudarte
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.55 }}
            className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight"
          >
            Contác<span className="text-primary">tanos</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="text-lg md:text-xl text-gray-300 max-w-xl mx-auto"
          >
            Estamos aquí para ayudarte con todas tus necesidades de repuestos automotrices
          </motion.p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
      </div>

      {/* WhatsApp highlight bar */}
      <div className="bg-[#111111] border-b border-[#2a2a2a]">
        <div className="container mx-auto px-4 py-5">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto"
          >
            <p className="text-gray-300 text-center sm:text-left">
              ¿Necesitás una respuesta inmediata?{' '}
              <span className="text-white font-semibold">Escribinos por WhatsApp</span>
            </p>
            <button
              onClick={handleWhatsApp}
              className="flex-shrink-0 inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold px-6 py-3 rounded-xl text-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(37,211,102,0.35)]"
            >
              <MessageCircle size={18} />
              Abrir WhatsApp
            </button>
          </motion.div>
        </div>
      </div>

      {/* Main content */}
      <section className="py-24 bg-[#F8FAFC]">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-12 max-w-6xl mx-auto items-stretch">

            {/* Form — 3 columns */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3 h-full flex flex-col"
            >
              <div className="mb-2">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-1 bg-primary rounded-full" />
                  <span className="text-primary text-xs font-bold uppercase tracking-widest">Formulario</span>
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900">Envíanos un Mensaje</h2>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 flex-1 flex flex-col">
                <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col justify-between">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="nombre" className="block text-gray-700 font-semibold mb-2 text-sm">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        id="nombre"
                        placeholder="Tu nombre completo"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        className="w-full px-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-gray-900 placeholder:text-gray-400"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="telefono" className="block text-gray-700 font-semibold mb-2 text-sm">
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        id="telefono"
                        placeholder="+595 981 000 000"
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                        className="w-full px-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-gray-900 placeholder:text-gray-400"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-gray-700 font-semibold mb-2 text-sm">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-gray-900 placeholder:text-gray-400"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="mensaje" className="block text-gray-700 font-semibold mb-2 text-sm">
                      Mensaje *
                    </label>
                    <textarea
                      id="mensaje"
                      placeholder="Describe el repuesto que necesitás, tu vehículo o cualquier consulta..."
                      value={formData.mensaje}
                      onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                      rows={5}
                      className="w-full px-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 text-gray-900 placeholder:text-gray-400 resize-none"
                      required
                    />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-primary hover:bg-[#D9A504] text-black font-bold px-8 py-4 rounded-xl text-lg transition-all duration-300 flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(242,183,5,0.35)]"
                  >
                    <Send size={20} />
                    Enviar Mensaje
                  </motion.button>
                </form>
              </div>
            </motion.div>

            {/* Contact info — 2 columns */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 flex flex-col gap-4 h-full"
            >
              <div className="mb-2">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-1 bg-primary rounded-full" />
                  <span className="text-primary text-xs font-bold uppercase tracking-widest">Datos</span>
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900">Información de Contacto</h2>
              </div>

              <motion.div {...stagger} className="flex-1 flex flex-col gap-4">
                {contactInfo.map((item, index) => (
                  <motion.div
                    key={index}
                    variants={cardVariant}
                    className="flex-1 bg-white rounded-2xl p-6 flex items-start gap-4 group hover:ring-1 hover:ring-primary/50 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                      <item.icon size={22} className="text-primary group-hover:text-black transition-colors duration-300" />
                    </div>
                    <div>
                      <h3 className="text-gray-900 font-bold mb-1">{item.title}</h3>
                      {item.content}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map full-width */}
      <div className="relative h-80 overflow-hidden border-t-4 border-primary">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115106.13533398158!2d-57.64038084650878!3d-25.30353793886241!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x945da5e05cb6e4f9%3A0x3bfe00c455da3fce!2sAsunci%C3%B3n%2C%20Paraguay!5e0!3m2!1ses!2sus!4v1677123456789!5m2!1ses!2sus"
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'grayscale(30%)' }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Ubicación de Logisparts"
        />
      </div>
    </motion.div>
  );
}
