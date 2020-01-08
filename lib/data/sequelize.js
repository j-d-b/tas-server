const Sequelize = require('sequelize');

const logger = require('../logging/logger');
const { MSSQL_DB_NAME, MSSQL_USERNAME, MSSQL_PASSWORD } = process.env;

const sequelize = new Sequelize(MSSQL_DB_NAME, MSSQL_USERNAME, MSSQL_PASSWORD, {
  dialect: 'mssql',
  logging: message => logger.log({ level: 'verbose', message })
});

module.exports = sequelize;