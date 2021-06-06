'use strict';
const faker = require('faker');
faker.locale = "vi";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   for(let i = 1; i <= 50; i++) {
    await queryInterface.bulkInsert('posts', [
      {
        title: faker.lorem.text(),
        content: faker.lorem.paragraphs(),
        post_type: 'page',
        status: 'public',
        slug: faker.lorem.slug(),
      }
    ], {});
   }
     
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
