const Sequelize = require('sequelize');
const nanoid = require('nanoid');

module.exports = sequelize => (
  sequelize.define('action', {
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
      values: ['TWENTYFOOT', 'FORTYFOOT']
    },
    containerWeight: Sequelize.INTEGER,
    containerType: Sequelize.STRING,
    formNumber705: Sequelize.STRING,
    emptyForCityFormNumber: Sequelize.STRING,
    bookingNumber: Sequelize.STRING,
    vesselName: Sequelize.STRING,
    vesselETA: Sequelize.DATE,
    shippingLine: Sequelize.STRING
  })
);
