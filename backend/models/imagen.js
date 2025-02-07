// models/Imagen.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Propiedad = require('./propiedad');

const Imagen = sequelize.define('Imagen', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'imagenes',
    timestamps: false,
});

module.exports = Imagen;