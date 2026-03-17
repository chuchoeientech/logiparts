import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Target, Award, Users, CheckCircle, TrendingUp, Star } from 'lucide-react';

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
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Nosotros() {
  const values = [
    {
      icon: Shield,
      title: 'Confiabilidad',
      description: 'Productos de calidad garantizada que cumplen con los más altos estándares del mercado.',
    },
    {
      icon: Target,
      title: 'Precisión',
      description: 'Asesoramiento experto para encontrar el repuesto exacto que necesita tu vehículo.',
    },
    {
      icon: Award,
      title: 'Calidad',
      description: 'Repuestos originales y alternativos de primera línea, probados y certificados.',
    },
    {
      icon: Users,
      title: 'Atención Personalizada',
      description: 'Un equipo dedicado a brindarte el mejor servicio y soporte técnico.',
    },
  ];

  const stats = [
    { number: '10+', label: 'Años de experiencia' },
    { number: '5.000+', label: 'Productos disponibles' },
    { number: '500+', label: 'Clientes satisfechos' },
    { number: '100%', label: 'Garantía de calidad' },
  ];

  const highlights = [
    'Repuestos originales y alternativos certificados',
    'Asesoramiento técnico especializado',
    'Entrega rápida en todo Paraguay',
    'Precios competitivos y transparentes',
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen"
    >
      {/* Hero */}
      <div className="relative h-[648px] pt-[128px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage:
              'url(https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=1920)',
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
            Tu socio de confianza
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.55 }}
            className="text-5xl md:text-7xl font-extrabold mb-5 leading-tight"
          >
            Sobre{' '}
            <span className="text-primary">Nosotros</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Líderes en distribución de repuestos automotrices en Paraguay, con calidad y confianza como pilares fundamentales.
          </motion.p>
        </div>

        {/* Gold bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
      </div>

      {/* Stats bar */}
      <div className="bg-[#111111] border-b border-[#2a2a2a]">
        <div className="container mx-auto px-4">
          <motion.div
            {...stagger}
            className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-[#2a2a2a]"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                variants={cardVariant}
                className="py-8 px-6 text-center group"
              >
                <div className="text-3xl md:text-4xl font-extrabold text-primary mb-1 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Quiénes Somos */}
      <motion.section {...fadeInUp} className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-1 bg-primary rounded-full" />
                <span className="text-primary text-sm font-bold uppercase tracking-widest">Nuestra Historia</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                Quiénes <br />
                <span className="text-primary">Somos</span>
              </h2>
              <div className="space-y-5 text-gray-600 text-lg leading-relaxed">
                <p>
                  <span className="font-bold text-gray-900">Logisparts</span> es una empresa paraguaya líder en la
                  distribución de repuestos automotrices, con años de experiencia en el mercado nacional.
                </p>
                <p>
                  Nos especializamos en ofrecer repuestos originales y alternativos de alta calidad para una amplia gama
                  de vehículos, combinando calidad superior, precios competitivos y un servicio de atención excepcional.
                </p>
                <p>
                  Entendemos que cada vehículo es único y cada cliente tiene necesidades específicas. Por eso, nos
                  comprometemos a brindar un servicio personalizado que asegure la satisfacción total.
                </p>
              </div>

              <div className="mt-8 space-y-3">
                {highlights.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle size={20} className="text-primary flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative h-[520px] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/1719648/pexels-photo-1719648.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Almacén Logisparts"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-6 -left-6 bg-primary text-black rounded-2xl p-5 shadow-2xl">
                <div className="text-3xl font-extrabold">10+</div>
                <div className="text-sm font-semibold">Años en el mercado</div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#111111] rounded-2xl flex flex-col items-center justify-center shadow-xl">
                <TrendingUp size={28} className="text-primary mb-1" />
                <span className="text-white text-xs font-bold text-center leading-tight">Líder del Mercado</span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Misión y Visión */}
      <section className="py-24 bg-[#F8FAFC]">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-1 bg-primary rounded-full" />
              <span className="text-primary text-sm font-bold uppercase tracking-widest">Lo que nos mueve</span>
              <div className="w-10 h-1 bg-primary rounded-full" />
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900">Misión & Visión</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              {...fadeInUp}
              className="relative bg-white border border-slate-100 rounded-2xl p-10 overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0" />
              <div className="absolute -right-8 -top-8 w-40 h-40 bg-primary/5 rounded-full" />
              <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center mb-6">
                <Target size={28} className="text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Nuestra Misión</h3>
              <p className="text-gray-500 leading-relaxed">
                Ser el proveedor de repuestos automotrices más confiable de Paraguay, ofreciendo productos de calidad
                excepcional y un servicio que supere las expectativas de nuestros clientes, contribuyendo así a mantener
                sus vehículos en óptimas condiciones de funcionamiento y seguridad.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="relative bg-white border border-slate-100 rounded-2xl p-10 overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0" />
              <div className="absolute -right-8 -top-8 w-40 h-40 bg-primary/5 rounded-full" />
              <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp size={28} className="text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Nuestra Visión</h3>
              <p className="text-gray-500 leading-relaxed">
                Consolidarnos como la empresa líder en la distribución de repuestos automotrices en Paraguay, reconocida
                por nuestra excelencia en servicio, calidad de productos y compromiso con la satisfacción del cliente,
                expandiendo nuestra presencia a nivel nacional.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <motion.section {...stagger} className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-14" variants={cardVariant}>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-1 bg-primary rounded-full" />
              <span className="text-primary text-sm font-bold uppercase tracking-widest">Nuestros principios</span>
              <div className="w-10 h-1 bg-primary rounded-full" />
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3">Nuestros Valores</h2>
            <p className="text-gray-500 text-lg">Los pilares que guían nuestro trabajo diario</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={cardVariant}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group relative bg-white border border-slate-100 rounded-2xl p-8 text-center shadow-sm hover:shadow-2xl transition-shadow duration-400 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <div className="relative">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 border border-primary/20 rounded-2xl mb-6 group-hover:bg-primary transition-colors duration-300">
                    <value.icon size={36} className="text-primary group-hover:text-black transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-500 leading-relaxed text-sm">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section {...fadeInUp} className="relative py-28 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.pexels.com/photos/1231643/pexels-photo-1231643.jpeg?auto=compress&cs=tinysrgb&w=1920)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0d]/95 via-[#0d0d0d]/90 to-[#0d0d0d]/95" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <div className="inline-flex items-center gap-2 bg-primary text-black text-sm font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-widest">
            <Star size={14} />
            Estamos para ayudarte
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-5 leading-tight">
            ¿Listo para encontrar el{' '}
            <span className="text-primary">repuesto perfecto?</span>
          </h2>
          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
            Contáctanos y nuestro equipo de expertos te ayudará a encontrar exactamente lo que necesitas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contacto"
              className="inline-block bg-primary hover:bg-[#D9A504] text-black font-bold px-10 py-4 rounded-xl text-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(242,183,5,0.4)]"
            >
              Contactar Ahora
            </Link>
            <Link
              to="/productos"
              className="inline-block border-2 border-white/30 hover:border-primary text-white hover:text-primary font-bold px-10 py-4 rounded-xl text-lg transition-all duration-300"
            >
              Ver Productos
            </Link>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
