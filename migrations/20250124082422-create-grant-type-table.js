"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("grant_types", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      kode: {
        type: Sequelize.STRING(3),
        allowNull: false,
        unique: true,
      },
      grant: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("grant_types");
  },
};
