const { createResolver } = require('apollo-resolvers');

const { isAuthenticatedResolver } = require('../auth');
const { NotOwnUserError, NoUserInDBError, ChangeRoleError } = require('../errors');

// only admin can perform an action for another user
// attaches `targetUser` to `context`
const isUpdateOwnUserResolver = isAuthenticatedResolver.createResolver(
  (_, { email, details }, context) => {
    const isAdmin = context.user.userRole === 'ADMIN';

    if (email !== context.user.userEmail && !isAdmin) throw new NotOwnUserError();
    if (details.role !== context.user.userRole && !isAdmin) throw new ChangeRoleError();

    const targetUser = context.users.by('email', email);
    if (!targetUser) throw new NoUserInDBError({ data: { targetUser: email }});

    context.targetUser = targetUser;
  }
);

// updateUser(email: String!, details: UpdateUserInput!): User
const updateUser = isUpdateOwnUserResolver.createResolver(
  (_, { email, details }, { users, targetUser }) => {
    Object.entries(details).forEach(([field, val]) => targetUser[field] = val);
    users.update(targetUser);

    return targetUser;
  }
);

module.exports = updateUser;
