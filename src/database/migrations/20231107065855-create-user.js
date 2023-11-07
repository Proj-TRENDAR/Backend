'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      'CREATE TABLE `user` (' +
        '`id` varchar(45) NOT NULL, ' +
        '`name` varchar(45) NOT NULL, ' +
        '`email` varchar(100) NOT NULL, ' +
        '`img_url` varchar(1000) DEFAULT NULL,' +
        '`created_at` datetime DEFAULT CURRENT_TIMESTAMP,' +
        '`refresh_token` varchar(250) DEFAULT NULL,' +
        "`thema_color` int NOT NULL DEFAULT '1'," +
        'PRIMARY KEY (`id`) );'
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user')
    // await queryInterface.sequelize.query('DROP TABLE `user`;')
  },
}
