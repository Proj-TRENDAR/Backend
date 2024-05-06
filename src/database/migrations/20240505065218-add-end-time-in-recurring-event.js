'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      'ALTER TABLE `trendar`.`recurring_event` ADD COLUMN `end_time` DATETIME NULL DEFAULT NULL AFTER `max_num_of_occurrances`;'
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('ALTER TABLE `trendar`.`recurring_event` DROP COLUMN `end_time`;')
  },
}
