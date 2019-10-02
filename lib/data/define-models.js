const action = require('./models/action');
const appt = require('./models/appt');
const config = require('./models/config');
const restriction = require('./models/restriction');
const user = require('./models/user');

module.exports = (sequelize) => {
  const Action = action(sequelize);
  const Appt = appt(sequelize);
  const Config = config(sequelize);
  const Restriction = restriction(sequelize);
  const User = user(sequelize);

  // associations
  Appt.hasMany(Action, { as: 'actions', onDelete: 'CASCADE' });
  Action.belongsTo(Appt);

  User.hasMany(Appt, { as: 'appts', foreignKey: 'userEmail' });
  Appt.belongsTo(User, { foreignKey: 'userEmail' });

  return {
    Action,
    Appt,
    Config,
    Restriction,
    User
  };
};
