const Sequelize = require('sequelize');

const Appt = require('./models/appt');
const Block = require('./models/block');
const Config = require('.models/config');
const Restriction = require('.models/restriction');
const User = require('models/user');

module.exports = (sequelize) => {
  // associations
  Block.hasMany(Appt, { as: 'Appts', foreignKey: 'block' });
  Block.hasMany(Restriction, { foreignKey: 'block' });
  User.hasMany(Appt, { as: 'Appts', foreignKey: 'userEmail' });
  Appt.belongsTo(User, { foreignKey: 'userEmail', as: 'User' });

  return {
    Appt,
    Restriction,
    Block,
    Config,
    User
  };
};
