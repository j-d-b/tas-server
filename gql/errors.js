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
