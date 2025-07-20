import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { token, user } = useAuth();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/notas', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (data.success) {
          setNotes(data.data || []);
        } else {
          setError(data.message || 'Error cargando notas');
        }
      } catch (error) {
        console.error('Error cargando notas:', error);
        setError('Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchNotes();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-lg text-gray-600">Cargando tus notas...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mis Notas</h1>
            <p className="text-gray-600 mt-2">
              👋 Hola <strong>{user?.email}</strong>, tienes {notes.length} nota{notes.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link 
            to="/note/new"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            ➕ Nueva Nota
          </Link>
        </div>
        
        {/* Mostrar error si existe */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg">
          {notes.length === 0 ? (
            // Estado vacío - sin notas
            <div className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aún no tienes notas</h3>
              <p className="text-gray-600 mb-6">
                ¡Comienza creando tu primera nota! Organiza tus ideas, pensamientos y recordatorios.
              </p>
              <Link 
                to="/note/new"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
              >
                ✨ Crear primera nota
              </Link>
            </div>
          ) : (
            // Lista de notas
            <div className="divide-y divide-gray-200">
              {notes.map((note) => (
                <div key={note.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-gray-900">
                          {note.titulo}
                        </h3>
                        
                        {/* Badges */}
                        <div className="flex items-center space-x-2">
                          {note.categoria && (
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              🏷️ {note.categoria}
                            </span>
                          )}
                          {note.es_publica && (
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              🌐 Pública
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Preview del contenido */}
                      <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                        {note.contenido.length > 100 
                          ? `${note.contenido.substring(0, 100)}...`
                          : note.contenido
                        }
                      </p>
                      
                      {/* Fecha */}
                      <p className="text-gray-400 text-xs mt-2">
                        📅 {new Date(note.created_at).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    
                    {/* Acciones */}
                    <div className="flex items-center space-x-2 ml-4">
                      <Link 
                        to={`/note/${note.id}`}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-200 transition-colors"
                      >
                        👁️ Ver
                      </Link>
                      <Link 
                        to={`/note/edit/${note.id}`}
                        className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded text-sm hover:bg-yellow-200 transition-colors"
                      >
                        ✏️ Editar
                      </Link>
                      {note.es_publica && (
                        <Link 
                          to={`/public/note/${note.id}`}
                          className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm hover:bg-green-200 transition-colors"
                          target="_blank"
                        >
                          🌐 Ver pública
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats footer */}
        {notes.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                📊 Total: <strong>{notes.length}</strong> nota{notes.length !== 1 ? 's' : ''}
              </span>
              <span>
                🌐 Públicas: <strong>{notes.filter(note => note.es_publica).length}</strong>
              </span>
              <span>
                🔒 Privadas: <strong>{notes.filter(note => !note.es_publica).length}</strong>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}