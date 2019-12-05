const Sequelize = require('sequelize');

const sequelize = require('../sequelize');

const Config = sequelize.define('config', {
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
});

module.exports = Config;
