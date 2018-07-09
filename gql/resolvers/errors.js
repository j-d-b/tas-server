const { createError } = require('apollo-errors');

// auth
module.exports.UnexpectedError = createError('UnexpectedError', {
  message: 'An unexpected error occurred'
});

module.exports.AuthenticationError = createError('AuthenticationError', {
  message: 'You must be authenticated to perform this action'
});

module.exports.AlreadyLoggedInError = createError('AlreadyLoggedInError', {
  message: 'You cannot perform this action as a logged in user'
});

module.exports.NotOpOrAdminError = createError('NotOpOrAdminError', {
  message: 'You must be an operator or admin to perform this action'
});

module.exports.NotAdminError = createError('NotAdminError', {
  message: 'You must be an admin to perform this action'
});


// user
module.exports.NoUserError = createError('NoUserError', {
  message: 'No user with that email exists'
});

module.exports.UserAlreadyExistsError = createError('UserAlreadyExistsError', {
  message: 'User with that email already exists'
});

module.exports.OwnUserError = createError('OwnUserError', {
  message: 'You cannot perform this action on yourself'
});

module.exports.NotOwnUserError = createError('NotOwnUserError', {
  message: 'The entered user email must not be different than your own'
});

module.exports.NotOwnRoleError = createError('NotOwnRoleError', {
  message: 'The entered user role cannot be different than your own'
});

module.exports.UnconfirmedUserError = createError('UnconfirmedUserError', {
  message: 'Your account must be confirmed by an admin before you can log in'
});

module.exports.AlreadyConfirmedUserError = createError('AlreadyConfirmedUserError', {
  message: 'This user is already confirmed'
});


//appt
module.exports.NotOwnApptError = createError('NotOwnApptError', {
  message: 'You cannot modify or delete an appointment owned by another user'
});

module.exports.NoApptError = createError('NoApptError', {
  message: 'The requested appointment does not exist'
});

module.exports.NoApptTypeDetailsError = createError('NoApptTypeDetailsError', {
  message: 'You must provide type-specific appointment details'
});


// block
module.exports.BlockAlreadyExistsError = createError('BlockAlreadyExistsError', {
  message: 'A block with that id already exists'
});

module.exports.InvalidAllowedApptsPerHourError = createError('InvalidAllowedApptsPerHourError', {
  message: 'Current allowed appointments per hour must be less than max appointments per hour, and neither can be negative'
});

module.exports.NoBlockError = createError('NoBlockError', {
  message: 'No block with that ID exists'
});


// action
module.exports.IncorrectPasswordError = createError('IncorrectPasswordError', {
  message: 'Incorrect password'
});

module.exports.InvalidOrExpiredLinkError = createError('InvalidOrExpiredLinkError', {
  message: 'Password reset link invalid or expired'
});

module.exports.PasswordCheckError = createError('PasswordCheckError', {
  message: 'Password must be at least 6 characters'
});

module.exports.MailSendError = createError('MailSendError', {
  message: 'The requested email could not be sent'
});
