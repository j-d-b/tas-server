const Sequelize = require('sequelize');

const logger = require('../logging/logger');

module.exports = new Sequelize(process.env.DB_CONNECTION_STRING, {
  operatorsAliases: false,
  logging: message => logger.log({ level: 'verbose', message })
});
