'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query("ALTER TABLE `trendar`.`todo` CHANGE COLUMN `idx` `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT ;")
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query("ALTER TABLE `trendar`.`todo` CHANGE COLUMN `idx` `idx` BIGINT UNSIGNED NOT NULL ;")
  }
};
