'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      'ALTER TABLE `trendar`.`user` CHANGE COLUMN `theme_color` `theme_color` INT UNSIGNED NOT NULL DEFAULT 0 ;'
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      'ALTER TABLE `trendar`.`user` CHANGE COLUMN `theme_color` `theme_color` INT NOT NULL DEFAULT 1 ;'
    )
  },
}
