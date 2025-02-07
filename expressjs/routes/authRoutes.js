const express = require('express');
const authController = require('../controllers/authController');
const { authenticateJWT } = require('../middlewares/auth.middleware'); // Usa require

const router = express.Router();

router.post('/register', authController.validate('register'), authController.register); 
router.post('/login',  authController.login);
router.post('/refresh-token', authController.refreshToken);
router.delete('/logout', authController.logout);

router.get('/protected', authenticateJWT, (req, res) => {
    res.json({ message: 'Ruta protegida', userId: req.userId });
  });

module.exports = router;