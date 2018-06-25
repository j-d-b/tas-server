const { createResolver } = require('apollo-resolvers');
const { createError, isInstance } = require('apollo-errors');
const jwt = require('jsonwebtoken');

const { UnknownError, AuthenticationError, AuthorizationError, NotOwnUserError } = require('../errors');

// catch non 'apollo-errors' and mask with unknown for client
const baseResolver = createResolver(
  null,
  (_, args, context, error) => isInstance(error) ? error : new UnknownError();
);

const isAuthenticatedResolver = baseResolver.createResolver(
  (_, args, context) => {
    try {
      const token = context.headers.authorization.replace('Bearer ', '');
      const user = jwt.verify(token, process.env.JWT_SECRET);
      context.user = user; // add user to the context
    } catch (err) {
      throw new AuthenticationError();
    }
  }
);

// only admin can access perform an action for another user
const isOwnUserResolver = isAuthenticatedResolver.createResolver(
  (_, args, { user }) => {
    if (!(user.userRole === 'admin') && args.email !== user.email) throw new NotOwnUserError();

  }
);

const hasOperatorPermissionsResolver = isAuthenticatedResolver.createResolver(
  (_, args, { user }) => {
    if (!(user.userRole === 'operator' || user.userRole === 'admin')) throw new AuthorizationError();
  }
);

const isAdminResolver = isAuthenticatedResolver.createResolver(
  (_, args, { user }) => {
    if (!(user.userRole === 'admin')) throw new AuthorizationError();
  }
);

module.exports.isAuthenticatedResolver = isAuthenticatedResolver;
module.exports.hasOperatorPermissionsResolver = hasOperatorPermissionsResolver;
module.exports.isAdminResolver = isAdminResolver;
module.exports.isOwnUserResolver = isOwnUserResolver;
