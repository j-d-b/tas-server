const Sequelize = require('sequelize');
const nanoid = require('nanoid');

const sequelize = require('../sequelize');

const Action = sequelize.define('action', {
  id: {
    type: Sequelize.UUID,
    defaultValue: nanoid,
    primaryKey: true
  },
  type: {
    type: Sequelize.ENUM,
    values: ['IMPORT_FULL', 'STORAGE_EMPTY', 'EXPORT_FULL', 'EXPORT_EMPTY'],
    allowNull: false
  },
  containerId: Sequelize.STRING,
  containerSize: {
    type: Sequelize.ENUM,
    values: ['TWENTYFOOT', 'FORTYFOOT'],
    allowNull: false
  },
  containerType: {
    type: Sequelize.ENUM,
    values: [
      'GENERAL',
      'OPEN_TOP',
      'REEFER',
      'HIGH_CUBE',
      'TANK',
      'PLATFORM',
      'SPECIAL_TYPE',
      'FLATRACK'
    ],
    defaultValue: 'GENERAL',
    allowNull: false
  },
  containerWeight: Sequelize.INTEGER,
  formNumber705: Sequelize.STRING,
  emptyForCityFormNumber: Sequelize.STRING,
  bookingNumber: Sequelize.STRING,
  shippingLine: Sequelize.STRING
});

module.exports = Action;
