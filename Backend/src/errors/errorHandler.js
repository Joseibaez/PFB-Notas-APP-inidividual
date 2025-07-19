
const errorHandler = (error, req, res, next) => {
    console.error('Error:', error);
    
    // Error personalizado con httpStatus 
    if (error.httpStatus) {
        return res.status(error.httpStatus).json({
            success: false,
            error: 'Error de aplicación',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
    
    // Error de validación de JWT
    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            error: 'Token inválido',
            message: 'El token proporcionado no es válido'
        });
    }
    
    // Error de token expirado
    if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            error: 'Token expirado',
            message: 'El token ha expirado, por favor inicia sesión nuevamente'
        });
    }
    
    // Error de base de datos - entrada duplicada
    if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
            success: false,
            error: 'Conflicto de datos',
            message: 'El recurso ya existe'
        });
    }
    
    // Error de conexión a BD
    if (error.code === 'ECONNREFUSED') {
        return res.status(503).json({
            success: false,
            error: 'Servicio no disponible',
            message: 'Error de conexión a la base de datos'
        });
    }
    
    // Error de validación de express-validator
    if (error.type === 'validation') {
        return res.status(400).json({
            success: false,
            error: 'Datos inválidos',
            message: 'Los datos proporcionados no son válidos',
            details: error.errors
        });
    }
    
    // Error genérico del servidor
    res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: error.message || 'Ha ocurrido un error inesperado',
        timestamp: new Date().toISOString(),
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
};

export default errorHandler;