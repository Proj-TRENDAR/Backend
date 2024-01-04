'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      'CREATE TABLE `trendar`.`event` (' +
        '`event_idx` INT UNSIGNED NOT NULL AUTO_INCREMENT,' +
        '`user_id` VARCHAR(45) NOT NULL,' +
        '`title` VARCHAR(80) NOT NULL,' +
        '`is_all_day` TINYINT NOT NULL DEFAULT 0,' +
        '`start_time` DATETIME NULL,' +
        '`end_time` DATETIME NULL,' +
        "`color` INT(1) NOT NULL DEFAULT '1'," +
        '`place` VARCHAR(200) NULL,' +
        '`description` TEXT NULL,' +
        '`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,' +
        '`updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,' +
        '`is_recurring` TINYINT NOT NULL DEFAULT 0,' +
        'PRIMARY KEY (`event_idx`), INDEX `FK_EVENT_USER_ID_idx` (`user_id` ASC) VISIBLE,' +
        'CONSTRAINT `FK_EVENT_USER_ID` FOREIGN KEY (`user_id`) REFERENCES `trendar`.`user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE);'
    )
    await queryInterface.sequelize.query(
      'CREATE TABLE `trendar`.`recurring_event` (' +
        '`recurring_idx` INT UNSIGNED NOT NULL AUTO_INCREMENT,' +
        '`event_idx` INT UNSIGNED NOT NULL,' +
        '`separation_count` INT NULL,' +
        '`repeat_cycle` INT NULL,' +
        '`max_num_of_occurrances` INT NULL,' +
        "`recurring_condition` VARCHAR(1) NOT NULL DEFAULT 'D'," +
        '`weekly_condition` INT NULL,' +
        '`end_time` DATETIME NULL,' +
        'PRIMARY KEY (`recurring_idx`), INDEX `FK_EVENT_USER_ID_idx` (`event_idx` ASC) VISIBLE,' +
        'CONSTRAINT `FK_RECUR_EVENT_EVENT` FOREIGN KEY (`event_idx`) REFERENCES `trendar`.`event` (`event_idx`) ON DELETE CASCADE ON UPDATE CASCADE);'
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('DROP TABLE `recurring_event`;')
    await queryInterface.sequelize.query('DROP TABLE `event`;')
  },
}
