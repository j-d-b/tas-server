const Sequelize = require('sequelize');

const appt = require('./models/appt');
const block = require('./models/block');
const config = require('./models/config');
const restriction = require('./models/restriction');
const user = require('./models/user');

module.exports = (sequelize) => {
  const Appt = appt(sequelize);
  const Block = block(sequelize);
  const Config = config(sequelize);
  const Restriction = restriction(sequelize);
  const User = user(sequelize);

  // associations
  Block.hasMany(Appt, { as: 'appts', foreignKey: 'block' });
  Block.hasMany(Restriction, { as: 'restrictions', foreignKey: 'block' });
  User.hasMany(Appt, { as: 'appts', foreignKey: 'userEmail' });
  Appt.belongsTo(User, { as: 'user', foreignKey: 'userEmail' });

  return {
    Appt,
    Block,
    Config,
    Restriction,
    User
  };
};
