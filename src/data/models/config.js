const Sequelize = require('sequelize');

module.exports = sequelize => (sequelize.define('config', {
  defaultAllowedApptsPerHour: {
    type: Sequelize.INTEGER,
    field: 'default_allowed_appts_per_hour',
    allowNull: false
  },
  maxTFUPerAppt: {
    type: Sequelize.INTEGER,
    field: 'max_tfu_per_appt',
    allowNull: false
  },
  arrivalWindowLength: {
    type: Sequelize.INTEGER,
    field: 'arrival_window_length',
    allowNull: false
  }
}, { timestamps: false, freezeTableName: true, underscored: true }));
