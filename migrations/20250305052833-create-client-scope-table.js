"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "client_scopes",
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
        },
        client_id: {
          type: Sequelize.UUID,
          references: {
            model: "clients",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        action_kode: {
          type: Sequelize.STRING(3),
          references: {
            model: "scope_actions",
            key: "kode",
          },
          onUpdate: "CASCADE",
          onDelete: "RESTRICT",
        },
        scope_id: {
          type: Sequelize.UUID,
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
    await queryInterface.addConstraint("client_scopes", {
      type: "unique",
      fields: ["clientId", "action_kode", "scopeId"],
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("client_scopes");
  },
};
