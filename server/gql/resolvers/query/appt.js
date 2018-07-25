const { isAuthenticatedResolver } = require('../auth');

// appt(id: ID!): Appointment
const appt = isAuthenticatedResolver.createResolver(
  async (_, { id }, { Appt }) => Appt.findById(id)
);

module.exports = appt;
