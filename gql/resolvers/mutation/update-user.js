const { createResolver } = require('apollo-resolvers');

const { isOwnUserResolver } = require('../auth');

// updateUser(email: String!, details: UpdateUserInput!): User
const updateUser = isOwnUserResolver.createResolver(
  (_, { email, details }, { users, targetUser }) => {
    Object.entries(details).forEach(([field, val]) => targetUser[field] = val);
    users.update(targetUser);

    return targetUser;
  }
);

module.exports = updateUser;
