import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            📝 App de Notas
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Organiza tus ideas, guarda tus pensamientos y mantén todo en orden
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">✨ Fácil de usar</h3>
              <p className="text-blue-700">Crea y organiza tus notas de forma intuitiva</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900 mb-2">🏷️ Categorías</h3>
              <p className="text-green-700">Organiza por categorías: trabajo, personal, estudios...</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">🔒 Privacidad</h3>
              <p className="text-purple-700">Tus notas privadas, seguras y accesibles solo para ti</p>
            </div>
            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-orange-900 mb-2">🌐 Compartir</h3>
              <p className="text-orange-700">Opción de hacer notas públicas cuando quieras</p>
            </div>
          </div>

          <div className="space-x-4">
            <Link 
              to="/login" 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
            >
              Iniciar Sesión
            </Link>
            <Link 
              to="/register" 
              className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors inline-block"
            >
              Registrarse
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
