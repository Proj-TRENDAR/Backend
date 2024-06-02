'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      'ALTER TABLE `trendar`.`event` CHANGE COLUMN `updated_at` `updated_at` DATETIME NULL DEFAULT NULL ;'
    )
    await queryInterface.sequelize.query(
      'ALTER TABLE `trendar`.`routine` CHANGE COLUMN `updated_at` `updated_at` DATETIME NULL DEFAULT NULL ;'
    )
    await queryInterface.sequelize.query(
      'ALTER TABLE `trendar`.`todo` CHANGE COLUMN `updated_at` `updated_at` DATETIME NULL DEFAULT NULL ;'
    )
    await queryInterface.sequelize.query(
      'ALTER TABLE `trendar`.`user` CHANGE COLUMN `updated_at` `updated_at` DATETIME NULL DEFAULT NULL ;'
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      'ALTER TABLE `trendar`.`user` CHANGE COLUMN `updated_at` `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
    )
    await queryInterface.sequelize.query(
      'ALTER TABLE `trendar`.`todo` CHANGE COLUMN `updated_at` `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP ;'
    )
    await queryInterface.sequelize.query(
      'ALTER TABLE `trendar`.`routine` CHANGE COLUMN `updated_at` `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP ;'
    )
    await queryInterface.sequelize.query(
      'ALTER TABLE `trendar`.`event` CHANGE COLUMN `updated_at` `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP ;'
    )
  },
}
