import { body } from 'express-validator';

// Validaciones para registro de usuario
export const validateRegister = [
    body('email')
        .isEmail()
        .withMessage('Debe ser un email válido')
        .normalizeEmail()
        .isLength({ min: 5, max: 255 })
        .withMessage('El email debe tener entre 5 y 255 caracteres'),
    
    body('password')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('La contraseña debe contener al menos: una minúscula, una mayúscula y un número')
];

// Validaciones para login de usuario
export const validateLogin = [
    body('email')
        .isEmail()
        .withMessage('Debe ser un email válido')
        .normalizeEmail(),
    
    body('password')
        .notEmpty()
        .withMessage('La contraseña es requerida')
];

// Validaciones para crear/editar nota
export const validateNote = [
    body('titulo')
        .trim()
        .isLength({ min: 1, max: 255 })
        .withMessage('El título es requerido y debe tener máximo 255 caracteres'),
    
    body('contenido')
        .trim()
        .isLength({ min: 1 })
        .withMessage('El contenido es requerido'),
    
    body('categoria_id')
        .isInt({ min: 1 })
        .withMessage('La categoría debe ser un número válido'),
    
    body('es_publica')
        .optional()
        .isBoolean()
        .withMessage('es_publica debe ser true o false')
];