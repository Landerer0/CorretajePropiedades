const TokenUtils = require('../utils/tokenUtils');
const TokenService = require('../services/tokenService');
const Corredor = require('../models/Corredor'); // Modelo de base de datos

const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const redisClient = require('../config/redis')

// Validaciones para las rutas
exports.validate = (method) => {
    switch (method) {
        case 'register': {
            return [
                check('name').notEmpty().withMessage('Name is required'),
                check('password').notEmpty().withMessage('Password is required'),
                check('email').notEmpty().withMessage('Email is required'),
                check('phone').notEmpty().withMessage('Phone number is required')
            ];
        }
    }
};

// Controlador para registrar usuarios
exports.register = async (req, res) => {
    try {
        // Validar entrada
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password, phone } = req.body;

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el nuevo usuario
        const nuevoCorredor = await Corredor.create({
            name,
            email,
            password: hashedPassword,
            phone
        });

        res.status(201).json(nuevoCorredor);
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// // Controlador para login
// exports.login = async (req, res) => {
//     try {
//         // Validar entrada
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }

//         const { name, password } = req.body;

//         // Verificar las credenciales
//         const user = await Corredor.findOne({ where: { name } });
//         if (!user || !(await bcrypt.compare(password, user.password))) {
//             return res.status(401).json({ message: 'Invalid credentials' });
//         }

//         // Generar tokens
//         const accessToken = TokenUtils.generateAccessToken(user);
//         const refreshToken = TokenUtils.generateRefreshToken(user);

//         // Almacenar el refresh token en Redis
//         await TokenService.storeRefreshToken(user.id, refreshToken);

//         res.json({ accessToken, refreshToken });
//     } catch (error) {
//         console.error('Error during login:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

// // Controlador para refrescar token
// exports.refreshToken = async (req, res) => {
//     try {
//         // Validar entrada
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }

//         const { token } = req.body;

//         // Validar el token
//         const payload = TokenUtils.verifyToken(token, 'refresh');
//         if (!payload) {
//             return res.status(403).json({ message: 'Invalid or expired token' });
//         }

//         // Verificar token en Redis
//         const storedToken = await TokenService.getRefreshToken(payload.id);
//         if (storedToken !== token) {
//             return res.status(403).json({ message: 'Invalid refresh token' });
//         }

//         // Generar nuevo access token
//         const accessToken = TokenUtils.generateAccessToken(payload);

//         res.json({ accessToken });
//     } catch (error) {
//         console.error('Error during refreshToken:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Corredor.findOne({ where: {email: email} });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const accessToken = TokenUtils.generateAccessToken(user.id);
        const refreshToken = TokenUtils.generateRefreshToken(user.id);

        // Guardar el refresh token en Redis (con TTL de 7 días)
        await redisClient.set(
            `refresh_token:${user.id}`,
            await bcrypt.hash(refreshToken, 10),
            { EX: 7 * 24 * 60 * 60 } // Expira en 7 días
        );

        // Enviar tokens en cookies HttpOnly
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000, // 15 min
        });

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
        });

        // Almacenar el refresh token en Redis
        await TokenService.storeRefreshToken(user.id, refreshToken);

        res.json({ message: 'Login exitoso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) return res.sendStatus(401);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
        if (err) return res.sendStatus(403);

        // Obtener el refresh token hasheado desde Redis
        const hashedToken = await redisClient.get(`refresh_token:${decoded.sub}`);
        if (!hashedToken || !(await bcrypt.compare(refreshToken, hashedToken))) {
            return res.sendStatus(403);
        }

        // Generar nuevo access token
        const newAccessToken = generateAccessToken(decoded.sub);
        res.cookie('access_token', newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000,
        });

        res.json({ message: 'Token renovado' });
    });
};

// Controlador para logout
// exports.logout = async (req, res) => {
//     try {
//         // Validar entrada
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }

//         const { token } = req.body;

//         const payload = TokenUtils.verifyToken(token, 'refresh');
//         if (payload) {
//             await TokenService.deleteRefreshToken(payload.id);
//         }

//         res.status(204).send();
//     } catch (error) {
//         console.error('Error during logout:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

exports.logout = async (req, res) => {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) return res.sendStatus(204); // No Content

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
        if (err) return res.sendStatus(204);

        // Eliminar el refresh token de Redis
        await redisClient.del(`refresh_token:${decoded.sub}`);

        // Limpiar cookies
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');

        res.sendStatus(204);
    });
};