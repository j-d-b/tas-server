const { createResolver } = require('apollo-resolvers');

const { isAuthenticatedResolver } = require('../auth');
const { isAdmin } = require('../helpers');
const { doesUserExistCheck, isUserSelfCheck, isRoleOwnRoleCheck } = require('../checks');

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
