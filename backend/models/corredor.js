const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/database');

const Corredor = sequelize.define('Corredor', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING(15),
        allowNull: true,
    }
}, {
    tableName: 'corredores',
    timestamps: false,
});

module.exports = Corredor;


