const { createResolver, and } = require('apollo-resolvers');

const { isAdminResolver } = require('../auth');
const { doesUserExistCheck } = require('../checks');

// confirmUser(email: String!): User
const confirmUser = isAdminResolver.createResolver(
  (_, { email }, { users, user }) => {
    const targetUser = doesUserExistCheck(email, users);

    targetUser.confirmed = true;
    users.update(targetUser);

    return targetUser;
  }
);

module.exports = confirmUser;
