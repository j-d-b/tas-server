const Sequelize = require('sequelize');

module.exports = sequelize => (
  sequelize.define('block', {
    id: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    maxAllowedActionsPerHour: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  })
);
