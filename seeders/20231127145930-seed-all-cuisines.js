'use strict';
const fs = require('fs');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    let data = JSON.parse(fs.readFileSync('./data/cuisines.json', 'utf-8')).map((el, i) => {
      // el.createdAt = el.updatedAt = new Date()
      let timestamp = new Date().getTime() + i * 1000
      el.createdAt = el.updatedAt = new Date(timestamp)
      return el
    })
    await queryInterface.bulkInsert('Cuisines', data, {})
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Cuisines', null, {
      truncate: true,
      restartIdentity: true,
      cascade: true
    })
  }
};
