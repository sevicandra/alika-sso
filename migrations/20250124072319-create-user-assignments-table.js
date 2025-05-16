"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("user_assignments", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      nama: {
        type: Sequelize.STRING(125),
        allowNull: false,
      },
      nip: {
        type: Sequelize.STRING(18),
        allowNull: false,
        index: true,
        references: {
          model: "users",
          key: "nip",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      kd_satker: {
        type: Sequelize.STRING(6),
        allowNull: false,
      },
    });
    await queryInterface.addConstraint("user_assignments", {
      fields: ["nip", "kd_satker"],
      name: "unique_nip",
      type: "unique",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("user_assignments");
  },
};
