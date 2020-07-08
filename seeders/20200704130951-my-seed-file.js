'use strict';
const bcrypt = require('bcryptjs');
const faker = require('faker');
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
    try {
      await queryInterface.bulkInsert(
        'Users',
        [
          {
            email: 'root@example.com',
            password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
            isAdmin: true,
            name: 'root',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            email: 'user1@example.com',
            password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
            isAdmin: false,
            name: 'user1',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            email: 'user2@example.com',
            password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
            isAdmin: false,
            name: 'user2',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ],
        {}
      );
      await queryInterface.bulkInsert(
        'Restaurants',
        Array.from({ length: 50 }).map((d) => ({
          name: faker.name.findName(),
          tel: faker.phone.phoneNumber(),
          address: faker.address.streetAddress(),
          opening_hours: '08:00',
          image: `https://loremflickr.com/320/240/restaurant,food/?random=${
            Math.random() * 100
          }`,
          description: faker.lorem.text(),
          createdAt: new Date(),
          updatedAt: new Date(),
          CategoryId: Math.floor(Math.random() * 5) + 1
        })),
        {}
      );
      await queryInterface.bulkInsert(
        'Categories',
        [
          'Chinese',
          'Japanese',
          'Italian',
          'Mexican',
          'Vegan',
          'American',
          'Fusion'
        ].map((item, index) => ({
          id: index + 1,
          name: item,
          createdAt: new Date(),
          updatedAt: new Date()
        })),
        {}
      );
    } catch (err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    try {
      await queryInterface.bulkDelete('Users', null, {});
      await queryInterface.bulkDelete('Categories', null, {});
      await queryInterface.bulkDelete('Restaurants', null, {});
    } catch (err) {
      console.log(err);
    }
  }
};
