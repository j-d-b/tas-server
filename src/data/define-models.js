const Sequelize = require('sequelize');

const defineAppt = require('./models/appt');
const defineBlock = require('./models/block');
const defineConfig = require('./models/config');
const defineRestriction = require('./models/restriction');
const defineUser = require('./models/user');

module.exports = (sequelize) => {
  const Appt = defineAppt(sequelize);
  const Block = defineBlock(sequelize);
  const Config = defineConfig(sequelize);
  const Restriction = defineRestriction(sequelize);
  const User = defineUser(sequelize);

  // associations
  Block.hasMany(Appt, { as: 'Appts', foreignKey: 'block' });
  Block.hasMany(Restriction, { foreignKey: 'block' });
  User.hasMany(Appt, { as: 'Appts', foreignKey: 'userEmail' });
  Appt.belongsTo(User, { foreignKey: 'userEmail', as: 'User' });

  return {
    Appt,
    Block,
    Config,
    Restriction,
    User
  };
};
