import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await fetch(`https://jcuhp5efnm.us-east-1.awsapprunner.com/api/notas/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (data.success) {
          setNote(data.data);
        } else {
          setError(data.message || 'Nota no encontrada');
        }
      } catch (error) {
        console.error('Error cargando nota:', error);
        setError('Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    if (id && token) {
      fetchNote();
    }
  }, [id, token]);

  const handleDelete = async () => {
    setDeleting(true);
    
    try {
      const response = await fetch(`https://jcuhp5efnm.us-east-1.awsapprunner.com/api/notas/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        // Redirigir al dashboard con mensaje de éxito
        navigate('/dashboard', { 
          state: { message: 'Nota eliminada correctamente' }
        });
      } else {
        setError(data.message || 'Error eliminando la nota');
        setDeleting(false);
        setShowDeleteConfirm(false);
      }
    } catch (error) {
      console.error('Error eliminando nota:', error);
      setError('Error de conexión');
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const togglePublic = async () => {
    try {
      const response = await fetch(`https://jcuhp5efnm.us-east-1.awsapprunner.com/api/notas/${id}/toggle-public`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        // Actualizar el estado local
        setNote(prev => ({
          ...prev,
          es_publica: !prev.es_publica
        }));
      } else {
        setError(data.message || 'Error cambiando visibilidad');
      }
    } catch (error) {
      console.error('Error cambiando visibilidad:', error);
      setError('Error de conexión');
    }
  };

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

  if (error || !note) {
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
          
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-red-600 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 15.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h2 className="text-xl font-semibold">Nota no disponible</h2>
              <p className="text-gray-600 mt-2">{error}</p>
            </div>
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
            to="/dashboard" 
            className="text-blue-600 hover:text-blue-700 flex items-center"
          >
            ← Volver a mis notas
          </Link>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-lg">
          {/* Header de la nota */}
          <div className="border-b border-gray-200 p-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {note.titulo}
                </h1>
                
                {/* Meta información */}
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                  {note.categoria && (
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                      🏷️ {note.categoria}
                    </span>
                  )}
                  
                  <span className={`px-3 py-1 rounded-full font-medium ${
                    note.es_publica 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {note.es_publica ? '🌐 Pública' : '🔒 Privada'}
                  </span>
                  
                  <span className="flex items-center">
                    📅 Creada: {new Date(note.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  
                  {note.updated_at !== note.created_at && (
                    <span className="flex items-center">
                      ✏️ Editada: {new Date(note.updated_at).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Acciones */}
              <div className="flex items-center space-x-2 ml-6">
                <Link
                  to={`/note/edit/${note.id}`}
                  className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-md hover:bg-yellow-200 transition-colors font-medium"
                >
                  ✏️ Editar
                </Link>
                
                <button
                  onClick={togglePublic}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    note.es_publica
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {note.es_publica ? '🔒 Hacer privada' : '🌐 Hacer pública'}
                </button>
                
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red-100 text-red-700 px-4 py-2 rounded-md hover:bg-red-200 transition-colors font-medium"
                >
                  🗑️ Eliminar
                </button>
                
                {note.es_publica && (
                  <Link
                    to={`/public/note/${note.id}`}
                    target="_blank"
                    className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-200 transition-colors font-medium"
                  >
                    👁️ Ver pública
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Contenido de la nota */}
          <div className="p-8">
            <div className="prose max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
                {note.contenido}
              </div>
            </div>
          </div>
        </div>

        {/* Modal de confirmación para eliminar */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                🗑️ ¿Eliminar nota?
              </h3>
              <p className="text-gray-600 mb-6">
                Esta acción no se puede deshacer. La nota <strong>"{note.titulo}"</strong> será eliminada permanentemente.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:bg-red-300 font-medium"
                >
                  {deleting ? 'Eliminando...' : 'Sí, eliminar'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 font-medium"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}