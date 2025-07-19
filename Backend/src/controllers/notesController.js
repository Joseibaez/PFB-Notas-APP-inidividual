import { validationResult } from 'express-validator';
import getPool from '../database/getPool.js';
import generateErrorsUtils from '../utils/generateErrorsUtils.js';

// GET /api/notas - Obtener todas las notas del usuario
export const getNotes = async (req, res, next) => {
    try {
        const pool = await getPool();
        const userId = req.userId; // Del middleware auth
        const { categoria } = req.query; // Filtro opcional

        let query = `
            SELECT 
                n.id,
                n.titulo,
                n.contenido,
                n.es_publica,
                n.created_at,
                n.updated_at,
                c.nombre as categoria
            FROM notas n 
            INNER JOIN categorias c ON n.categoria_id = c.id 
            WHERE n.usuario_id = ?
        `;
        
        const params = [userId];

        // Filtrar por categoría si se proporciona
        if (categoria) {
            query += ' AND n.categoria_id = ?';
            params.push(categoria);
        }

        query += ' ORDER BY n.updated_at DESC';

        const [notas] = await pool.query(query, params);

        res.json({
            success: true,
            message: 'Notas obtenidas exitosamente',
            data: notas
        });

    } catch (error) {
        next(error); 
    }
};

// POST /api/notas - Crear nueva nota
export const createNote = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const validationError = new Error('Datos de entrada inválidos');
            validationError.type = 'validation';
            validationError.errors = errors.array();
            throw validationError;
        }

        const { titulo, contenido, categoria_id, es_publica = false } = req.body;
        const userId = req.userId;
        const pool = await getPool();

        // Verificar que la categoría existe
        const [categorias] = await pool.query(
            'SELECT id FROM categorias WHERE id = ?',
            [categoria_id]
        );

        if (categorias.length === 0) {
            throw generateErrorsUtils('La categoría especificada no existe', 400);
        }

        // Crear la nota
        const [result] = await pool.query(
            'INSERT INTO notas (titulo, contenido, usuario_id, categoria_id, es_publica) VALUES (?, ?, ?, ?, ?)',
            [titulo, contenido, userId, categoria_id, es_publica]
        );

        const noteId = result.insertId;

        // Obtener la nota creada con información de categoría
        const [newNote] = await pool.query(`
            SELECT 
                n.id,
                n.titulo,
                n.contenido,
                n.es_publica,
                n.created_at,
                c.nombre as categoria
            FROM notas n 
            INNER JOIN categorias c ON n.categoria_id = c.id 
            WHERE n.id = ?
        `, [noteId]);

        res.status(201).json({
            success: true,
            message: 'Nota creada exitosamente',
            data: newNote[0]
        });

    } catch (error) {
        next(error); 
    }
};

// GET /api/notas/:id - Obtener nota específica
export const getNote = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const pool = await getPool();

        const [notas] = await pool.query(`
            SELECT 
                n.id,
                n.titulo,
                n.contenido,
                n.es_publica,
                n.created_at,
                n.updated_at,
                c.nombre as categoria,
                c.id as categoria_id
            FROM notas n 
            INNER JOIN categorias c ON n.categoria_id = c.id 
            WHERE n.id = ? AND n.usuario_id = ?
        `, [id, userId]);

        if (notas.length === 0) {
            throw generateErrorsUtils('Nota no encontrada', 404);
        }

        res.json({
            success: true,
            message: 'Nota obtenida exitosamente',
            data: notas[0]
        });

    } catch (error) {
        next(error); 
    }
};

// PUT /api/notas/:id - Actualizar nota
export const updateNote = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const validationError = new Error('Datos de entrada inválidos');
            validationError.type = 'validation';
            validationError.errors = errors.array();
            throw validationError;
        }

        const { id } = req.params;
        const { titulo, contenido, categoria_id, es_publica } = req.body;
        const userId = req.userId;
        const pool = await getPool();

        // Verificar que la nota existe y pertenece al usuario
        const [existingNote] = await pool.query(
            'SELECT id FROM notas WHERE id = ? AND usuario_id = ?',
            [id, userId]
        );

        if (existingNote.length === 0) {
            throw generateErrorsUtils('Nota no encontrada', 404);
        }

        // Verificar que la categoría existe si se proporciona
        if (categoria_id) {
            const [categorias] = await pool.query(
                'SELECT id FROM categorias WHERE id = ?',
                [categoria_id]
            );

            if (categorias.length === 0) {
                throw generateErrorsUtils('La categoría especificada no existe', 400);
            }
        }

        // Actualizar la nota
        await pool.query(
            'UPDATE notas SET titulo = ?, contenido = ?, categoria_id = ?, es_publica = ? WHERE id = ?',
            [titulo, contenido, categoria_id, es_publica, id]
        );

        // Obtener la nota actualizada
        const [updatedNote] = await pool.query(`
            SELECT 
                n.id,
                n.titulo,
                n.contenido,
                n.es_publica,
                n.created_at,
                n.updated_at,
                c.nombre as categoria
            FROM notas n 
            INNER JOIN categorias c ON n.categoria_id = c.id 
            WHERE n.id = ?
        `, [id]);

        res.json({
            success: true,
            message: 'Nota actualizada exitosamente',
            data: updatedNote[0]
        });

    } catch (error) {
        next(error); 
    }
};

// DELETE /api/notas/:id - Eliminar nota
export const deleteNote = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const pool = await getPool();

        // Verificar que la nota existe y pertenece al usuario
        const [existingNote] = await pool.query(
            'SELECT id, titulo FROM notas WHERE id = ? AND usuario_id = ?',
            [id, userId]
        );

        if (existingNote.length === 0) {
            throw generateErrorsUtils('Nota no encontrada', 404);
        }

        // Eliminar la nota
        await pool.query('DELETE FROM notas WHERE id = ?', [id]);

        res.json({
            success: true,
            message: 'Nota eliminada exitosamente',
            data: {
                id: parseInt(id),
                titulo: existingNote[0].titulo
            }
        });

    } catch (error) {
        next(error); 
    }
};

// PATCH /api/notas/:id/toggle-public - Cambiar estado público/privado
export const togglePublicNote = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.userId;
        const pool = await getPool();

        // Verificar que la nota existe y pertenece al usuario
        const [existingNote] = await pool.query(
            'SELECT id, es_publica FROM notas WHERE id = ? AND usuario_id = ?',
            [id, userId]
        );

        if (existingNote.length === 0) {
            throw generateErrorsUtils('Nota no encontrada', 404);
        }

        const newPublicStatus = !existingNote[0].es_publica;

        // Actualizar el estado
        await pool.query(
            'UPDATE notas SET es_publica = ? WHERE id = ?',
            [newPublicStatus, id]
        );

        res.json({
            success: true,
            message: `Nota ${newPublicStatus ? 'marcada como pública' : 'marcada como privada'}`,
            data: {
                id: parseInt(id),
                es_publica: newPublicStatus
            }
        });

    } catch (error) {
        next(error); // Pasar al errorHandler
    }
};

// GET /api/notas/public/:id - Ver nota pública (sin autenticación)
export const getPublicNote = async (req, res, next) => {
    try {
        const { id } = req.params;
        const pool = await getPool();

        const [notas] = await pool.query(`
            SELECT 
                n.id,
                n.titulo,
                n.contenido,
                n.created_at,
                c.nombre as categoria,
                u.email as autor
            FROM notas n 
            INNER JOIN categorias c ON n.categoria_id = c.id 
            INNER JOIN usuarios u ON n.usuario_id = u.id
            WHERE n.id = ? AND n.es_publica = true
        `, [id]);

        if (notas.length === 0) {
            throw generateErrorsUtils('Nota pública no encontrada', 404);
        }

        res.json({
            success: true,
            message: 'Nota pública obtenida exitosamente',
            data: notas[0]
        });

    } catch (error) {
        next(error); 
    }
};