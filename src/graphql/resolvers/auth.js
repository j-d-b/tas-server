const { createResolver } = require('apollo-resolvers');
const { isInstance } = require('apollo-errors');

const logger = require('../../logging/logger');
const Errors = require('./errors');
const { isOpOrAdmin, getUserFromAuthHeader } = require('./helpers');


// catch all non 'apollo-errors' and mask with unexpected (generic) for client cleanliness
const baseResolver = createResolver(
  (_, args, context, info) => {
    logger.info(`GraphQL Query: ${info.fieldName}`);
    // return nothing; pass through
  },
  (_, args, context, error) => {
    if (isInstance(error)) {
      logger.info(`GraphQL Error: ${error}`);
      return error;
    }
    logger.error(error.stack);
    return process.env.NODE_ENV === 'development' ? error : new Errors.UnexpectedError();
  }
);

// throws error if user already logged in
const notLoggedInResolver = baseResolver.createResolver(
  (_, args, { authHeader }) => {
    let user;
    try {
      user = getUserFromAuthHeader(authHeader);
    } catch (error) {
      // move on to next resolver
    }

    if (user) {
      logger.info(`Requesting User: ${user}`);
      throw new Errors.AlreadyLoggedInError();
    }
  }
);

// throws error if jwt in header is invalid
// attaches `user` object from jwt payload onto GraphQL `context`
const isAuthenticatedResolver = baseResolver.createResolver(
  (_, args, context) => {
    try {
      const user = getUserFromAuthHeader(context.authHeader);
      context.user = user; // add user to the context
      logger.info(`Requesting User: ${user.userEmail}`);
    } catch (err) {
      throw new Errors.AuthenticationError();
    }
  }
);

// throws error if user is not an operator or admin
const isOpOrAdminResolver = isAuthenticatedResolver.createResolver(
  (_, args, { user }) => {
    if (!isOpOrAdmin(user)) throw new Errors.NotOpOrAdminError();
  }
);

// throws error if user is not an admin
const isAdminResolver = isAuthenticatedResolver.createResolver(
  (_, args, { user }) => {
    if (user.userRole !== 'ADMIN') throw new Errors.NotAdminError();
  }
);

module.exports.baseResolver = baseResolver;
module.exports.notLoggedInResolver = notLoggedInResolver;
module.exports.isAuthenticatedResolver = isAuthenticatedResolver;
module.exports.isOpOrAdminResolver = isOpOrAdminResolver;
module.exports.isAdminResolver = isAdminResolver;
