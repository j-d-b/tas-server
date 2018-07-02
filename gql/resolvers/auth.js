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
  // below should be removed
  ChangeApptOwnerError,
  NotOwnApptError,
  NoApptError,
  NoUserInDBError,
  OwnUserError,
  UserAlreadyInDBError,
  PasswordCheckError,
  NotOwnUserError,
  NotOwnRoleError
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

module.exports.baseResolver = baseResolver;
module.exports.notLoggedInResolver = notLoggedInResolver;
module.exports.isAuthenticatedResolver = isAuthenticatedResolver;
module.exports.isOpOrAdminResolver = isOpOrAdminResolver;
module.exports.isAdminResolver = isAdminResolver;

// all this below should be removed


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

// NOTE this can be changed to use isAuthenticatedResolver if registration mutation is implemented
// throws error is given email does not match a user in the database
// attaches `targetUser` to context
const doesUserExistResolver = baseResolver.createResolver(
  (_, { email }, context) => {
    const targetUser = context.users.by('email', email);
    if (!targetUser) throw new NoUserInDBError({ data: { targetUser: email }});
    context.targetUser = targetUser;
  }
);

// throws error if given email is the same as user's email
const isUserNotSelfResolver = isAuthenticatedResolver.createResolver(
  (_, { email }, { user }) => {
    if (user.userEmail === email) throw new DeleteSelfError();
  }
);


// throws error if given email is not the same as user's email
const isUserSelfResolver = isAuthenticatedResolver.createResolver(
  (_, { email }, { user }) => {
    if (user.userEmail !== email) throw new NotOwnUserError();
  }
);


// NOTE this can be changed to use isAuthenticatedResolver if registration mutation is implemented
// throws error if user details.email already exists in the users database
const doesUserNotExistResolver = baseResolver.createResolver(
  (_, { details: { email } }, { users }) => {
    if (users.by('email', email)) throw new UserAlreadyInDBError({ data: { targetUser: email }});
  }
);


// throws error if
const isUserRoleOwnRoleResolver = isAuthenticatedResolver.createResolver(
  (_, { details: { role } }, { user }) => {
    if (user.userRole !== role) throw new ChangeRoleError();
  }
);


// throws error if password (args.password or args.newPassword) does not satisfy the
// password strength criteria
const isAllowedPasswordResolver = baseResolver.createResolver(
  (_, args) => {
    const passToCheck = args.password ? args.password : args.newPassword;
    if (passToCheck.length < 6) throw new PasswordCheckError();
  }
);

// performs the check function, throws the given error
function check(checkFunction, error) {
  // TODO
}

module.exports.isOwnApptResolver = isOwnApptResolver;
module.exports.willBeOwnApptResolver = willBeOwnApptResolver;
module.exports.doesUserExistResolver = doesUserExistResolver;
module.exports.isUserSelfResolver = isUserSelfResolver;
module.exports.doesUserNotExistResolver = doesUserNotExistResolver;
module.exports.isAllowedPasswordResolver = isAllowedPasswordResolver;
module.exports.isUserSelfResolver = isUserSelfResolver;
module.exports.isUserRoleOwnRoleResolver = isUserRoleOwnRoleResolver;
