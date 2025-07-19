import jwt from 'jsonwebtoken';

// Middleware para verificar JWT token
export const authenticateToken = (req, res, next) => {
    try {
        // Obtener el token del header Authorization
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Formato : "Bearer TOKEN"

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token de acceso requerido'
            });
        }

        // Verificar el token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: 'Token inválido o expirado'
                });
            }

            // Añadir el userId a la request para uso posterior
            req.userId = decoded.userId;
            next();
        });

    } catch (error) {
        console.error('Error en authenticateToken:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

//  Para las rutas que pueden ser públicas o privadas
export const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            // No hay token, continuar sin autenticación
            req.userId = null;
            return next();
        }

        // Verificar el token si existe
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                // Token inválido, continuar sin autenticación
                req.userId = null;
            } else {
                // Token válido, añadir userId
                req.userId = decoded.userId;
            }
            next();
        });

    } catch (error) {
        console.error('Error en optionalAuth:', error);
        req.userId = null;
        next();
    }
};