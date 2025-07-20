import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validación básica
    if (!email || !password) {
      setError('Todos los campos son obligatorios');
      setLoading(false);
      return;
    }

    try {
      const result = await login(email, password);
      
      if (result.success) {
        // Login exitoso, redirigir al dashboard
        navigate('/dashboard');
      } else {
        // Mostrar error del backend
        setError(result.message || 'Error en el login');
      }
    } catch (error) {
        console.error('Error en el login', error);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campo Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="tu@email.com"
            disabled={loading}
          />
        </div>

        {/* Campo Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
            disabled={loading}
          />
        </div>

        {/* Mostrar error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Botón Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
        >
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>

      {/* Link a registro */}
      <p className="text-center text-sm text-gray-600 mt-4">
        ¿No tienes cuenta?{' '}
        <a href="/register" className="text-blue-600 hover:underline">
          Regístrate aquí
        </a>
      </p>

      {/* Datos de prueba */}
      <div className="mt-6 p-4 bg-gray-50 rounded-md">
        <p className="text-xs text-gray-600 font-medium">Datos de prueba:</p>
        <p className="text-xs text-gray-500">Email: test@notas.com</p>
        <p className="text-xs text-gray-500">Password: test123456</p>
      </div>
    </div>
  );
}