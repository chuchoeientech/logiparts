import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { Navigate } from 'react-router-dom';
import { LayoutDashboard, FolderOpen, Package, Car, LogOut } from 'lucide-react';

export default function AdminLayout() {
  const { isAuthenticated, logout } = useAdminAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary text-dark-gray font-semibold' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
    }`;

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <aside className="w-64 bg-dark-gray flex flex-col fixed inset-y-0">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold text-primary">Logiparts Admin</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <NavLink to="/admin" end className={linkClass}>
            <LayoutDashboard size={20} />
            Inicio
          </NavLink>
          <NavLink to="/admin/categorias" className={linkClass}>
            <FolderOpen size={20} />
            Categorías
          </NavLink>
          <NavLink to="/admin/productos" className={linkClass}>
            <Package size={20} />
            Productos
          </NavLink>
          <NavLink to="/admin/vehiculos" className={linkClass}>
            <Car size={20} />
            Vehículos
          </NavLink>
          <NavLink to="/admin/bulk" className={linkClass}>
            <FolderOpen size={20} />
            Carga Masiva
          </NavLink>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <LogOut size={20} />
            Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="flex-1 ml-64 p-8 bg-light-gray min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
