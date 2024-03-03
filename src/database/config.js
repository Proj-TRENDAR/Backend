module.exports = {
  development: {
    // temp
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'test123',
    database: 'trendar',
  },
  test: {
    // temp
    dialect: 'mysql',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWD,
    database: process.env.DB_DATABASE,
  },
  production: {
    // temp
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'test123',
    database: 'trendar',
  },
}
