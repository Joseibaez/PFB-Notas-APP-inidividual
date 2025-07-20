import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mis Notas</h1>
          <Link 
            to="/note/new"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Nueva Nota
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-center text-gray-600">
            Lista de notas aquí (próximo paso)
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;