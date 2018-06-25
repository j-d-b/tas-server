const { combineResolvers } = require('apollo-resolvers');

const UserResolvers = require('./resolvers/user');
const ApptResolvers = require('./resolvers/appointment');
const ActionResolvers = require('./resolvers/action');

const Resolvers = combineResolvers([
  UserResolvers,
  ApptResolvers,
  ActionResolvers
]);

module.exports = Resolvers;
