import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Target, Award, Users } from 'lucide-react';

const fadeInUp = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };
const stagger = { initial: 'hidden', whileInView: 'visible', viewport: { once: true }, variants: { visible: { transition: { staggerChildren: 0.1 } } } };

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen pt-[128px]"
    >
      <div className="relative h-96 flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=1920)',
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#111111]/90 to-[#1A1A1A]/80"></div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="text-5xl md:text-6xl font-bold mb-4"
          >
            Sobre Nosotros
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-xl text-gray-300"
          >
            Tu socio de confianza en repuestos automotrices
          </motion.p>
        </div>
      </div>

      <motion.section {...fadeInUp} className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Quiénes Somos</h2>
            <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
              <p>
                <span className="font-bold text-primary">Logisparts</span> es una empresa paraguaya líder en la distribución de repuestos automotrices,
                con años de experiencia en el mercado nacional. Nos especializamos en ofrecer repuestos originales y alternativos
                de alta calidad para una amplia gama de vehículos.
              </p>
              <p>
                Nuestra misión es proporcionar a nuestros clientes las mejores soluciones en repuestos, combinando calidad superior,
                precios competitivos y un servicio de atención excepcional. Trabajamos con las marcas más reconocidas del mercado
                y contamos con un equipo de expertos que garantiza la correcta identificación y suministro de cada pieza.
              </p>
              <p>
                En <span className="font-bold text-primary">Logisparts</span>, entendemos que cada vehículo es único y cada cliente
                tiene necesidades específicas. Por eso, nos comprometemos a brindar un servicio personalizado que asegure la satisfacción
                total de nuestros clientes.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section {...fadeInUp} className="py-20 bg-light-gray">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Nuestra Misión</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-8">
                Ser el proveedor de repuestos automotrices más confiable de Paraguay, ofreciendo productos de calidad
                excepcional y un servicio que supere las expectativas de nuestros clientes, contribuyendo así a mantener
                sus vehículos en óptimas condiciones de funcionamiento y seguridad.
              </p>

              <h2 className="text-4xl font-bold text-gray-900 mb-6">Nuestra Visión</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                Consolidarnos como la empresa líder en la distribución de repuestos automotrices en Paraguay, reconocida
                por nuestra excelencia en servicio, calidad de productos y compromiso con la satisfacción del cliente,
                expandiendo nuestra presencia y fortaleciendo nuestra red de distribución a nivel nacional.
              </p>
            </div>

            <div className="relative h-[500px] rounded-lg overflow-hidden shadow-xl">
              <img
                src="https://images.pexels.com/photos/3806248/pexels-photo-3806248.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Warehouse"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section {...stagger} className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-12" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nuestros Valores</h2>
            <p className="text-gray-600 text-lg">Los pilares que guían nuestro trabajo diario</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
                className="bg-light-gray rounded-lg p-8 text-center hover:shadow-xl transition-shadow duration-300"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-6">
                  <value.icon size={40} className="text-black" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-700 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section {...fadeInUp} className="py-20 bg-dark-gray text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">¿Listo para encontrar el repuesto perfecto?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Contáctanos y nuestro equipo te ayudará a encontrar exactamente lo que necesitas
          </p>
          <Link
            to="/contacto"
            className="inline-block bg-primary hover:bg-[#D9A504] text-black font-bold px-8 py-4 rounded-lg text-lg transition-colors duration-300"
          >
            Contactar Ahora
          </Link>
        </div>
      </motion.section>
    </motion.div>
  );
}
