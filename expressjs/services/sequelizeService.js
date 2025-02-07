const Corredor = require('../models/Corredor');
const Propiedad = require('../models/propiedad');
const Imagen = require('../models/Imagen');

const SequelizeService = {
    async createCorredor(data) {
        return await Corredor.create(data);
    },

    async getCorredores() {
        return await Corredor.findAll();
    },

    // Agrega más métodos para actualizar y eliminar corredores

    async createPropiedad(data) {
        return await Propiedad.create(data);
    },

    async getPropiedades() {
        return await Propiedad.findAll();
    },

    // Agrega más métodos para actualizar y eliminar propiedades

    async createImagen(data) {
        return await Imagen.create(data);
    },

    async getImagenes() {
        return await Imagen.findAll();
    },

    // Agrega más métodos para actualizar y eliminar imágenes
};

module.exports = SequelizeService;