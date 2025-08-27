import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function PublicNote() {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPublicNote = async () => {
      try {
        const response = await fetch(`https://jcuhp5efnm.us-east-1.awsapprunner.com/api/notas/public/${id}`);
        const data = await response.json();

        if (data.success) {
          setNote(data.data);
        } else {
          setError(data.message || 'Nota no encontrada');
        }
      } catch (error) {
        console.error('Error cargando nota pública:', error);
        setError('Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPublicNote();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-lg text-gray-600">Cargando nota...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-red-600 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h2 className="text-xl font-semibold">Nota no disponible</h2>
              <p className="text-gray-600 mt-2">{error}</p>
            </div>
            <Link 
              to="/" 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-gray-600">Nota no encontrada</div>
            <Link 
              to="/" 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block mt-4"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Link 
            to="/" 
            className="text-blue-600 hover:text-blue-700 flex items-center"
          >
            ← Volver al inicio
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header de la nota */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">
                {note.titulo}
              </h1>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                📖 Pública
              </span>
            </div>
            
            {/* Meta información */}
            <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
              {note.categoria && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  🏷️ {note.categoria}
                </span>
              )}
              {note.created_at && (
                <span>
                  📅 {new Date(note.created_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              )}
            </div>
          </div>

          {/* Contenido de la nota */}
          <div className="prose max-w-none">
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {note.contenido}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>📝 Esta es una nota pública compartida</p>
        </div>
      </div>
    </div>
  );
}