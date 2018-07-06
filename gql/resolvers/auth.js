const jwt = require('jsonwebtoken');
const { createResolver, and } = require('apollo-resolvers');
const { createError, isInstance } = require('apollo-errors');

const { UnexpectedError, AlreadyLoggedInError, AuthenticationError, NotOpOrAdminError, NotAdminError } = require('./errors');
const { isOpOrAdmin, getUserFromAuthHeader } = require('./helpers');


// catch all non 'apollo-errors' and mask with unexpected (generic) for client cleanliness
const baseResolver = createResolver(
  null,
  (_, args, context, error) => error //isInstance(error) ? error : new UnexpectedError()
);

// throws error if user already logged in
const notLoggedInResolver = baseResolver.createResolver(
  (_, args, { authHeader }) => {
    let user;
    try {
      user = getUserFromAuthHeader(authHeader);
    } catch (error) {
      console.log('Logging error & passing through:' + error); // DEBUG
      // move on to next resolver
    }
    if (user) throw new AlreadyLoggedInError();
  }
);

// throws error if jwt in header is invalid
// attaches `user` object from jwt payload onto GraphQL `context`
const isAuthenticatedResolver = baseResolver.createResolver(
  (_, args, context) => {
    try {
      const user = getUserFromAuthHeader(context.authHeader);
      if (!user.userEmail || !user.userRole) throw new AuthenticationError();
      context.user = user; // add user to the context
    } catch (err) {
      throw new AuthenticationError();
    }
  }
);

// throws error if user is not an operator or admin
const isOpOrAdminResolver = isAuthenticatedResolver.createResolver(
  (_, args, { user }) => {
    if (!isOpOrAdmin(user)) throw new NotOpOrAdminError();
  }
);

// throws error if user is not an admin
const isAdminResolver = isAuthenticatedResolver.createResolver(
  (_, args, { user }) => {
    if (user.userRole !== 'ADMIN') throw new NotAdminError();
  }
);

module.exports.baseResolver = baseResolver;
module.exports.notLoggedInResolver = notLoggedInResolver;
module.exports.isAuthenticatedResolver = isAuthenticatedResolver;
module.exports.isOpOrAdminResolver = isOpOrAdminResolver;
module.exports.isAdminResolver = isAdminResolver;
