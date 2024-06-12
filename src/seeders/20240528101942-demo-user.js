'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        username: 'Yuki',
        email: 'yuki@gmail.com',
        password: '$2y$10$cJ2hbULjQUN9q3ck3ReW7eWrQD2zjGbi9cmH1cMwoDlTYng79d1Mm',
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  },
};
