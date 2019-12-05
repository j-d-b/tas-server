const Sequelize = require('sequelize');

const logger = require('../logging/logger');

const sequelize = new Sequelize(process.env.DB_CONNECTION_STRING, {
  logging: message => logger.log({ level: 'verbose', message })
});

module.exports = sequelize;