const { createResolver } = require('apollo-resolvers');

const { isAuthenticatedResolver } = require('../auth');

// IDEA currently returns null if no matches, but could require a return and error otherwise..
// appt(id: ID!): Appointment
const appt = isAuthenticatedResolver.createResolver(
  (_, { id }, { appts }) => appts.get(id)
);

module.exports = appt;
