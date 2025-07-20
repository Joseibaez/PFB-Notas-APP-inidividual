import { useParams, Link } from 'react-router-dom';

function NoteDetail() {
  const { id } = useParams();
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Link 
            to="/dashboard" 
            className="text-blue-600 hover:text-blue-700 flex items-center"
          >
            ← Volver a mis notas
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Detalle de Nota #{id}
          </h1>
          <p className="text-gray-600">
            Contenido de la nota aquí (próximo paso)
          </p>
        </div>
      </div>
    </div>
  );
}

export default NoteDetail;