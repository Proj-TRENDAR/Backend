'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      'ALTER TABLE `trendar`.`recurring_event` \n' +
        "CHANGE COLUMN `day_of_week` `day_of_week` TEXT NULL DEFAULT NULL COMMENT '주마다 반복되는 요일을 array로 가짐\\n0: 일요일, 1:월요일, ..., 6: 토요일' ,\n" +
        "CHANGE COLUMN `day_of_month` `date_of_month` TEXT NULL DEFAULT NULL COMMENT '월마다 반복되는 날짜를 array로 가짐' ,\n" +
        "CHANGE COLUMN `week_of_month` `week_of_month` INT NULL DEFAULT NULL COMMENT '월간 반복 시 반복되는 주차를 가짐' ,\n" +
        "CHANGE COLUMN `month_of_year` `month_of_year` TEXT NULL DEFAULT NULL COMMENT '년마다 반복되는 월을 array로 가짐' ;"
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      "ALTER TABLE `trendar`.`recurring_event` CHANGE COLUMN `date_of_month` `day_of_month` TEXT NULL DEFAULT NULL COMMENT '월마다 반복되는 날짜를 array로 가짐';"
    )
  },
}
