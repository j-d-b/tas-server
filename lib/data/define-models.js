const action = require('./models/action');
const appt = require('./models/appt');
const config = require('./models/config');
const restriction = require('./models/restriction');
const restrictionTemplate = require('./models/restriction-template');
const user = require('./models/user');

module.exports = (sequelize) => {
  const Action = action(sequelize);
  const Appt = appt(sequelize);
  const Config = config(sequelize);
  const Restriction = restriction(sequelize);
  const RestrictionTemplate = restrictionTemplate(sequelize);
  const User = user(sequelize);

  // associations
  Appt.hasMany(Action, { as: 'actions', onDelete: 'CASCADE' });
  Action.belongsTo(Appt);

  User.hasMany(Appt, { as: 'appts', foreignKey: 'userEmail' });
  Appt.belongsTo(User, { foreignKey: 'userEmail' });

  RestrictionTemplate.hasMany(Restriction, { as: 'restrictions', foreignKey: 'template', onDelete: 'CASCADE' });

  return {
    Action,
    Appt,
    Config,
    Restriction,
    RestrictionTemplate,
    User
  };
};
