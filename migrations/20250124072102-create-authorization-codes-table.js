'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('authorization_codes', {
      code: {
        type: Sequelize.STRING(64),
        allowNull: false,
        unique: true,
      },
      client_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      scope: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      sessionId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      redirect_uri: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('authorization_codes');
  },
};
