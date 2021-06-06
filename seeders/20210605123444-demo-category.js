'use strict';

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
     await queryInterface.bulkInsert('categories', [
      {
        name: 'Chưa phân loại',
        category_type: 'post',
        parent_id: 0,
        slug: 'chua-phan-loai-1',
        default: true
      },
      {
        name: 'Chưa phân loại',
        category_type: 'product',
        parent_id: 0,
        slug: 'chua-phan-loai-2',
        default: true
      }
    ], {});
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
