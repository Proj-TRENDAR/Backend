'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      'ALTER TABLE `trendar`.`routine` \n' +
        'DROP COLUMN `num_of_achievements`,\n' +
        'ADD COLUMN `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER `created_at`,\n' +
        'ADD COLUMN `deleted_at` DATETIME NULL DEFAULT NULL AFTER `updated_at`;'
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      'ALTER TABLE `trendar`.`routine` DROP COLUMN `updated_at`, DROP COLUMN `deleted_at`, ADD COLUMN `num_of_achievements` INT NULL AFTER `description`;'
    )
  },
}
