const jwt = require('jsonwebtoken');
const { createResolver, and } = require('apollo-resolvers');
const { createError, isInstance } = require('apollo-errors');

const { UnexpectedError, AlreadyLoggedInError, AuthenticationError, NotAdminError } = require('./errors');


// catch all non 'apollo-errors' and mask with unexpected (generic) for client cleanliness
const baseResolver = createResolver(
  null,
  (_, args, context, error) => isInstance(error) ? error : new UnexpectedError()
);

// TODO look into making this more robust
// throws error if user already logged in
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

// throws error if jwt in header is invalid
// attaches `user` object from jwt payload onto GraphQL `context`
const isAuthenticatedResolver = baseResolver.createResolver(
  (_, args, context) => {
    try {
      const token = context.authHeader.replace('Bearer ', '');
      const user = jwt.verify(token, process.env.JWT_SECRET);
      if (!user.userEmail || !user.userRole) throw new AuthenticationError();
      context.user = user; // add user to the context
    } catch (err) {
      throw new AuthenticationError();
    }
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
module.exports.isAdminResolver = isAdminResolver;
