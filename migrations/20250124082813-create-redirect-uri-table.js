'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('redirect_uris', {
      
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
      },
      client_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references:{
          model: 'clients',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      uri: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('redirect_uris');
  }
};
