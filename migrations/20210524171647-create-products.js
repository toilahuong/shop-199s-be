'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      sku: {
        type: Sequelize.STRING,
        unique: true
      },
      description: {
        type: Sequelize.TEXT('long')
      },
      details: {
        type: Sequelize.TEXT('long')
      },
      thumbnail: {
        type: Sequelize.INTEGER
      },
      quantily: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      regular_price: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      sale_price: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'pending'
      },
      slug: {
        type: Sequelize.STRING
      },
      user_id: {
        type: Sequelize.INTEGER,
      },
      post_date: {
        type: Sequelize.DATE
      },
      sale_start_time: {
        type: Sequelize.DATE
      },
      sale_end_time: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },

    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('products');
  }
};