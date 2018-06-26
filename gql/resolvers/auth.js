const { createResolver } = require('apollo-resolvers');
const { createError, isInstance } = require('apollo-errors');
const jwt = require('jsonwebtoken');

const {
  UnknownError,
  AlreadyLoggedInError,
  AuthenticationError,
  AuthorizationError,
  NotOwnUserError,
  AddNotOwnApptError,
  NotOwnApptError,
  NoApptError
} = require('../errors');

// catch non 'apollo-errors' and mask with unknown for client
const baseResolver = createResolver(
  null,
  (_, args, context, error) => isInstance(error) ? error : new UnknownError()
);

// checks the jwt
// attaches `user` object from jwt payload onto GraphQL contaxt
const isAuthenticatedResolver = baseResolver.createResolver(
  (_, args, context) => {
    try {
      const token = context.authHeader.replace('Bearer ', '');
      const user = jwt.verify(token, process.env.JWT_SECRET);
      context.user = user; // add user to the context
    } catch (err) {
      throw new AuthenticationError();
    }
  }
);

// TODO look into making this more robust
// checks if user is already logged in
// throws error if they are
const notLoggedInResolver = baseResolver.createResolver(
  (_, args, context) => {
    if (context.authHeader) {
      const token = context.authHeader.replace('Bearer ', '');
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        console.log(err); // but move on to next resolver
      }
      if (decoded) throw new AlreadyLoggedInError();
    }
  }
);

// only admin can perform an action for another user
const isOwnUserResolver = isAuthenticatedResolver.createResolver(
  (_, { details: email }, { user }) => {
    if (email !== user.email && user.userRole !== 'ADMIN') throw new NotOwnUserError();
  }
);

// only operator (and admin) can add appointment data for another user (or change an appt owner `userEmail`)
// attaches `isOpOrAdmin` to context
const isAddOwnApptResolver = isAuthenticatedResolver.createResolver(
  (_, { details: userEmail }, { user }) => {
    const isOpOrAdmin = user.userRole === 'OPERATOR' || user.userRole === 'ADMIN';
    if (userEmail !== user.email && !isOpOrAdmin) throw new AddNotOwnApptError();
    context.isOpOrAdmin = isOpOrAdmin;
  }
);

// only operator (and admin) can modify/delete appointments for another user
// attaches `targetAppt` to the context
const isOwnApptResolver = isAddOwnApptResolver.createResolver(
  (_, { id }, context) => {
    const targetAppt = appts.get(id);
    if (!targetAppt) throw new NoApptError();
    if (context.user.email !== targetAppt.userEmail && !context.isOpOrAdmin) throw new NotOwnApptError();
    context.targetAppt = targetAppt; // attach targetAppt to context
  }
);

const hasOperatorPermissionsResolver = isAuthenticatedResolver.createResolver(
  (_, args, { user: userRole }) => {
    if (!(userRole === 'OPERATOR' || userRole === 'ADMIN')) throw new AuthorizationError(); // could simplify to `if (userRole === 'CUSTOMER')` as long as it will NEVER not be one of the three
  }
);

const isAdminResolver = isAuthenticatedResolver.createResolver(
  (_, args, { user }) => {
    if (user.userRole !== 'ADMIN') throw new AuthorizationError();
  }
);

module.exports.baseResolver = baseResolver;
module.exports.isAuthenticatedResolver = isAuthenticatedResolver;
module.exports.hasOperatorPermissionsResolver = hasOperatorPermissionsResolver;
module.exports.isAdminResolver = isAdminResolver;
module.exports.isOwnUserResolver = isOwnUserResolver;
module.exports.isAddOwnApptResolver = isAddOwnApptResolver;
module.exports.isOwnApptResolver = isOwnApptResolver;
module.exports.notLoggedInResolver = notLoggedInResolver;
