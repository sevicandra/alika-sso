'use strict';

const { name } = require('ejs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('services', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
      },
      kode: {
        type: Sequelize.STRING(3),
        allowNull: false,
        unique: true,
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('services');
  }
};