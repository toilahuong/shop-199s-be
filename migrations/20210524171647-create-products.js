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
        type: Sequelize.TEXT,
        allowNull: false,
      },
      code: {
        type: Sequelize.TEXT,
        unique: true
      },
      description: {
        type: Sequelize.TEXT
      },
      details: {
        type: Sequelize.STRING
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
        type: Sequelize.TEXT,
        defaultValue: 'pending'
      },
      slug: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('products');
  }
};