const Sequelize = require('sequelize');

module.exports = new Sequelize(process.env.DB_CONNECTION_STRING, {
  operatorsAliases: false,
  logging: false
});
