import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import WhatsAppFloatingButton from '../WhatsAppFloatingButton';

export default function PublicLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Header />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
}
