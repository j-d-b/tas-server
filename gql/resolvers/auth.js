const jwt = require('jsonwebtoken');
const { createResolver, and } = require('apollo-resolvers');
const { createError, isInstance } = require('apollo-errors');

const { isOpOrAdmin } = require('./helpers');
const {
  UnexpectedError,
  AlreadyLoggedInError,
  AuthenticationError,
  NotAdminError,
  AddNotOwnApptError,
  NotOwnApptError,
  NoApptError,
  NoUserInDBError
} = require('./errors');


// catch non 'apollo-errors' and mask with unexpected (generic) for client
const baseResolver = createResolver(
  null,
  (_, args, context, error) => error //isInstance(error) ? error : new UnexpectedError() DEBUG
);

// TODO look into making this more robust
// throws error if use already logged in
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

// authenticates using jwt
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

const isAdminResolver = isAuthenticatedResolver.createResolver(
  (_, args, { user }) => {
    if (user.userRole !== 'ADMIN') throw new NotAdminError();
  }
);

// uses given appt id and compares appt owner to requesting user
// attaches `targetAppt` to the context
const isOwnApptResolver = isAuthenticatedResolver.createResolver(
  (_, { id }, context) => {
    const targetAppt = context.appts.get(id);
    if (!targetAppt) throw new NoApptError();
    if (context.user.userEmail !== targetAppt.userEmail && !isOpOrAdmin(context.user.userRole)) throw new NotOwnApptError();
    context.targetAppt = targetAppt; // attach targetAppt to context
  }
);

// appt details user must exist in users database
const doesApptUserExistResolver = isAuthenticatedResolver.createResolver(
  (_, { details }, { users }) => {
    if (!users.by('email', details.userEmail)) throw new NoUserInDBError({ data: { targetUser: details.userEmail }});
  }
);

module.exports.baseResolver = baseResolver;
module.exports.notLoggedInResolver = notLoggedInResolver;
module.exports.isAuthenticatedResolver = isAuthenticatedResolver;
module.exports.isAdminResolver = isAdminResolver;
module.exports.isOwnApptResolver = isOwnApptResolver;
module.exports.doesApptUserExistResolver = doesApptUserExistResolver;
