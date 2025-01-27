import jwt from 'jsonwebtoken';

export const verifyRole = (allowedRoles) => {
    return (req, res, next) => {
        // Obtener el token del encabezado x-access-token directamente sin split
        const token = req.header('x-access-token');

        if (!token) {
            return res.status(401).json({ message: 'Acceso no autorizado. Token no proporcionado.' });
        }

        try {
            // Decodificar el token usando la clave secreta
            const decoded = jwt.verify(token, req.app.get("secretKey"));
            
            if (allowedRoles.includes(decoded.role)) {
                req.user = decoded; // Almacenar los datos del usuario en req
                next(); // Si tiene acceso, continúa
            } else {
                return res.status(403).json({ message: 'Acceso denegado. Rol insuficiente.' });
            }
        } catch (err) {
            return res.status(401).json({ message: 'Token inválido.' });
        }
    };
};
