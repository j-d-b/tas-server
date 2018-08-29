const Sequelize = require('sequelize');

module.exports = new Sequelize({
  host: process.env.MYSQL_HOST,
  database: process.env.MYSQL_DATABASE,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  dialect: 'mysql',
  operatorsAliases: false
});
