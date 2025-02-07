const request = require('supertest');
const app = require('../index'); // Ahora importamos 'app' desde 'index.js'
const sequelize = require('../config/database');
const Corredor = require('../models/Corredor'); // Si es necesario importar el modelo
const redisClient = require('../config/redis'); // Importa correctamente redisClient

let server; // Guardamos la referencia del servidor

beforeAll(async () => {

    // Iniciar el servidor en el entorno de pruebas
    server = app.listen(process.env.PORT || 3000, () => {
        console.log(`Test server is running on port ${process.env.PORT || 3000}`);
    });

    
    // Primero eliminamos todas las tablas
    await sequelize.drop(); // Elimina todas las tablas de la base de datos

    // Luego recreamos las tablas
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await redisClient.quit();
    await sequelize.close(); // Cierra la conexión a la base de datos
    server.close(); // Cierra el servidor Express
});

describe('Auth API', () => {
    let accessToken;
    let refreshToken;
    it('should register a new user', async () => {
        const res = await request(app) // Ahora usamos 'app' para interactuar con la aplicación
            .post('/api/auth/register')
            .send({
                name: 'Juan2 Pérez',
                email: 'juan2.perez@example.com',
                password: 'tu_contraseña_segura2',
                phone: '123456789',
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id'); // Verifica que el ID del usuario sea devuelto
    });

    it('should login an existing user', async () => {
        // Luego, intenta iniciar sesión con el usuario registrado
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                name: 'Juan2 Pérez', // Cambiado a email
                password: 'tu_contraseña_segura2',
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('accessToken');
        expect(res.body).toHaveProperty('refreshToken');
        accessToken = res.body.accessToken;
        refreshToken = res.body.refreshToken;
    });

    it('should refresh token of an existing user', async () => {
        // Luego, intenta iniciar sesión con el usuario registrado
        const res = await request(app)
            .post('/api/auth/refresh-token')
            .send({
                token: refreshToken
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('accessToken');
        accessToken = res.body.accessToken;
    });

    it('should logout an existing user', async () => {
        // Luego, intenta iniciar sesión con el usuario registrado
        const res = await request(app)
            .delete('/api/auth/logout')
            .send({
                token: refreshToken
            });

        expect(res.statusCode).toEqual(204);
    });

    // Puedes agregar más pruebas aquí si es necesario
});
