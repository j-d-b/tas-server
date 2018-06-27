const { createResolver } = require('apollo-resolvers');

const { isAuthenticatedResolver } = require('../auth');

// appts(where: ApptsWhere): [Appointment]
const appts = isAuthenticatedResolver.createResolver(
  (_, { where }, { appts }) => appts.find(removeEmpty(where))
);

module.exports = appts;
