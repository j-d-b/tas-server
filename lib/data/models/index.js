const Action = require('./action');
const Appt = require('./appt');
const Config = require('./config');
const Restriction = require('./restriction');
const RestrictionTemplate = require('./restriction-template');
const User = require('./user');

// build associations
Appt.hasMany(Action, { as: 'actions', onDelete: 'CASCADE' });
Action.belongsTo(Appt);
User.hasMany(Appt, { as: 'appts', foreignKey: 'userEmail', onDelete: 'CASCADE' });
Appt.belongsTo(User, { foreignKey: 'userEmail' });
RestrictionTemplate.hasMany(Restriction, { as: 'restrictions', foreignKey: 'template', onDelete: 'CASCADE' });

module.exports = {
  Action,
  Appt,
  Config,
  Restriction,
  RestrictionTemplate,
  User
};
