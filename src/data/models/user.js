const Sequelize = require('sequelize');

module.exports = sequelize => (sequelize.define('user', {
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
    defaultValue: false,
    field: 'email_verified'
  },
  reminderSetting: {
    type: Sequelize.ENUM,
    values: ['NONE', 'EMAIL', 'SMS', 'BOTH'],
    allowNull: false,
    defaultValue: 'NONE',
    field: 'reminder_setting'
  },
  company: {
    type: Sequelize.STRING,
    allowNull: false
  },
  mobileNumber: {
    type: Sequelize.STRING,
    field: 'mobile_number'
  },
  companyType: {
    type: Sequelize.STRING,
    field: 'company_type'
  },
  companyRegNumber: {
    type: Sequelize.STRING,
    field: 'company_reg_number'
  },
  refreshToken: {
    type: Sequelize.STRING,
    field: 'refresh_token'
  }
}, { underscored: true }));
