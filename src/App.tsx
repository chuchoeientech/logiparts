import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <AdminAuthProvider>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="categorias" replace />} />
            <Route path="categorias" element={<AdminCategorias />} />
            <Route path="productos" element={<AdminProductos />} />
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
