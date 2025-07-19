import express from 'express';
import { 
    getNotes, 
    createNote, 
    getNote, 
    updateNote, 
    deleteNote, 
    togglePublicNote,
    getPublicNote 
} from '../../controllers/notesController.js';
import { validateNote } from '../../middlewares/validation.js';
import { authenticateToken, optionalAuth } from '../../middlewares/auth.js';

const router = express.Router();

// GET /api/notas - Listar notas del usuario
router.get('/', authenticateToken, getNotes);

// POST /api/notas - Crear nueva nota
router.post('/', authenticateToken, validateNote, createNote);

// GET /api/notas/public/:id - Ver nota pública (ANTES que /:id)
router.get('/public/:id', optionalAuth, getPublicNote);

// GET /api/notas/:id - Obtener nota específica
router.get('/:id', authenticateToken, getNote);

// PUT /api/notas/:id - Actualizar nota
router.put('/:id', authenticateToken, validateNote, updateNote);

// DELETE /api/notas/:id - Eliminar nota
router.delete('/:id', authenticateToken, deleteNote);

// PATCH /api/notas/:id/toggle-public - Cambiar estado público/privado
router.patch('/:id/toggle-public', authenticateToken, togglePublicNote);

export default router;