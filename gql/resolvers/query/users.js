const { createResolver } = require('apollo-resolvers');

const { isAdminResolver } = require('../auth');

// users(where: UsersWhere): [User]
const users = isAdminResolver.createResolver(
  (_, { where }, { users }) => users.find(removeEmpty(where))
);

module.exports = users;
