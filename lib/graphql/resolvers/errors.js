const { createError } = require('apollo-errors');

module.exports = {
  AllowedApptsAlreadyExistsError: createError('AllowedApptsAlreadyExistsError', {
    message: 'One or more of the given allowed appointments values already has a value for the the given time slot'
  }),
  AlreadyLoggedInError: createError('AlreadyLoggedInError', {
    message: 'You cannot perform this action as a logged in user'
  }),
  ApptPairContainerSizeError: createError('ApptPairContainerSizeError', {
    message: 'Appointment pairs must consist of two TWENTYFOOT appointments only'
  }),
  AuthenticationError: createError('AuthenticationError', {
    message: 'You must be authenticated to perform this action'
  }),
  DuplicateRestrictionError: createError('DuplicateRestrictionError', {
    message: 'Multiple restrictions must not apply to same timeslot or day/time'
  }),
  DuplicateTemplateNameError: createError('DuplicateTemplateNameError', {
    message: 'The given template name is already in use'
  }),
  IncorrectPasswordError: createError('IncorrectPasswordError', {
    message: 'Incorrect password'
  }),
  InvalidAllowedApptsPerHourError: createError('InvalidAllowedApptsPerHourError', {
    message: 'Current allowed appointments per hour must be less than max appointments per hour, and neither can be negative'
  }),
  InvalidDateValueError: createError('InvalidDateValueError', {
    message: 'The date must be a string in ISO8601 format'
  }),
  InvalidNumContainersError: createError('InvalidNumContainersError', {
    message: 'Too many containers (using TFU)'
  }),
  InvalidOrExpiredLinkError: createError('InvalidOrExpiredLinkError', {
    message: 'This link is invalid or expired'
  }),
  InvalidRestrictionInputError: createError('InvalidRestrictionInputError', {
    message: 'Invalid Input. Ensure you are providing a gateCapacity value'
  }),
  InvalidSlotHourValueError: createError('InvalidSlotHourValueError', {
    message: 'The time slot hour must be between 0 and 23'
  }),
  InvalidWindowLengthValueError: createError('InvalidWindowLengthValueError', {
    message: 'The window length value must be 5, 10, 15, 30, or 60 (minutes)'
  }),
  EmailSendError: createError('EmailSendError', {
    message: 'The requested email could not be sent'
  }),
  NotAdminError: createError('NotAdminError', {
    message: 'You must be an admin to perform this action'
  }),
  NoActionError: createError('NoActionError', {
    message: 'There is no action found for the given id'
  }),
  NoApptError: createError('NoApptError', {
    message: 'The requested appointment does not exist'
  }),
  NoActionTypeDetailsError: createError('NoActionTypeDetailsError', {
    message: 'You must provide the required type-specific action details'
  }),
  NoAvailabilityError: createError('NoAvailabilityError', {
    message: 'The appointment(s) cannot be scheduled for this time slot'
  }),
  NoRefreshTokenCookieError: createError('NoRefreshTokenCookieError', {
    message: 'The HTTP request does not contain a refreshToken cookie'
  }),
  NoRestrictionTemplateError: createError('NoRestrictionTemplateError', {
    message: 'The restriction template does not exist'
  }),
  NotChildActionError: createError('NotChildActionError', {
    message: 'The given action ID does not match a child action of the given appointment'
  }),
  NotOpOrAdminError: createError('NotOpOrAdminError', {
    message: 'You must be an operator or admin to perform this action'
  }),
  NotOwnApptError: createError('NotOwnApptError', {
    message: 'You cannot modify or delete an appointment owned by another user'
  }),
  NotOwnRoleError: createError('NotOwnRoleError', {
    message: 'The entered user role cannot be different than your own'
  }),
  NotOwnUserError: createError('NotOwnUserError', {
    message: 'The entered user email must not be different than your own'
  }),
  NoRestrictionError: createError('NoRestrictionError', {
    message: 'No restriction matching the given criteria exists'
  }),
  NoUserError: createError('NoUserError', {
    message: 'No user with that email exists'
  }),
  OwnUserError: createError('OwnUserError', {
    message: 'You cannot perform this action on yourself'
  }),
  PasswordCheckError: createError('PasswordCheckError', {
    message: 'Password must be at least 6 characters'
  }),
  SMSSendError: createError('SMSSendError', {
    message: 'SMS message(s) failed to send'
  }),
  TokenExpiredError: createError('TokenExpiredError', {
    message: 'The authentication token included in the request has expired'
  }),
  UnconfirmedUserError: createError('UnconfirmedUserError', {
    message: 'Your account must be confirmed by an admin before you can log in'
  }),
  UnexpectedError: createError('UnexpectedError', {
    message: 'An unexpected error occurred'
  }),
  UserAlreadyExistsError: createError('UserAlreadyExistsError', {
    message: 'User with that email already exists'
  }),
  UserEmailNotVerifiedError: createError('UserEmailNotVerifiedError', {
    message: 'You must verify your account email before you can log in'
  })
};
