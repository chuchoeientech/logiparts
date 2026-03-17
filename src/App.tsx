import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import PublicLayout from './components/layout/PublicLayout';
import Home from './pages/Home';
import Productos from './pages/Productos';
import Producto from './pages/Producto';
import Nosotros from './pages/Nosotros';
import Contacto from './pages/Contacto';
import AdminLayout from './pages/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminCategorias from './pages/admin/AdminCategorias';
import AdminProductos from './pages/admin/AdminProductos';
import AdminVehiculos from './pages/admin/AdminVehiculos';
import AdminBulkUpload from './pages/admin/AdminBulkUpload';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AdminAuthProvider>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="categorias" replace />} />
            <Route path="categorias" element={<AdminCategorias />} />
            <Route path="productos" element={<AdminProductos />} />
            <Route path="vehiculos" element={<AdminVehiculos />} />
            <Route path="bulk" element={<AdminBulkUpload />} />
          </Route>
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="productos" element={<Productos />} />
            <Route path="productos/:id" element={<Producto />} />
            <Route path="nosotros" element={<Nosotros />} />
            <Route path="contacto" element={<Contacto />} />
          </Route>
        </Routes>
      </AdminAuthProvider>
    </Router>
  );
}

export default App;
