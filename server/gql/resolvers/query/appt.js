const { isAuthenticatedResolver } = require('../auth');

// appt(id: ID!): Appointment
const appt = isAuthenticatedResolver.createResolver(
  (_, { id }, { appts }) => appts.get(id)
);

module.exports = appt;
