"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("client_grant_types", {
      id:{
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
      grant_kode: {
        type: Sequelize.STRING(3),
        references: {
          model: "grant_types",
          key: "kode",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    });
        await queryInterface.addConstraint("client_scopes", {
      type: "unique",
      fields: ["client_id", "grant_kode"],
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("client_grant_types");
  },
};
