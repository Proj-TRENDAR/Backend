'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      'CREATE TABLE `trendar`.`routine_day` (' +
        '  `routineday_idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,' +
        '  `routine_idx` BIGINT UNSIGNED NOT NULL,' +
        '  `day` INT UNSIGNED NOT NULL DEFAULT 0,' +
        '  PRIMARY KEY (`routineday_idx`),' +
        '  INDEX `FK_ROUTINEDAY_ROUTINE_idx` (`routine_idx` ASC) VISIBLE,' +
        '  CONSTRAINT `FK_ROUTINEDAY_ROUTINE` FOREIGN KEY (`routine_idx`) REFERENCES `trendar`.`routine` (`routine_idx`) ON DELETE CASCADE ON UPDATE CASCADE)' +
        "COMMENT = '루틴에 해당하는 요일을 저장\n0 = 일요일, 1 = 월요일, ... , 6 = 토요일';"
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('DROP TABLE `routine_day`;')
  },
}
