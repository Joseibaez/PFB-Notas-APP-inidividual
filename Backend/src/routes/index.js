import express from 'express';
import authUserRoutes from './user/authUserRoutes.js';
import notesRoutes from './notes/notesRoutes.js';
import categoriesRoutes from './categories/categoriesRoutes.js';

const router = express.Router();

// Rutas de usuarios (auth)
router.use('/auth', authUserRoutes);

// Rutas de notas
router.use('/notas', notesRoutes);

// Rutas de categorías
router.use('/categorias', categoriesRoutes);

// Info de endpoints disponibles
router.get('/', (req, res) => {
    res.json({
        message: 'API de Notas - Endpoints Disponibles',
        version: '1.0.0',
        endpoints: {
            auth: {
                register: 'POST /api/auth/register',
                login: 'POST /api/auth/login', 
                verify: 'GET /api/auth/verify',
                me: 'GET /api/auth/me'
            },
            notas: {
                list: 'GET /api/notas',
                create: 'POST /api/notas',
                get: 'GET /api/notas/:id',
                update: 'PUT /api/notas/:id',
                delete: 'DELETE /api/notas/:id',
                togglePublic: 'PATCH /api/notas/:id/toggle-public',
                viewPublic: 'GET /api/notas/public/:id'
            },
            categorias: {
                list: 'GET /api/categorias'
            }
        }
    });
});

export default router;