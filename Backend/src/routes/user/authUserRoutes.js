import express from 'express';
import { register, login, verifyToken } from '../../controllers/authController.js';
import { validateRegister, validateLogin } from '../../middlewares/validation.js';
import { authenticateToken } from '../../middlewares/auth.js';

const router = express.Router();

// POST /api/auth/register - Registrar nuevo usuario
router.post('/register', validateRegister, register);

// POST /api/auth/login - Iniciar sesión
router.post('/login', validateLogin, login);

// GET /api/auth/verify - Verificar token válido (ruta protegida)
router.get('/verify', authenticateToken, verifyToken);

export default router;