'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      'ALTER TABLE `trendar`.`todo` CHANGE COLUMN `todo_idx` `idx` BIGINT UNSIGNED NOT NULL ;'
    )
    await queryInterface.sequelize.query('DROP TABLE `trendar`.`recurring_event`')
    await queryInterface.sequelize.query(
      'ALTER TABLE `trendar`.`event` CHANGE COLUMN `event_idx` `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT ;'
    )
    await queryInterface.sequelize.query(
      'ALTER TABLE `trendar`.`routine` CHANGE COLUMN `routine_idx` `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT ;'
    )
    await queryInterface.sequelize.query(
      'ALTER TABLE `trendar`.`routine_completed` CHANGE COLUMN `routinecomp_idx` `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT ;'
    )
    await queryInterface.sequelize.query(
      'ALTER TABLE `trendar`.`routine_day` CHANGE COLUMN `routineday_idx` `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT ;'
    )
    await queryInterface.sequelize.query(
      'CREATE TABLE `trendar`.`recurring_event` (' +
        '  `idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,' +
        '  `event_idx` BIGINT UNSIGNED NOT NULL,' +
        "  `recurring_type` VARCHAR(1) NOT NULL DEFAULT 'D' COMMENT 'D(일) | W(주) | M(월) | Y(연)'," +
        '  `separation_count` INT NOT NULL DEFAULT 0,' +
        '  `max_num_of_occurrances` INT NULL DEFAULT NULL,' +
        '  `day_of_week` INT NULL DEFAULT NULL,' +
        '  `day_of_month` INT NULL DEFAULT NULL,' +
        '  `week_of_month` INT NULL DEFAULT NULL,' +
        '  `month_of_year` INT NULL DEFAULT NULL,' +
        '  PRIMARY KEY (`idx`), INDEX `FK_RECUR_EVENT_EVENT_idx` (`event_idx` ASC) VISIBLE,' +
        '  CONSTRAINT `FK_RECUR_EVENT_EVENT` FOREIGN KEY (`event_idx`) REFERENCES `trendar`.`event` (`idx`) ON DELETE CASCADE ON UPDATE CASCADE);'
    )
  },

  async down(queryInterface, Sequelize) {},
}
