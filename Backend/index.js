import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares básicos
app.use(cors());
app.use(express.json()); // Para parsear JSON de React

// Ruta básica de health check
app.get('/', (req, res) => {
    res.json({ 
        message: '🚀 API de Notas funcionando',
        status: 'OK',
        version: '1.0.0'
    });
});

// TODO: Aquí irán las rutas organizadas
// app.use('/api/auth', authRoutes);
// app.use('/api/notas', notasRoutes);
// app.use('/api/categorias', categoriasRoutes);

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint no encontrado',
        message: `La ruta ${req.originalUrl} no existe`
    });
});

// Middleware global de manejo de errores
app.use((error, req, res, next) => {
    console.error('❌ Error:', error);
    res.status(500).json({
        error: 'Error interno del servidor',
        message: error.message
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
    console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🗄️  Base de datos: ${process.env.MYSQL_DATABASE}`);
});

export default app;