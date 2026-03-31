"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    queryInterface.createTable("jabatan_services", {
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
      kode_satker: {
        type: Sequelize.STRING(6),
        allowNull: false,
      },
      kode_organisasi: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      kode_jabatan: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("jabatan_services");
  },
};
