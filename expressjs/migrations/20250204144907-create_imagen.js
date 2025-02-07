"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("imagenes", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      propiedadId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "propiedades",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("imagenes");
  },
};
