"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("client_grant_types", {
      clientId: {
        type: Sequelize.UUID,
        primaryKey: true,
        references: {
          model: "clients",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      grant: {
        type: Sequelize.STRING(3),
        primaryKey: true,
        references: {
          model: "grant_types",
          key: "kode",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("client_grant_types");
  },
};
