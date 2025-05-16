'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_global_roles', {
      userId: {
        type: Sequelize.UUID,
        primaryKey: true,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      role: {
        type: Sequelize.STRING(3),
        primaryKey: true,
        references: {
          model: "global_roles",
          key: "kode",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_global_roles');
  }
};