const Sequelize = require('sequelize');

const logger = require('../logging/logger');
const {
  MSSQL_DB_NAME,
  MSSQL_USERNAME,
  MSSQL_PASSWORD,
  MSSQL_IPALL_TCP_DYNAMIC_PORTS,
  MSSQL_INSTANCE_NAME
} = process.env;

const sequelize = new Sequelize(MSSQL_DB_NAME, MSSQL_USERNAME, MSSQL_PASSWORD, {
  port: MSSQL_IPALL_TCP_DYNAMIC_PORTS,
  dialect: 'mssql',
  dialectOptions: { instanceName: MSSQL_INSTANCE_NAME },
  logging: message => logger.log({ level: 'verbose', message })
});

module.exports = sequelize;