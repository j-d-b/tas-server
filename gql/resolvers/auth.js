const jwt = require('jsonwebtoken');
const { createResolver, and } = require('apollo-resolvers');
const { createError, isInstance } = require('apollo-errors');

const { isOpOrAdmin } = require('./helpers');
const {
  UnexpectedError,
  AlreadyLoggedInError,
  AuthenticationError,
  NotOperatorError,
  NotAdminError,
  ChangeApptOwnerError,
  NotOwnApptError,
  NoApptError,
  NoUserInDBError
} = require('./errors');


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

// throws error if user is not an operator or admin
const isOpOrAdminResolver = isAuthenticatedResolver.createResolver(
  (_, args, { user }) => {
    const isOpOrAdmin = user.userRole === 'OPERATOR' || user.userRole === 'ADMIN';
    if (!isOpOrAdmin) throw new NotOperatorError();
  }
);

// throws error if user is not an admin
const isAdminResolver = isAuthenticatedResolver.createResolver(
  (_, args, { user }) => {
    if (user.userRole !== 'ADMIN') throw new NotAdminError();
  }
);

// throws error if target appt (by id) does not exist in database
// attaches `targetAppt` to the context if appt exists
const doesApptExistResolver = isAuthenticatedResolver.createResolver(
  (_, { id }, context) => {
    const targetAppt = context.appts.get(id);
    if (!targetAppt) throw new NoApptError();
    context.targetAppt = targetAppt;
  }
);

// throws error if appt details.userEmail does not match a user in the database
const doesApptUserExistResolver = isAuthenticatedResolver.createResolver(
  (_, { details: { userEmail } }, { users }) => {
    if (!users.by('email', userEmail)) throw new NoUserInDBError({ data: { targetUser: userEmail }});
  }
);

// throws error if target appt (by id) userEmail does not match user's email
// attaches `targetAppt` to the context
const isOwnApptResolver = doesApptExistResolver.createResolver(
  (_, args, { user, targetAppt }) => {
    if (user.userEmail !== targetAppt.userEmail) throw new NotOwnApptError();
  }
);

// throws error if appt details.userEmail (to add or update to) differs from email of
// user who is adding it (user.userEmail)
const willBeOwnApptResolver = doesApptUserExistResolver.createResolver(
  (_, { details: { userEmail } }, { user }) => {
    if (userEmail !== user.userEmail) throw new ChangeApptOwnerError();
  }
);


module.exports.baseResolver = baseResolver;
module.exports.notLoggedInResolver = notLoggedInResolver;
module.exports.isAuthenticatedResolver = isAuthenticatedResolver;
module.exports.isOpOrAdminResolver = isOpOrAdminResolver;
module.exports.isAdminResolver = isAdminResolver;
module.exports.isOwnApptResolver = isOwnApptResolver;
module.exports.willBeOwnApptResolver = willBeOwnApptResolver;
