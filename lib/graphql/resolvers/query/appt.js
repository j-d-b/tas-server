const { isAuthenticatedResolver } = require('../auth');

// appt(input: ApptInput!): Appointment
const appt = isAuthenticatedResolver.createResolver(
  async (_, { input: { id } }, { Appt }) => Appt.findByPk(id)
);

module.exports = appt;
