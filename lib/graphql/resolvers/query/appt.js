const { isAuthenticatedResolver } = require('../auth');

// appt(input: ApptInput!): Appointment
const appt = isAuthenticatedResolver.createResolver(
  async (_, { input: { id } }, { Appt }) => Appt.findById(id)
);

module.exports = appt;
