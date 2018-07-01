const { createResolver, or } = require('apollo-resolvers');

const { isAdminResolver, doesUserExistResolver, isUserSelfResolver, isUserRoleOwnRoleResolver } = require('../auth');
const { NotOwnUserError, NoUserInDBError, ChangeRoleError } = require('../errors');

// *if not admin*
// check auth
// check if target user email matches current user's email
// check if new details.role matches current user's role
// update user

// *if admin*
// check if target user (by email) exists
// update user

const isOwnUserAndOwnRoleResolver = isUserSelfResolver.createResolver(isUserRoleOwnRoleResolver);
const isAdminAndUserExistsResolver = isAdminResolver.createResolver(doesUserExistResolver);

// updateUser(email: String!, details: UpdateUserInput!): User
const updateUser = or(isAdminAndUserExistsResolver, isOwnUserAndOwnRoleResolver)(
  (_, { email, details }, { users, targetUser }) => {
    Object.entries(details).forEach(([field, val]) => targetUser[field] = val);
    users.update(targetUser);

    return targetUser;
  }
);

module.exports = updateUser;
