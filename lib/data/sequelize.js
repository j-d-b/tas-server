const Sequelize = require('sequelize');

const logger = require('../logging/logger');
const { MSSQL_DB_NAME, MSSQL_USERNAME, MSSQL_PASSWORD, MSSQL_IPALL_TCP_DYNAMIC_PORTS } = process.env;

const sequelize = new Sequelize(MSSQL_DB_NAME, MSSQL_USERNAME, MSSQL_PASSWORD, {
  port: MSSQL_IPALL_TCP_DYNAMIC_PORTS,
  dialect: 'mssql',
  dialectOptions: { instanceName: 'SQLEXPRESS' },
  logging: message => logger.log({ level: 'verbose', message })
});

module.exports = sequelize;