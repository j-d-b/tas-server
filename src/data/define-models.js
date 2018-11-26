const action = require('./models/action');
const appt = require('./models/appt');
const block = require('./models/block');
const config = require('./models/config');
const restriction = require('./models/restriction');
const user = require('./models/user');

module.exports = (sequelize) => {
  const Action = action(sequelize);
  const Appt = appt(sequelize);
  const Block = block(sequelize);
  const Config = config(sequelize);
  const Restriction = restriction(sequelize);
  const User = user(sequelize);

  // associations
  Appt.hasMany(Action, { as: 'actions' });
  Action.belongsTo(Appt);

  User.hasMany(Appt, { as: 'appts', foreignKey: 'userEmail' });
  Appt.belongsTo(User, { foreignKey: 'userEmail' });

  Block.hasMany(Action, { as: 'actions' });
  Block.hasMany(Restriction, { as: 'restrictions' });

  return {
    Action,
    Appt,
    Block,
    Config,
    Restriction,
    User
  };
};
