const { createResolver, and } = require('apollo-resolvers');

const { isAdminResolver, doesUserExistResolver, isUserNotSelfResolver } = require('../auth');

// check if user is admin
// check if target user (by email) exists
// ensure target user email is not user's email (can't delete self)
// delete user

const doesUserExistAndIsNotSelfResolver = doesUserExistResolver.createResolver(isUserNotSelfResolver);

// deleteUser(email: String!): String
const deleteUser = and(isAdminResolver, doesUserExistAndIsNotSelfResolver)(
  (_, { email }, { users, user, targetUser }) => {
    users.remove(targetUser);
    return `User ${email} deleted successfully`;
  }
);

module.exports = deleteUser;
