"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("user_assignments", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      nama: {
        type: Sequelize.STRING(125),
        allowNull: false,
      },
      nip: {
        type: Sequelize.STRING(18),
        allowNull: false,
        index: true,
      },
      kd_satker: {
        type: Sequelize.STRING(6),
        allowNull: true,
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
    });
    await queryInterface.addConstraint("user_assignments", {
      fields: ["nip", "kd_satker", "service_kode"],
      name: "unique_nip",
      type: "unique",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("user_assignments");
  },
};
