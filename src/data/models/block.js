const Sequelize = require('sequelize');

module.exports = sequelize => (sequelize.define('block', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  maxAllowedApptsPerHour: {
    type: Sequelize.INTEGER,
    field: 'max_allowed_appts_per_hour',
    allowNull: false
  }
}));
