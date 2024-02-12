'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      'CREATE TABLE `trendar`.`routine` (' +
        '  `rountine_idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,' +
        '  `user_id` VARCHAR(45) NOT NULL,' +
        '  `title` VARCHAR(80) NOT NULL,' +
        '  `color` INT NOT NULL DEFAULT 1,' +
        '  `description` TEXT NULL,' +
        '  `weekly_condition` INT NOT NULL DEFAULT 1,' +
        '  `num_of_achievements` INT NULL,' +
        '  `start_time` DATETIME NOT NULL,' +
        '  `end_time` DATETIME NOT NULL,' +
        '  `sequence` INT NULL DEFAULT NULL,' +
        '  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,' +
        '  PRIMARY KEY (`rountine_idx`),  INDEX `FK_ROUTINE_USER_ID_idx` (`user_id` ASC) VISIBLE,' +
        '  CONSTRAINT `FK_ROUTINE_USER_ID` FOREIGN KEY (`user_id`) REFERENCES `trendar`.`user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE);'
    )
    await queryInterface.sequelize.query(
      'CREATE TABLE `trendar`.`completed_routine` (' +
        '  `comproutine_idx` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,' +
        '  `routine_idx` BIGINT UNSIGNED NOT NULL,' +
        '  `completed_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,' +
        '  PRIMARY KEY (`comproutine_idx`),' +
        '  INDEX `FK_COMPROUTINE_ROUTINE_idx` (`routine_idx` ASC) VISIBLE,' +
        '  CONSTRAINT `FK_COMPROUTINE_ROUTINE` FOREIGN KEY (`routine_idx`) REFERENCES `trendar`.`routine` (`rountine_idx`) ON DELETE CASCADE ON UPDATE CASCADE);'
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('DROP TABLE `completed_routine`;')
    await queryInterface.sequelize.query('DROP TABLE `routine`;')
  },
}
