const redisClient = require('../config/redis');

const TokenService = {
    async storeRefreshToken(userId, token, expiresIn = 3600) {
        const key = `refreshToken:${userId}`;
        await redisClient.set(key, token, {
            EX: expiresIn, // Expiración en segundos, es decir 1 hora
        });
        console.log(`Refresh token stored for user ${userId}`);
    },

    async getRefreshToken(userId) {
        const key = `refreshToken:${userId}`;
        return await redisClient.get(key);
    },

    async deleteRefreshToken(userId) {
        const key = `refreshToken:${userId}`;
        await redisClient.del(key);
        console.log(`Refresh token deleted for user ${userId}`);
    },
};

module.exports = TokenService;
