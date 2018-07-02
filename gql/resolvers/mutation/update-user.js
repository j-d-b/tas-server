const { createResolver } = require('apollo-resolvers');

const { isAuthenticatedResolver } = require('../auth');
const { isAdmin } = require('../helpers');
const { doesUserExistCheck, isUserSelfCheck, isRoleOwnRoleCheck } = require('../checks');
const { NotOwnUserError, NoUserInDBError, ChangeRoleError } = require('../errors');

// *if not admin*
// check auth
// check if target user email matches current user's email
// check if new details.role matches current user's role
// update user

// *if admin*
// check if target user (by email) exists
// update user

// updateUser(email: String!, details: UpdateUserInput!): User
const updateUser = isAuthenticatedResolver.createResolver(
  (_, { email, details }, { users, user }) => {
    const targetUser = doesUserExistCheck(email, users);
    if (!isAdmin(user)) {
      isUserSelfCheck(email, user);
      isRoleOwnRoleCheck(details.role, user);
    }

    Object.entries(details).forEach(([field, val]) => targetUser[field] = val);
    users.update(targetUser);

    return targetUser;
  }
);

module.exports = updateUser;
