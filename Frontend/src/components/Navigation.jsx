import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navigation() {
  const { user, logout, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Mostrar loading mientras verifica autenticación
  if (loading) {
    return (
      <nav className="bg-blue-600 text-white p-4">
        <div className="container mx-auto">
          <span>Cargando...</span>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo/Título */}
        <Link to="/" className="text-xl font-bold hover:text-blue-200">
          📝 Mis Notas
        </Link>

        <div className="flex items-center space-x-4">
          {/* Si NO está logueado */}
          {!isAuthenticated && (
            <>
              <Link 
                to="/login" 
                className="hover:text-blue-200 transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link 
                to="/register" 
                className="bg-blue-700 px-4 py-2 rounded hover:bg-blue-800 transition-colors"
              >
                Registrarse
              </Link>
            </>
          )}

          {/* Si SÍ está logueado */}
          {isAuthenticated && (
            <>
              <Link 
                to="/dashboard" 
                className="hover:text-blue-200 transition-colors"
              >
                Mis Notas
              </Link>
              <Link 
                to="/note/new" 
                className="hover:text-blue-200 transition-colors"
              >
                Nueva Nota
              </Link>
              
              {/* Info del usuario */}
              <span className="text-blue-200 text-sm">
                👋 {user?.email}
              </span>
              
              {/* Botón logout */}
              <button
                onClick={handleLogout}
                className="bg-red-600 px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
              >
                Salir
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}