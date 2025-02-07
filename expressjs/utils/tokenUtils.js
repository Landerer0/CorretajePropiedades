const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const TokenUtils = {
    generateAccessToken(user) {
        return jwt.sign(
            { id: user.id, name: user.name },
            ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' } // Expira en 15 minutos
        );
    },

    generateRefreshToken(user) {
        return jwt.sign(
            { id: user.id, name: user.name },
            REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' } // Expira en 7 días
        );
    },

    verifyToken(token, type = 'access') {
        try {
            const secret = type === 'access' ? ACCESS_TOKEN_SECRET : REFRESH_TOKEN_SECRET;
            return jwt.verify(token, secret); // Retorna el payload si el token es válido
        } catch (error) {
            return null; // Token inválido o expirado
        }
    },
};

module.exports = TokenUtils;
