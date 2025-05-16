"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("users", {
      sub: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true,
      },
      id: {
        type: Sequelize.UUID,
        allowNull: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      kode_kl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      nama_kl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      nip: {
        type: Sequelize.STRING(18),
        allowNull: false,
        unique: true,
        index: true,
      },
      jabatan: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      jenis_jabatan: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      kode_organisasi: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      organisasi: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      kode_satker: {
        type: Sequelize.STRING(6),
        allowNull: true,
      },
      satker: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      gravatar: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      preferred_username: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      nik: {
        type: Sequelize.STRING(16),
        allowNull: true,
      },
      npwp: {
        type: Sequelize.STRING(16),
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("users");
  },
};
