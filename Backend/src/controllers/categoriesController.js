import getPool from '../database/getPool.js';

// GET /api/categorias - Obtener todas las categorías
export const getCategories = async (req, res, next) => {
    try {
        const pool = await getPool();

        const [categorias] = await pool.query(`
            SELECT 
                c.id,
                c.nombre,
                c.created_at,
                COUNT(n.id) as total_notas
            FROM categorias c 
            LEFT JOIN notas n ON c.id = n.categoria_id 
            GROUP BY c.id, c.nombre, c.created_at
            ORDER BY c.nombre ASC
        `);

        res.json({
            success: true,
            message: 'Categorías obtenidas exitosamente',
            data: categorias
        });

    } catch (error) {
        next(error); 
    }
};