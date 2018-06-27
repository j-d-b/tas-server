const { createResolver } = require('apollo-resolvers');
const { createError, isInstance } = require('apollo-errors');
const jwt = require('jsonwebtoken');

const {
  UnexpectedError,
  AlreadyLoggedInError,
  AuthenticationError,
  NotAdminError,
  NotOwnUserError,
  AddNotOwnApptError,
  NotOwnApptError,
  NoApptError,
  NoUserInDBError
} = require('../errors');

// helper
function isOpOrAdmin(userRole) {
  return userRole === 'OPERATOR' || userRole === 'ADMIN';
}

// catch non 'apollo-errors' and mask with unexpected (generic) for client
const baseResolver = createResolver(
  null,
  (_, args, context, error) => error//isInstance(error) ? error : new UnexpectedError() DEBUG
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

// checks the jwt
// attaches `user` object from jwt payload onto GraphQL contaxt
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

// only admin can perform an action for another user
// attaches targetUser to context
const isOwnUserResolver = isAuthenticatedResolver.createResolver(
  (_, { email }, context) => {
    if (email !== context.user.userEmail && context.user.userRole !== 'ADMIN') throw new NotOwnUserError();

    const targetUser = context.users.by('email', email);
    if (!targetUser) throw new NoUserInDBError({ data: { targetUser: email }});

    context.targetUser = targetUser;
  }
);

// only operator (and admin) can add appointment data for another user (or change an appt owner `userEmail`)
const isAddOwnApptResolver = isAuthenticatedResolver.createResolver(
  (_, { details: { userEmail } }, { user }) => {
    if (userEmail !== user.userEmail && !isOpOrAdmin(user.userRole)) throw new AddNotOwnApptError();
  }
);

// TODO combine the above ⬆️ and below2 ⬇️ & ⬇️⬇️ resolvers and make cleaner with less repetition

// only operator (and admin) can modify/delete appointments for another user
// attaches `targetAppt` to the context
const isOwnApptResolver = isAuthenticatedResolver.createResolver(
  (_, { id }, context) => {
    const targetAppt = context.appts.get(id);
    if (!targetAppt) throw new NoApptError();
    if (context.user.userEmail !== targetAppt.userEmail && !isOpOrAdmin(context.user.userRole)) throw new NotOwnApptError();
    context.targetAppt = targetAppt; // attach targetAppt to context
  }
);

const isUpdateApptOwnEmailResolver = isOwnApptResolver.createResolver(
  (_, { details: { userEmail } }, context) => {
    if (userEmail && userEmail !== context.targetAppt.userEmail && !isOpOrAdmin(context.user.userRole)) throw new Error('You must be an admin to change the user email associated with an appointment'); // TODO apollo errorize
  }
);

const isAdminResolver = isAuthenticatedResolver.createResolver(
  (_, args, { user }) => {
    if (user.userRole !== 'ADMIN') throw new NotAdminError();
  }
);

module.exports.baseResolver = baseResolver;
module.exports.notLoggedInResolver = notLoggedInResolver;
module.exports.isAuthenticatedResolver = isAuthenticatedResolver;
module.exports.isAdminResolver = isAdminResolver;
module.exports.isOwnUserResolver = isOwnUserResolver;
module.exports.isAddOwnApptResolver = isAddOwnApptResolver;
module.exports.isUpdateApptOwnEmailResolver = isUpdateApptOwnEmailResolver;
module.exports.isOwnApptResolver = isOwnApptResolver;
