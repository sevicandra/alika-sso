"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("roles", {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
      },
      kode: {
        type: Sequelize.STRING(3),
        unique: true,
        allowNull: false,
      },
      role: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      service_kode: {
        type: Sequelize.STRING(3),
        references: {
          model: "services",
          key: "kode",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("roles");
  },
};
