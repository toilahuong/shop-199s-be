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
    await queryInterface.bulkInsert('permission_groups', [
      {
        name: 'Quản Lý Thành Viên',
      },
      {
        name: 'Quản Lý Bài Viết',
      },
      {
        name: 'Quản Lý Sản Phẩm',
      },
      {
        name: 'Quản Lý Chuyên Mục',
      },
      {
        name: 'Quản Lý Tệp',
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
     await queryInterface.bulkDelete('permission_groups', null, {});
  }
};
