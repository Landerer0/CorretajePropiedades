const express = require('express');
const router = express.Router();
const { getAllCorredores } = require('../controllers/corredorController');

router.get('/', getAllCorredores); // Ruta para obtener todos los corredores

module.exports = router;
