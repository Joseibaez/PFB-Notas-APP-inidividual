import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './src/routes/index.js';
import notFoundHandler from './src/errors/notFoundHandler.js';
import errorHandler from './src/errors/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json()); 

// Ruta health check
app.get('/', (req, res) => {
    res.json({ 
        message: '🚀 API de Notas funcionando',
        status: 'OK',
        version: '1.0.0'
    });
});

// Rutas API
app.use('/api', apiRoutes);

//  rutas no encontradas
app.use('*', notFoundHandler);

// Manejador de errores
app.use(errorHandler);

export default app;