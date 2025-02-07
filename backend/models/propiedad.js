const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Propiedad = sequelize.define('Propiedad', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    precio: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'propiedades',
    timestamps: true, // Para createdAt y updatedAt
});

module.exports = Propiedad;