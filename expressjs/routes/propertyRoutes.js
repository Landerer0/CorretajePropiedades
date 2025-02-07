const express = require('express');
const propertyController = require('../controllers/propertyController');
const upload = require('../middlewares/uploadImage');
const router = express.Router();

// Ruta para obtener una propiedad por ID
router.get('/:id', propertyController.getProperty);
router.post('/create', upload.single('imagen'), propertyController.createProperty);

module.exports = router;