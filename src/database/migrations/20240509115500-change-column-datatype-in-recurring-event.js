'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      'ALTER TABLE `trendar`.`recurring_event` \n' +
        'CHANGE COLUMN `day_of_week` `day_of_week` TEXT NULL DEFAULT NULL ,\n' +
        'CHANGE COLUMN `day_of_month` `day_of_month` TEXT NULL DEFAULT NULL ,\n' +
        'CHANGE COLUMN `month_of_year` `month_of_year` TEXT NULL DEFAULT NULL ;'
    )
  },

  async down(queryInterface) {},
}
