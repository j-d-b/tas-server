const Sequelize = require('sequelize');

module.exports = sequelize => (
  sequelize.define('user', {
    email: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    role: {
      type: Sequelize.ENUM,
      values: ['CUSTOMER', 'OPERATOR', 'ADMIN'],
      defaultValue: 'CUSTOMER',
      allowNull: false
    },
    confirmed: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    emailVerified: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    reminderSetting: {
      type: Sequelize.ENUM,
      values: ['NONE', 'EMAIL', 'SMS', 'BOTH'],
      allowNull: false,
      defaultValue: 'NONE'
    },
    company: {
      type: Sequelize.STRING,
      allowNull: false
    },
    mobileNumber: Sequelize.STRING,
    companyType:Sequelize.STRING,
    companyRegNumber: Sequelize.STRING,
    refreshToken: Sequelize.STRING
  })
);
