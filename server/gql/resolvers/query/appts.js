const { isAuthenticatedResolver } = require('../auth');

// appts(where: ApptsWhere): [Appointment]
const appts = isAuthenticatedResolver.createResolver(
  async (_, { where }, { Appt }) => Appt.findAll({ where })
);

module.exports = appts;
