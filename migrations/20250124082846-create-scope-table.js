"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "scopes",
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
        },
        service_kode: {
          type: Sequelize.STRING(3),
          allowNull: false,
          references: {
            model: "services",
            key: "kode",
          },
          onUpdate: "CASCADE",
          onDelete: "RESTRICT",
        },
        kode: {
          type: Sequelize.STRING(3),
          allowNull: false,
        },
        scope: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
      },
    );
    await queryInterface.addConstraint("scopes", {
      type: "unique",
      fields: ["service_kode", "kode"],
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("scopes");
  },
};
