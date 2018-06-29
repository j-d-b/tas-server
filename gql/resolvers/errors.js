const { createError } = require('apollo-errors');

module.exports.UnexpectedError = createError('UnexpectedError', {
  message: 'An unexpected error occurred'
});

module.exports.AuthenticationError = createError('AuthenticationError', {
  message: 'You must be authenticated to perform this action'
});

module.exports.NotAdminError = createError('NotAdminError', {
  message: 'You must be an admin to perform this action'
});

module.exports.DBTypeError = createError('DBTypeError', {
  message: 'Type incorrect in db: Something went wrong... O_O'
});

module.exports.NotOwnUserError = createError('NotOwnUserError', {
  message: 'You cannot perform this action for another user'
});

module.exports.ChangeRoleError = createError('ChangeRoleError', {
  message: 'You must be an administrator to change user role'
});

module.exports.AddNotOwnApptError = createError('AddNotOwnApptError', {
  message: 'You cannot add an appointment for another user'
});

module.exports.NotOwnApptError = createError('NotOwnApptError', {
  message: 'You cannot modify or delete an appointment owned by another user'
});

module.exports.NoApptError = createError('NoApptError', {
  message: 'The requested appointment does not exist'
});

module.exports.AlreadyLoggedInError = createError('AlreadyLoggedInError', {
  message: 'You cannot perform this action as a logged in user'
});

module.exports.NoUserInDBError = createError('NoUserInDBError', {
  message: 'No user with that email exists'
});

module.exports.UserAlreadyInDBError = createError('UserAlreadyInDBError', {
  message: 'User with that email already exists'
});

module.exports.IncorrectPasswordError = createError('IncorrectPasswordError', {
  message: 'Incorrect password'
});

module.exports.InvalidOrExpiredLinkError = createError('InvalidOrExpiredLinkError', {
  message: 'Password reset link invalid or expired'
});

module.exports.DeleteSelfError = createError('DeleteSelfError', {
  message: 'You cannot delete yourself'
})

module.exports.PasswordCheckError = createError('PasswordCheckError', {
  message: 'Password must be at least 6 characters'
});

module.exports.UpdateApptUserError = createError('UpdateApptUserError', {
  message: 'You must be an admin to change the user email associated with an appointment'
});
