"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "client_scopes",
      {
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
        action_kode:{
          type: Sequelize.STRING(3),
          primaryKey: true,
          references: {
            model: "scope_actions", 
            key: "kode", 
          },
          onUpdate: "CASCADE",
          onDelete: "RESTRICT",
        },
        scopeId: {
          type: Sequelize.UUID,
          primaryKey: true,
          references: {
            model: "scopes", 
            key: "id", 
          },
          onUpdate: "CASCADE",
          onDelete: "RESTRICT",
        },
      },
      {
        timestamps: false,
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("client_scopes");
  },
};
