'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('global_roles', {
      id: {
        primaryKey: true,
        type: Sequelize.UUID,
      },
      kode: {
        type: Sequelize.STRING(3),
        unique: true,
        allowNull: false,
        index: true,
      },
      role: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('global_roles');
  }
};