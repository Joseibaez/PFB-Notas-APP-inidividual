import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import getPool from '../database/getPool.js';
import generateErrorsUtils from '../utils/generateErrorsUtils.js';

// Función para generar JWT token
const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

// REGISTRO DE USUARIO
export const register = async (req, res, next) => {
    try {
        // Verificar errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const validationError = new Error('Datos de entrada inválidos');
            validationError.type = 'validation';
            validationError.errors = errors.array();
            throw validationError;
        }

        const { email, password } = req.body;
        const pool = await getPool();

        // Verificar si el usuario ya existe
        const [existingUser] = await pool.query(
            'SELECT id FROM usuarios WHERE email = ?',
            [email]
        );

        if (existingUser.length > 0) {
            throw generateErrorsUtils('El email ya está registrado', 409);
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el usuario
        const [result] = await pool.query(
            'INSERT INTO usuarios (email, password) VALUES (?, ?)',
            [email, hashedPassword]
        );

        const userId = result.insertId;

        // Generar token JWT
        const token = generateToken(userId);

        // Respuesta exitosa
        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            data: {
                user: {
                    id: userId,
                    email: email
                },
                token
            }
        });

    } catch (error) {
        next(error); 
    }
};

// LOGIN DE USUARIO
export const login = async (req, res, next) => {
    try {
        // Verificar errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const validationError = new Error('Datos de entrada inválidos');
            validationError.type = 'validation';
            validationError.errors = errors.array();
            throw validationError;
        }

        const { email, password } = req.body;
        const pool = await getPool();

        // Buscar el usuario por email
        const [users] = await pool.query(
            'SELECT id, email, password FROM usuarios WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            throw generateErrorsUtils('Credenciales inválidas', 401);
        }

        const user = users[0];

        // Verificar la contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw generateErrorsUtils('Credenciales inválidas', 401);
        }

        // Generar token JWT
        const token = generateToken(user.id);

        // Respuesta exitosa
        res.json({
            success: true,
            message: 'Login exitoso',
            data: {
                user: {
                    id: user.id,
                    email: user.email
                },
                token
            }
        });

    } catch (error) {
        next(error); // Pasar al errorHandler
    }
};

// VERIFICAR TOKEN (para rutas protegidas)
export const verifyToken = async (req, res, next) => {
    try {
        // El middleware auth ya verificó el token y añadió req.userId
        const pool = await getPool();
        
        const [users] = await pool.query(
            'SELECT id, email FROM usuarios WHERE id = ?',
            [req.userId]
        );

        if (users.length === 0) {
            throw generateErrorsUtils('Usuario no encontrado', 404);
        }

        res.json({
            success: true,
            message: 'Token válido',
            data: {
                user: users[0]
            }
        });

    } catch (error) {
        next(error); 
    }
};