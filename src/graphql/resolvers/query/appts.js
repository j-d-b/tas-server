const { isAuthenticatedResolver } = require('../auth');

// appts(input: ApptsInput!): [Appointment]
const appts = isAuthenticatedResolver.createResolver(
  async (_, { input: { where } }, { Appt }) => Appt.findAll({ where })
);

module.exports = appts;
