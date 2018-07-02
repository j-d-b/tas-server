const { createResolver, and } = require('apollo-resolvers');

const { isAdminResolver } = require('../auth');
const { doesUserExistCheck, isUserNotSelfCheck } = require('../checks');

// check auth
// check if user is admin
// check if target user (by email) exists
// ensure target user email is not user's email (can't delete self)
// delete user

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
