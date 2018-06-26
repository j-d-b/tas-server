const { createError } = require('apollo-errors');

module.exports.UnknownError = createError('UnknownError', {
  message: 'An unknown error occurred!'
});

module.exports.AuthenticationError = createError('AuthenticationError', {
  message: 'You must be logged in to perform this action.'
});

module.exports.AuthorizationError = createError('AuthorizationError', {
  message: 'You are not authorized to perform this action.'
});

module.exports.DBTypeError = createError('DBTypeError', {
  message: 'Type incorrect in db: Something went wrong... O_O'
});

module.exports.NotOwnUserError = createError('NotOwnUserError', {
  message: 'You cannot perform this action for another user.'
});

module.exports.AddNotOwnApptError = createError('AddNotOwnApptError', {
  message: 'You cannot add an appointment for another user.'
});

module.exports.NotOwnApptError = createError('NotOwnApptError', {
  message: 'You cannot modify or delete an appointment for another user.'
});

module.exports.NoApptError = createError('NoApptError', {
  message: 'The requested appointment does not exist.'
});

module.exports.AlreadyLoggedInError = createError('AlreadyLoggedInError', {
  message: 'You cannot perform this action as a logged in user.'
});
