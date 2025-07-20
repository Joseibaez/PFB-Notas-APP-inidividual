import { Link } from 'react-router-dom';

function Login() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
            Iniciar Sesión
          </h2>
          <p className="text-center text-gray-600 mb-4">
            Formulario de login aquí (próximo paso)
          </p>
          <div className="text-center">
            <Link to="/register" className="text-blue-600 hover:text-blue-700">
              ¿No tienes cuenta? Regístrate
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;