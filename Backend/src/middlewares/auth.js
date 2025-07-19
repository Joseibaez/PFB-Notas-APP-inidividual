import jwt from 'jsonwebtoken';
import generateErrorsUtils from '../utils/generateErrorsUtils.js';

// Middleware para verificar JWT token
export const authenticateToken = (req, res, next) => {
    try {
        // Obtener el token del header Authorization
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Formato : "Bearer TOKEN"

        if (!token) {
            return next(generateErrorsUtils('Token de acceso requerido', 401));
        }

        // Verificar el token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return next(generateErrorsUtils('Token inválido o expirado', 403));
            }

            // Añadir el userId a la request para uso posterior
            req.userId = decoded.userId;
            next();
        });

    } catch (error) {
        next(error); // Pasar al errorHandler
    }
};

// Para las rutas que pueden ser públicas o privadas
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
        // En optionalAuth, los errores no deben cortar el flujo
        req.userId = null;
        next();
    }
};