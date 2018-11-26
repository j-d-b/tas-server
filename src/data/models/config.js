const Sequelize = require('sequelize');

module.exports = sequelize => (
  sequelize.define('config', {
    defaultAllowedApptsPerHour: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    maxTFUPerAppt: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    arrivalWindowLength: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  },
  {
    timestamps: false,
    freezeTableName: true
  })
);
