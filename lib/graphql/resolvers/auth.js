const { createResolver } = require('apollo-resolvers');
const { isInstance } = require('apollo-errors');
const jwt = require('jsonwebtoken');

const logger = require('../../logging/logger');
const Errors = require('./errors');
const { isOpOrAdmin, getTokenFromAuthHeader } = require('./helpers');

const { NODE_ENV, SECRET_KEY } = process.env;

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
    return NODE_ENV === 'development' ? error : new Errors.UnexpectedError();
  }
);

// throws error if user already logged in
const notLoggedInResolver = baseResolver.createResolver(
  (_, args, { authHeader }) => {
    let user;
    try {
      const token = getTokenFromAuthHeader(authHeader);
      user = jwt.verify(token, SECRET_KEY);
    } catch (err) {
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
      const token = getTokenFromAuthHeader(context.authHeader);
      const user = jwt.decode(token);
      context.user = user;
      logger.info(`Requesting User: ${user.userEmail}`);
      jwt.verify(token, SECRET_KEY);
    } catch (err) {
      logger.error(NODE_ENV === 'development' ? err.stack : err.message);

      throw (err.name === 'TokenExpiredError')
        ? new Errors.TokenExpiredError()
        : new Errors.AuthenticationError();
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

module.exports = {
  baseResolver,
  notLoggedInResolver,
  isAuthenticatedResolver,
  isOpOrAdminResolver,
  isAdminResolver
};
