const notFoundHandler = (req, res) => {
    res.status(404).json({
        error: 'Endpoint no encontrado',
        message: `La ruta ${req.originalUrl} no existe`,
        timestamp: new Date().toISOString(),
        method: req.method,
        path: req.originalUrl
    });
};

export default notFoundHandler;