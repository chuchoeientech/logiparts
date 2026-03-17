import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import WhatsAppFloatingButton from '../WhatsAppFloatingButton';

export default function PublicLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Header />
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Outlet />
      </motion.div>
      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
}
