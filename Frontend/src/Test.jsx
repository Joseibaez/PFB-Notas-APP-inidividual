const Test = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          🎉 ¡Tailwind CDN Funciona!
        </h1>
        
        <p className="text-gray-600 mb-6 text-center">
          Esto es SÚPER simple. Solo con CDN, sin configuraciones raras.
        </p>
        
        <div className="space-y-3">
          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Botón Azul
          </button>
          <button className="w-full px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
            Botón Blanco
          </button>
          <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
            Botón Rojo
          </button>
        </div>
        
        <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-400 rounded">
          <p className="text-green-800 text-sm">
            ✅ ¡Perfecto! Tailwind está funcionando sin problemas
          </p>
        </div>
        
        <div className="mt-4 flex gap-2 justify-center">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Fácil</span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Simple</span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Funciona</span>
        </div>
      </div>
    </div>
  );
};

export default Test;