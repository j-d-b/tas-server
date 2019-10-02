const Sequelize = require('sequelize');

module.exports = sequelize => (
  sequelize.define('restrictionTemplate', {
    name: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    createdBy: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  {
    timestamps: false
  })
);
