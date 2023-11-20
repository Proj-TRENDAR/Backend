'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      'CREATE TABLE `trendar`.`social` (' +
        '  `user_id` VARCHAR(45) NOT NULL,' +
        '  `social` VARCHAR(20) NOT NULL,' +
        '  `connected_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,' +
        '  PRIMARY KEY (`user_id`),' +
        '  CONSTRAINT `FK_SOCIAL_USER_ID`' +
        '  FOREIGN KEY (`user_id`) REFERENCES `trendar`.`user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE);'
    )
    await queryInterface.sequelize.query(
      'CREATE TABLE `trendar`.`todo` (' +
        '  `todo_idx` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,' +
        '  `user_id` VARCHAR(45) NOT NULL,' +
        '  `title` VARCHAR(80) NOT NULL,' +
        '  `is_done` TINYINT NOT NULL DEFAULT 0,' +
        '  `applied_at` DATETIME NOT NULL,' +
        '  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,' +
        '  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,' +
        '  `sequence` INT(1) NOT NULL DEFAULT 1,' +
        '  PRIMARY KEY (`todo_idx`),' +
        '  INDEX `FK_TODO_USER_ID_idx` (`user_id` ASC) INVISIBLE,' +
        '  CONSTRAINT `FK_TODO_USER_ID` FOREIGN KEY (`user_id`) REFERENCES `trendar`.`user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE);'
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('DROP TABLE `todo`;')
    await queryInterface.sequelize.query('DROP TABLE `social`;')
  },
}
