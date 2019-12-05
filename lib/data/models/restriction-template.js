const Sequelize = require('sequelize');

const sequelize = require('../sequelize');

const RestrictionTemplate = sequelize.define('restrictionTemplate', {
  name: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  isApplied: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
},
{
  timestamps: false
});

module.exports = RestrictionTemplate;
