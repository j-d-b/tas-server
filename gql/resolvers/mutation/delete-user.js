const { createResolver, and } = require('apollo-resolvers');

const { isAdminResolver } = require('../auth');
const { doesUserExistCheck, isUserNotSelfCheck } = require('../checks');

// deleteUser(email: String!): String
const deleteUser = isAdminResolver.createResolver(
  (_, { email }, { users, user }) => {
    const targetUser = doesUserExistCheck(user.userEmail, users);
    isUserNotSelfCheck(targetUser, user.userEmail);

    users.remove(targetUser);
    return `User ${email} deleted successfully`;
  }
);

module.exports = deleteUser;
