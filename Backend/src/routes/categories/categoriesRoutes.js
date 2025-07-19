import express from 'express';
import { getCategories } from '../../controllers/categoriesController.js';

const router = express.Router();

// GET /api/categorias - Listar todas las categorías
router.get('/', getCategories);

export default router;