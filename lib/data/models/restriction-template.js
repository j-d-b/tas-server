const Sequelize = require('sequelize');

module.exports = sequelize => (
  sequelize.define('restrictionTemplate', {
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
  })
);
