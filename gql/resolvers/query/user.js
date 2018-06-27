const { createResolver } = require('apollo-resolvers');

const { isAdminResolver } = require('../auth');

// IDEA currently returns null if no matches, but could require a return and error otherwise..
// user(email: String!): User
const user = isAdminResolver.createResolver(
  (_, args, { users }) => users.by('email', args.email)
);

module.exports = user;
