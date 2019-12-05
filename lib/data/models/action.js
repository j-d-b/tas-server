const Sequelize = require('sequelize');

const sequelize = require('../sequelize');

const Action = sequelize.define('action', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: Sequelize.ENUM,
    values: ['IMPORT_FULL', 'STORAGE_EMPTY', 'EXPORT_FULL', 'EXPORT_EMPTY'],
    allowNull: false
  },
  containerId: Sequelize.STRING,
  containerSize: {
    type: Sequelize.ENUM,
    values: ['TWENTYFOOT', 'FORTYFOOT']
  },
  containerWeight: Sequelize.INTEGER,
  containerType: Sequelize.STRING,
  formNumber705: Sequelize.STRING,
  emptyForCityFormNumber: Sequelize.STRING,
  bookingNumber: Sequelize.STRING,
  shippingLine: Sequelize.STRING
});

module.exports = Action;
