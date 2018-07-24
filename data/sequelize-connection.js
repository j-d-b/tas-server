const chalk = require('chalk');
const Sequelize = require('sequelize');

module.exports = new Sequelize({
  host: process.env.MARIADB_HOST,
  database: process.env.MARIADB_DATABASE,
  username: process.env.MARIADB_USER,
  password: process.env.MARIADB_PASSWORD,
  dialect: 'mysql'
});
