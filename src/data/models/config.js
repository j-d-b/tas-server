const Sequelize = require('sequelize');

module.exports = (sequelize) => (sequelize.define('config', {
  maxAllowedApptsPerHour: {
    type: Sequelize.INTEGER,
    field: 'max_allowed_appts_per_hour',
    allowNull: false
  },
  maxTFUPerAppt: {
    type: Sequelize.INTEGER,
    field: 'max_tfu_per_appt',
    allowNull: false
  }
}, { timestamps: false, freezeTableName: true, underscored: true }));
