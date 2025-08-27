import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NoteForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const isEditing = Boolean(id);

  // Estados del formulario
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [esPublica, setEsPublica] = useState(false);
  
  // Estados de control
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingNote, setLoadingNote] = useState(isEditing);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Cargar categorías al montar el componente
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch('https://jcuhp5efnm.us-east-1.awsapprunner.com/api/categorias');
        const data = await response.json();
        
        if (data.success) {
          setCategorias(data.data || []);
          // Seleccionar primera categoría por defecto si no está editando
          if (!isEditing && data.data && data.data.length > 0) {
            setCategoriaId(data.data[0].id.toString());
          }
        }
      } catch (error) {
        console.error('Error cargando categorías:', error);
      }
    };

    fetchCategorias();
  }, [isEditing]);

  // Cargar nota si estamos editando
  useEffect(() => {
    if (isEditing && token) {
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
            const note = data.data;
            setTitulo(note.titulo);
            setContenido(note.contenido);
            setCategoriaId(note.categoria_id.toString());
            setEsPublica(note.es_publica);
          } else {
            setError(data.message || 'Error cargando la nota');
          }
        } catch (error) {
          console.error('Error cargando nota:', error);
          setError('Error de conexión');
        } finally {
          setLoadingNote(false);
        }
      };

      fetchNote();
    }
  }, [id, isEditing, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validaciones
    if (!titulo.trim()) {
      setError('El título es obligatorio');
      setLoading(false);
      return;
    }

    if (!contenido.trim()) {
      setError('El contenido es obligatorio');
      setLoading(false);
      return;
    }

    if (!categoriaId) {
      setError('Debes seleccionar una categoría');
      setLoading(false);
      return;
    }

    try {
      const url = isEditing 
        ? `https://jcuhp5efnm.us-east-1.awsapprunner.com/api/notas/${id}`
        : 'https://jcuhp5efnm.us-east-1.awsapprunner.com/api/notas';
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          titulo: titulo.trim(),
          contenido: contenido.trim(),
          categoria_id: parseInt(categoriaId),
          es_publica: esPublica
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(isEditing ? 'Nota actualizada correctamente' : 'Nota creada correctamente');
        
        // Redirigir después de un breve delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setError(data.message || 'Error guardando la nota');
      }
    } catch (error) {
      console.error('Error guardando nota:', error);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  if (loadingNote) {
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {isEditing ? '✏️ Editar Nota' : '➕ Nueva Nota'}
          </h1>

          {/* Mensajes */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título */}
            <div>
              <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-2">
                Título de la nota *
              </label>
              <input
                type="text"
                id="titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Escribe el título de tu nota..."
                disabled={loading}
                maxLength={255}
              />
              <p className="text-xs text-gray-500 mt-1">
                {titulo.length}/255 caracteres
              </p>
            </div>

            {/* Categoría */}
            <div>
              <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-2">
                Categoría *
              </label>
              <select
                id="categoria"
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                <option value="">Selecciona una categoría</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    🏷️ {categoria.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Contenido */}
            <div>
              <label htmlFor="contenido" className="block text-sm font-medium text-gray-700 mb-2">
                Contenido *
              </label>
              <textarea
                id="contenido"
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
                placeholder="Escribe el contenido de tu nota aquí..."
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                {contenido.length} caracteres
              </p>
            </div>

            {/* Nota pública */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="esPublica"
                checked={esPublica}
                onChange={(e) => setEsPublica(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={loading}
              />
              <label htmlFor="esPublica" className="ml-2 block text-sm text-gray-700">
                🌐 Hacer esta nota pública
                <span className="block text-xs text-gray-500">
                  Las notas públicas pueden ser vistas por cualquier persona con el enlace
                </span>
              </label>
            </div>

            {/* Botones */}
            <div className="flex space-x-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300 font-medium"
              >
                {loading 
                  ? (isEditing ? 'Actualizando...' : 'Creando...')
                  : (isEditing ? '✏️ Actualizar Nota' : '➕ Crear Nota')
                }
              </button>

              <Link
                to="/dashboard"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>

        {/* Ayuda */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">💡 Consejos:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Usa títulos descriptivos para encontrar tus notas fácilmente</li>
            <li>• Las categorías te ayudan a organizar mejor tus notas</li>
            <li>• Solo marca como pública si quieres que otros puedan ver la nota</li>
          </ul>
        </div>
      </div>
    </div>
  );
}